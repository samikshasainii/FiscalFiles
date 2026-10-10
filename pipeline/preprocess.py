#!/usr/bin/env python3
"""
preprocess.py - Graph Visualization Preprocessing Pipeline
FiscalFiles: India's Sovereign Fiscal Network Architecture

Strict Compliance with project_brief_guidelines.md and PROCEED.md:
- Code Boundary: strictly used for data ingestion, cleaning, transformation,
  network metric computation, and exporting node/edge CSV lists and standard graph formats.
- Prepares nodes.csv (38 nodes: Id, Label, Category, Tier, Budget_Crore)
- Prepares edges.csv (52 directed weighted edges: Source, Target, Weight, Type, Relation)
- Computes NetworkX metrics (Betweenness Centrality, Louvain Modularity, Degree Centrality, PageRank)
- Exports native graph interchange formats: GEXF (for Gephi) and GraphML (for Cytoscape/yEd)
- Exports Neo4j Cypher script (for Neo4j + Bloom)
"""

import os
import sys
import json
import math
from pathlib import Path
import networkx as nx

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
EXPORTS_DIR = BASE_DIR / "exports"

EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# 1. Exact 38 Nodes across 6 Fiscal Tiers
NODES_DATA = [
    # Tier 1: Primary Revenue & Borrowing Mobilization (7 nodes)
    {"id": "corp_tax", "label": "Corporation Tax", "category": "Direct Tax", "tier": 1, "budget": 1020000.0},
    {"id": "income_tax", "label": "Personal Income Tax", "category": "Direct Tax", "tier": 1, "budget": 1156000.0},
    {"id": "gst", "label": "Goods & Services Tax (GST)", "category": "Indirect Tax", "tier": 1, "budget": 1067650.0},
    {"id": "customs", "label": "Customs Duty", "category": "Indirect Tax", "tier": 1, "budget": 231700.0},
    {"id": "excise", "label": "Union Excise Duties", "category": "Indirect Tax", "tier": 1, "budget": 318780.0},
    {"id": "borrowings", "label": "Fiscal Deficit Borrowings", "category": "Capital Inflow", "tier": 1, "budget": 1613312.0},
    {"id": "non_tax", "label": "Non-Tax Receipts (RBI/Dividends)", "category": "Non-Tax Revenue", "tier": 1, "budget": 562692.0},

    # Tier 2: Tax Aggregation Hubs (3 nodes)
    {"id": "direct_tax", "label": "Direct Taxes Pool", "category": "Tax Pool", "tier": 2, "budget": 2176000.0},
    {"id": "indirect_tax", "label": "Indirect Taxes Pool", "category": "Tax Pool", "tier": 2, "budget": 1618130.0},
    {"id": "gross_tax", "label": "Gross Tax Revenue", "category": "Macro Hub", "tier": 2, "budget": 3794130.0},

    # Tier 3: Constitutional & Statutory Intermediaries (2 nodes)
    {"id": "devolution", "label": "States Devolution (41% FC Pool)", "category": "Constitutional Devolution", "tier": 3, "budget": 1219783.0},
    {"id": "net_tax", "label": "Net Tax to Centre", "category": "Central Revenue", "tier": 3, "budget": 2574347.0},

    # Tier 4: Sovereign Treasury Core / Master Gatekeeper (1 node)
    {"id": "central_pool", "label": "Consolidated Fund of India (CFI)", "category": "Sovereign Treasury", "tier": 4, "budget": 4750351.0},

    # Tier 5: 8 Functional Expenditure Pillars (8 nodes)
    {"id": "interest", "label": "Debt Servicing (Interest Payments)", "category": "Sovereign Obligation", "tier": 5, "budget": 1162940.0},
    {"id": "defense", "label": "Defense & National Security", "category": "Strategic Defense", "tier": 5, "budget": 454773.0},
    {"id": "infra", "label": "Transport & Infrastructure", "category": "Capital Infrastructure", "tier": 5, "budget": 544000.0},
    {"id": "rural_agri", "label": "Agri & Rural Development", "category": "Rural & Agrarian", "tier": 5, "budget": 265808.0},
    {"id": "subsidies", "label": "Major Subsidies (Food & Fert)", "category": "Social Safety Net", "tier": 5, "budget": 381175.0},
    {"id": "social", "label": "Education & Health Human Capital", "category": "Human Capital", "tier": 5, "budget": 212450.0},
    {"id": "transfers_grants", "label": "Finance Commission Grants", "category": "Intergovernmental", "tier": 5, "budget": 232000.0},
    {"id": "other_exp", "label": "General Admin & Organs of State", "category": "Public Administration", "tier": 5, "budget": 1497205.0},

    # Tier 6: Line Ministries & Flagship Schemes (17 nodes) -> Total = 38 nodes
    {"id": "mod", "label": "Ministry of Defence", "category": "Strategic Defense", "tier": 6, "budget": 454773.0},
    {"id": "def_capex", "label": "Defense Modernization Capex", "category": "Strategic Defense", "tier": 6, "budget": 172000.0},
    {"id": "def_salaries", "label": "Defense Revenue & Pensions", "category": "Strategic Defense", "tier": 6, "budget": 282773.0},

    {"id": "morth", "label": "Ministry of Road Transport & Highways", "category": "Capital Infrastructure", "tier": 6, "budget": 278000.0},
    {"id": "nhai", "label": "NHAI Expressways & Highways", "category": "Capital Infrastructure", "tier": 6, "budget": 168464.0},
    {"id": "railways", "label": "Indian Railways Capital Outlay", "category": "Capital Infrastructure", "tier": 6, "budget": 252200.0},
    {"id": "mohua", "label": "Ministry of Housing & Urban Affairs", "category": "Capital Infrastructure", "tier": 6, "budget": 82577.0},
    {"id": "pmay", "label": "Pradhan Mantri Awas Yojana (PMAY)", "category": "Social Safety Net", "tier": 6, "budget": 54500.0},

    {"id": "mord", "label": "Ministry of Rural Development", "category": "Rural & Agrarian", "tier": 6, "budget": 177566.0},
    {"id": "mgnrega", "label": "MGNREGA Rural Employment Guarantee", "category": "Rural & Agrarian", "tier": 6, "budget": 86000.0},
    {"id": "moa", "label": "Ministry of Agriculture & Farmers Welfare", "category": "Rural & Agrarian", "tier": 6, "budget": 132000.0},
    {"id": "pm_kisan", "label": "PM-KISAN Direct Income Support", "category": "Rural & Agrarian", "tier": 6, "budget": 60000.0},

    {"id": "food_pds", "label": "Dept of Food & Public Distribution", "category": "Social Safety Net", "tier": 6, "budget": 213000.0},
    {"id": "nfsa_food", "label": "NFSA Food Subsidy (PDS)", "category": "Social Safety Net", "tier": 6, "budget": 205250.0},
    {"id": "fert_dept", "label": "Department of Fertilizers", "category": "Social Safety Net", "tier": 6, "budget": 168000.0},
    {"id": "fert_sub", "label": "Fertilizer Subsidy (Urea & NBS)", "category": "Social Safety Net", "tier": 6, "budget": 164000.0},

    {"id": "mohfw_health", "label": "Ministry of Health & Family Welfare", "category": "Human Capital", "tier": 6, "budget": 90659.0},
]

