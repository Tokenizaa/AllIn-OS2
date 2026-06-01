import { Distributor, TreeNode, Transaction, ProductItem, SystemIntegration, SalesOrder } from './types';

export const INITIAL_DISTRIBUTORS: Distributor[] = [
  {
    id: "DST-001",
    name: "Catherine Vance",
    rank: "Crown President",
    status: "Active",
    email: "c.vance@allinos.net",
    phone: "+1 (555) 019-2834",
    sponsorId: null,
    joinDate: "2023-01-15",
    monthlyPV: 1200,
    monthlyGV: 145000,
    totalCommissions: 48600.00,
    downlineCount: 154,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    location: "Miami, Florida, US"
  },
  {
    id: "DST-002",
    name: "Marcus Aurelius",
    rank: "Diamond",
    status: "Active",
    email: "m.aurelius@allinos.net",
    phone: "+1 (555) 014-9988",
    sponsorId: "DST-001",
    joinDate: "2023-04-10",
    monthlyPV: 800,
    monthlyGV: 62000,
    totalCommissions: 24350.00,
    downlineCount: 68,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    location: "Rome, Italy"
  },
  {
    id: "DST-003",
    name: "Elena Rostova",
    rank: "Diamond",
    status: "Active",
    email: "e.rostova@allinos.net",
    phone: "+49 89 201938",
    sponsorId: "DST-001",
    joinDate: "2023-05-18",
    monthlyPV: 950,
    monthlyGV: 78000,
    totalCommissions: 28900.00,
    downlineCount: 82,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    location: "Munich, Germany"
  },
  {
    id: "DST-004",
    name: "Kenji Sato",
    rank: "Platinum",
    status: "Active",
    email: "k.sato@allinos.net",
    phone: "+81 3 5555 0143",
    sponsorId: "DST-002",
    joinDate: "2023-08-22",
    monthlyPV: 500,
    monthlyGV: 34000,
    totalCommissions: 12500.00,
    downlineCount: 29,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    location: "Tokyo, Japan"
  },
  {
    id: "DST-005",
    name: "Amara Diop",
    rank: "Gold",
    status: "Active",
    email: "a.diop@allinos.net",
    phone: "+221 33 824 1515",
    sponsorId: "DST-002",
    joinDate: "2023-11-05",
    monthlyPV: 400,
    monthlyGV: 18500,
    totalCommissions: 6800.00,
    downlineCount: 14,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    location: "Dakar, Senegal"
  },
  {
    id: "DST-006",
    name: "Sophia Martinez",
    rank: "Platinum",
    status: "Active",
    email: "s.martinez@allinos.net",
    phone: "+34 91 555 0192",
    sponsorId: "DST-003",
    joinDate: "2023-07-12",
    monthlyPV: 600,
    monthlyGV: 42000,
    totalCommissions: 14750.00,
    downlineCount: 41,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    location: "Madrid, Spain"
  },
  {
    id: "DST-007",
    name: "Thomas Wright",
    rank: "Silver",
    status: "Active",
    email: "t.wright@allinos.net",
    phone: "+44 20 7946 0194",
    sponsorId: "DST-003",
    joinDate: "2023-12-01",
    monthlyPV: 300,
    monthlyGV: 11200,
    totalCommissions: 3100.00,
    downlineCount: 8,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    location: "London, UK"
  },
  {
    id: "DST-008",
    name: "Lucas van der Berg",
    rank: "Bronze",
    status: "Active",
    email: "l.vanderberg@allinos.net",
    phone: "+31 20 555 0124",
    sponsorId: "DST-005",
    joinDate: "2024-02-14",
    monthlyPV: 250,
    monthlyGV: 4500,
    totalCommissions: 1100.00,
    downlineCount: 3,
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    location: "Amsterdam, Netherlands"
  },
  {
    id: "DST-009",
    name: "Zoe Jenkins",
    rank: "Distributor",
    status: "Active",
    email: "z.jenkins@allinos.net",
    phone: "+1 (555) 012-7744",
    sponsorId: "DST-006",
    joinDate: "2024-03-20",
    monthlyPV: 200,
    monthlyGV: 1800,
    totalCommissions: 450.00,
    downlineCount: 1,
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    location: "Austin, Texas, US"
  },
  {
    id: "DST-010",
    name: "Alex Vance Jr.",
    rank: "Distributor",
    status: "Active",
    email: "alex.vance@allinos.net",
    phone: "+1 (555) 015-8833",
    sponsorId: "DST-001",
    joinDate: "2024-04-12",
    monthlyPV: 350,
    monthlyGV: 350,
    totalCommissions: 150.00,
    downlineCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    location: "Miami, Florida, US"
  },
  {
    id: "DST-011",
    name: "Nadia Belomestny",
    rank: "Pending",
    status: "Pending",
    email: "nadia.b@mail.com",
    phone: "+33 1 42 27 78 89",
    sponsorId: "DST-006",
    joinDate: "2024-05-28",
    monthlyPV: 0,
    monthlyGV: 0,
    totalCommissions: 0,
    downlineCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    location: "Paris, France"
  },
  {
    id: "DST-012",
    name: "George Cooper",
    rank: "Inactive",
    status: "Inactive",
    email: "g.cooper@allinos.net",
    phone: "+1 (555) 013-1122",
    sponsorId: "DST-004",
    joinDate: "2023-09-05",
    monthlyPV: 0,
    monthlyGV: 1200,
    totalCommissions: 850.00,
    downlineCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?w=150",
    location: "Seattle, Washington, US"
  }
];

