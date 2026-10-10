// =========================================================================
// FiscalFiles: Neo4j Graph Model & Cypher Execution Script
// India Sovereign Fiscal Network Architecture (~INR 48.2 Lakh Cr)
// Generated for strict compliance with project_brief_guidelines.md
// =========================================================================

// 1. Schema Constraints & Indexes
CREATE CONSTRAINT fiscal_node_id_unique IF NOT EXISTS FOR (n:FiscalEntity) REQUIRE n.id IS UNIQUE;
CREATE INDEX fiscal_category_idx IF NOT EXISTS FOR (n:FiscalEntity) ON (n.category);
CREATE INDEX fiscal_tier_idx IF NOT EXISTS FOR (n:FiscalEntity) ON (n.tier);

// 2. Clear Existing Fiscal Graph
MATCH (n:FiscalEntity) DETACH DELETE n;

// 3. Ingest Nodes with Domain Attributes & Centrality Metrics (38 Nodes)
CREATE (:FiscalEntity:Direct_Tax {
  id: 'corp_tax',
  label: 'Corporation Tax',
  category: 'Direct Tax',
  tier: 1,
  budget_crore: 1020000.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 0,
  out_degree: 1,
  pagerank: 0.0113,
  modularity_class: 1
});
CREATE (:FiscalEntity:Direct_Tax {
  id: 'income_tax',
  label: 'Personal Income Tax',
  category: 'Direct Tax',
  tier: 1,
  budget_crore: 1156000.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 0,
  out_degree: 1,
  pagerank: 0.0113,
  modularity_class: 1
});
CREATE (:FiscalEntity:Indirect_Tax {
  id: 'gst',
  label: 'Goods & Services Tax (GST)',
  category: 'Indirect Tax',
  tier: 1,
  budget_crore: 1067650.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 0,
  out_degree: 1,
  pagerank: 0.0113,
  modularity_class: 0
});
CREATE (:FiscalEntity:Indirect_Tax {
  id: 'customs',
  label: 'Customs Duty',
  category: 'Indirect Tax',
  tier: 1,
  budget_crore: 231700.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 0,
  out_degree: 1,
  pagerank: 0.0113,
  modularity_class: 0
});
CREATE (:FiscalEntity:Indirect_Tax {
  id: 'excise',
  label: 'Union Excise Duties',
  category: 'Indirect Tax',
  tier: 1,
  budget_crore: 318780.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 0,
  out_degree: 1,
  pagerank: 0.0113,
  modularity_class: 0
});
CREATE (:FiscalEntity:Capital_Inflow {
  id: 'borrowings',
  label: 'Fiscal Deficit Borrowings',
  category: 'Capital Inflow',
  tier: 1,
  budget_crore: 1613312.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.1081,
  in_degree: 0,
  out_degree: 4,
  pagerank: 0.0113,
  modularity_class: 2
});
CREATE (:FiscalEntity:Non-Tax_Revenue {
  id: 'non_tax',
  label: 'Non-Tax Receipts (RBI/Dividends)',
  category: 'Non-Tax Revenue',
  tier: 1,
  budget_crore: 562692.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.1081,
  in_degree: 0,
  out_degree: 4,
  pagerank: 0.0113,
  modularity_class: 2
});
CREATE (:FiscalEntity:Tax_Pool {
  id: 'direct_tax',
  label: 'Direct Taxes Pool',
  category: 'Tax Pool',
  tier: 2,
  budget_crore: 2176000.00,
  betweenness_centrality: 0.0435,
  degree_centrality: 0.0811,
  in_degree: 2,
  out_degree: 1,
  pagerank: 0.0304,
  modularity_class: 1
});
CREATE (:FiscalEntity:Tax_Pool {
  id: 'indirect_tax',
  label: 'Indirect Taxes Pool',
  category: 'Tax Pool',
  tier: 2,
  budget_crore: 1618130.00,
  betweenness_centrality: 0.0653,
  degree_centrality: 0.1081,
  in_degree: 3,
  out_degree: 1,
  pagerank: 0.04,
  modularity_class: 0
});
CREATE (:FiscalEntity:Macro_Hub {
  id: 'gross_tax',
  label: 'Gross Tax Revenue',
  category: 'Macro Hub',
  tier: 2,
  budget_crore: 3794130.00,
  betweenness_centrality: 0.1471,
  degree_centrality: 0.1081,
  in_degree: 2,
  out_degree: 2,
  pagerank: 0.0711,
  modularity_class: 1
});
CREATE (:FiscalEntity:Constitutional_Devolution {
  id: 'devolution',
  label: 'States Devolution (41% FC Pool)',
  category: 'Constitutional Devolution',
  tier: 3,
  budget_crore: 1219783.00,
  betweenness_centrality: 0.0601,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0307,
  modularity_class: 1
});
CREATE (:FiscalEntity:Central_Revenue {
  id: 'net_tax',
  label: 'Net Tax to Centre',
  category: 'Central Revenue',
  tier: 3,
  budget_crore: 2574347.00,
  betweenness_centrality: 0.0961,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0523,
  modularity_class: 1
});
CREATE (:FiscalEntity:Sovereign_Treasury {
  id: 'central_pool',
  label: 'Consolidated Fund of India (CFI)',
  category: 'Sovereign Treasury',
  tier: 4,
  budget_crore: 4750351.00,
  betweenness_centrality: 0.1224,
  degree_centrality: 0.2973,
  in_degree: 3,
  out_degree: 8,
  pagerank: 0.062,
  modularity_class: 2
});
CREATE (:FiscalEntity:Sovereign_Obligation {
  id: 'interest',
  label: 'Debt Servicing (Interest Payments)',
  category: 'Sovereign Obligation',
  tier: 5,
  budget_crore: 1162940.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.0541,
  in_degree: 2,
  out_degree: 0,
  pagerank: 0.0262,
  modularity_class: 2
});
CREATE (:FiscalEntity:Strategic_Defense {
  id: 'defense',
  label: 'Defense & National Security',
  category: 'Strategic Defense',
  tier: 5,
  budget_crore: 454773.00,
  betweenness_centrality: 0.0691,
  degree_centrality: 0.1081,
  in_degree: 2,
  out_degree: 2,
  pagerank: 0.0169,
  modularity_class: 3
});
CREATE (:FiscalEntity:Capital_Infrastructure {
  id: 'infra',
  label: 'Transport & Infrastructure',
  category: 'Capital Infrastructure',
  tier: 5,
  budget_crore: 544000.00,
  betweenness_centrality: 0.0413,
  degree_centrality: 0.1892,
  in_degree: 4,
  out_degree: 3,
  pagerank: 0.0215,
  modularity_class: 2
});
CREATE (:FiscalEntity:Rural_And_Agrarian {
  id: 'rural_agri',
  label: 'Agri & Rural Development',
  category: 'Rural & Agrarian',
  tier: 5,
  budget_crore: 265808.00,
  betweenness_centrality: 0.0683,
  degree_centrality: 0.1351,
  in_degree: 3,
  out_degree: 2,
  pagerank: 0.0341,
  modularity_class: 4
});
CREATE (:FiscalEntity:Social_Safety_Net {
  id: 'subsidies',
  label: 'Major Subsidies (Food & Fert)',
  category: 'Social Safety Net',
  tier: 5,
  budget_crore: 381175.00,
  betweenness_centrality: 0.018,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0155,
  modularity_class: 4
});
CREATE (:FiscalEntity:Human_Capital {
  id: 'social',
  label: 'Education & Health Human Capital',
  category: 'Human Capital',
  tier: 5,
  budget_crore: 212450.00,
  betweenness_centrality: 0.0098,
  degree_centrality: 0.1081,
  in_degree: 3,
  out_degree: 1,
  pagerank: 0.0285,
  modularity_class: 1
});
CREATE (:FiscalEntity:Intergovernmental {
  id: 'transfers_grants',
  label: 'Finance Commission Grants',
  category: 'Intergovernmental',
  tier: 5,
  budget_crore: 232000.00,
  betweenness_centrality: 0.0075,
  degree_centrality: 0.0811,
  in_degree: 2,
  out_degree: 1,
  pagerank: 0.0175,
  modularity_class: 4
});
CREATE (:FiscalEntity:Public_Administration {
  id: 'other_exp',
  label: 'General Admin & Organs of State',
  category: 'Public Administration',
  tier: 5,
  budget_crore: 1497205.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.0541,
  in_degree: 2,
  out_degree: 0,
  pagerank: 0.0297,
  modularity_class: 2
});
CREATE (:FiscalEntity:Strategic_Defense {
  id: 'mod',
  label: 'Ministry of Defence',
  category: 'Strategic Defense',
  tier: 6,
  budget_crore: 454773.00,
  betweenness_centrality: 0.0195,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0249,
  modularity_class: 3
});
CREATE (:FiscalEntity:Strategic_Defense {
  id: 'def_capex',
  label: 'Defense Modernization Capex',
  category: 'Strategic Defense',
  tier: 6,
  budget_crore: 172000.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0193,
  modularity_class: 3
});
CREATE (:FiscalEntity:Strategic_Defense {
  id: 'def_salaries',
  label: 'Defense Revenue & Pensions',
  category: 'Strategic Defense',
  tier: 6,
  budget_crore: 282773.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0244,
  modularity_class: 3
});
CREATE (:FiscalEntity:Capital_Infrastructure {
  id: 'morth',
  label: 'Ministry of Road Transport & Highways',
  category: 'Capital Infrastructure',
  tier: 6,
  budget_crore: 278000.00,
  betweenness_centrality: 0.0105,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0196,
  modularity_class: 2
});
CREATE (:FiscalEntity:Capital_Infrastructure {
  id: 'nhai',
  label: 'NHAI Expressways & Highways',
  category: 'Capital Infrastructure',
  tier: 6,
  budget_crore: 168464.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0244,
  modularity_class: 2
});
CREATE (:FiscalEntity:Capital_Infrastructure {
  id: 'railways',
  label: 'Indian Railways Capital Outlay',
  category: 'Capital Infrastructure',
  tier: 6,
  budget_crore: 252200.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.0541,
  in_degree: 2,
  out_degree: 0,
  pagerank: 0.0223,
  modularity_class: 2
});
CREATE (:FiscalEntity:Capital_Infrastructure {
  id: 'mohua',
  label: 'Ministry of Housing & Urban Affairs',
  category: 'Capital Infrastructure',
  tier: 6,
  budget_crore: 82577.00,
  betweenness_centrality: 0.003,
  degree_centrality: 0.0541,
  in_degree: 1,
  out_degree: 1,
  pagerank: 0.0137,
  modularity_class: 2
});
CREATE (:FiscalEntity:Social_Safety_Net {
  id: 'pmay',
  label: 'Pradhan Mantri Awas Yojana (PMAY)',
  category: 'Social Safety Net',
  tier: 6,
  budget_crore: 54500.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.0541,
  in_degree: 2,
  out_degree: 0,
  pagerank: 0.031,
  modularity_class: 4
});
CREATE (:FiscalEntity:Rural_And_Agrarian {
  id: 'mord',
  label: 'Ministry of Rural Development',
  category: 'Rural & Agrarian',
  tier: 6,
  budget_crore: 177566.00,
  betweenness_centrality: 0.024,
  degree_centrality: 0.1081,
  in_degree: 2,
  out_degree: 2,
  pagerank: 0.0428,
  modularity_class: 4
});
CREATE (:FiscalEntity:Rural_And_Agrarian {
  id: 'mgnrega',
  label: 'MGNREGA Rural Employment Guarantee',
  category: 'Rural & Agrarian',
  tier: 6,
  budget_crore: 86000.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0396,
  modularity_class: 4
});
CREATE (:FiscalEntity:Rural_And_Agrarian {
  id: 'moa',
  label: 'Ministry of Agriculture & Farmers Welfare',
  category: 'Rural & Agrarian',
  tier: 6,
  budget_crore: 132000.00,
  betweenness_centrality: 0.0345,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0236,
  modularity_class: 4
});
CREATE (:FiscalEntity:Rural_And_Agrarian {
  id: 'pm_kisan',
  label: 'PM-KISAN Direct Income Support',
  category: 'Rural & Agrarian',
  tier: 6,
  budget_crore: 60000.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.018,
  modularity_class: 4
});
CREATE (:FiscalEntity:Social_Safety_Net {
  id: 'food_pds',
  label: 'Dept of Food & Public Distribution',
  category: 'Social Safety Net',
  tier: 6,
  budget_crore: 213000.00,
  betweenness_centrality: 0.0143,
  degree_centrality: 0.0811,
  in_degree: 1,
  out_degree: 2,
  pagerank: 0.0186,
  modularity_class: 4
});
CREATE (:FiscalEntity:Social_Safety_Net {
  id: 'nfsa_food',
  label: 'NFSA Food Subsidy (PDS)',
  category: 'Social Safety Net',
  tier: 6,
  budget_crore: 205250.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0197,
  modularity_class: 4
});
CREATE (:FiscalEntity:Social_Safety_Net {
  id: 'fert_dept',
  label: 'Department of Fertilizers',
  category: 'Social Safety Net',
  tier: 6,
  budget_crore: 168000.00,
  betweenness_centrality: 0.0128,
  degree_centrality: 0.0811,
  in_degree: 2,
  out_degree: 1,
  pagerank: 0.0305,
  modularity_class: 4
});
CREATE (:FiscalEntity:Social_Safety_Net {
  id: 'fert_sub',
  label: 'Fertilizer Subsidy (Urea & NBS)',
  category: 'Social Safety Net',
  tier: 6,
  budget_crore: 164000.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0372,
  modularity_class: 4
});
CREATE (:FiscalEntity:Human_Capital {
  id: 'mohfw_health',
  label: 'Ministry of Health & Family Welfare',
  category: 'Human Capital',
  tier: 6,
  budget_crore: 90659.00,
  betweenness_centrality: 0.0,
  degree_centrality: 0.027,
  in_degree: 1,
  out_degree: 0,
  pagerank: 0.0355,
  modularity_class: 1
});

