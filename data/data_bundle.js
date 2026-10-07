window.FISCAL_DATA = {
  "sankey": {
    "metadata": {
      "title": "India Union Budget Fiscal Flow (Inflow to Sectoral Outlay)",
      "source": "Ministry of Finance (Union Budget 2024-25 Receipts & Expenditure Budget)",
      "author": "Shreyashi (Data Lead & Pipeline Architect - Member 1)",
      "verification_status": "Reconciled & Mathematically Balanced"
    },
    "fiscal_year": "2024-25",
    "data_stage": "BE",
    "unit": "INR_CRORE",
    "summary": {
      "gross_tax_revenue": 3794130.0,
      "states_share_devolution": 1219783.0,
      "net_tax_to_centre": 2574347.0,
      "non_tax_revenue": 562692.0,
      "borrowings_fiscal_deficit": 1613312.0,
      "total_central_receipts": 4750351.0,
      "total_central_expenditure": 4750351.0
    },
    "nodes": [
      {
        "id": "gross_tax",
        "name": "Gross Tax Revenue",
        "category": "tax_source"
      },
      {
        "id": "direct_tax",
        "name": "Direct Taxes",
        "category": "tax_source"
      },
      {
        "id": "indirect_tax",
        "name": "Indirect Taxes",
        "category": "tax_source"
      },
      {
        "id": "corp_tax",
        "name": "Corporation Tax",
        "category": "inflow"
      },
      {
        "id": "income_tax",
        "name": "Income Tax",
        "category": "inflow"
      },
      {
        "id": "gst",
        "name": "Goods & Services Tax (GST)",
        "category": "inflow"
      },
      {
        "id": "customs",
        "name": "Customs Duty",
        "category": "inflow"
      },
      {
        "id": "excise",
        "name": "Union Excise Duties",
        "category": "inflow"
      },
      {
        "id": "devolution",
        "name": "States' Share of Taxes",
        "category": "transfer"
      },
      {
        "id": "net_tax",
        "name": "Net Tax to Centre",
        "category": "pool"
      },
      {
        "id": "borrowings",
        "name": "Borrowings & Liabilities",
        "category": "inflow"
      },
      {
        "id": "non_tax",
        "name": "Non-Tax Receipts",
        "category": "inflow"
      },
      {
        "id": "central_pool",
        "name": "Consolidated Fund of India",
        "category": "pool"
      },
      {
        "id": "defense",
        "name": "Defense & Security",
        "category": "expenditure"
      },
      {
        "id": "infra",
        "name": "Transport & Infrastructure",
        "category": "expenditure"
      },
      {
        "id": "social",
        "name": "Education & Healthcare",
        "category": "expenditure"
      },
      {
        "id": "rural_agri",
        "name": "Agri & Rural Development",
        "category": "expenditure"
      },
      {
        "id": "subsidies",
        "name": "Subsidies (Food, Fert, Fuel)",
        "category": "expenditure"
      },
      {
        "id": "interest",
        "name": "Interest Payments",
        "category": "expenditure"
      },
      {
        "id": "transfers_grants",
        "name": "Finance Commission Transfers",
        "category": "expenditure"
      },
      {
        "id": "other_exp",
        "name": "General Admin & Others",
        "category": "expenditure"
      }
    ],
    "links": [
      {
        "source": "corp_tax",
        "target": "direct_tax",
        "value": 1020000.0
      },
      {
        "source": "income_tax",
        "target": "direct_tax",
        "value": 1156000.0
      },
      {
        "source": "gst",
        "target": "indirect_tax",
        "value": 1067650.0
      },
      {
        "source": "customs",
        "target": "indirect_tax",
        "value": 231700.0
      },
      {
        "source": "excise",
        "target": "indirect_tax",
        "value": 318780.0
      },
      {
        "source": "direct_tax",
        "target": "gross_tax",
        "value": 2176000.0
      },
      {
        "source": "indirect_tax",
        "target": "gross_tax",
        "value": 1618130.0
      },
      {
        "source": "gross_tax",
        "target": "devolution",
        "value": 1219783.0
      },
      {
        "source": "gross_tax",
        "target": "net_tax",
        "value": 2574347.0
      },
      {
        "source": "net_tax",
        "target": "central_pool",
        "value": 2574347.0
      },
      {
        "source": "borrowings",
        "target": "central_pool",
        "value": 1613312.0
      },
      {
        "source": "non_tax",
        "target": "central_pool",
        "value": 562692.0
      },
      {
        "source": "central_pool",
        "target": "interest",
        "value": 1162940.0
      },
      {
        "source": "central_pool",
        "target": "defense",
        "value": 454773.0
      },
      {
        "source": "central_pool",
        "target": "infra",
        "value": 544000.0
      },
      {
        "source": "central_pool",
        "target": "rural_agri",
        "value": 265808.0
      },
      {
        "source": "central_pool",
        "target": "subsidies",
        "value": 381175.0
      },
      {
        "source": "central_pool",
        "target": "social",
        "value": 212450.0
      },
      {
        "source": "central_pool",
        "target": "transfers_grants",
        "value": 232000.0
      },
      {
        "source": "central_pool",
        "target": "other_exp",
        "value": 1497205.0
      }
    ]
  },
  "treemap": {
    "name": "Total Central Expenditure",
    "fiscal_year": "2024-25",
    "data_stage": "BE",
    "unit": "INR_CRORE",
    "children": [
      {
        "name": "Social Infrastructure & Human Capital",
        "sector_code": "SEC_SOCIAL",
        "children": [
          {
            "name": "Ministry of Education",
            "children": [
              {
                "name": "Samagra Shiksha Abhiyan",
                "value": 37500.0,
                "code": "SCH_SSA"
              },
              {
                "name": "PM POSHAN (Midday Meals)",
                "value": 12467.0,
                "code": "SCH_POSHAN"
              },
              {
                "name": "Higher Education Grants & IITs/NITs",
                "value": 47619.0,
                "code": "SCH_HIED"
              },
              {
                "name": "PM SHRI Schools",
                "value": 6050.0,
                "code": "SCH_PMSHRI"
              }
            ]
          },
          {
            "name": "Ministry of Health and Family Welfare",
            "children": [
              {
                "name": "National Health Mission (NHM)",
                "value": 36000.0,
                "code": "SCH_NHM"
              },
              {
                "name": "Ayushman Bharat - PMJAY",
                "value": 7300.0,
                "code": "SCH_PMJAY"
              },
              {
                "name": "AIIMS & Apex Medical Institutions",
                "value": 18000.0,
                "code": "SCH_AIIMS"
              },
              {
                "name": "PM Ayushman Bharat Health Infra (PM-ABHIM)",
                "value": 4108.0,
                "code": "SCH_ABHIM"
              }
            ]
          },
          {
            "name": "Ministry of Women and Child Development",
            "children": [
              {
                "name": "Saksham Anganwadi and POSHAN 2.0",
                "value": 21200.0,
                "code": "SCH_POSHAN2"
              },
              {
                "name": "Mission SAMARTH (Empowerment)",
                "value": 3146.0,
                "code": "SCH_SAMARTH"
              },
              {
                "name": "Mission VATSALYA (Child Protection)",
                "value": 1472.0,
                "code": "SCH_VATSALYA"
              }
            ]
          },
          {
            "name": "Ministry of Skill Development & Labour",
            "children": [
              {
                "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
                "value": 4500.0,
                "code": "SCH_PMKVY"
              },
              {
                "name": "Employment Linked Incentive & Labour Welfare",
                "value": 10088.0,
                "code": "SCH_ELI"
              }
            ]
          }
        ]
      },
      {
        "name": "Transportation & Physical Infrastructure",
        "sector_code": "SEC_INFRA",
        "children": [
          {
            "name": "Ministry of Road Transport & Highways",
            "children": [
              {
                "name": "National Highways Authority of India (NHAI)",
                "value": 168464.0,
                "code": "SCH_NHAI"
              },
              {
                "name": "Road Works & PMGSY Component",
                "value": 103986.0,
                "code": "SCH_ROADS"
              }
            ]
          },
          {
            "name": "Ministry of Railways",
            "children": [
              {
                "name": "Capital Outlay on Railways (Track & Rolling Stock)",
                "value": 252000.0,
                "code": "SCH_RLY_CAP"
              },
              {
                "name": "Railway Safety & Kavach Implementation",
                "value": 3000.0,
                "code": "SCH_RLY_SFT"
              }
            ]
          },
          {
            "name": "Ministry of Housing and Urban Affairs",
            "children": [
              {
                "name": "Pradhan Mantri Awas Yojana (Urban)",
                "value": 30171.0,
                "code": "SCH_PMAY_U"
              },
              {
                "name": "Metro Rail Projects",
                "value": 24931.0,
                "code": "SCH_METRO"
              },
              {
                "name": "AMRUT & Smart Cities Mission",
                "value": 10400.0,
                "code": "SCH_AMRUT"
              }
            ]
          },
          {
            "name": "Ministry of Ports, Shipping & Civil Aviation",
            "children": [
              {
                "name": "Sagarmala & Port Connectivity",
                "value": 2300.0,
                "code": "SCH_SAGARMALA"
              },
              {
                "name": "UDAN Scheme & Regional Airport Dev",
                "value": 502.0,
                "code": "SCH_UDAN"
              }
            ]
          }
        ]
      },
      {
        "name": "Agriculture, Rural & Water Resources",
        "sector_code": "SEC_AGRI",
        "children": [
          {
            "name": "Department of Rural Development",
            "children": [
              {
                "name": "MGNREGA (Rural Employment)",
                "value": 86000.0,
                "code": "SCH_MGNREGA"
              },
              {
                "name": "PM Awas Yojana (Gramin)",
                "value": 54500.0,
                "code": "SCH_PMAY_G"
              },
              {
                "name": "PM Gram Sadak Yojana (PMGSY)",
                "value": 19000.0,
                "code": "SCH_PMGSY"
              },
              {
                "name": "National Rural Livelihood Mission (NRLM)",
                "value": 15047.0,
                "code": "SCH_NRLM"
              }
            ]
          },
          {
            "name": "Ministry of Agriculture and Farmers Welfare",
            "children": [
              {
                "name": "PM-KISAN (Income Support)",
                "value": 60000.0,
                "code": "SCH_PMKISAN"
              },
              {
                "name": "PM Fasal Bima Yojana (Crop Insurance)",
                "value": 14600.0,
                "code": "SCH_PMFBY"
              },
              {
                "name": "Modified Interest Subvention Scheme (MISS)",
                "value": 22600.0,
                "code": "SCH_MISS"
              },
              {
                "name": "Krishonnati Yojana & Digital Agri Mission",
                "value": 7400.0,
                "code": "SCH_AGRI_DIGI"
              }
            ]
          },
          {
            "name": "Ministry of Jal Shakti",
            "children": [
              {
                "name": "Jal Jeevan Mission (Har Ghar Jal)",
                "value": 70163.0,
                "code": "SCH_JJM"
              },
              {
                "name": "Swachh Bharat Mission (Grameen)",
                "value": 7192.0,
                "code": "SCH_SBM_G"
              },
              {
                "name": "Pradhan Mantri Krishi Sinchayee Yojana",
                "value": 11391.0,
                "code": "SCH_PMKSY"
              }
            ]
          }
        ]
      },
      {
        "name": "National Defense & Security",
        "sector_code": "SEC_DEFENSE",
        "children": [
          {
            "name": "Ministry of Defence",
            "children": [
              {
                "name": "Defence Capital Outlay (Modernization & Weapons)",
                "value": 172000.0,
                "code": "SCH_DEF_CAP"
              },
              {
                "name": "Defence Revenue Services (Army, Navy, Air Force)",
                "value": 282773.0,
                "code": "SCH_DEF_REV"
              },
              {
                "name": "Defence Pensions",
                "value": 141205.0,
                "code": "SCH_DEF_PEN"
              },
              {
                "name": "DRDO & R&D Development",
                "value": 23855.0,
                "code": "SCH_DRDO"
              }
            ]
          },
          {
            "name": "Ministry of Home Affairs",
            "children": [
              {
                "name": "Central Armed Police Forces (CAPF / Paramilitary)",
                "value": 105820.0,
                "code": "SCH_CAPF"
              },
              {
                "name": "Border Infrastructure & Management",
                "value": 3756.0,
                "code": "SCH_BORDER"
              }
            ]
          }
        ]
      },
      {
        "name": "Subsidies & Welfare Transfers",
        "sector_code": "SEC_SUBSIDY",
        "children": [
          {
            "name": "Food Subsidy",
            "children": [
              {
                "name": "Pradhan Mantri Garib Kalyan Anna Yojana (FCI)",
                "value": 205250.0,
                "code": "SCH_SUB_FOOD"
              }
            ]
          },
          {
            "name": "Fertilizer Subsidy",
            "children": [
              {
                "name": "Indigenous & Imported Urea Subsidy",
                "value": 119000.0,
                "code": "SCH_SUB_UREA"
              },
              {
                "name": "Nutrient Based Subsidy (NBS)",
                "value": 45000.0,
                "code": "SCH_SUB_NBS"
              }
            ]
          },
          {
            "name": "Petroleum & LPG Subsidy",
            "children": [
              {
                "name": "PM Ujjwala Yojana & LPG Connections",
                "value": 11925.0,
                "code": "SCH_SUB_LPG"
              }
            ]
          }
        ]
      },
      {
        "name": "Energy, Industry & Technology",
        "sector_code": "SEC_ENERGY_IND",
        "children": [
          {
            "name": "Ministry of New and Renewable Energy (MNRE)",
            "children": [
              {
                "name": "PM Surya Ghar Muft Bijli Yojana",
                "value": 10000.0,
                "code": "SCH_SURYA_GHAR"
              },
              {
                "name": "National Green Hydrogen Mission",
                "value": 600.0,
                "code": "SCH_GREEN_H2"
              },
              {
                "name": "Grid Solar & Wind Infrastructure",
                "value": 8500.0,
                "code": "SCH_RENEWABLE"
              }
            ]
          },
          {
            "name": "Ministry of Electronics & Information Technology",
            "children": [
              {
                "name": "India Semiconductor Mission & Design Linked PLI",
                "value": 6903.0,
                "code": "SCH_SEMICON"
              },
              {
                "name": "Electronics Manufacturing Incentive Scheme",
                "value": 6200.0,
                "code": "SCH_ELEC_PLI"
              }
            ]
          },
          {
            "name": "Ministry of Commerce and Industry",
            "children": [
              {
                "name": "Production Linked Incentive (PLI) Multi-Sector",
                "value": 15000.0,
                "code": "SCH_PLI_CORP"
              },
              {
                "name": "PM Gati Shakti & Logistics Support",
                "value": 1200.0,
                "code": "SCH_GATISHAKTI"
              }
            ]
          }
        ]
      },
      {
        "name": "Debt Servicing & Finance Transfers",
        "sector_code": "SEC_DEBT_FIN",
        "children": [
          {
            "name": "Ministry of Finance - Debt Servicing",
            "children": [
              {
                "name": "Interest Payments on Internal & External Debt",
                "value": 1162940.0,
                "code": "SCH_INTEREST"
              }
            ]
          },
          {
            "name": "Transfers & Grants to States",
            "children": [
              {
                "name": "Finance Commission Revenue Deficit Grants",
                "value": 86600.0,
                "code": "SCH_FC_REVD"
              },
              {
                "name": "Grants to Rural & Urban Local Bodies",
                "value": 72400.0,
                "code": "SCH_LOCAL_BODIES"
              },
              {
                "name": "State Disaster Response Fund (SDRF)",
                "value": 25000.0,
                "code": "SCH_SDRF"
              },
              {
                "name": "Special Assistance for Capital Investment to States",
                "value": 48000.0,
                "code": "SCH_CAP_STATES"
              }
            ]
          }
        ]
      },
      {
        "name": "General Administration & Strategic Sectors",
        "sector_code": "SEC_GEN_ADMIN",
        "children": [
          {
            "name": "Strategic Scientific Departments",
            "children": [
              {
                "name": "Department of Space (ISRO - Gaganyaan & Chandrayaan)",
                "value": 13042.0,
                "code": "SCH_ISRO"
              },
              {
                "name": "Department of Atomic Energy",
                "value": 24968.0,
                "code": "SCH_DAE"
              },
              {
                "name": "Department of Science and Technology",
                "value": 8029.0,
                "code": "SCH_DST"
              }
            ]
          },
          {
            "name": "External Affairs & Overseas Aid",
            "children": [
              {
                "name": "Aid to Neighboring Countries & Foreign Missions",
                "value": 22155.0,
                "code": "SCH_MEA"
              }
            ]
          },
          {
            "name": "Constitutional Organs & Law",
            "children": [
              {
                "name": "Election Commission & Judiciary Infrastructure",
                "value": 6800.0,
                "code": "SCH_LAW_EC"
              }
            ]
          }
        ]
      }
    ]
  },
  "trends": {
    "metadata": {
      "title": "Decadal Trends in Central Tax Collections and Expenditures",
      "source": "Reserve Bank of India (Handbook of Statistics) & Ministry of Finance Budget at a Glance",
      "curator": "Shreyashi (Member 1 - Data Lead)",
      "period": "2015-16 to 2024-25",
      "notes": "2015-16 to 2022-23 are CGA Audited Actuals; 2023-24 is RE; 2024-25 is BE."
    },
    "unit": "INR_CRORE",
    "years": [
      "2015-16",
      "2016-17",
      "2017-18",
      "2018-19",
      "2019-20",
      "2020-21",
      "2021-22",
      "2022-23",
      "2023-24",
      "2024-25"
    ],
    "series": {
      "direct_tax": [
        741945.0,
        849760.0,
        1002037.0,
        1137685.0,
        1050688.0,
        947176.0,
        1412082.0,
        1663686.0,
        1958000.0,
        2176000.0
      ],
      "indirect_tax": [
        710101.0,
        862152.0,
        916445.0,
        939491.0,
        955355.0,
        1077366.0,
        1293638.0,
        1390494.0,
        1500000.0,
        1618130.0
      ],
      "gross_tax_revenue": [
        1452046.0,
        1711912.0,
        1918482.0,
        2077176.0,
        2006043.0,
        2024542.0,
        2705720.0,
        3054180.0,
        3458000.0,
        3794130.0
      ],
      "total_expenditure": [
        1790783.0,
        1975194.0,
        2141973.0,
        2315113.0,
        2686330.0,
        3509836.0,
        3794000.0,
        4193157.0,
        4490486.0,
        4765768.0
      ],
      "capital_expenditure": [
        224198.0,
        284596.0,
        263140.0,
        307714.0,
        335726.0,
        426317.0,
        593400.0,
        739391.0,
        950000.0,
        1111111.0
      ],
      "revenue_expenditure": [
        1566585.0,
        1690598.0,
        1878833.0,
        2007399.0,
        2350604.0,
        3083519.0,
        3200600.0,
        3453766.0,
        3540486.0,
        3654657.0
      ],
      "fiscal_deficit_pct_gdp": [
        3.9,
        3.5,
        3.5,
        3.4,
        4.6,
        9.2,
        6.7,
        6.4,
        5.8,
        5.1
      ],
      "tax_to_gdp_ratio": [
        10.2,
        10.8,
        11.2,
        11.0,
        9.9,
        10.2,
        11.5,
        11.2,
        11.6,
        11.7
      ]
    },
    "growth_metrics": {
      "cagr_direct_tax_10yr_pct": 12.7,
      "cagr_indirect_tax_10yr_pct": 9.58,
      "cagr_total_expenditure_10yr_pct": 11.49,
      "cagr_capital_expenditure_10yr_pct": 19.46
    }
  },
  "variance": [
    {
      "sector": "Defense & Security",
      "year": "2023-24",
      "budget_estimate": 432720.0,
      "revised_estimate": 453580.0,
      "actuals": 448900.0,
      "variance_re_vs_be_pct": 4.82,
      "variance_actual_vs_be_pct": 3.73,
      "status": "Over-utilized"
    },
    {
      "sector": "Healthcare & Family Welfare",
      "year": "2023-24",
      "budget_estimate": 89155.0,
      "revised_estimate": 79221.0,
      "actuals": 76500.0,
      "variance_re_vs_be_pct": -11.14,
      "variance_actual_vs_be_pct": -14.19,
      "status": "Under-utilized"
    },
    {
      "sector": "Education & Skill Dev",
      "year": "2023-24",
      "budget_estimate": 112899.0,
      "revised_estimate": 108500.0,
      "actuals": 104200.0,
      "variance_re_vs_be_pct": -3.9,
      "variance_actual_vs_be_pct": -7.7,
      "status": "Under-utilized"
    },
    {
      "sector": "Transport & Highways",
      "year": "2023-24",
      "budget_estimate": 270000.0,
      "revised_estimate": 276000.0,
      "actuals": 275500.0,
      "variance_re_vs_be_pct": 2.22,
      "variance_actual_vs_be_pct": 2.04,
      "status": "Near Target"
    },
    {
      "sector": "Rural Development (MGNREGA etc.)",
      "year": "2023-24",
      "budget_estimate": 157545.0,
      "revised_estimate": 171061.0,
      "actuals": 178000.0,
      "variance_re_vs_be_pct": 8.58,
      "variance_actual_vs_be_pct": 12.98,
      "status": "Demand Driven Expansion"
    },
    {
      "sector": "Subsidies (Food, Fert, Fuel)",
      "year": "2023-24",
      "budget_estimate": 374707.0,
      "revised_estimate": 413541.0,
      "actuals": 410200.0,
      "variance_re_vs_be_pct": 10.36,
      "variance_actual_vs_be_pct": 9.47,
      "status": "Price Shock Buffer"
    }
  ]
};