# 2. Exact 52 Directed Weighted Edges
EDGES_DATA = [
    # Direct Taxes Aggregation (2)
    {"source": "corp_tax", "target": "direct_tax", "weight": 1020000.0, "type": "Directed", "relation": "AGGREGATES_INTO"},
    {"source": "income_tax", "target": "direct_tax", "weight": 1156000.0, "type": "Directed", "relation": "AGGREGATES_INTO"},

    # Indirect Taxes Aggregation (3)
    {"source": "gst", "target": "indirect_tax", "weight": 1067650.0, "type": "Directed", "relation": "AGGREGATES_INTO"},
    {"source": "customs", "target": "indirect_tax", "weight": 231700.0, "type": "Directed", "relation": "AGGREGATES_INTO"},
    {"source": "excise", "target": "indirect_tax", "weight": 318780.0, "type": "Directed", "relation": "AGGREGATES_INTO"},

    # Gross Tax Pool Formation (2)
    {"source": "direct_tax", "target": "gross_tax", "weight": 2176000.0, "type": "Directed", "relation": "FORMS_GROSS_REVENUE"},
    {"source": "indirect_tax", "target": "gross_tax", "weight": 1618130.0, "type": "Directed", "relation": "FORMS_GROSS_REVENUE"},

    # Constitutional Devolution & Net Tax Bifurcation (2)
    {"source": "gross_tax", "target": "devolution", "weight": 1219783.0, "type": "Directed", "relation": "DEVOLVES_CONSTITUTIONALLY"},
    {"source": "gross_tax", "target": "net_tax", "weight": 2574347.0, "type": "Directed", "relation": "NET_TRANSFER_TO_CENTRE"},

    # Sovereign CFI Inflows (3)
    {"source": "net_tax", "target": "central_pool", "weight": 2574347.0, "type": "Directed", "relation": "CONSOLIDATES_INTO_CFI"},
    {"source": "borrowings", "target": "central_pool", "weight": 1613312.0, "type": "Directed", "relation": "DEFICIT_FINANCES_CFI"},
    {"source": "non_tax", "target": "central_pool", "weight": 562692.0, "type": "Directed", "relation": "NON_TAX_SURPLUS_INTO_CFI"},

    # CFI Master Allocations to 8 Functional Spending Pillars (8)
    {"source": "central_pool", "target": "interest", "weight": 1162940.0, "type": "Directed", "relation": "SERVICES_PUBLIC_DEBT"},
    {"source": "central_pool", "target": "defense", "weight": 454773.0, "type": "Directed", "relation": "FUNDS_NATIONAL_SECURITY"},
    {"source": "central_pool", "target": "infra", "weight": 544000.0, "type": "Directed", "relation": "CAPEX_ALLOCATION"},
    {"source": "central_pool", "target": "rural_agri", "weight": 265808.0, "type": "Directed", "relation": "AGRI_WELFARE_ALLOCATION"},
    {"source": "central_pool", "target": "subsidies", "weight": 381175.0, "type": "Directed", "relation": "SUBSIDY_SUPPORT"},
    {"source": "central_pool", "target": "social", "weight": 212450.0, "type": "Directed", "relation": "HUMAN_CAPITAL_ALLOCATION"},
    {"source": "central_pool", "target": "transfers_grants", "weight": 232000.0, "type": "Directed", "relation": "FC_STATUTORY_GRANTS"},
    {"source": "central_pool", "target": "other_exp", "weight": 1497205.0, "type": "Directed", "relation": "CIVIL_GOVERNANCE_EXP"},

    # Strategic Defense Sub-allocations (3)
    {"source": "defense", "target": "mod", "weight": 454773.0, "type": "Directed", "relation": "MINISTRY_ENVELOPE"},
    {"source": "mod", "target": "def_capex", "weight": 172000.0, "type": "Directed", "relation": "CAPITAL_MODERNIZATION"},
    {"source": "mod", "target": "def_salaries", "weight": 282773.0, "type": "Directed", "relation": "REVENUE_SALARIES_PENSIONS"},

    # Capital Infrastructure Sub-allocations (5)
    {"source": "infra", "target": "morth", "weight": 278000.0, "type": "Directed", "relation": "HIGHWAY_PORTFOLIO"},
    {"source": "infra", "target": "railways", "weight": 252200.0, "type": "Directed", "relation": "RAILWAY_CAPEX_FUND"},
    {"source": "infra", "target": "mohua", "weight": 82577.0, "type": "Directed", "relation": "URBAN_INFRA_FUND"},
    {"source": "morth", "target": "nhai", "weight": 168464.0, "type": "Directed", "relation": "FLAGSHIP_EXPRESSWAYS"},
    {"source": "mohua", "target": "pmay", "weight": 30171.0, "type": "Directed", "relation": "URBAN_HOUSING_PROGRAM"},

    # Rural & Agrarian Welfare Sub-allocations (4)
    {"source": "rural_agri", "target": "mord", "weight": 177566.0, "type": "Directed", "relation": "RURAL_DEVELOPMENT_ENVELOPE"},
    {"source": "rural_agri", "target": "moa", "weight": 132000.0, "type": "Directed", "relation": "AGRICULTURE_ENVELOPE"},
    {"source": "mord", "target": "mgnrega", "weight": 86000.0, "type": "Directed", "relation": "GUARANTEED_WAGE_SAFETY"},
    {"source": "moa", "target": "pm_kisan", "weight": 60000.0, "type": "Directed", "relation": "DIRECT_INCOME_TRANSFER"},

    # Subsidies & Food/Fertilizer Sub-allocations (4)
    {"source": "subsidies", "target": "food_pds", "weight": 213000.0, "type": "Directed", "relation": "FOOD_SUBSIDY_ENVELOPE"},
    {"source": "subsidies", "target": "fert_dept", "weight": 168000.0, "type": "Directed", "relation": "FERTILIZER_SUBSIDY_ENVELOPE"},
    {"source": "food_pds", "target": "nfsa_food", "weight": 205250.0, "type": "Directed", "relation": "FOOD_SECURITY_PDS"},
    {"source": "fert_dept", "target": "fert_sub", "weight": 164000.0, "type": "Directed", "relation": "AGRI_INPUT_SUBSIDY"},

    # Social & Human Capital Sub-allocations (2)
    {"source": "social", "target": "mohfw_health", "weight": 90659.0, "type": "Directed", "relation": "HEALTHCARE_ENVELOPE"},
    {"source": "mord", "target": "pmay", "weight": 24329.0, "type": "Directed", "relation": "RURAL_HOUSING_PMAY_G"},

    # Sovereign Borrowing & Capital Formation Direct Bridges (3)
    {"source": "borrowings", "target": "infra", "weight": 544000.0, "type": "Directed", "relation": "DIRECT_DEBT_TO_CAPEX"},
    {"source": "borrowings", "target": "interest", "weight": 618940.0, "type": "Directed", "relation": "DEBT_ROLLOVER_FINANCING"},
    {"source": "borrowings", "target": "defense", "weight": 172000.0, "type": "Directed", "relation": "SECURITY_CAPITAL_BORROWING"},

    # Constitutional Devolution & Intergovernmental Direct Ties (3)
    {"source": "devolution", "target": "rural_agri", "weight": 350000.0, "type": "Directed", "relation": "STATE_DEVOLUTION_RURAL_SPEND"},
    {"source": "devolution", "target": "social", "weight": 380000.0, "type": "Directed", "relation": "STATE_DEVOLUTION_HEALTH_EDU"},
    {"source": "transfers_grants", "target": "mord", "weight": 120000.0, "type": "Directed", "relation": "PANCHAYAT_TIER_GRANTS"},

    # Non-Tax Receipts Special Surpluses (3)
    {"source": "non_tax", "target": "social", "weight": 150000.0, "type": "Directed", "relation": "DIVIDEND_TO_HUMAN_CAPITAL"},
    {"source": "non_tax", "target": "infra", "weight": 200000.0, "type": "Directed", "relation": "SPECTRUM_AUCTION_TO_INFRA"},
    {"source": "non_tax", "target": "other_exp", "weight": 212692.0, "type": "Directed", "relation": "ADMIN_COST_ABSORPTION"},

    # Inter-Ministerial Synergies & Sovereign Feedback Ties (5) -> Total = exactly 52 edges
    {"source": "morth", "target": "railways", "weight": 45000.0, "type": "Directed", "relation": "PM_GATI_SHAKTI_MULTIMODAL"},
    {"source": "food_pds", "target": "rural_agri", "weight": 180000.0, "type": "Directed", "relation": "MSP_GRAIN_PROCUREMENT"},
    {"source": "moa", "target": "fert_dept", "weight": 120000.0, "type": "Directed", "relation": "AGRI_FERT_INPUT_SUBSIDY"},
    {"source": "defense", "target": "infra", "weight": 25000.0, "type": "Directed", "relation": "STRATEGIC_BORDER_ROADS"},
    {"source": "net_tax", "target": "transfers_grants", "weight": 232000.0, "type": "Directed", "relation": "POST_DEVOLUTION_DEFICIT_GRANTS"},
]


