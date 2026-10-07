/**
 * FISCALFILES - Hierarchical Sectoral Treemap Engine
 * Role: Visualization & Engine Lead (Aadrika - Member 2)
 * Module: js/treemapChart.js
 * 
 * Renders the hierarchical budget breakdown:
 * Total Central Expenditure -> 8 Primary Sectors -> Ministries -> Flagship Schemes
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['echarts'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('echarts'));
  } else {
    root.TreemapChart = factory(root.echarts);
  }
}(typeof self !== 'undefined' ? self : this, function (echarts) {
  'use strict';

  function formatINR(valCrores) {
    if (valCrores === undefined || valCrores === null) return 'N/A';
    if (valCrores >= 100000) {
      return `₹${(valCrores / 100000).toFixed(2)} Lakh Cr`;
    }
    return `₹${Number(valCrores).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
  }

  // 8 Primary Sector Color Accents
  const SECTOR_PALETTE = [
    '#2563eb', // Transportation & Infrastructure (Blue)
    '#dc2626', // National Defense & Security (Crimson)
    '#7c3aed', // Social Infrastructure & Human Capital (Purple)
    '#65a30d', // Agriculture, Rural & Water Resources (Green)
    '#ea580c', // Subsidies & Welfare Transfers (Orange)
    '#0891b2', // Energy, Industry & Technology (Cyan)
    '#b91c1c', // Debt Servicing & Finance Transfers (Dark Red/Coral)
    '#475569'  // General Admin & Strategic Sectors (Slate)
  ];

  /**
   * Initializes and renders the Treemap Chart
   * @param {string|HTMLElement} container - DOM element or ID
   * @param {Object} rawData - sector_treemap JSON data
   * @param {Object} [customOptions] - Optional configuration overrides
   */
  function initTreemapChart(container, rawData, customOptions = {}) {
    const dom = typeof container === 'string' ? document.getElementById(container) : container;
    if (!dom) {
      console.error(`[TreemapChart] Container not found:`, container);
      return null;
    }

    if (!echarts) {
      console.error('[TreemapChart] Apache ECharts library is not loaded.');
      return null;
    }

    const chart = echarts.getInstanceByDom(dom) || echarts.init(dom);

    // Recursively calculate and format tree values
    const treeData = [JSON.parse(JSON.stringify(rawData))];

    const option = {
      title: {
        text: customOptions.title || 'Central Sectoral Expenditure Drilldown (2024-25 BE)',
        subtext: customOptions.subtext || 'Click on any sector or ministry tile to zoom & drill down into flagship schemes',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#f8fafc'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#94a3b8'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#f8fafc',
          fontSize: 12
        },
        formatter: function (info) {
          const val = info.value;
          const name = info.name;
          const treePathInfo = info.treePathInfo;
          let pathHtml = '';
          if (treePathInfo && treePathInfo.length > 1) {
            pathHtml = treePathInfo.slice(1).map(p => p.name).join(' <span style="color:#38bdf8;">➔</span> ');
          }

          const codeStr = info.data && info.data.code ? `<div style="color:#94a3b8; font-size:11px; margin-top:2px;">Scheme Code: <code>${info.data.code}</code></div>` : '';

          return `
            <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">${pathHtml || 'Central Expenditure'}</div>
            <div style="font-weight:700; font-size:14px; color:#f8fafc; margin-bottom:4px;">${name}</div>
            <div style="font-size:16px; font-weight:700; color:#34d399;">${formatINR(val)}</div>
            ${codeStr}
          `;
        }
      },
      series: [
        {
          type: 'treemap',
          name: 'Central Budget',
          data: treeData,
          top: 65,
          bottom: 35,
          left: 20,
          right: 20,
          leafDepth: 1, // Enables click-to-drilldown
          roam: false,
          nodeClick: 'zoomToNode',
          breadcrumb: {
            show: true,
            left: 'center',
            bottom: 6,
            height: 24,
            emptyItemWidth: 25,
            itemStyle: {
              color: '#334155',
              borderColor: '#475569',
              borderWidth: 1,
              textStyle: {
                color: '#f8fafc',
                fontSize: 11
              }
            }
          },
          levels: [
            {
              // Level 0 (Root)
              itemStyle: {
                borderColor: '#0f172a',
                borderWidth: 2,
                gapWidth: 2
              }
            },
            {
              // Level 1: 8 Primary Sectors
              color: SECTOR_PALETTE,
              itemStyle: {
                borderColor: '#1e293b',
                borderWidth: 3,
                gapWidth: 2
              },
              upperLabel: {
                show: true,
                height: 28,
                fontSize: 12,
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                padding: [4, 8]
              }
            },
            {
              // Level 2: Ministries / Departments
              itemStyle: {
                borderColor: '#334155',
                borderWidth: 1.5,
                gapWidth: 1.5
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#38bdf8',
                  borderWidth: 2
                }
              }
            },
            {
              // Level 3: Flagship Schemes
              colorSaturation: [0.35, 0.65],
              itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 0.5,
                gapWidth: 1
              },
              label: {
                show: true,
                position: 'inside',
                fontSize: 10.5,
                color: '#ffffff',
                formatter: function (params) {
                  return `${params.name}\n${formatINR(params.value)}`;
                }
              }
            }
          ]
        }
      ]
    };

    chart.setOption(option);

    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);

    return {
      chartInstance: chart,
      resize: resizeHandler,
      update: function (newRawData) {
        initTreemapChart(container, newRawData, customOptions);
      }
    };
  }

  return {
    init: initTreemapChart,
    formatINR: formatINR
  };
}));