// 4. Create Directed Fiscal Flow Relationships (52 Edges)
MATCH (s:FiscalEntity {id: 'corp_tax'}), (t:FiscalEntity {id: 'direct_tax'})
CREATE (s)-[:AGGREGATES_INTO {
  weight: 1020000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'income_tax'}), (t:FiscalEntity {id: 'direct_tax'})
CREATE (s)-[:AGGREGATES_INTO {
  weight: 1156000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'gst'}), (t:FiscalEntity {id: 'indirect_tax'})
CREATE (s)-[:AGGREGATES_INTO {
  weight: 1067650.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'customs'}), (t:FiscalEntity {id: 'indirect_tax'})
CREATE (s)-[:AGGREGATES_INTO {
  weight: 231700.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'excise'}), (t:FiscalEntity {id: 'indirect_tax'})
CREATE (s)-[:AGGREGATES_INTO {
  weight: 318780.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'direct_tax'}), (t:FiscalEntity {id: 'gross_tax'})
CREATE (s)-[:FORMS_GROSS_REVENUE {
  weight: 2176000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'indirect_tax'}), (t:FiscalEntity {id: 'gross_tax'})
CREATE (s)-[:FORMS_GROSS_REVENUE {
  weight: 1618130.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'gross_tax'}), (t:FiscalEntity {id: 'devolution'})
