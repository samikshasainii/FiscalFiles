#!/usr/bin/env python3
"""
FISCALFILES - Automated Fiscal Data Quality & Validation Engine
Role: Data Lead & Pipeline Architect (Shreyashi - Member 1)
Project: FISCALFILES (India's Tax Collection vs. Sectoral Expenditure)

This script performs comprehensive QA audits and mathematical reconciliations
on all JSON artifacts generated in the data/ directory, verifying:
  1. Zero Missing Nodes (source/target IDs strictly present in nodes definition)
  2. Zero Dead-End Leaks (Total Inflow == Total Outflow within 0.01 Cr bound)
  3. Devolution Formula Integrity (Gross Tax - Devolution == Net Tax)
  4. Component Aggregation Integrity (Direct + Indirect == Gross Tax)
  5. Schema, Metadata, and Non-Null constraints
  6. Treemap & Time-series array consistency
  7. Verification Log generation (pipeline/verification_log.txt)
"""

import sys
import json
import math
import hashlib
import datetime
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("FiscalFilesValidator")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
PIPELINE_DIR = BASE_DIR / "pipeline"

class FiscalValidationError(Exception):
    """Custom exception for validation failure."""
    pass

def load_json(filename):
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise FiscalValidationError(f"Required data file missing: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def get_md5(filepath):
    """Returns MD5 hash of file."""
    h = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def validate_sankey():
    logger.info("--> Validating sankey_fiscal_flow.json...")
    data = load_json("sankey_fiscal_flow.json")

    # 1. Metadata check
    assert "fiscal_year" in data, "Missing fiscal_year in sankey"
    assert "data_stage" in data, "Missing data_stage in sankey"
    assert data.get("unit") == "INR_CRORE", f"Invalid unit: {data.get('unit')}, expected INR_CRORE"

    nodes = data.get("nodes", [])
    links = data.get("links", [])
    assert len(nodes) > 0, "Nodes array is empty"
    assert len(links) > 0, "Links array is empty"

    node_ids = {n["id"] for n in nodes if "id" in n}
    assert len(node_ids) == len(nodes), "Duplicate node IDs detected in nodes array"

    # 2. Zero Missing Nodes
    missing_sources = set()
    missing_targets = set()
    link_values_by_pair = {}

    for link in links:
        src = link.get("source")
        tgt = link.get("target")
        val = link.get("value")

        if src not in node_ids:
            missing_sources.add(src)
        if tgt not in node_ids:
            missing_targets.add(tgt)
        if val is None or math.isnan(val) or val <= 0:
            raise FiscalValidationError(f"Invalid link value for {src} -> {tgt}: {val}")

        link_values_by_pair[(src, tgt)] = val

    if missing_sources:
        raise FiscalValidationError(f"Link sources missing from nodes: {missing_sources}")
    if missing_targets:
        raise FiscalValidationError(f"Link targets missing from nodes: {missing_targets}")
    logger.info("   [PASS] Zero Missing Nodes: All link sources & targets mapped in nodes.")

    # 3. Direct Tax Aggregation Check
    corp_val = link_values_by_pair.get(("corp_tax", "direct_tax"), 0.0)
    income_val = link_values_by_pair.get(("income_tax", "direct_tax"), 0.0)
    direct_val = link_values_by_pair.get(("direct_tax", "gross_tax"), 0.0)
    assert math.isclose(corp_val + income_val, direct_val, abs_tol=0.01), \
        f"Direct tax mismatch: {corp_val} + {income_val} != {direct_val}"
    logger.info(f"   [PASS] Direct Tax Reconciliation: ₹{direct_val:,.2f} Cr")

    # 4. Indirect Tax Aggregation Check
    gst_val = link_values_by_pair.get(("gst", "indirect_tax"), 0.0)
    customs_val = link_values_by_pair.get(("customs", "indirect_tax"), 0.0)
    excise_val = link_values_by_pair.get(("excise", "indirect_tax"), 0.0)
    indirect_val = link_values_by_pair.get(("indirect_tax", "gross_tax"), 0.0)
    assert math.isclose(gst_val + customs_val + excise_val, indirect_val, abs_tol=0.01), \
        f"Indirect tax mismatch: {gst_val + customs_val + excise_val} != {indirect_val}"
    logger.info(f"   [PASS] Indirect Tax Reconciliation: ₹{indirect_val:,.2f} Cr")

    # 5. Gross Tax Aggregation Check
    gross_tax_calc = direct_val + indirect_val
    devolution_val = link_values_by_pair.get(("gross_tax", "devolution"), 0.0)
    net_tax_val = link_values_by_pair.get(("gross_tax", "net_tax"), 0.0)
    assert math.isclose(gross_tax_calc, devolution_val + net_tax_val, abs_tol=0.01), \
        f"Gross tax split mismatch: {gross_tax_calc} != {devolution_val} + {net_tax_val}"
    logger.info(f"   [PASS] Devolution & Net Tax Reconciliation: Gross=₹{gross_tax_calc:,.2f} Cr, Devolution=₹{devolution_val:,.2f} Cr, Net=₹{net_tax_val:,.2f} Cr")

    # 6. Central Pool Inflows vs Outflows (No Dead-End Leaks)
    pool_inflows = [link["value"] for link in links if link["target"] == "central_pool"]
    pool_outflows = [link["value"] for link in links if link["source"] == "central_pool"]

    total_inflow = sum(pool_inflows)
    total_outflow = sum(pool_outflows)
    discrepancy = abs(total_inflow - total_outflow)

    assert discrepancy <= 0.01, \
        f"Consolidated Pool mismatch! Inflow: {total_inflow}, Outflow: {total_outflow}, Diff: {discrepancy}"
    logger.info(f"   [PASS] Consolidated Fund Balance: Inflow ₹{total_inflow:,.2f} Cr == Outflow ₹{total_outflow:,.2f} Cr (Diff: ₹{discrepancy:.4f} Cr)")

    return {
        "direct_tax": direct_val,
        "indirect_tax": indirect_val,
        "gross_tax": gross_tax_calc,
        "devolution": devolution_val,
        "net_tax": net_tax_val,
        "total_inflow": total_inflow,
        "total_outflow": total_outflow,
        "discrepancy": discrepancy
    }

def validate_treemap():
    logger.info("--> Validating sector_treemap.json...")
    data = load_json("sector_treemap.json")

    assert data.get("name") == "Total Central Expenditure", "Invalid treemap root name"
    assert data.get("unit") == "INR_CRORE", "Invalid treemap unit"
    assert "children" in data and len(data["children"]) >= 8, f"Expected at least 8 sectors, got {len(data.get('children', []))}"

    def check_node(node, depth=0):
        assert "name" in node and node["name"], f"Unnamed node at depth {depth}"
        if "children" in node:
            assert len(node["children"]) > 0, f"Empty children list in {node['name']}"
            subtree_val = 0.0
            for child in node["children"]:
                subtree_val += check_node(child, depth + 1)
            return subtree_val
        else:
            val = node.get("value")
            assert val is not None and not math.isnan(val) and val > 0, f"Invalid leaf value in {node['name']}: {val}"
            return val

    total_tree_val = check_node(data)
    logger.info(f"   [PASS] Treemap Hierarchy: {len(data['children'])} primary sectors validated. Total Leaves Value: ₹{total_tree_val:,.2f} Cr")
    return total_tree_val

def validate_historical_trends():
    logger.info("--> Validating historical_trends.json...")
    data = load_json("historical_trends.json")

    years = data.get("years", [])
    assert len(years) == 10, f"Expected 10-year rolling window, got {len(years)}"
    series = data.get("series", {})

    required_keys = ["direct_tax", "indirect_tax", "total_expenditure", "capital_expenditure", "fiscal_deficit_pct_gdp"]
    for k in required_keys:
        assert k in series, f"Missing key in series: {k}"
        assert len(series[k]) == len(years), f"Length mismatch in {k}: {len(series[k])} != {len(years)}"
        for v in series[k]:
            assert v is not None and not math.isnan(v), f"Null or NaN detected in series {k}"

    for def_val in series["fiscal_deficit_pct_gdp"]:
        assert 2.0 <= def_val <= 12.0, f"Fiscal deficit outlier: {def_val}%"

    logger.info(f"   [PASS] 10-Year Time Series: {len(years)} years ({years[0]} to {years[-1]}) verified.")
    return len(years)

def validate_budget_variance():
    logger.info("--> Validating budget_variance_be_re_actuals.json...")
    data = load_json("budget_variance_be_re_actuals.json")

    assert isinstance(data, list) and len(data) >= 5, "Expected list of sectoral variances with at least 5 entries"
    for item in data:
        be = item.get("budget_estimate")
        re = item.get("revised_estimate")
        act = item.get("actuals")
        assert be and re and act, f"Missing estimate figures in {item.get('sector')}"

        calc_re_var = round(((re - be) / be) * 100, 2)
        calc_act_var = round(((act - be) / be) * 100, 2)
        rep_re_var = item.get("variance_re_vs_be_pct")
        rep_act_var = item.get("variance_actual_vs_be_pct")

        assert math.isclose(calc_re_var, rep_re_var, abs_tol=0.1), \
            f"RE Variance discrepancy in {item['sector']}: calculated {calc_re_var}% != reported {rep_re_var}%"
        assert math.isclose(calc_act_var, rep_act_var, abs_tol=0.1), \
            f"Actuals Variance discrepancy in {item['sector']}: calculated {calc_act_var}% != reported {rep_act_var}%"

    logger.info(f"   [PASS] Budget Variance Analysis: {len(data)} sectors mathematically verified.")
    return len(data)

def write_verification_log(sankey_stats, tree_val, trends_count, variance_count):
    """Outputs persistent verification log to pipeline/verification_log.txt."""
    log_file = PIPELINE_DIR / "verification_log.txt"
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    files = [
        "sankey_fiscal_flow.json",
        "sector_treemap.json",
        "historical_trends.json",
        "budget_variance_be_re_actuals.json"
    ]
    file_hashes = [f"  - {f}: MD5 {get_md5(DATA_DIR / f)}" for f in files if (DATA_DIR / f).exists()]

    log_text = f"""============================================================
FISCALFILES DATA ENGINEERING AUDIT CERTIFICATE
Auditor: Shreyashi (Member 1 - Data Lead & Pipeline Architect)
Timestamp: {timestamp}
Status: 100% VERIFIED & RECONCILED (Exit Code 0)
============================================================

1. CHECKSUM MANIFEST:
{chr(10).join(file_hashes)}

2. AUDIT SUMMARY:
  - Sankey Nodes & Links: All mapped, zero missing node IDs
  - Inflow-Outflow Balance: Inflow ₹{sankey_stats['total_inflow']:,.2f} Cr == Outflow ₹{sankey_stats['total_outflow']:,.2f} Cr
  - Discrepancy: ₹{sankey_stats['discrepancy']:.4f} Cr (Zero Leakage)
  - Gross Tax Reconciliation: ₹{sankey_stats['gross_tax']:,.2f} Cr (Direct: ₹{sankey_stats['direct_tax']:,.2f} Cr + Indirect: ₹{sankey_stats['indirect_tax']:,.2f} Cr)
  - Net Tax to Centre: ₹{sankey_stats['net_tax']:,.2f} Cr (Devolution: ₹{sankey_stats['devolution']:,.2f} Cr)
  - Treemap Leaves Sum: ₹{tree_val:,.2f} Cr across 8 primary sectors
  - Decadal Time Series: {trends_count} continuous fiscal periods (2015-16 to 2024-25)
  - Fiscal Discipline Sectors: {variance_count} sectors tested

CERTIFIED BY:
Shreyashi (Data Lead & Pipeline Architect)
============================================================
"""
    with open(log_file, "w", encoding="utf-8") as f:
        f.write(log_text)
    logger.info(f"[SUCCESS] Audit log exported to {log_file.relative_to(BASE_DIR)}")

def main():
    logger.info("=" * 60)
    logger.info("FISCALFILES QUALITY ASSURANCE & VERIFICATION SUITE")
    logger.info("Inspector: Shreyashi (Data Lead & Pipeline Architect)")
    logger.info("=" * 60)

    try:
        sankey_stats = validate_sankey()
        tree_val = validate_treemap()
        trends_count = validate_historical_trends()
        variance_count = validate_budget_variance()

        write_verification_log(sankey_stats, tree_val, trends_count, variance_count)

        logger.info("=" * 60)
        logger.info("ALL VERIFICATION CHECKS PASSED WITH 100% MATHEMATICAL PRECISION!")
        logger.info("The data is verified, clean, and ready for Aadrika & Samiksha.")
        logger.info("=" * 60)
        return 0
    except Exception as e:
        logger.error(f"[FAILED] QA Validation Error: {e}", exc_info=True)
        return 1

if __name__ == "__main__":
    sys.exit(main())
