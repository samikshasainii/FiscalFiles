/**
 * FISCALFILES - UI Controller & Application Orchestrator
 * Role: Frontend & UI/UX Lead (Samiksha - Member 3)
 * Consumes: Aadrika's Visualization Engines (SankeyChart, TreemapChart, TrendsChart, VarianceChart)
 * Module: js/app.js
 */

(function () {
  'use strict';

  // State
  let fiscalData = null;
  let chartInstances = {};

  // Formatter helper
  function formatLakhCrore(crores) {
    if (!crores) return '₹0 Cr';
    return `₹${(crores / 100000).toFixed(2)} Lakh Cr`;
  }

  async function loadData() {
    // 1. Prioritize asynchronous HTTP fetch from JSON endpoints (Standard Web & GitHub Pages)
    try {
      console.log('[App] Loading datasets asynchronously via fetch()...');
      const [sankey, treemap, trends, variance] = await Promise.all([
        fetch('./data/sankey_fiscal_flow.json').then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} on sankey_fiscal_flow.json`);
          return r.json();
        }),
        fetch('./data/sector_treemap.json').then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} on sector_treemap.json`);
          return r.json();
        }),
        fetch('./data/historical_trends.json').then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} on historical_trends.json`);
          return r.json();
        }),
        fetch('./data/budget_variance_be_re_actuals.json').then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} on budget_variance_be_re_actuals.json`);
          return r.json();
        })
      ]);

      return { sankey, treemap, trends, variance };
    } catch (fetchErr) {
      // 2. Offline fallback for direct file:// browser inspection (Zero-CORS bundle)
      if (window.FISCAL_DATA) {
        console.info('[App] Using pre-bundled window.FISCAL_DATA for offline environment:', fetchErr.message);
        return window.FISCAL_DATA;
      }
      throw fetchErr;
    }
  }

  function updateKPIs(data) {
    const summary = (data.sankey && data.sankey.summary) || {};
    
    const grossTaxEl = document.getElementById('kpi-gross-tax');
    if (grossTaxEl && summary.gross_tax_revenue) {
      grossTaxEl.textContent = formatLakhCrore(summary.gross_tax_revenue);
    }

    const devolutionEl = document.getElementById('kpi-devolution');
    if (devolutionEl && summary.states_share_devolution) {
      devolutionEl.textContent = formatLakhCrore(summary.states_share_devolution);
    }

    const totalPoolEl = document.getElementById('kpi-total-pool');
    if (totalPoolEl && summary.total_central_receipts) {
      totalPoolEl.textContent = formatLakhCrore(summary.total_central_receipts);
    }
  }

  function initCharts(data) {
    // 1. Sankey Macro Flow
    if (window.SankeyChart && data.sankey) {
      chartInstances.sankey = window.SankeyChart.init('sankey-chart', data.sankey);
    }

    // 2. Hierarchical Treemap
    if (window.TreemapChart && data.treemap) {
      chartInstances.treemap = window.TreemapChart.init('treemap-chart', data.treemap);
    }

    // 3. 10-Year Decadal Trends
    if (window.TrendsChart && data.trends) {
      chartInstances.trends = window.TrendsChart.init('trends-chart', data.trends);
    }

    // 4. Budget Variance Analysis
    if (window.VarianceChart && data.variance) {
      chartInstances.variance = window.VarianceChart.init('variance-chart', data.variance);
    }
  }

  function bindEventListeners() {
    // Year filter listener
    const yearSelect = document.getElementById('filter-year');
    if (yearSelect) {
      yearSelect.addEventListener('change', function (e) {
        const selectedYear = e.target.value;
        console.log(`[App] Fiscal Year changed to: ${selectedYear}`);
        const badge = document.querySelector('.badge');
        if (badge) {
          badge.textContent = `FY ${selectedYear} View`;
        }
      });
    }

    // Stage filter listener (BE vs RE)
    const stageSelect = document.getElementById('filter-stage');
    if (stageSelect) {
      stageSelect.addEventListener('change', function (e) {
        const selectedStage = e.target.value;
        console.log(`[App] Data Stage changed to: ${selectedStage}`);
        const badge = document.querySelector('.badge');
        if (badge) {
          const yr = yearSelect ? yearSelect.value : '2024-25';
          badge.textContent = `${yr} (${selectedStage})`;
        }
      });
    }
  }

  // Application Entry Point
  document.addEventListener('DOMContentLoaded', async function () {
    try {
      fiscalData = await loadData();
      updateKPIs(fiscalData);
      initCharts(fiscalData);
      bindEventListeners();
      console.log('🚀 [App] FISCALFILES dashboard initialized successfully.');
    } catch (err) {
      console.error('[App] Initialization failed:', err);
    }
  });

})();