CREATE (s)-[:DEVOLVES_CONSTITUTIONALLY {
  weight: 1219783.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'gross_tax'}), (t:FiscalEntity {id: 'net_tax'})
CREATE (s)-[:NET_TRANSFER_TO_CENTRE {
  weight: 2574347.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'net_tax'}), (t:FiscalEntity {id: 'central_pool'})
CREATE (s)-[:CONSOLIDATES_INTO_CFI {
  weight: 2574347.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'borrowings'}), (t:FiscalEntity {id: 'central_pool'})
CREATE (s)-[:DEFICIT_FINANCES_CFI {
  weight: 1613312.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'non_tax'}), (t:FiscalEntity {id: 'central_pool'})
CREATE (s)-[:NON_TAX_SURPLUS_INTO_CFI {
  weight: 562692.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'interest'})
CREATE (s)-[:SERVICES_PUBLIC_DEBT {
  weight: 1162940.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'defense'})
CREATE (s)-[:FUNDS_NATIONAL_SECURITY {
  weight: 454773.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'infra'})
CREATE (s)-[:CAPEX_ALLOCATION {
  weight: 544000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'rural_agri'})
CREATE (s)-[:AGRI_WELFARE_ALLOCATION {
  weight: 265808.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'subsidies'})
CREATE (s)-[:SUBSIDY_SUPPORT {
  weight: 381175.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'social'})