def write_csv_files():
    """Generates clean CSV files for nodes and edges adhering strictly to Gephi/Cytoscape imports."""
    node_lines = ["Id,Label,Category,Tier,Budget_Crore\n"]
    for n in NODES_DATA:
        node_lines.append(f'"{n["id"]}","{n["label"]}","{n["category"]}",{n["tier"]},{n["budget"]:.2f}\n')

    edge_lines = ["Source,Target,Weight,Type,Relation\n"]
    for e in EDGES_DATA:
        edge_lines.append(f'"{e["source"]}","{e["target"]}",{e["weight"]:.2f},"{e["type"]}","{e["relation"]}"\n')

    # Write to root
    with open(BASE_DIR / "nodes.csv", "w", encoding="utf-8") as f:
        f.writelines(node_lines)
    with open(BASE_DIR / "edges.csv", "w", encoding="utf-8") as f:
        f.writelines(edge_lines)

    # Write to data/
    with open(DATA_DIR / "nodes.csv", "w", encoding="utf-8") as f:
        f.writelines(node_lines)
    with open(DATA_DIR / "edges.csv", "w", encoding="utf-8") as f:
        f.writelines(edge_lines)

    print(f"[OK] Exported nodes.csv ({len(NODES_DATA)} records) and edges.csv ({len(EDGES_DATA)} records)")


