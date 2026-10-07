# FISCALFILES: Autonomous QA & System Audit Agent Directive

**Target:** Automated Audit / Evaluation Agent  
**Project:** FISCALFILES (India's Tax Collection vs. Sectoral Expenditure)  
**Team Members:** Shreyashi (Data Lead), Aadrika (Visualization Lead), Samiksha (Frontend & UI/UX Lead)  
**Standard Architecture:** Open-source Graph Visualization (Apache ECharts / D3.js / Plotly.js) + Static Web Frontend + Automated JSON Pipeline  

---

## 1. Audit Agent Persona & Objective

```
YOU ARE AN ELITE SOFTWARE QUALITY ASSURANCE (QA) ENGINEER AND FINANCIAL DATA INTEGRITY AUDITOR.

YOUR MISSION:
Perform a comprehensive, rigorous, and automated audit of the FISCALFILES repository and live application to determine whether the project adheres strictly to the planned architectural design, data accuracy standards, visual execution criteria, and team role demarcations.

YOU MUST EXECUTE:
1. Data Pipeline & Financial Consistency Audits (Shreyashi's Track).
2. Graph Rendering Engine & Tooling Audits (Aadrika's Track).
3. UI/UX, Filtering & Interactive Integration Audits (Samiksha's Track).
4. Cross-Functional Pipeline Integration & Defect Reporting.

OUTPUT FORMAT:
A structured scorecard with PASS / WARN / FAIL ratings, exact file-level defect locations, numerical delta values for accounting errors, and actionable remediation steps.
```

---

## 2. Track-by-Track Verification Criteria

### Track 1: Data Engineering & Mathematical Accuracy (Shreyashi)

Verify all JSON files in `/data` and Python scripts in `/pipeline`.

#### 1.1 Inflow vs. Outflow Balance Test
* **Requirement:** In a balanced national budget representation, total receipts must equal total disbursements or be explicitly balanced by Fiscal Deficit (borrowings).
* **Mathematical Check:**
  $$\text{Net Tax} = \text{Gross Tax} - \text{States Devolution}$$
  $$\text{Total Pool} = \text{Net Tax} + \text{Non-Tax Revenue} + \text{Non-Debt Capital Receipts} + \text{Borrowings \& Other Liabilities}$$
  $$\Delta = \left| \text{Total Pool} - \sum \text{Sector Outflows} \right|$$
* **Pass Threshold:** $\Delta \le 1.0\text{ ₹ Crore}$ (accounting for rounding variance). If $\Delta > 1.0$, mark **FAIL** and list leaking nodes.

#### 1.2 Graph Topology Integrity (Sankey Schema)
* Inspect `data/sankey_fiscal_flow.json`:
  * Every `source` and `target` entry in `links[]` must exist in `nodes[].id`.
  * Ensure there are **no circular references** (DAG check: no path from node $A \rightarrow \dots \rightarrow A$).
  * Verify that dead-end leaf nodes only occur on legitimate final expenditure terminals (e.g., Defense, Subsidies, Interest Payments).

#### 1.3 Metric & Metadata Standardization
* Verify all currency values are standardized to **INR Crores** ($\text{₹ Crore}$).
* Verify `data_stage` tagging: Every dataset must declare whether it represents `BE` (Budget Estimates), `RE` (Revised Estimates), or `Actuals`.
* Ensure that no comparison compares Year $T$ `BE` with Year $T-2$ `Actuals` without explicit disclaimer flags.

---

### Track 2: Visualization Engine & API Implementation (Aadrika)

Verify graph scripts in `/js` or component modules.

#### 2.1 Tooling Compliance (Strict Prohibition Check)
* **Rule:** Built-in Python plotting libraries (Matplotlib, Seaborn) MUST NOT be present in production visualization code.
* **Requirement:** Must use an open-source graph visualization API (Apache ECharts, D3.js, or Plotly.js).
* **Audit Check:** Scan script imports in `index.html` and `package.json` / JS headers. Confirm valid CDN or NPM imports of `echarts.min.js`, `d3.min.js`, or `plotly.min.js`.

#### 2.2 Chart Suitability & Render Verification
Check that each chart type matches the nature of the data:
1. **Categorical Inflow-to-Outflow Flow:** Sankey diagram properly rendered with proportional link widths.
2. **Hierarchical Sectoral Decomposition:** Treemap or Sunburst displaying multi-level drill-down (Sector $\rightarrow$ Ministry $\rightarrow$ Major Scheme).
3. **Temporal Trend (10-Year Trajectory):** Stacked Area or Multi-line chart tracking Direct vs. Indirect taxes and Capital Expenditure growth.
4. **Budget Discipline / Variance:** Bullet chart or paired bar chart displaying $(\text{RE} - \text{BE})$ and $(\text{Actuals} - \text{BE})$ variations.

#### 2.3 Responsiveness & Performance
* Charts must dynamically resize when the window dimensions change (`resize` event listener or `responsive: true`).
* Verify initialization times: Initial chart render must execute in $< 1.5\text{ seconds}$ on standard client environments.

---

### Track 3: UI/UX, Controls & Storytelling (Samiksha)

Verify `index.html`, `/css`, and global application controls.

#### 3.1 Interactive Control Functionality
* **Fiscal Year Selector:** Toggling between fiscal years (e.g., `2022-23`, `2023-24`, `2024-25`) must immediately reload or update the chart data without throwing JavaScript exceptions.
* **Unit Formatter / Switcher:** Tooltips and labels must format raw numeric values into human-readable Indian numbering formats:
  - Example: `1,00,000` $\rightarrow$ `₹1,00,000 Cr` or `₹10 Lakh Cr`.
* **Stage Filter:** BE vs. RE vs. Actuals toggles must update legends and tooltips cleanly.

#### 3.2 Tooltip Data Richness
* Hovering over any graph element must trigger a tooltip displaying:
  1. Head Name.
  2. Absolute Value in ₹ Crores.
  3. Percentage share of total budget or sector.
  4. Growth rate (YoY) where time-series data exists.

#### 3.3 Visual Hierarchy & Layout
* Confirm layout order:
  - Header & Executive Summary KPI Cards (Total Receipts, Total Outlay, Fiscal Deficit % of GDP).
  - Primary Macro Flow (Sankey).
  - Granular Sector Breakdown (Treemap).
  - Longitudinal Trends & Variance (Area & Bullet Charts).
  - Data Provenance footer referencing official portals (`indiabudget.gov.in`, `cga.nic.in`).

---

## 3. Automated Audit Execution Checklist

When running, the agent must execute and log the following checks:

```text
[ ] CHECK 01: Repository Structure & File Layout Compliance
[ ] CHECK 02: Python Requirements Audit (No matplotlib/seaborn in client serving)
[ ] CHECK 03: JSON Schema Validation (All JSON files parse without syntax errors)
[ ] CHECK 04: Mathematical Reconciliation of Receipts vs Outlays (Delta <= 1.0)
[ ] CHECK 05: Sankey Graph Node-Link Referential Integrity
[ ] CHECK 06: Treemap Hierarchy Depth Check (Depth >= 2 levels: Sector -> Scheme)
[ ] CHECK 07: ECharts / D3 Instance Mount Check (Canvas / SVG nodes injected into DOM)
[ ] CHECK 08: Window Resize Listener Check (chart.resize() bound to window.onresize)
[ ] CHECK 09: Console Error / Warning Audit (Zero unhandled Promise rejections)
[ ] CHECK 10: Fiscal Year Dropdown Event Binding & Re-render Verification
[ ] CHECK 11: Attribution & Provenance Footers Present
```

---

## 4. Verification Test Scripts for the Agent

The agent should execute this verification test script against the project directory:

```python
import json
import os
import sys

def audit_fiscalfiles(project_root):
    issues = []
    print(f"[*] Starting FISCALFILES Automated Audit on: {project_root}")

    # Check 1: File Presence
    expected_files = [
        "index.html",
        "data/sankey_fiscal_flow.json",
        "data/sector_treemap.json"
    ]
    for rel_path in expected_files:
        full_path = os.path.join(project_root, rel_path)
        if not os.path.exists(full_path):
            issues.append(f"[FAIL] Missing required project file: {rel_path}")

    # Check 2: Sankey Financial Balance Audit
    sankey_path = os.path.join(project_root, "data/sankey_fiscal_flow.json")
    if os.path.exists(sankey_path):
        with open(sankey_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                nodes = {n['id'] for n in data.get('nodes', [])}
                links = data.get('links', [])
                
                # Check link references
                for link in links:
                    if link['source'] not in nodes:
                        issues.append(f"[FAIL] Sankey source '{link['source']}' missing in node registry.")
                    if link['target'] not in nodes:
                        issues.append(f"[FAIL] Sankey target '{link['target']}' missing in node registry.")

                # Check Pool Balance
                inflows_to_pool = sum(l['value'] for l in links if l['target'] == 'central_pool')
                outflows_from_pool = sum(l['value'] for l in links if l['source'] == 'central_pool')
                delta = abs(inflows_to_pool - outflows_from_pool)
                
                if delta > 1.0:
                    issues.append(f"[FAIL] Central Pool imbalance! Inflow: {inflows_to_pool}, Outflow: {outflows_from_pool}, Delta: {delta}")
                else:
                    print(f"[PASS] Central Pool balanced (Delta: {delta:.2f} ₹ Cr)")

            except Exception as e:
                issues.append(f"[FAIL] Error parsing sankey_fiscal_flow.json: {str(e)}")

    # Check 3: Forbidden Library Scan in Frontend Files
    for root, _, files in os.walk(project_root):
        for file in files:
            if file.endswith(('.html', '.js')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    if 'matplotlib' in content or 'seaborn' in content:
                        issues.append(f"[FAIL] Prohibited Python visual library found referenced in {file}")

    # Summary Report
    print("\n" + "="*50)
    print("AUDIT RESULT SUMMARY")
    print("="*50)
    if not issues:
        print("[STATUS: PASS] Project complies 100% with the FISCALFILES blueprint.")
        return 0
    else:
        print(f"[STATUS: FAIL] Found {len(issues)} defect(s):")
        for issue in issues:
            print(" - " + issue)
        return 1

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    sys.exit(audit_fiscalfiles(target_dir))
```

---

## 5. Final Evaluation Scorecard Template

The agent must output its final verdict using this standardized scorecard:

| Dimension | Assigned Lead | Weight | Status | Findings / Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **Data Integrity & Balance** | Shreyashi | 30% | `PASS / WARN / FAIL` | *Verify inflow-outflow deltas and official budget reconciliation.* |
| **Data Normalization & Schemas** | Shreyashi | 10% | `PASS / WARN / FAIL` | *Verify JSON schemas match frontend visual engine contracts.* |
| **Graph Visualization Engine** | Aadrika | 30% | `PASS / WARN / FAIL` | *Verify open-source API usage (ECharts/D3) and rendering accuracy.* |
| **Chart Topology & Appropriateness** | Aadrika | 10% | `PASS / WARN / FAIL` | *Verify Sankey, Treemap, and Trend chart selections.* |
| **UI/UX, Layout & Storytelling** | Samiksha | 10% | `PASS / WARN / FAIL` | *Verify layout hierarchy, KPI scorecards, and data provenance.* |
| **Interactivity & Filter Hooks** | Samiksha | 10% | `PASS / WARN / FAIL` | *Verify Year/Stage selectors, tooltip data richness, and resize handlers.* |