CREATE (s)-[:HUMAN_CAPITAL_ALLOCATION {
  weight: 212450.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'transfers_grants'})
CREATE (s)-[:FC_STATUTORY_GRANTS {
  weight: 232000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'central_pool'}), (t:FiscalEntity {id: 'other_exp'})
CREATE (s)-[:CIVIL_GOVERNANCE_EXP {
  weight: 1497205.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'defense'}), (t:FiscalEntity {id: 'mod'})
CREATE (s)-[:MINISTRY_ENVELOPE {
  weight: 454773.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'mod'}), (t:FiscalEntity {id: 'def_capex'})
CREATE (s)-[:CAPITAL_MODERNIZATION {
  weight: 172000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'mod'}), (t:FiscalEntity {id: 'def_salaries'})
CREATE (s)-[:REVENUE_SALARIES_PENSIONS {
  weight: 282773.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'infra'}), (t:FiscalEntity {id: 'morth'})
CREATE (s)-[:HIGHWAY_PORTFOLIO {
  weight: 278000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'infra'}), (t:FiscalEntity {id: 'railways'})
CREATE (s)-[:RAILWAY_CAPEX_FUND {
  weight: 252200.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'infra'}), (t:FiscalEntity {id: 'mohua'})
CREATE (s)-[:URBAN_INFRA_FUND {
  weight: 82577.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'morth'}), (t:FiscalEntity {id: 'nhai'})
