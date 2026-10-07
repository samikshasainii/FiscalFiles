# FISCALFILES: Data Quality & Provenance Report
**Author:** Shreyashi (Data Lead & Pipeline Architect - Member 1)  
**Execution Timestamp:** 2026-10-02 10:57:18  
**Pipeline Run Status:** 100% Passed & Mathematically Reconciled

---

## 1. Raw Data Ingestion & Provenance Hashes (Step 1 & 2)
- `historical_fiscal_indicators_10yr.csv` (SHA-256: `c74820e5b733e21e...`)
- `sectoral_mapping_taxonomy.json` (SHA-256: `533962fd61627881...`)
- `union_budget_2024_expenditure_profile.csv` (SHA-256: `81797e0f1e94651e...`)
- `union_budget_2024_receipts.csv` (SHA-256: `241bdeda6e739c13...`)

---

## 2. Mathematical Integrity Audits (Step 4)

| Formula / Audit Head | Expected Formula | Calculated Value (₹ Cr) | Reconciliation Status |
| :--- | :--- | :--- | :--- |
| **Direct Taxes** | Corp Tax + Income Tax | ₹2,176,000.00 Cr | ✅ Exact Match |
| **Indirect Taxes** | GST + Customs + Excise | ₹1,618,130.00 Cr | ✅ Exact Match |
| **Gross Tax Revenue** | Direct + Indirect Taxes | ₹3,794,130.00 Cr | ✅ Exact Match |
| **States' Share (Devolution)** | 15th Finance Commission | ₹1,219,783.00 Cr | ✅ Verified (~41% divisible pool) |
| **Net Tax to Centre** | Gross Tax - Devolution | ₹2,574,347.00 Cr | ✅ Exact Match |
| **Consolidated Fund Inflow** | Net Tax + Non-Tax + Borrowings | ₹4,750,351.00 Cr | ✅ Verified |
| **Consolidated Fund Outflow** | Sum of 8 Primary Spending Sectors | ₹4,750,351.00 Cr | ✅ Verified |
| **Zero Leakage Bound** | Inflow - Outflow == 0.00 | ₹0.0000 Cr | ✅ Passed ($\le 0.01$ Cr threshold) |

---

## 3. Serialized Output Datasets (Step 5)

| Filename | Records / Nodes | Schema Key Elements | Target Consumer |
| :--- | :--- | :--- | :--- |
| `data/sankey_fiscal_flow.json` | 21 Nodes, 20 Links | Nodes, Links, Fiscal Summary | Aadrika (`sankeyChart.js`) |
| `data/sector_treemap.json` | 8 Primary Sectors | Hierarchical Sectors $\\rightarrow$ Schemes | Aadrika (`treemapChart.js`) |
| `data/historical_trends.json` | 10 Decadal Years | Tax, Outlays, Fiscal Deficit % | Aadrika (`trendsChart.js`) |
| `data/budget_variance_be_re_actuals.json` | 6 Critical Sectors | BE vs RE vs Actuals + Variances | Dashboard Cards & Bullet Charts |

---

## 4. Certification Statement
All outputs conform strictly to the Indian Public Finance taxonomy and zero-error tolerances. The pipeline scripts, raw data dictionaries, and serialized JSONs are fully verified for production deployment.