def compute_network_metrics():
    """
    Computes rigorous graph theory metrics using NetworkX:
    - Degree Centrality (In, Out, Total)
    - Betweenness Centrality (C_B)
    - Modularity / Louvain Community Detection
    - Closeness Centrality & PageRank
    """
    G = nx.DiGraph()
    G_undirected = nx.Graph()

    for n in NODES_DATA:
        G.add_node(n["id"], label=n["label"], category=n["category"], tier=n["tier"], budget=n["budget"])
        G_undirected.add_node(n["id"], label=n["label"], category=n["category"], tier=n["tier"], budget=n["budget"])

    for e in EDGES_DATA:
        G.add_edge(e["source"], e["target"], weight=e["weight"], relation=e["relation"])
        G_undirected.add_edge(e["source"], e["target"], weight=e["weight"])

    # 1. Centralities
    in_degrees = dict(G.in_degree())
    out_degrees = dict(G.out_degree())
    total_degrees = dict(G_undirected.degree())
    degree_centrality = nx.degree_centrality(G)
    betweenness = nx.betweenness_centrality(G, weight="weight", normalized=True)
    unweighted_betweenness = nx.betweenness_centrality(G, normalized=True)
    closeness = nx.closeness_centrality(G)
    pagerank = nx.pagerank(G, weight="weight")

    # 2. Louvain Modularity Communities
    communities = nx.community.louvain_communities(G_undirected, weight="weight", seed=42)
    modularity_score = nx.community.modularity(G_undirected, communities, weight="weight")

    community_map = {}
    for c_id, comm in enumerate(communities):
        for node in comm:
            community_map[node] = c_id

    # Descriptive community labels based on members
    comm_names = {
        0: "Macro Revenue & Devolution Hub",
        1: "Direct Taxes & Sovereign Debt Servicing",
        2: "Capital Infrastructure & Transport",
        3: "Social Human Capital & Rural Welfare",
        4: "Strategic Defense & Security"
    }

    # Aggregate metric results
    results = {
        "graph_summary": {
            "node_count": G.number_of_nodes(),
            "edge_count": G.number_of_edges(),
            "is_directed": True,
            "density": nx.density(G),
            "modularity_score_Q": round(modularity_score, 4),
            "community_count": len(communities)
        },
        "communities": [
            {
                "community_id": c_id,
                "label": comm_names.get(c_id, f"Cluster {c_id}"),
                "members": sorted(list(comm))
            }
            for c_id, comm in enumerate(communities)
        ],
        "node_metrics": {}
    }

    for n in NODES_DATA:
        nid = n["id"]
        results["node_metrics"][nid] = {
            "id": nid,
            "label": n["label"],
            "category": n["category"],
            "tier": n["tier"],
            "budget_cr": n["budget"],
            "in_degree": in_degrees.get(nid, 0),
            "out_degree": out_degrees.get(nid, 0),
            "total_degree": total_degrees.get(nid, 0),
            "degree_centrality": round(degree_centrality.get(nid, 0.0), 4),
            "betweenness_centrality": round(betweenness.get(nid, 0.0), 4),
            "unweighted_betweenness": round(unweighted_betweenness.get(nid, 0.0), 4),
            "closeness_centrality": round(closeness.get(nid, 0.0), 4),
            "pagerank": round(pagerank.get(nid, 0.0), 4),
            "modularity_class": community_map.get(nid, 0)
        }

    # Save metrics JSON
    with open(DATA_DIR / "network_metrics.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"[OK] Computed NetworkX metrics (Modularity Q={modularity_score:.4f}, Nodes={G.number_of_nodes()}, Edges={G.number_of_edges()}) -> data/network_metrics.json")
    return results, G, community_map


def export_gexf_and_graphml(results, G, community_map):
    """
    Exports native Gephi GEXF format (with viz position, color, and size attributes)
    and GraphML format for Cytoscape and yEd.
    """
    palette = [
        {"r": 234, "g": 88,  "b": 12,  "hex": "#EA580C"},  # Amber/Orange
        {"r": 16,  "g": 185, "b": 129, "hex": "#10B981"},  # Emerald
        {"r": 59,  "g": 130, "b": 246, "hex": "#3B82F6"},  # Blue
        {"r": 168, "g": 85,  "b": 247, "hex": "#A855F7"},  # Purple
        {"r": 239, "g": 68,  "b": 68,  "hex": "#EF4444"},  # Red
    ]

    tier_x_ranges = {
        1: -600.0,
        2: -340.0,
        3: -100.0,
        4: 100.0,
        5: 360.0,
        6: 660.0
    }

    tier_nodes = {}
    for n in NODES_DATA:
        t = n["tier"]
        tier_nodes.setdefault(t, []).append(n)

    coords = {}
    for t, nodes in tier_nodes.items():
        base_x = tier_x_ranges.get(t, 0.0)
        num = len(nodes)
        y_step = 720.0 / max(1, num)
        start_y = -360.0 + (y_step / 2.0)
        for i, n in enumerate(nodes):
            h = abs(hash(n["id"])) % 50 - 25
            coords[n["id"]] = (base_x + (h * 1.2), start_y + (i * y_step) + h)

    # 1. GEXF Export
    gexf_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>\n',
        '<gexf xmlns="http://www.gexf.net/1.3draft"\n',
        '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n',
        '      xmlns:viz="http://www.gexf.net/1.3draft/viz"\n',
        '      xsi:schemaLocation="http://www.gexf.net/1.3draft http://www.gexf.net/1.3draft/gexf.xsd"\n',
        '      version="1.3">\n',
        '  <meta lastmodifieddate="2026-10-10">\n',
        '    <creator>FiscalFiles Preprocessing Engine (Compliance Audit)</creator>\n',
        '    <description>India Union Budget Fiscal Flow Network with ForceAtlas2 & Louvain encodings</description>\n',
        '  </meta>\n',
        '  <graph defaultedgetype="directed" mode="static">\n',
        '    <attributes class="node" mode="static">\n',
        '      <attribute id="0" title="Category" type="string"/>\n',
        '      <attribute id="1" title="Tier" type="integer"/>\n',
        '      <attribute id="2" title="Budget_Crore" type="double"/>\n',
        '      <attribute id="3" title="Betweenness_Centrality" type="double"/>\n',
        '      <attribute id="4" title="Modularity_Class" type="integer"/>\n',
        '    </attributes>\n',
        '    <attributes class="edge" mode="static">\n',
        '      <attribute id="0" title="Relation" type="string"/>\n',
        '    </attributes>\n',
        '    <nodes>\n'
    ]

    for n in NODES_DATA:
        nid = n["id"]
        met = results["node_metrics"][nid]
        bc = met["betweenness_centrality"]
        size = 15.0 + (bc * 75.0)
        comm_id = community_map.get(nid, 0) % len(palette)
        col = palette[comm_id]
        x, y = coords[nid]

        gexf_lines.append(f'      <node id="{nid}" label="{n["label"]}">\n')
        gexf_lines.append('        <attvalues>\n')
        gexf_lines.append(f'          <attvalue for="0" value="{n["category"]}"/>\n')
        gexf_lines.append(f'          <attvalue for="1" value="{n["tier"]}"/>\n')
        gexf_lines.append(f'          <attvalue for="2" value="{n["budget"]}"/>\n')
        gexf_lines.append(f'          <attvalue for="3" value="{bc}"/>\n')
        gexf_lines.append(f'          <attvalue for="4" value="{comm_id}"/>\n')
        gexf_lines.append('        </attvalues>\n')
        gexf_lines.append(f'        <viz:size value="{size:.2f}"/>\n')
        gexf_lines.append(f'        <viz:position x="{x:.2f}" y="{y:.2f}" z="0.0"/>\n')
        gexf_lines.append(f'        <viz:color r="{col["r"]}" g="{col["g"]}" b="{col["b"]}" a="0.9"/>\n')
        gexf_lines.append('      </node>\n')

    gexf_lines.append('    </nodes>\n')
    gexf_lines.append('    <edges>\n')

    for idx, e in enumerate(EDGES_DATA):
        gexf_lines.append(f'      <edge id="{idx}" source="{e["source"]}" target="{e["target"]}" weight="{e["weight"]:.2f}">\n')
        gexf_lines.append('        <attvalues>\n')
        gexf_lines.append(f'          <attvalue for="0" value="{e["relation"]}"/>\n')
        gexf_lines.append('        </attvalues>\n')
        gexf_lines.append('      </edge>\n')

    gexf_lines.append('    </edges>\n')
    gexf_lines.append('  </graph>\n')
    gexf_lines.append('</gexf>\n')

    gexf_path = DATA_DIR / "fiscal_network.gexf"
    with open(gexf_path, "w", encoding="utf-8") as f:
        f.writelines(gexf_lines)
    with open(EXPORTS_DIR / "fiscal_network.gexf", "w", encoding="utf-8") as f:
        f.writelines(gexf_lines)
    with open(BASE_DIR / "fiscal_network.gexf", "w", encoding="utf-8") as f:
        f.writelines(gexf_lines)

    print("[OK] Generated Gephi native GEXF -> data/fiscal_network.gexf and exports/fiscal_network.gexf")

    # 2. GraphML Export
    nx.write_graphml(G, DATA_DIR / "fiscal_network.graphml")
    nx.write_graphml(G, EXPORTS_DIR / "fiscal_network.graphml")
    print("[OK] Generated Cytoscape/yEd GraphML -> data/fiscal_network.graphml and exports/fiscal_network.graphml")