CREATE (s)-[:FLAGSHIP_EXPRESSWAYS {
  weight: 168464.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'mohua'}), (t:FiscalEntity {id: 'pmay'})
CREATE (s)-[:URBAN_HOUSING_PROGRAM {
  weight: 30171.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'rural_agri'}), (t:FiscalEntity {id: 'mord'})
CREATE (s)-[:RURAL_DEVELOPMENT_ENVELOPE {
  weight: 177566.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'rural_agri'}), (t:FiscalEntity {id: 'moa'})
CREATE (s)-[:AGRICULTURE_ENVELOPE {
  weight: 132000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'mord'}), (t:FiscalEntity {id: 'mgnrega'})
CREATE (s)-[:GUARANTEED_WAGE_SAFETY {
  weight: 86000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'moa'}), (t:FiscalEntity {id: 'pm_kisan'})
CREATE (s)-[:DIRECT_INCOME_TRANSFER {
  weight: 60000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'subsidies'}), (t:FiscalEntity {id: 'food_pds'})
CREATE (s)-[:FOOD_SUBSIDY_ENVELOPE {
  weight: 213000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'subsidies'}), (t:FiscalEntity {id: 'fert_dept'})
CREATE (s)-[:FERTILIZER_SUBSIDY_ENVELOPE {
  weight: 168000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'food_pds'}), (t:FiscalEntity {id: 'nfsa_food'})
