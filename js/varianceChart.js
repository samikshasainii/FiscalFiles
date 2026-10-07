/**
 * FISCALFILES - Budget Variance & Fiscal Discipline Engine
 * Role: Visualization & Engine Lead (Aadrika - Member 2)
 * Module: js/varianceChart.js
 * 
 * Compares Budget Estimates (BE) vs Revised Estimates (RE) vs Actuals
 * for key critical public sectors.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['echarts'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('echarts'));
  } else {
    root.VarianceChart = factory(root.echarts);
  }
}(typeof self !== 'undefined' ? self : this, function (echarts) {
  'use strict';

  function formatINR(valCrores) {
    if (valCrores === undefined || valCrores === null) return 'N/A';
    if (valCrores >= 100000) {
      return `₹${(valCrores / 100000).toFixed(2)}L Cr`;
    }
    return `₹${Number(valCrores).toLocaleString('en-IN')} Cr`;
  }

  /**
   * Initializes and renders the Variance Chart
   * @param {string|HTMLElement} container - DOM element or ID
   * @param {Array} rawData - budget_variance_be_re_actuals JSON data
   * @param {Object} [customOptions] - Optional configuration overrides
   */
  function initVarianceChart(container, rawData, customOptions = {}) {
    const dom = typeof container === 'string' ? document.getElementById(container) : container;
    if (!dom) {
      console.error(`[VarianceChart] Container not found:`, container);
      return null;
    }

    if (!echarts) {
      console.error('[VarianceChart] Apache ECharts library is not loaded.');
      return null;
    }

    const chart = echarts.getInstanceByDom(dom) || echarts.init(dom);

    const sectors = rawData.map(d => d.sector);
    const beData = rawData.map(d => d.budget_estimate);
    const reData = rawData.map(d => d.revised_estimate);
    const actData = rawData.map(d => d.actuals);

    const option = {
      title: {
        text: customOptions.title || 'Fiscal Discipline: BE vs RE vs Actuals (FY 2023-24)',
        subtext: customOptions.subtext || 'Evaluation of Budget Estimates against Revised Outlays & Audited Actuals',
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#f8fafc',
          fontSize: 12
        },
        formatter: function (params) {
          if (!params || !params.length) return '';
          const idx = params[0].dataIndex;
          const item = rawData[idx];
          const header = `<div style="font-weight:700; font-size:13px; margin-bottom:4px; color:#38bdf8;">${item.sector}</div>`;
          const statusBadge = `<div style="font-size:11px; margin-bottom:8px; color:#fbbf24;">Status: <strong>${item.status}</strong> (Actual vs BE: <strong>${item.variance_actual_vs_be_pct > 0 ? '+' : ''}${item.variance_actual_vs_be_pct}%</strong>)</div>`;

          const rows = params.map(p => `
            <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0; font-size:12px;">
              <span>${p.marker} ${p.seriesName}:</span>
              <strong>${formatINR(p.value)}</strong>
            </div>
          `).join('');

          return header + statusBadge + rows;
        }
      },
      legend: {
        data: ['Budget Estimate (BE)', 'Revised Estimate (RE)', 'Audited Actuals'],
        top: 55,
        textStyle: {
          fontSize: 11,
          color: '#475569'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: 95,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: sectors,
        axisLabel: {
          interval: 0,
          rotate: 15,
          fontSize: 10.5,
          color: '#334155',
          formatter: function (v) {
            return v.length > 18 ? v.substring(0, 16) + '...' : v;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Amount (₹ Crore)',
        nameTextStyle: {
          fontSize: 11,
          color: '#64748b'
        },
        axisLabel: {
          formatter: function (v) {
            return v >= 100000 ? `${(v / 100000).toFixed(0)}L Cr` : `${v / 1000}k`;
          },
          color: '#64748b'
        },
        splitLine: {
          lineStyle: {
            color: '#e2e8f0',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'Budget Estimate (BE)',
          type: 'bar',
          barGap: '20%',
          itemStyle: {
            color: '#64748b',
            borderRadius: [4, 4, 0, 0]
          },
          data: beData
        },
        {
          name: 'Revised Estimate (RE)',
          type: 'bar',
          itemStyle: {
            color: '#f59e0b',
            borderRadius: [4, 4, 0, 0]
          },
          data: reData
        },
        {
          name: 'Audited Actuals',
          type: 'bar',
          itemStyle: {
            color: '#10b981',
            borderRadius: [4, 4, 0, 0]
          },
          data: actData
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
        initVarianceChart(container, newRawData, customOptions);
      }
    };
  }

  return {
    init: initVarianceChart,
    formatINR: formatINR
  };
}));