// Deep tree structure representing unilevel network matching above sponsors
export const NETWORK_TREE: TreeNode = {
  id: "DST-001",
  name: "Catherine Vance",
  rank: "Crown President",
  status: "Active",
  level: 0,
  monthlyPV: 1200,
  monthlyGV: 145000,
  children: [
    {
      id: "DST-002",
      name: "Marcus Aurelius",
      rank: "Diamond",
      status: "Active",
      level: 1,
      monthlyPV: 800,
      monthlyGV: 62000,
      children: [
        {
          id: "DST-004",
          name: "Kenji Sato",
          rank: "Platinum",
          status: "Active",
          level: 2,
          monthlyPV: 500,
          monthlyGV: 34000,
          children: [
            {
              id: "DST-012",
              name: "George Cooper",
              rank: "Inactive",
              status: "Inactive",
              level: 3,
              monthlyPV: 0,
              monthlyGV: 1200
            }
          ]
        },
        {
          id: "DST-005",
          name: "Amara Diop",
          rank: "Gold",
          status: "Active",
          level: 2,
          monthlyPV: 400,
          monthlyGV: 18500,
          children: [
            {
              id: "DST-008",
              name: "Lucas van der Berg",
              rank: "Bronze",
              status: "Active",
              level: 3,
              monthlyPV: 250,
              monthlyGV: 4500
            }
          ]
        }
      ]
    },
    {
      id: "DST-003",
      name: "Elena Rostova",
      rank: "Diamond",
      status: "Active",
      level: 1,
      monthlyPV: 950,
      monthlyGV: 78000,
      children: [
        {
          id: "DST-006",
          name: "Sophia Martinez",
          rank: "Platinum",
          status: "Active",
          level: 2,
          monthlyPV: 600,
          monthlyGV: 42000,
          children: [
            {
              id: "DST-009",
              name: "Zoe Jenkins",
              rank: "Distributor",
              status: "Active",
              level: 3,
              monthlyPV: 200,
              monthlyGV: 1800
            },
            {
              id: "DST-011",
              name: "Nadia Belomestny",
              rank: "Pending",
              status: "Pending",
              level: 3,
              monthlyPV: 0,
              monthlyGV: 0
            }
          ]
        },
        {
          id: "DST-007",
          name: "Thomas Wright",
          rank: "Silver",
          status: "Active",
          level: 2,
          monthlyPV: 300,
          monthlyGV: 11200
        }
      ]
    },
    {
      id: "DST-010",
      name: "Alex Vance Jr.",
      rank: "Distributor",
      status: "Active",
      level: 1,
      monthlyPV: 350,
      monthlyGV: 350
    }
  ]
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-7910",
    date: "2026-06-01T15:30:00Z",
    type: "Commission",
    amount: 1480.00,
    status: "Completed",
    description: "Level 1-3 Fast Start Matching Bonus Pool distribution",
    recipient: "Catherine Vance"
  },
  {
    id: "TXN-7909",
    date: "2026-06-01T12:15:00Z",
    type: "Retail Sale",
    amount: 450.00,
    status: "Completed",
    description: "Direct customer checkout: Order WEB-9018 PV accrued",
    recipient: "Marcus Aurelius"
  },
  {
    id: "TXN-7908",
    date: "2026-05-31T09:00:00Z",
    type: "Withdrawal",
    amount: -3500.00,
    status: "Completed",
    description: "HyperWallet Bank Wire Transfer - ACH Outbound execution",
    recipient: "Elena Rostova"
  },
  {
    id: "TXN-7907",
    date: "2026-05-30T18:45:00Z",
    type: "License Fee",
    amount: 99.00,
    status: "Completed",
    description: "Annual MLM Operating System Module seat billing",
    recipient: "Sophia Martinez"
  },
  {
    id: "TXN-7906",
    date: "2026-05-30T10:30:00Z",
    type: "Bonus",
    amount: 1000.00,
    status: "Completed",
    description: "Rank Advancement Award: Diamond Milestone Elite pool share",
    recipient: "Marcus Aurelius"
  },
  {
    id: "TXN-7905",
    date: "2026-05-29T14:20:00Z",
    type: "Commission",
    amount: 232.50,
    status: "Pending",
    description: "Unilevel Volume Overrides (Compressed Generation 4)",
    recipient: "Catherine Vance"
  },
  {
    id: "TXN-7904",
    date: "2026-05-28T08:00:00Z",
    type: "Withdrawal",
    amount: -1500.00,
    status: "Completed",
    description: "Coinbase API USDC Payout Integration transfer route",
    recipient: "Kenji Sato"
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "PROD-001",
    name: "NeuroMax Bio-Noortropic Elite",
    sku: "NMX-BIO-01",
    category: "Supplements",
    price: 89.00,
    pv: 60,
    stock: 1240,
    salesCount: 412,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300"
  },
  {
    id: "PROD-002",
    name: "E-Commerce Launch Fastpack Pack",
    sku: "EXP-LNC-03",
    category: "E-commerce Pack",
    price: 299.00,
    pv: 220,
    stock: 9999, // Subscription/Digital
    salesCount: 184,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300"
  },
  {
    id: "PROD-003",
    name: "OmniChannel Builder SaaS (1-Year)",
    sku: "OMN-SAS-12",
    category: "Software License",
    price: 499.00,
    pv: 400,
    stock: 9999, // Subscription/Digital
    salesCount: 95,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300"
  },
  {
    id: "PROD-004",
    name: "Aura Cellular Rejuvenation Mask",
    sku: "AUR-CEL-09",
    category: "Supplements",
    price: 125.00,
    pv: 90,
    stock: 450,
    salesCount: 204,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300"
  },
  {
    id: "PROD-05",
    name: "Social Accelerator Video Kit",
    sku: "SMC-ACC-11",
    category: "Marketing Suite",
    price: 150.00,
    pv: 100,
    stock: 3100,
    salesCount: 340,
    imageUrl: "https://images.unsplash.com/photo-1522241 labels?w=300"
  }
];

