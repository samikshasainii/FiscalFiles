/**
 * FISCALFILES - Sankey Flow Visualization Engine
 * Role: Visualization & Engine Lead (Aadrika - Member 2)
 * Module: js/sankeyChart.js
 * 
 * Renders the macro fiscal flow:
 * Tax Sources (Direct/Indirect) -> Gross Tax -> Devolution & Central Pool -> 8 Sectoral Outlays
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['echarts'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('echarts'));
  } else {
    root.SankeyChart = factory(root.echarts);
  }
}(typeof self !== 'undefined' ? self : this, function (echarts) {
  'use strict';

  // Indian Currency Formatter Helper
  function formatINR(valCrores) {
    if (valCrores === undefined || valCrores === null) return 'N/A';
    if (valCrores >= 100000) {
      return `₹${(valCrores / 100000).toFixed(2)} Lakh Cr`;
    }
    return `₹${Number(valCrores).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
  }

  // Category Color Palette
  const CATEGORY_COLORS = {
    inflow: '#10b981',       // Emerald
    tax_source: '#0f766e',   // Deep Teal
    transfer: '#f59e0b',     // Amber
    pool: '#d97706',         // Gold/Treasury
    expenditure: '#3b82f6'   // Blue
  };

  // Node-specific distinct palette for spending sectors
  const NODE_COLORS = {
    // Inflows
    corp_tax: '#10b981',
    income_tax: '#34d399',
    gst: '#06b6d4',
    customs: '#14b8a6',
    excise: '#0d9488',
    borrowings: '#6366f1',
    non_tax: '#8b5cf6',

    // Aggregates
    direct_tax: '#059669',
    indirect_tax: '#0e7490',
    gross_tax: '#047857',

    // Transfers & Pool
    devolution: '#f59e0b',
    net_tax: '#d97706',
    central_pool: '#b45309',

    // Spending Sectors
    defense: '#ef4444',          // Crimson Red
    infra: '#2563eb',            // Royal Blue
    social: '#8b5cf6',           // Purple
    rural_agri: '#84cc16',       // Lime/Agri Green
    subsidies: '#f97316',        // Orange
    interest: '#e11d48',         // Deep Rose
    transfers_grants: '#eab308',  // Yellow
    other_exp: '#64748b'         // Slate Grey
  };

  /**
   * Initializes and renders the Sankey Chart
   * @param {string|HTMLElement} container - DOM element or ID
   * @param {Object} rawData - sankey_fiscal_flow JSON data
   * @param {Object} [customOptions] - Optional configuration overrides
   */
  function initSankeyChart(container, rawData, customOptions = {}) {
    const dom = typeof container === 'string' ? document.getElementById(container) : container;
    if (!dom) {
      console.error(`[SankeyChart] Container not found:`, container);
      return null;
    }

    if (!echarts) {
      console.error('[SankeyChart] Apache ECharts library is not loaded. Please include echarts.min.js');
      return null;
    }

    // Reuse or initialize chart instance
    const chart = echarts.getInstanceByDom(dom) || echarts.init(dom);

    // Map node IDs to Names for ECharts link resolution
    const idToNodeMap = {};
    const nameToNodeMap = {};
    const nodes = (rawData.nodes || []).map(n => {
      idToNodeMap[n.id] = n;
      nameToNodeMap[n.name] = n;

      const itemColor = NODE_COLORS[n.id] || CATEGORY_COLORS[n.category] || '#94a3b8';
      return {
        id: n.id,
        name: n.name,
        category: n.category,
        itemStyle: {
          color: itemColor,
          borderColor: '#1e293b',
          borderWidth: 1
        }
      };
    });

    // Map links ensuring source and target use matching names
    const totalPool = (rawData.summary && rawData.summary.total_central_receipts) || 4750351;
    const links = (rawData.links || []).map(l => {
      const srcNode = idToNodeMap[l.source] || nameToNodeMap[l.source];
      const tgtNode = idToNodeMap[l.target] || nameToNodeMap[l.target];

      const sourceName = srcNode ? srcNode.name : l.source;
      const targetName = tgtNode ? tgtNode.name : l.target;

      return {
        source: sourceName,
        target: targetName,
        value: l.value,
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
          opacity: 0.42
        }
      };
    });

    const option = {
      title: {
        text: customOptions.title || 'India Union Budget Fiscal Flow (2024-25 BE)',
        subtext: customOptions.subtext || 'Receipts & Borrowings ➔ Consolidated Fund of India ➔ Sectoral Outlays',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#0f172a'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#64748b'
        }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#f8fafc',
          fontSize: 12
        },
        formatter: function (params) {
          if (params.dataType === 'node') {
            const node = idToNodeMap[params.data.id] || nameToNodeMap[params.data.name];
            const catName = node && node.category ? node.category.toUpperCase().replace('_', ' ') : 'NODE';
            const valueStr = params.value !== undefined ? formatINR(params.value) : '';
            return `
              <div style="font-weight:600; font-size:13px; margin-bottom:4px; color:#38bdf8;">
                ${params.name}
              </div>
              <div style="color:#94a3b8; font-size:11px; margin-bottom:4px;">Category: ${catName}</div>
              ${valueStr ? `<div style="font-weight:600; font-size:14px; color:#f1f5f9;">${valueStr}</div>` : ''}
            `;
          } else if (params.dataType === 'edge') {
            const pct = ((params.value / totalPool) * 100).toFixed(2);
            return `
              <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">Fiscal Flow Transfer</div>
              <div style="font-weight:600; font-size:13px; margin-bottom:4px; color:#f8fafc;">
                ${params.data.source} <span style="color:#38bdf8;">➔</span> ${params.data.target}
              </div>
              <div style="font-size:15px; font-weight:700; color:#34d399; margin-top:2px;">
                ${formatINR(params.value)}
              </div>
              <div style="font-size:11px; color:#cbd5e1; margin-top:2px;">
                Share of Central Pool: <strong>${pct}%</strong>
              </div>
            `;
          }
        }
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.4)'
            },
            lineStyle: {
              opacity: 0.8
            }
          },
          nodeAlign: 'justify',
          nodeGap: 14,
          nodeWidth: 20,
          draggable: true,
          top: 65,
          bottom: 30,
          left: 20,
          right: 140,
          data: nodes,
          links: links,
          label: {
            position: 'right',
            color: '#1e293b',
            fontSize: 11,
            fontWeight: 500,
            formatter: function (p) {
              return p.name;
            }
          }
        }
      ]
    };

    chart.setOption(option);

    // Responsive listener
    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);

    return {
      chartInstance: chart,
      resize: resizeHandler,
      update: function (newRawData) {
        initSankeyChart(container, newRawData, customOptions);
      }
    };
  }

  return {
    init: initSankeyChart,
    formatINR: formatINR
  };
}));
