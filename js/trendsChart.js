/**
 * FISCALFILES - 10-Year Decadal Trends Visualization Engine
 * Role: Visualization & Engine Lead (Aadrika - Member 2)
 * Module: js/trendsChart.js
 * 
 * Renders the longitudinal time series (2015-16 to 2024-25):
 * Direct vs Indirect Taxes, Capital Outlay Surge, Total Outlays, and Fiscal Deficit % of GDP.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['echarts'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('echarts'));
  } else {
    root.TrendsChart = factory(root.echarts);
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
   * Initializes and renders the Trends Chart
   * @param {string|HTMLElement} container - DOM element or ID
   * @param {Object} rawData - historical_trends JSON data
   * @param {Object} [customOptions] - Optional configuration overrides
   */
  function initTrendsChart(container, rawData, customOptions = {}) {
    const dom = typeof container === 'string' ? document.getElementById(container) : container;
    if (!dom) {
      console.error(`[TrendsChart] Container not found:`, container);
      return null;
    }

    if (!echarts) {
      console.error('[TrendsChart] Apache ECharts library is not loaded.');
      return null;
    }

    const chart = echarts.getInstanceByDom(dom) || echarts.init(dom);

    const years = rawData.years || [];
    const seriesData = rawData.series || {};

    const option = {
      title: {
        text: customOptions.title || '10-Year Decadal Fiscal Trends (2015-16 to 2024-25)',
        subtext: customOptions.subtext || 'Tax Buoyancy, Capital Expenditure Expansion & Fiscal Deficit Glide Path',
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
          type: 'cross',
          crossStyle: {
            color: '#94a3b8'
          }
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
          let header = `<div style="font-weight:700; font-size:13px; margin-bottom:6px; color:#38bdf8;">Fiscal Year: ${params[0].axisValue}</div>`;
          let rows = params.map(p => {
            const isPct = p.seriesName.includes('%') || p.seriesName.includes('Ratio');
            const displayVal = isPct ? `${p.value}%` : formatINR(p.value);
            return `
              <div style="display:flex; justify-content:space-between; gap:16px; margin:3px 0; font-size:12px;">
                <span>${p.marker} ${p.seriesName}:</span>
                <strong style="color:#ffffff;">${displayVal}</strong>
              </div>
            `;
          }).join('');
          return header + rows;
        }
      },
      legend: {
        data: [
          'Direct Tax',
          'Indirect Tax',
          'Capital Outlay (Capex)',
          'Total Expenditure',
          'Fiscal Deficit (% of GDP)'
        ],
        top: 60,
        textStyle: {
          fontSize: 11,
          color: '#475569'
        }
      },
      grid: {
        left: '4%',
        right: '5%',
        bottom: '12%',
        top: 105,
        containLabel: true
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          bottom: 5,
          height: 18,
          borderColor: '#cbd5e1',
          textStyle: {
            fontSize: 10,
            color: '#64748b'
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: years,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            fontSize: 11,
            color: '#334155'
          }
        }
      ],
      yAxis: [
        {
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
        {
          type: 'value',
          name: 'Deficit (% of GDP)',
          min: 0,
          max: 12,
          nameTextStyle: {
            fontSize: 11,
            color: '#dc2626'
          },
          axisLabel: {
            formatter: '{value}%',
            color: '#dc2626'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Direct Tax',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          itemStyle: { color: '#059669' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(5, 150, 105, 0.45)' },
              { offset: 1, color: 'rgba(5, 150, 105, 0.05)' }
            ])
          },
          data: seriesData.direct_tax || []
        },
        {
          name: 'Indirect Tax',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          itemStyle: { color: '#0891b2' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(8, 145, 178, 0.35)' },
              { offset: 1, color: 'rgba(8, 145, 178, 0.05)' }
            ])
          },
          data: seriesData.indirect_tax || []
        },
        {
          name: 'Capital Outlay (Capex)',
          type: 'bar',
          barWidth: '35%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#8b5cf6' },
              { offset: 1, color: '#6d28d9' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          data: seriesData.capital_expenditure || []
        },
        {
          name: 'Total Expenditure',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#2563eb'
          },
          itemStyle: { color: '#2563eb' },
          data: seriesData.total_expenditure || []
        },
        {
          name: 'Fiscal Deficit (% of GDP)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'diamond',
          symbolSize: 8,
          lineStyle: {
            width: 2.5,
            color: '#dc2626',
            type: 'dashed'
          },
          itemStyle: { color: '#dc2626' },
          markPoint: {
            data: [
              {
                name: 'COVID-19 Stimulus Peak',
                value: '9.2% (COVID)',
                coord: ['2020-21', 9.2],
                itemStyle: { color: '#b91c1c' }
              }
            ]
          },
          data: seriesData.fiscal_deficit_pct_gdp || []
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
        initTrendsChart(container, newRawData, customOptions);
      }
    };
  }

  return {
    init: initTrendsChart,
    formatINR: formatINR
  };
}));