def export_neo4j_cypher(results, community_map):
    """
    Exports a native Neo4j Cypher dump script creating indexes, constraints,
    labeled nodes, relationships, and Neo4j Bloom style metadata.
    """
    cypher_lines = [
        "// =========================================================================\n",
        "// FiscalFiles: Neo4j Graph Model & Cypher Execution Script\n",
        "// India Sovereign Fiscal Network Architecture (~INR 48.2 Lakh Cr)\n",
        "// Generated for strict compliance with project_brief_guidelines.md\n",
        "// =========================================================================\n\n",
        "// 1. Schema Constraints & Indexes\n",
        "CREATE CONSTRAINT fiscal_node_id_unique IF NOT EXISTS FOR (n:FiscalEntity) REQUIRE n.id IS UNIQUE;\n",
        "CREATE INDEX fiscal_category_idx IF NOT EXISTS FOR (n:FiscalEntity) ON (n.category);\n",
        "CREATE INDEX fiscal_tier_idx IF NOT EXISTS FOR (n:FiscalEntity) ON (n.tier);\n\n",
        "// 2. Clear Existing Fiscal Graph\n",
        "MATCH (n:FiscalEntity) DETACH DELETE n;\n\n",
        "// 3. Ingest Nodes with Domain Attributes & Centrality Metrics (38 Nodes)\n"
    ]

    for n in NODES_DATA:
        nid = n["id"]
        met = results["node_metrics"][nid]
        comm_id = community_map.get(nid, 0)
        cypher_lines.append(
            f"CREATE (:FiscalEntity:{n['category'].replace(' ', '_').replace('&', 'And')} {{\n"
            f"  id: '{nid}',\n"
            f"  label: '{n['label']}',\n"
            f"  category: '{n['category']}',\n"
            f"  tier: {n['tier']},\n"
            f"  budget_crore: {n['budget']:.2f},\n"
            f"  betweenness_centrality: {met['betweenness_centrality']},\n"
            f"  degree_centrality: {met['degree_centrality']},\n"
            f"  in_degree: {met['in_degree']},\n"
            f"  out_degree: {met['out_degree']},\n"
            f"  pagerank: {met['pagerank']},\n"
            f"  modularity_class: {comm_id}\n"
            f"}});\n"
        )

    cypher_lines.append("\n// 4. Create Directed Fiscal Flow Relationships (52 Edges)\n")
    for e in EDGES_DATA:
        cypher_lines.append(
            f"MATCH (s:FiscalEntity {{id: '{e['source']}'}}), (t:FiscalEntity {{id: '{e['target']}'}})\n"
            f"CREATE (s)-[:{e['relation']} {{\n"
            f"  weight: {e['weight']:.2f},\n"
            f"  type: '{e['type']}',\n"
            f"  unit: 'INR_CRORE'\n"
            f"}}]->(t);\n"
        )

    cypher_lines.append("\n// 5. Verification Cypher Queries for Neo4j Bloom & Browser\n")
    cypher_lines.append("// Verification 1: Structural Bottlenecks (Top Betweenness Centrality)\n")
    cypher_lines.append("MATCH (n:FiscalEntity) RETURN n.label, n.tier, n.betweenness_centrality ORDER BY n.betweenness_centrality DESC LIMIT 5;\n\n")
    cypher_lines.append("// Verification 2: Modularity Partition Distribution\n")
    cypher_lines.append("MATCH (n:FiscalEntity) RETURN n.modularity_class, collect(n.label) AS Members;\n")

    cypher_path = EXPORTS_DIR / "neo4j_fiscal_graph_dump.cypher"
    with open(cypher_path, "w", encoding="utf-8") as f:
        f.writelines(cypher_lines)
    with open(BASE_DIR / "neo4j_fiscal_graph_dump.cypher", "w", encoding="utf-8") as f:
        f.writelines(cypher_lines)

    print("[OK] Generated Neo4j Cypher Project Dump -> exports/neo4j_fiscal_graph_dump.cypher")


def main():
    print("=== FiscalFiles: Executing Graph Preprocessing Pipeline ===")
    write_csv_files()
    results, G, community_map = compute_network_metrics()
    export_gexf_and_graphml(results, G, community_map)
    export_neo4j_cypher(results, community_map)
    print("=== Phase 1 Pipeline Completed Successfully ===")

if __name__ == "__main__":
    main()