CREATE (s)-[:FOOD_SECURITY_PDS {
  weight: 205250.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'fert_dept'}), (t:FiscalEntity {id: 'fert_sub'})
CREATE (s)-[:AGRI_INPUT_SUBSIDY {
  weight: 164000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'social'}), (t:FiscalEntity {id: 'mohfw_health'})
CREATE (s)-[:HEALTHCARE_ENVELOPE {
  weight: 90659.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'mord'}), (t:FiscalEntity {id: 'pmay'})
CREATE (s)-[:RURAL_HOUSING_PMAY_G {
  weight: 24329.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'borrowings'}), (t:FiscalEntity {id: 'infra'})
CREATE (s)-[:DIRECT_DEBT_TO_CAPEX {
  weight: 544000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'borrowings'}), (t:FiscalEntity {id: 'interest'})
CREATE (s)-[:DEBT_ROLLOVER_FINANCING {
  weight: 618940.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'borrowings'}), (t:FiscalEntity {id: 'defense'})
CREATE (s)-[:SECURITY_CAPITAL_BORROWING {
  weight: 172000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'devolution'}), (t:FiscalEntity {id: 'rural_agri'})
CREATE (s)-[:STATE_DEVOLUTION_RURAL_SPEND {
  weight: 350000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'devolution'}), (t:FiscalEntity {id: 'social'})
CREATE (s)-[:STATE_DEVOLUTION_HEALTH_EDU {
  weight: 380000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'transfers_grants'}), (t:FiscalEntity {id: 'mord'})
CREATE (s)-[:PANCHAYAT_TIER_GRANTS {
  weight: 120000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'non_tax'}), (t:FiscalEntity {id: 'social'})
CREATE (s)-[:DIVIDEND_TO_HUMAN_CAPITAL {
  weight: 150000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'non_tax'}), (t:FiscalEntity {id: 'infra'})
CREATE (s)-[:SPECTRUM_AUCTION_TO_INFRA {
  weight: 200000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'non_tax'}), (t:FiscalEntity {id: 'other_exp'})
CREATE (s)-[:ADMIN_COST_ABSORPTION {
  weight: 212692.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'morth'}), (t:FiscalEntity {id: 'railways'})
CREATE (s)-[:PM_GATI_SHAKTI_MULTIMODAL {
  weight: 45000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'food_pds'}), (t:FiscalEntity {id: 'rural_agri'})
CREATE (s)-[:MSP_GRAIN_PROCUREMENT {
  weight: 180000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'moa'}), (t:FiscalEntity {id: 'fert_dept'})
CREATE (s)-[:AGRI_FERT_INPUT_SUBSIDY {
  weight: 120000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'defense'}), (t:FiscalEntity {id: 'infra'})
CREATE (s)-[:STRATEGIC_BORDER_ROADS {
  weight: 25000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);
MATCH (s:FiscalEntity {id: 'net_tax'}), (t:FiscalEntity {id: 'transfers_grants'})
CREATE (s)-[:POST_DEVOLUTION_DEFICIT_GRANTS {
  weight: 232000.00,
  type: 'Directed',
  unit: 'INR_CRORE'
}]->(t);

// 5. Verification Cypher Queries for Neo4j Bloom & Browser
// Verification 1: Structural Bottlenecks (Top Betweenness Centrality)
MATCH (n:FiscalEntity) RETURN n.label, n.tier, n.betweenness_centrality ORDER BY n.betweenness_centrality DESC LIMIT 5;

// Verification 2: Modularity Partition Distribution
MATCH (n:FiscalEntity) RETURN n.modularity_class, collect(n.label) AS Members;