export const SALES_ORDERS: SalesOrder[] = [
  {
    id: "ORD-92819",
    customerName: "Sarah Connor",
    products: [
      { name: "NeuroMax Bio-Noortropic Elite", quantity: 2, price: 89.00 }
    ],
    totalAmount: 178.00,
    totalPV: 120,
    status: "Shipped",
    date: "2026-06-01",
    distributorId: "DST-001"
  },
  {
    id: "ORD-92818",
    customerName: "John Doe",
    products: [
      { name: "E-Commerce Launch Fastpack Pack", quantity: 1, price: 299.00 },
      { name: "NeuroMax Bio-Noortropic Elite", quantity: 1, price: 89.00 }
    ],
    totalAmount: 388.00,
    totalPV: 280,
    status: "Processing",
    date: "2026-06-01",
    distributorId: "DST-002"
  },
  {
    id: "ORD-92817",
    customerName: "David Miller",
    products: [
      { name: "OmniChannel Builder SaaS (1-Year)", quantity: 1, price: 499.00 }
    ],
    totalAmount: 499.00,
    totalPV: 400,
    status: "Pending",
    date: "2026-05-31",
    distributorId: "DST-003"
  }
];

export const INITIAL_INTEGRATIONS: SystemIntegration[] = [
  {
    id: "INT-01",
    name: "HyperWallet Global Payouts",
    type: "PaymentGateway",
    status: "Connected",
    lastSync: "2026-06-01T18:00:00Z",
    details: "Connected via production Oauth 2.0 Webhook Server. Dual Routing Active."
  },
  {
    id: "INT-02",
    name: "Gemini Pro AI Engines",
    type: "AI",
    status: "Connected",
    lastSync: "2026-06-01T20:00:00Z",
    details: "Active server connections on Vertex/Cloud Run interface."
  },
  {
    id: "INT-03",
    name: "Shopify Storefront Connector",
    type: "E-commerce",
    status: "Connected",
    lastSync: "2026-06-01T15:45:00Z",
    details: "Bidirectional SKU matching, PV/GV commissions mapped."
  },
  {
    id: "INT-04",
    name: "Avalara Automated Tax Matrix",
    type: "TaxService",
    status: "Connected",
    lastSync: "2026-05-31T23:59:59Z",
    details: "Automated real-time checkout sales tax calculations."
  },
  {
    id: "INT-05",
    name: "Twilio Broadcast CRM SMS",
    type: "CRM",
    status: "Disconnected",
    lastSync: "2026-05-15T09:20:00Z",
    details: "API Key balance depleted. Secondary fallback configured."
  }
];
