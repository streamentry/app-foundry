/** Exactly 100 explicit job-specific prototypes, derived from docs/ideas/ideas.json (2026-11-14).
 *  Not verified demand, not a license to mass-publish. */
import type { IdeaSpec } from './types';
export const ideaSpecs: readonly IdeaSpec[] = [
  {
    "id": "001",
    "slug": "timesheet-rounding",
    "name": "Timesheet Rounding Audit",
    "category": "Work & field operations",
    "icp": "Hourly contractors",
    "job": "Compare actual and rounded punch times",
    "query": "timesheet rounding calculator",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "calculator",
    "fields": [
      {
        "key": "label",
        "type": "text",
        "label": "Shift label",
        "required": true
      },
      {
        "key": "clockIn",
        "type": "time",
        "label": "Clock in",
        "required": true
      },
      {
        "key": "clockOut",
        "type": "time",
        "label": "Clock out",
        "required": true
      },
      {
        "key": "interval",
        "type": "choice",
        "label": "Rounding interval",
        "required": true,
        "options": [
          "5",
          "10",
          "15",
          "30"
        ]
      }
    ],
    "rule": "rounding",
    "cta": "Check rounding",
    "layout": "ledger"
  },
  {
    "id": "002",
    "slug": "oncall-handoff",
    "name": "On-call Handoff Cards",
    "category": "Work & field operations",
    "icp": "Tiny IT teams",
    "job": "Capture incident handovers offline",
    "query": "on call handoff checklist",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 5
    },
    "score": 83,
    "flow": "handoff",
    "fields": [
      {
        "key": "incident",
        "type": "text",
        "label": "Incident or service",
        "required": true
      },
      {
        "key": "owner",
        "type": "text",
        "label": "Handover recipient",
        "required": true
      },
      {
        "key": "status",
        "type": "choice",
        "label": "Status",
        "required": true,
        "options": [
          "Investigating",
          "Mitigating",
          "Monitoring",
          "Resolved"
        ]
      },
      {
        "key": "next",
        "type": "notes",
        "label": "Next action",
        "required": true
      }
    ],
    "rule": "none",
    "cta": "Save handoff",
    "layout": "board"
  },
  {
    "id": "003",
    "slug": "truck-pretrip",
    "name": "Driver Pre-Trip Checklist",
    "category": "Work & field operations",
    "icp": "Delivery drivers",
    "job": "Document vehicle inspections",
    "query": "pre trip inspection checklist",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 3
    },
    "score": 77,
    "flow": "checklist",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Inspection item",
        "required": true
      },
      {
        "key": "vehicle",
        "type": "text",
        "label": "Vehicle identifier",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Observation",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add check item",
    "layout": "board"
  },
  {
    "id": "004",
    "slug": "field-visit-log",
    "name": "Client Visit Journal",
    "category": "Work & field operations",
    "icp": "Solo field salespeople",
    "job": "Record visit outcomes and follow-ups",
    "query": "client visit report app",
    "ratings": {
      "intent": 4,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 79,
    "flow": "journal",
    "fields": [
      {
        "key": "client",
        "type": "text",
        "label": "Client or organization",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Visit date",
        "required": true
      },
      {
        "key": "result",
        "type": "choice",
        "label": "Visit outcome",
        "required": true,
        "options": [
          "Follow up",
          "Qualified",
          "Not now",
          "Closed"
        ]
      },
      {
        "key": "next",
        "type": "notes",
        "label": "Next action",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Log client visit",
    "layout": "timeline"
  },
  {
    "id": "005",
    "slug": "overtime-shift-notes",
    "name": "Overtime Shift Notes",
    "category": "Work & field operations",
    "icp": "Hourly workers",
    "job": "Record overtime independently of payroll",
    "query": "overtime hours tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 5
    },
    "score": 83,
    "flow": "ledger",
    "fields": [
      {
        "key": "shift",
        "type": "text",
        "label": "Shift or employer",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Work date",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Extra minutes",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Reason",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record overtime",
    "layout": "ledger"
  },
  {
    "id": "006",
    "slug": "equipment-checkout",
    "name": "Equipment Checkout Ledger",
    "category": "Work & field operations",
    "icp": "Small workshops",
    "job": "Track borrowed tools and returns",
    "query": "tool checkout tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Equipment",
        "required": true
      },
      {
        "key": "person",
        "type": "text",
        "label": "Borrower",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Quantity",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Return arrangement",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Check out equipment",
    "layout": "board"
  },
  {
    "id": "007",
    "slug": "freelancer-deposit",
    "name": "Freelance Deposit Tracker",
    "category": "Work & field operations",
    "icp": "Solo creatives",
    "job": "Reconcile deposits against project balances",
    "query": "freelance deposit tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 84,
    "flow": "ledger",
    "fields": [
      {
        "key": "project",
        "type": "text",
        "label": "Project or client",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Deposit date",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Deposit amount",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Reference",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record deposit",
    "layout": "ledger"
  },
  {
    "id": "008",
    "slug": "site-photo-log",
    "name": "Site Progress Photo Log",
    "category": "Work & field operations",
    "icp": "Small contractors",
    "job": "Capture dated site work evidence",
    "query": "construction daily photo log",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 3
    },
    "score": 77,
    "flow": "journal",
    "fields": [
      {
        "key": "site",
        "type": "text",
        "label": "Site or project",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Visit date",
        "required": true
      },
      {
        "key": "area",
        "type": "text",
        "label": "Location or area",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Photo reference and observation",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record site progress",
    "layout": "paper"
  },
  {
    "id": "009",
    "slug": "job-application-followup",
    "name": "Interview Follow-up Log",
    "category": "Work & field operations",
    "icp": "Job seekers",
    "job": "Track stages and interview follow-ups",
    "query": "job application tracker offline",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "timeline",
    "fields": [
      {
        "key": "company",
        "type": "text",
        "label": "Company",
        "required": true
      },
      {
        "key": "role",
        "type": "text",
        "label": "Role",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next follow-up",
        "required": true
      },
      {
        "key": "stage",
        "type": "choice",
        "label": "Stage",
        "required": true,
        "options": [
          "Applied",
          "Interviewing",
          "Offer",
          "Closed"
        ]
      }
    ],
    "rule": "none",
    "cta": "Add application",
    "layout": "timeline"
  },
  {
    "id": "010",
    "slug": "service-warranty-jobs",
    "name": "Repair Job Ledger",
    "category": "Work & field operations",
    "icp": "Repair technicians",
    "job": "Record work, parts and follow-up",
    "query": "repair job tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "journal",
    "fields": [
      {
        "key": "device",
        "type": "text",
        "label": "Item or appliance",
        "required": true
      },
      {
        "key": "client",
        "type": "text",
        "label": "Customer",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Service date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Work and parts",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record repair",
    "layout": "paper"
  },
  {
    "id": "011",
    "slug": "invoice-number-ledger",
    "name": "Invoice Number Ledger",
    "category": "Small-business admin",
    "icp": "Micro-business owners",
    "job": "Avoid duplicate invoice numbers",
    "query": "invoice number tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 87,
    "flow": "register",
    "fields": [
      {
        "key": "number",
        "type": "text",
        "label": "Invoice number",
        "required": true
      },
      {
        "key": "client",
        "type": "text",
        "label": "Client",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Issue date",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Invoice amount",
        "required": false
      }
    ],
    "rule": "unique:first",
    "cta": "Record invoice number",
    "layout": "ledger"
  },
  {
    "id": "012",
    "slug": "cash-float-count",
    "name": "Cash Drawer Count",
    "category": "Small-business admin",
    "icp": "Shop owners",
    "job": "Count cash and reconcile till",
    "query": "cash drawer counter app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 87,
    "flow": "calculator",
    "fields": [
      {
        "key": "label",
        "type": "text",
        "label": "Drawer label",
        "required": true
      },
      {
        "key": "hundreds",
        "type": "number",
        "label": "Notes of 100",
        "required": true
      },
      {
        "key": "fifties",
        "type": "number",
        "label": "Notes of 50",
        "required": true
      },
      {
        "key": "twenties",
        "type": "number",
        "label": "Notes of 20",
        "required": true
      },
      {
        "key": "tens",
        "type": "number",
        "label": "Notes of 10",
        "required": true
      },
      {
        "key": "fives",
        "type": "number",
        "label": "Notes of 5",
        "required": true
      },
      {
        "key": "ones",
        "type": "number",
        "label": "Units of 1",
        "required": true
      }
    ],
    "rule": "cash",
    "cta": "Count cash drawer",
    "layout": "ledger"
  },
  {
    "id": "013",
    "slug": "price-quote-history",
    "name": "Quote Revision Tracker",
    "category": "Small-business admin",
    "icp": "Freelancers",
    "job": "Store versions of price quotes",
    "query": "quotation tracker app",
    "ratings": {
      "intent": 3,
      "pay": 4,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 79,
    "flow": "ledger",
    "fields": [
      {
        "key": "quote",
        "type": "text",
        "label": "Quote number",
        "required": true
      },
      {
        "key": "client",
        "type": "text",
        "label": "Customer",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Quoted amount",
        "required": true
      },
      {
        "key": "revision",
        "type": "notes",
        "label": "Change reason",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Save quote revision",
    "layout": "ledger"
  },
  {
    "id": "014",
    "slug": "market-stall-stock",
    "name": "Market Stall Stock Count",
    "category": "Small-business admin",
    "icp": "Weekend market vendors",
    "job": "Count stock after stall hours",
    "query": "market stall inventory",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Product",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Quantity on hand",
        "required": true
      },
      {
        "key": "location",
        "type": "text",
        "label": "Stall or box",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add stock item",
    "layout": "board"
  },
  {
    "id": "015",
    "slug": "purchase-order-receipt",
    "name": "PO Receipt Checklist",
    "category": "Small-business admin",
    "icp": "Micro-wholesalers",
    "job": "Compare ordered and delivered items",
    "query": "purchase order receiving app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 3
    },
    "score": 77,
    "flow": "calculator",
    "fields": [
      {
        "key": "order",
        "type": "text",
        "label": "Purchase order",
        "required": true
      },
      {
        "key": "ordered",
        "type": "number",
        "label": "Units ordered",
        "required": true
      },
      {
        "key": "received",
        "type": "number",
        "label": "Units received",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Damages or discrepancies",
        "required": false
      }
    ],
    "rule": "shortage",
    "cta": "Check delivery",
    "layout": "ledger"
  },
  {
    "id": "016",
    "slug": "rental-deposit-ledger",
    "name": "Rental Deposit Ledger",
    "category": "Small-business admin",
    "icp": "Small equipment renters",
    "job": "Track deposits to return",
    "query": "rental deposit tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "ledger",
    "fields": [
      {
        "key": "rental",
        "type": "text",
        "label": "Renter or item",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Deposit held",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Received date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Return condition",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record deposit",
    "layout": "ledger"
  },
  {
    "id": "017",
    "slug": "booth-sales-tally",
    "name": "Craft Fair Sales Tally",
    "category": "Small-business admin",
    "icp": "Craft-market sellers",
    "job": "Tally item sales without POS",
    "query": "craft fair sales tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 84,
    "flow": "counter",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Craft product",
        "required": true
      },
      {
        "key": "price",
        "type": "number",
        "label": "Price per unit",
        "required": false
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Booth",
        "required": false
      }
    ],
    "rule": "counterValue",
    "cta": "Add sales counter",
    "layout": "tiles"
  },
  {
    "id": "018",
    "slug": "commission-split",
    "name": "Commission Split Worksheet",
    "category": "Small-business admin",
    "icp": "Independent agents",
    "job": "Calculate commission split scenarios",
    "query": "commission split calculator",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "calculator",
    "fields": [
      {
        "key": "deal",
        "type": "text",
        "label": "Deal or client",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Deal amount",
        "required": true
      },
      {
        "key": "percent",
        "type": "number",
        "label": "Commission percentage",
        "required": true
      },
      {
        "key": "recipient",
        "type": "text",
        "label": "Payee",
        "required": false
      }
    ],
    "rule": "commission",
    "cta": "Calculate commission",
    "layout": "ledger"
  },
  {
    "id": "019",
    "slug": "service-contract-renewal",
    "name": "Contract Renewal Calendar",
    "category": "Small-business admin",
    "icp": "Small B2B providers",
    "job": "Track renewal dates and contacts",
    "query": "contract renewal tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 87,
    "flow": "timeline",
    "fields": [
      {
        "key": "client",
        "type": "text",
        "label": "Contract or customer",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Renewal date",
        "required": true
      },
      {
        "key": "terms",
        "type": "notes",
        "label": "Terms and follow-up",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add contract renewal",
    "layout": "timeline"
  },
  {
    "id": "020",
    "slug": "simple-reorder-points",
    "name": "Reorder Point Notebook",
    "category": "Small-business admin",
    "icp": "Tiny retailers",
    "job": "Know what inventory to replenish",
    "query": "reorder point inventory app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "SKU or product",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Units available",
        "required": true
      },
      {
        "key": "threshold",
        "type": "number",
        "label": "Reorder threshold",
        "required": true
      }
    ],
    "rule": "reorder",
    "cta": "Track SKU",
    "layout": "board"
  },
  {
    "id": "021",
    "slug": "home-filter-replacement",
    "name": "Home Filter Replacement",
    "category": "Home & property",
    "icp": "Homeowners",
    "job": "Track air and water filter replacement",
    "query": "air filter replacement tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "timeline",
    "fields": [
      {
        "key": "filter",
        "type": "text",
        "label": "Filter or appliance",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next replacement",
        "required": true
      },
      {
        "key": "model",
        "type": "text",
        "label": "Part number",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Schedule filter",
    "layout": "timeline"
  },
  {
    "id": "022",
    "slug": "appliance-maintenance",
    "name": "Appliance Maintenance Diary",
    "category": "Home & property",
    "icp": "Homeowners",
    "job": "Recall repair and servicing dates",
    "query": "appliance maintenance tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 5
    },
    "score": 73,
    "flow": "journal",
    "fields": [
      {
        "key": "appliance",
        "type": "text",
        "label": "Appliance",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Service date",
        "required": true
      },
      {
        "key": "service",
        "type": "notes",
        "label": "Work and parts",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record service",
    "layout": "paper"
  },
  {
    "id": "023",
    "slug": "paint-color-archive",
    "name": "Paint Color Archive",
    "category": "Home & property",
    "icp": "Home renovators",
    "job": "Save precise room paint and finish codes",
    "query": "paint color tracker app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "register",
    "fields": [
      {
        "key": "room",
        "type": "text",
        "label": "Room or surface",
        "required": true
      },
      {
        "key": "color",
        "type": "text",
        "label": "Paint color code",
        "required": true
      },
      {
        "key": "finish",
        "type": "text",
        "label": "Finish or brand",
        "required": false
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Batch notes",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save paint color",
    "layout": "paper"
  },
  {
    "id": "024",
    "slug": "home-renovation-punchlist",
    "name": "Renovation Snag List",
    "category": "Home & property",
    "icp": "Home renovators",
    "job": "Document unfinished work per room",
    "query": "home renovation punch list",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 4,
      "safe": 4
    },
    "score": 77,
    "flow": "checklist",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Defect or unfinished task",
        "required": true
      },
      {
        "key": "room",
        "type": "text",
        "label": "Room",
        "required": true
      },
      {
        "key": "details",
        "type": "notes",
        "label": "Contractor follow-up",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add snag",
    "layout": "board"
  },
  {
    "id": "025",
    "slug": "household-meter-readings",
    "name": "Utility Meter Readings",
    "category": "Home & property",
    "icp": "Renters and owners",
    "job": "Compare manual meter readings",
    "query": "water meter reading log",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 70,
    "flow": "measure",
    "fields": [
      {
        "key": "meter",
        "type": "text",
        "label": "Meter name",
        "required": true
      },
      {
        "key": "reading",
        "type": "number",
        "label": "Meter reading",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Reading date",
        "required": true
      },
      {
        "key": "unit",
        "type": "text",
        "label": "Unit",
        "required": false
      }
    ],
    "rule": "change",
    "cta": "Record reading",
    "layout": "ledger"
  },
  {
    "id": "026",
    "slug": "moving-box-inventory",
    "name": "Moving Box Inventory",
    "category": "Home & property",
    "icp": "Moving households",
    "job": "Find items by box number",
    "query": "moving box inventory app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 84,
    "flow": "inventory",
    "fields": [
      {
        "key": "box",
        "type": "text",
        "label": "Box number",
        "required": true
      },
      {
        "key": "item",
        "type": "text",
        "label": "Contents",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Quantity",
        "required": true
      },
      {
        "key": "room",
        "type": "text",
        "label": "Destination room",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add to box",
    "layout": "shelf"
  },
  {
    "id": "027",
    "slug": "home-dimensions",
    "name": "Room Measurements Notebook",
    "category": "Home & property",
    "icp": "DIY homeowners",
    "job": "Remember room and furniture dimensions",
    "query": "room measurement log",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "measure",
    "fields": [
      {
        "key": "area",
        "type": "text",
        "label": "Room or object",
        "required": true
      },
      {
        "key": "length",
        "type": "number",
        "label": "Length in cm",
        "required": true
      },
      {
        "key": "width",
        "type": "number",
        "label": "Width in cm",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Door clearance or notes",
        "required": false
      }
    ],
    "rule": "area",
    "cta": "Record dimensions",
    "layout": "paper"
  },
  {
    "id": "028",
    "slug": "key-handover",
    "name": "Key Handover Record",
    "category": "Home & property",
    "icp": "Property caretakers",
    "job": "Record who holds a physical key",
    "query": "key handover register",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "register",
    "fields": [
      {
        "key": "key",
        "type": "text",
        "label": "Key or property",
        "required": true
      },
      {
        "key": "holder",
        "type": "text",
        "label": "Current holder",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Handover date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Reference",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record handover",
    "layout": "ledger"
  },
  {
    "id": "029",
    "slug": "septic-maintenance",
    "name": "Septic Service Log",
    "category": "Home & property",
    "icp": "Rural homeowners",
    "job": "Track septic servicing history",
    "query": "septic tank maintenance log",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 5
    },
    "score": 73,
    "flow": "timeline",
    "fields": [
      {
        "key": "system",
        "type": "text",
        "label": "Property or system",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next service date",
        "required": true
      },
      {
        "key": "provider",
        "type": "text",
        "label": "Service company",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Track service date",
    "layout": "timeline"
  },
  {
    "id": "030",
    "slug": "smoke-alarm-test-log",
    "name": "Smoke Alarm Test Log",
    "category": "Home & property",
    "icp": "Homeowners",
    "job": "Record test dates and results",
    "query": "smoke alarm testing app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 74,
    "flow": "checklist",
    "fields": [
      {
        "key": "alarm",
        "type": "text",
        "label": "Alarm or room",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Last test observation",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add alarm test",
    "layout": "board"
  },
  {
    "id": "031",
    "slug": "school-uniform-labels",
    "name": "Kids Clothing Size Ledger",
    "category": "Family & caregiving",
    "icp": "Parents",
    "job": "Remember sizes per child and brand",
    "query": "kids clothing size tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "register",
    "fields": [
      {
        "key": "child",
        "type": "text",
        "label": "Child label",
        "required": true
      },
      {
        "key": "item",
        "type": "text",
        "label": "Clothing item",
        "required": true
      },
      {
        "key": "size",
        "type": "text",
        "label": "Size and brand",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Fit notes",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save size",
    "layout": "shelf"
  },
  {
    "id": "032",
    "slug": "school-paperwork",
    "name": "School Form Deadline Log",
    "category": "Family & caregiving",
    "icp": "Parents",
    "job": "Track school paperwork deadlines",
    "query": "school form tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 74,
    "flow": "timeline",
    "fields": [
      {
        "key": "form",
        "type": "text",
        "label": "Form or payment",
        "required": true
      },
      {
        "key": "child",
        "type": "text",
        "label": "Student",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Deadline",
        "required": true
      }
    ],
    "rule": "none",
    "cta": "Add school deadline",
    "layout": "timeline"
  },
  {
    "id": "033",
    "slug": "family-emergency-contacts",
    "name": "Emergency Contact Card",
    "category": "Family & caregiving",
    "icp": "Families",
    "job": "Store printable family emergency numbers",
    "query": "emergency contact card app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 3
    },
    "score": 68,
    "flow": "register",
    "fields": [
      {
        "key": "person",
        "type": "text",
        "label": "Contact name",
        "required": true
      },
      {
        "key": "phone",
        "type": "text",
        "label": "Phone number",
        "required": true
      },
      {
        "key": "relation",
        "type": "text",
        "label": "Relationship",
        "required": false
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Instructions",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add offline contact",
    "layout": "shelf"
  },
  {
    "id": "034",
    "slug": "child-book-reading",
    "name": "Children Reading Log",
    "category": "Family & caregiving",
    "icp": "Parents",
    "job": "Remember books children have read",
    "query": "kids reading log app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "journal",
    "fields": [
      {
        "key": "book",
        "type": "text",
        "label": "Book title",
        "required": true
      },
      {
        "key": "child",
        "type": "text",
        "label": "Child label",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Finished reading",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Favorite moment",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Log book",
    "layout": "paper"
  },
  {
    "id": "035",
    "slug": "elderly-visit-journal",
    "name": "Family Visit Journal",
    "category": "Family & caregiving",
    "icp": "Adult children",
    "job": "Record non-medical family visits",
    "query": "elderly visit log",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 70,
    "flow": "journal",
    "fields": [
      {
        "key": "visit",
        "type": "text",
        "label": "Visit with",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Visit date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Conversation or household tasks",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Log family visit",
    "layout": "paper"
  },
  {
    "id": "036",
    "slug": "parent-teacher-meeting",
    "name": "Teacher Meeting Notes",
    "category": "Family & caregiving",
    "icp": "Parents",
    "job": "Capture teacher meeting action items",
    "query": "parent teacher conference notes",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "checklist",
    "fields": [
      {
        "key": "action",
        "type": "text",
        "label": "Follow-up action",
        "required": true
      },
      {
        "key": "child",
        "type": "text",
        "label": "Student",
        "required": true
      },
      {
        "key": "detail",
        "type": "notes",
        "label": "Teacher suggestion",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add follow-up",
    "layout": "board"
  },
  {
    "id": "037",
    "slug": "family-heirloom-catalog",
    "name": "Family Heirloom Catalog",
    "category": "Family & caregiving",
    "icp": "Families",
    "job": "Record stories behind heirlooms",
    "query": "family heirloom inventory",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 4,
      "safe": 5
    },
    "score": 70,
    "flow": "register",
    "fields": [
      {
        "key": "heirloom",
        "type": "text",
        "label": "Object",
        "required": true
      },
      {
        "key": "owner",
        "type": "text",
        "label": "Family member",
        "required": true
      },
      {
        "key": "story",
        "type": "notes",
        "label": "Story and origin",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save heirloom story",
    "layout": "shelf"
  },
  {
    "id": "038",
    "slug": "kids-chore-allowance",
    "name": "Allowance Chore Record",
    "category": "Family & caregiving",
    "icp": "Parents",
    "job": "Reconcile agreed chores and allowance",
    "query": "kids allowance tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 70,
    "flow": "ledger",
    "fields": [
      {
        "key": "chore",
        "type": "text",
        "label": "Chore or agreement",
        "required": true
      },
      {
        "key": "child",
        "type": "text",
        "label": "Child",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Allowance amount",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Condition",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record allowance",
    "layout": "ledger"
  },
  {
    "id": "039",
    "slug": "caregiver-handoff",
    "name": "Care Visit Handoff",
    "category": "Family & caregiving",
    "icp": "Non-medical family carers",
    "job": "Record household tasks across visits",
    "query": "caregiver visit checklist",
    "ratings": {
      "intent": 4,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 3
    },
    "score": 72,
    "flow": "handoff",
    "fields": [
      {
        "key": "task",
        "type": "text",
        "label": "Household task",
        "required": true
      },
      {
        "key": "person",
        "type": "text",
        "label": "Care visit contact",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Next action or supplies",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record visit handoff",
    "layout": "board"
  },
  {
    "id": "040",
    "slug": "school-supply-inventory",
    "name": "School Supply Tracker",
    "category": "Family & caregiving",
    "icp": "Families",
    "job": "Avoid repurchasing existing supplies",
    "query": "school supplies checklist app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "inventory",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "School supply",
        "required": true
      },
      {
        "key": "child",
        "type": "text",
        "label": "Child",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Quantity available",
        "required": true
      }
    ],
    "rule": "none",
    "cta": "Add school supply",
    "layout": "shelf"
  },
  {
    "id": "041",
    "slug": "pet-vaccination-record",
    "name": "Pet Vaccination Recordbook",
    "category": "Pets & animals",
    "icp": "Pet owners",
    "job": "Store vet-issued vaccination dates",
    "query": "pet vaccination record app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 70,
    "flow": "timeline",
    "fields": [
      {
        "key": "pet",
        "type": "text",
        "label": "Pet",
        "required": true
      },
      {
        "key": "vaccine",
        "type": "text",
        "label": "Vet-issued vaccination name",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Record or due date",
        "required": true
      },
      {
        "key": "ref",
        "type": "notes",
        "label": "Vet document reference",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save vaccine record",
    "layout": "timeline"
  },
  {
    "id": "042",
    "slug": "pet-grooming-history",
    "name": "Pet Grooming Diary",
    "category": "Pets & animals",
    "icp": "Dog owners",
    "job": "Remember grooming cadence and visits",
    "query": "pet grooming tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "journal",
    "fields": [
      {
        "key": "pet",
        "type": "text",
        "label": "Pet",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Grooming date",
        "required": true
      },
      {
        "key": "care",
        "type": "notes",
        "label": "Grooming notes",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record grooming",
    "layout": "paper"
  },
  {
    "id": "043",
    "slug": "aquarium-water-parameters",
    "name": "Aquarium Test Log",
    "category": "Pets & animals",
    "icp": "Aquarium keepers",
    "job": "Chart water parameter readings",
    "query": "aquarium water test log",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "measure",
    "fields": [
      {
        "key": "tank",
        "type": "text",
        "label": "Tank",
        "required": true
      },
      {
        "key": "ph",
        "type": "number",
        "label": "Measured pH",
        "required": true
      },
      {
        "key": "temperature",
        "type": "number",
        "label": "Temperature",
        "required": false
      },
      {
        "key": "date",
        "type": "date",
        "label": "Test date",
        "required": true
      }
    ],
    "rule": "none",
    "cta": "Save water test",
    "layout": "ledger"
  },
  {
    "id": "044",
    "slug": "horse-farrier-log",
    "name": "Farrier Visit Log",
    "category": "Pets & animals",
    "icp": "Horse owners",
    "job": "Track hoof-care appointments",
    "query": "horse farrier tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "timeline",
    "fields": [
      {
        "key": "horse",
        "type": "text",
        "label": "Horse",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next farrier visit",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Previous hoof care",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Track appointment",
    "layout": "timeline"
  },
  {
    "id": "045",
    "slug": "chicken-egg-tally",
    "name": "Backyard Egg Collection",
    "category": "Pets & animals",
    "icp": "Chicken keepers",
    "job": "Log daily egg yield by coop",
    "query": "egg production tracker chickens",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "counter",
    "fields": [
      {
        "key": "coop",
        "type": "text",
        "label": "Coop name",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Collection note",
        "required": false
      }
    ],
    "rule": "counterValue",
    "cta": "Start egg tally",
    "layout": "tiles"
  },
  {
    "id": "046",
    "slug": "dog-walking-rounds",
    "name": "Dog Walker Route Notes",
    "category": "Pets & animals",
    "icp": "Solo pet walkers",
    "job": "Log each dog walk and handoff",
    "query": "dog walking log app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "journal",
    "fields": [
      {
        "key": "dog",
        "type": "text",
        "label": "Dog and client",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Walk date",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Minutes walked",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Handoff note",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Log walk",
    "layout": "timeline"
  },
  {
    "id": "047",
    "slug": "pet-sitting-handoff",
    "name": "Pet Sitting Instructions",
    "category": "Pets & animals",
    "icp": "Pet sitters",
    "job": "Keep visit instructions by pet",
    "query": "pet sitting checklist",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "handoff",
    "fields": [
      {
        "key": "pet",
        "type": "text",
        "label": "Pet",
        "required": true
      },
      {
        "key": "instruction",
        "type": "text",
        "label": "Care instruction",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Contact or preference",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save care instruction",
    "layout": "board"
  },
  {
    "id": "048",
    "slug": "reptile-feeding-log",
    "name": "Reptile Feeding Journal",
    "category": "Pets & animals",
    "icp": "Reptile keepers",
    "job": "Record feeding and shedding dates",
    "query": "reptile feeding tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 84,
    "flow": "journal",
    "fields": [
      {
        "key": "animal",
        "type": "text",
        "label": "Reptile",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Feeding date",
        "required": true
      },
      {
        "key": "food",
        "type": "text",
        "label": "Food offered",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Observed response",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record feeding",
    "layout": "paper"
  },
  {
    "id": "049",
    "slug": "bird-molt-diary",
    "name": "Bird Observation Log",
    "category": "Pets & animals",
    "icp": "Pet bird owners",
    "job": "Record molts and dated observations",
    "query": "bird care journal app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 4,
      "safe": 4
    },
    "score": 67,
    "flow": "journal",
    "fields": [
      {
        "key": "bird",
        "type": "text",
        "label": "Bird",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Observation date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Molt or behavior note",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add observation",
    "layout": "paper"
  },
  {
    "id": "050",
    "slug": "pet-weight-record",
    "name": "Pet Weight History",
    "category": "Pets & animals",
    "icp": "Pet owners",
    "job": "Log weigh-ins without medical claims",
    "query": "pet weight tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "measure",
    "fields": [
      {
        "key": "pet",
        "type": "text",
        "label": "Pet",
        "required": true
      },
      {
        "key": "weight",
        "type": "number",
        "label": "Measured weight",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Weigh-in date",
        "required": true
      },
      {
        "key": "unit",
        "type": "choice",
        "label": "Weight unit",
        "required": false,
        "options": [
          "kg",
          "lb"
        ]
      }
    ],
    "rule": "none",
    "cta": "Record weigh-in",
    "layout": "ledger"
  },
  {
    "id": "051",
    "slug": "passport-expiry-family",
    "name": "Family Document Expiry",
    "category": "Travel & vehicle",
    "icp": "Traveling families",
    "job": "Track passport expiration dates",
    "query": "passport expiry reminder",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 5,
      "safe": 4
    },
    "score": 81,
    "flow": "timeline",
    "fields": [
      {
        "key": "person",
        "type": "text",
        "label": "Document holder",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Passport expiry",
        "required": true
      },
      {
        "key": "country",
        "type": "text",
        "label": "Issuing country",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add document expiry",
    "layout": "timeline"
  },
  {
    "id": "052",
    "slug": "packing-by-climate",
    "name": "Travel Packing Template",
    "category": "Travel & vehicle",
    "icp": "Frequent travelers",
    "job": "Reuse packing lists by climate",
    "query": "packing list winter travel",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "checklist",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Packing item",
        "required": true
      },
      {
        "key": "trip",
        "type": "text",
        "label": "Trip type",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Weather or packing note",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add packing item",
    "layout": "board"
  },
  {
    "id": "053",
    "slug": "vehicle-service-history",
    "name": "Car Service Recordbook",
    "category": "Travel & vehicle",
    "icp": "Car owners",
    "job": "Track maintenance by mileage",
    "query": "car maintenance log app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "journal",
    "fields": [
      {
        "key": "vehicle",
        "type": "text",
        "label": "Vehicle",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Service date",
        "required": true
      },
      {
        "key": "odometer",
        "type": "number",
        "label": "Odometer",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Work completed",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Log vehicle service",
    "layout": "paper"
  },
  {
    "id": "054",
    "slug": "motorbike-maintenance",
    "name": "Motorbike Maintenance Log",
    "category": "Travel & vehicle",
    "icp": "Motorbike commuters",
    "job": "Track repairs and oil changes",
    "query": "motorcycle maintenance log",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 84,
    "flow": "timeline",
    "fields": [
      {
        "key": "bike",
        "type": "text",
        "label": "Motorbike",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next service date",
        "required": true
      },
      {
        "key": "odometer",
        "type": "number",
        "label": "Odometer estimate",
        "required": false
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Service type",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Schedule maintenance",
    "layout": "timeline"
  },
  {
    "id": "055",
    "slug": "roadtrip-fuel-cost",
    "name": "Road Trip Fuel Ledger",
    "category": "Travel & vehicle",
    "icp": "Road travelers",
    "job": "Track fuel purchases by trip",
    "query": "road trip gas tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "ledger",
    "fields": [
      {
        "key": "stop",
        "type": "text",
        "label": "Fuel stop",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Refill date",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Fuel purchase amount",
        "required": true
      },
      {
        "key": "liters",
        "type": "number",
        "label": "Liters refilled",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record fuel expense",
    "layout": "ledger"
  },
  {
    "id": "056",
    "slug": "luggage-weight-check",
    "name": "Luggage Weight Planner",
    "category": "Travel & vehicle",
    "icp": "Air travelers",
    "job": "Estimate packed bag weights",
    "query": "luggage weight tracker app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "calculator",
    "fields": [
      {
        "key": "bag",
        "type": "text",
        "label": "Bag name",
        "required": true
      },
      {
        "key": "weight",
        "type": "number",
        "label": "Packed weight in kg",
        "required": true
      },
      {
        "key": "limit",
        "type": "number",
        "label": "Airline limit in kg",
        "required": true
      }
    ],
    "rule": "difference",
    "cta": "Check weight",
    "layout": "ledger"
  },
  {
    "id": "057",
    "slug": "visa-document-checklist",
    "name": "Visa Paperwork Checklist",
    "category": "Travel & vehicle",
    "icp": "Travelers",
    "job": "Manage personal checklist without legal claims",
    "query": "visa documents checklist",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 3
    },
    "score": 68,
    "flow": "checklist",
    "fields": [
      {
        "key": "document",
        "type": "text",
        "label": "Document to prepare",
        "required": true
      },
      {
        "key": "trip",
        "type": "text",
        "label": "Trip or destination",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Application reference",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add document",
    "layout": "board"
  },
  {
    "id": "058",
    "slug": "car-park-spot-note",
    "name": "Parking Location Note",
    "category": "Travel & vehicle",
    "icp": "Drivers",
    "job": "Remember garage and parking spot",
    "query": "where did i park app",
    "ratings": {
      "intent": 2,
      "pay": 2,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 64,
    "flow": "register",
    "fields": [
      {
        "key": "location",
        "type": "text",
        "label": "Parking garage",
        "required": true
      },
      {
        "key": "spot",
        "type": "text",
        "label": "Floor and bay",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Exit or landmark",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save parking spot",
    "layout": "shelf"
  },
  {
    "id": "059",
    "slug": "toll-expense-journal",
    "name": "Toll Expense Journal",
    "category": "Travel & vehicle",
    "icp": "Road travelers",
    "job": "Record toll spending by trip",
    "query": "toll expenses tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "ledger",
    "fields": [
      {
        "key": "road",
        "type": "text",
        "label": "Toll location",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Date",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Paid amount",
        "required": true
      }
    ],
    "rule": "sum",
    "cta": "Log toll",
    "layout": "ledger"
  },
  {
    "id": "060",
    "slug": "campground-gear-list",
    "name": "Camping Gear Checklist",
    "category": "Travel & vehicle",
    "icp": "Campers",
    "job": "Reuse seasonal gear lists",
    "query": "camping equipment checklist",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "checklist",
    "fields": [
      {
        "key": "gear",
        "type": "text",
        "label": "Camping gear",
        "required": true
      },
      {
        "key": "trip",
        "type": "text",
        "label": "Trip type",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Packing note",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add gear",
    "layout": "board"
  },
  {
    "id": "061",
    "slug": "knitting-row-counter",
    "name": "Knitting Project Rows",
    "category": "Hobbies & crafts",
    "icp": "Knitters",
    "job": "Track rows across projects",
    "query": "knitting row counter",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "counter",
    "fields": [
      {
        "key": "project",
        "type": "text",
        "label": "Knitting project",
        "required": true
      },
      {
        "key": "section",
        "type": "text",
        "label": "Pattern section",
        "required": false
      }
    ],
    "rule": "counterValue",
    "cta": "Create row counter",
    "layout": "tiles"
  },
  {
    "id": "062",
    "slug": "sewing-measurements",
    "name": "Sewing Measurement Cards",
    "category": "Hobbies & crafts",
    "icp": "Sewists",
    "job": "Keep person and garment measurements",
    "query": "sewing measurements app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "measure",
    "fields": [
      {
        "key": "person",
        "type": "text",
        "label": "Person or garment",
        "required": true
      },
      {
        "key": "length",
        "type": "number",
        "label": "Measurement in cm",
        "required": true
      },
      {
        "key": "part",
        "type": "text",
        "label": "Measurement type",
        "required": false
      },
      {
        "key": "date",
        "type": "date",
        "label": "Measured date",
        "required": true
      }
    ],
    "rule": "none",
    "cta": "Save measurement",
    "layout": "paper"
  },
  {
    "id": "063",
    "slug": "fabric-stash",
    "name": "Fabric Stash Inventory",
    "category": "Hobbies & crafts",
    "icp": "Quilters",
    "job": "Find fabric quantities by category",
    "query": "fabric stash tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "fabric",
        "type": "text",
        "label": "Fabric print or code",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Length in meters",
        "required": true
      },
      {
        "key": "color",
        "type": "text",
        "label": "Color and bin",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add fabric",
    "layout": "shelf"
  },
  {
    "id": "064",
    "slug": "woodworking-cutlist",
    "name": "Woodworking Cut List",
    "category": "Hobbies & crafts",
    "icp": "Woodworkers",
    "job": "Prepare board cut dimensions",
    "query": "woodworking cut list app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "calculator",
    "fields": [
      {
        "key": "project",
        "type": "text",
        "label": "Project",
        "required": true
      },
      {
        "key": "board",
        "type": "number",
        "label": "Board length in mm",
        "required": true
      },
      {
        "key": "cut",
        "type": "number",
        "label": "Single cut length in mm",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Number of cuts",
        "required": true
      }
    ],
    "rule": "cutlist",
    "cta": "Calculate cut plan",
    "layout": "ledger"
  },
  {
    "id": "065",
    "slug": "ceramic-kiln-notes",
    "name": "Pottery Firing Log",
    "category": "Hobbies & crafts",
    "icp": "Potters",
    "job": "Track glaze and firing outcomes",
    "query": "pottery kiln firing log",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "journal",
    "fields": [
      {
        "key": "batch",
        "type": "text",
        "label": "Firing batch",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Firing date",
        "required": true
      },
      {
        "key": "glaze",
        "type": "notes",
        "label": "Glaze and cone",
        "required": false
      },
      {
        "key": "outcome",
        "type": "notes",
        "label": "Result",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record firing",
    "layout": "paper"
  },
  {
    "id": "066",
    "slug": "paint-mixing-swatches",
    "name": "Paint Mix Notebook",
    "category": "Hobbies & crafts",
    "icp": "Artists",
    "job": "Remember pigment recipes",
    "query": "paint mixing recipe app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 4
    },
    "score": 71,
    "flow": "register",
    "fields": [
      {
        "key": "color",
        "type": "text",
        "label": "Target color",
        "required": true
      },
      {
        "key": "formula",
        "type": "text",
        "label": "Mixing recipe",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Pigment ratio or medium",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save swatch recipe",
    "layout": "shelf"
  },
  {
    "id": "067",
    "slug": "film-roll-notes",
    "name": "Analog Film Roll Log",
    "category": "Hobbies & crafts",
    "icp": "Film photographers",
    "job": "Keep rolls and developing notes",
    "query": "film photography log app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 84,
    "flow": "journal",
    "fields": [
      {
        "key": "roll",
        "type": "text",
        "label": "Film roll number",
        "required": true
      },
      {
        "key": "camera",
        "type": "text",
        "label": "Camera",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Loaded or developed",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Exposure and developer",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record film roll",
    "layout": "paper"
  },
  {
    "id": "068",
    "slug": "guitar-practice-repertoire",
    "name": "Guitar Repertoire Log",
    "category": "Hobbies & crafts",
    "icp": "Guitarists",
    "job": "Track practice on pieces",
    "query": "guitar practice log app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "session",
    "fields": [
      {
        "key": "piece",
        "type": "text",
        "label": "Song or exercise",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Minutes practiced",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Practice date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Next technique",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Log practice",
    "layout": "atelier"
  },
  {
    "id": "069",
    "slug": "boardgame-scorepad",
    "name": "Board Game Score Sheets",
    "category": "Hobbies & crafts",
    "icp": "Board game fans",
    "job": "Track custom multi-round scoring",
    "query": "board game score tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "counter",
    "fields": [
      {
        "key": "player",
        "type": "text",
        "label": "Player name",
        "required": true
      },
      {
        "key": "game",
        "type": "text",
        "label": "Game",
        "required": false
      }
    ],
    "rule": "counterValue",
    "cta": "Create score counter",
    "layout": "tiles"
  },
  {
    "id": "070",
    "slug": "seed-germination-journal",
    "name": "Seed Germination Diary",
    "category": "Hobbies & crafts",
    "icp": "Gardeners",
    "job": "Track seed sow and sprouting",
    "query": "seed germination tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "timeline",
    "fields": [
      {
        "key": "seed",
        "type": "text",
        "label": "Seed variety",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Sowing date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Sprouting observation",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record sowing",
    "layout": "timeline"
  },
  {
    "id": "071",
    "slug": "spelling-test-maker",
    "name": "Spelling Practice Cards",
    "category": "Learning & education",
    "icp": "Parents",
    "job": "Practice parent-entered spelling words",
    "query": "spelling test practice app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "flashcard",
    "fields": [
      {
        "key": "word",
        "type": "text",
        "label": "Spelling word",
        "required": true
      },
      {
        "key": "sentence",
        "type": "notes",
        "label": "Example sentence",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add practice card",
    "layout": "atelier"
  },
  {
    "id": "072",
    "slug": "music-scale-practice",
    "name": "Music Scales Checklist",
    "category": "Learning & education",
    "icp": "Music students",
    "job": "Keep scales practice history",
    "query": "piano scales practice tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "session",
    "fields": [
      {
        "key": "scale",
        "type": "text",
        "label": "Scale or exercise",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Minutes practiced",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Practice date",
        "required": true
      }
    ],
    "rule": "sum",
    "cta": "Log scale practice",
    "layout": "atelier"
  },
  {
    "id": "073",
    "slug": "vocabulary-context-notes",
    "name": "Vocabulary Sentence Journal",
    "category": "Learning & education",
    "icp": "Language learners",
    "job": "Remember words with context",
    "query": "vocabulary sentence notebook",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "flashcard",
    "fields": [
      {
        "key": "word",
        "type": "text",
        "label": "Vocabulary word",
        "required": true
      },
      {
        "key": "meaning",
        "type": "text",
        "label": "Meaning",
        "required": true
      },
      {
        "key": "sentence",
        "type": "notes",
        "label": "Your example sentence",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save word card",
    "layout": "atelier"
  },
  {
    "id": "074",
    "slug": "exam-topic-checklist",
    "name": "Exam Syllabus Tracker",
    "category": "Learning & education",
    "icp": "Exam candidates",
    "job": "Prioritize unmastered topics",
    "query": "exam topic checklist app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "checklist",
    "fields": [
      {
        "key": "topic",
        "type": "text",
        "label": "Syllabus topic",
        "required": true
      },
      {
        "key": "subject",
        "type": "text",
        "label": "Subject",
        "required": false
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Confidence or reference",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add study topic",
    "layout": "board"
  },
  {
    "id": "075",
    "slug": "lab-notebook-dates",
    "name": "School Lab Observation Log",
    "category": "Learning & education",
    "icp": "Science students",
    "job": "Record experiment observations",
    "query": "science experiment log app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 4,
      "safe": 5
    },
    "score": 70,
    "flow": "journal",
    "fields": [
      {
        "key": "experiment",
        "type": "text",
        "label": "Experiment",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Observation date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Observation and results",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record lab observation",
    "layout": "paper"
  },
  {
    "id": "076",
    "slug": "phonics-practice-log",
    "name": "Phonics Session Record",
    "category": "Learning & education",
    "icp": "Parents/tutors",
    "job": "Note phonics practice by session",
    "query": "phonics practice tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 5
    },
    "score": 73,
    "flow": "session",
    "fields": [
      {
        "key": "sound",
        "type": "text",
        "label": "Phonics sound or skill",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Practice minutes",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Practice date",
        "required": true
      }
    ],
    "rule": "sum",
    "cta": "Log phonics practice",
    "layout": "atelier"
  },
  {
    "id": "077",
    "slug": "reading-minute-journal",
    "name": "Reading Minutes Journal",
    "category": "Learning & education",
    "icp": "Students",
    "job": "Record focused reading minutes",
    "query": "reading minutes tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "session",
    "fields": [
      {
        "key": "book",
        "type": "text",
        "label": "Book or reading topic",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Minutes read",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Reading date",
        "required": true
      }
    ],
    "rule": "sum",
    "cta": "Log reading",
    "layout": "atelier"
  },
  {
    "id": "078",
    "slug": "tutor-lesson-notes",
    "name": "Private Tutor Lesson Log",
    "category": "Learning & education",
    "icp": "Tutors",
    "job": "Track lesson content and homework",
    "query": "tutor lesson log app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "journal",
    "fields": [
      {
        "key": "student",
        "type": "text",
        "label": "Student",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Lesson date",
        "required": true
      },
      {
        "key": "topic",
        "type": "text",
        "label": "Topic",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Homework or next lesson",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save lesson",
    "layout": "paper"
  },
  {
    "id": "079",
    "slug": "math-error-notebook",
    "name": "Math Mistake Notebook",
    "category": "Learning & education",
    "icp": "Exam students",
    "job": "Revisit common solved mistakes",
    "query": "math error log notebook",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 87,
    "flow": "flashcard",
    "fields": [
      {
        "key": "problem",
        "type": "text",
        "label": "Problem topic",
        "required": true
      },
      {
        "key": "mistake",
        "type": "text",
        "label": "What went wrong",
        "required": true
      },
      {
        "key": "correction",
        "type": "notes",
        "label": "Correct method",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save mistake card",
    "layout": "atelier"
  },
  {
    "id": "080",
    "slug": "study-room-seat-timer",
    "name": "Library Study Session Log",
    "category": "Learning & education",
    "icp": "University students",
    "job": "Record focused study sessions",
    "query": "study time log app",
    "ratings": {
      "intent": 2,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 69,
    "flow": "session",
    "fields": [
      {
        "key": "subject",
        "type": "text",
        "label": "Study subject",
        "required": true
      },
      {
        "key": "minutes",
        "type": "number",
        "label": "Minutes studied",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Session date",
        "required": true
      }
    ],
    "rule": "sum",
    "cta": "Log study session",
    "layout": "atelier"
  },
  {
    "id": "081",
    "slug": "subscription-renewal-offline",
    "name": "Subscription Renewal Notebook",
    "category": "Personal admin & money",
    "icp": "Households",
    "job": "Track manual recurring payments",
    "query": "subscription renewal tracker offline",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "timeline",
    "fields": [
      {
        "key": "service",
        "type": "text",
        "label": "Service",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next renewal date",
        "required": true
      },
      {
        "key": "price",
        "type": "number",
        "label": "Recurring amount",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Track renewal",
    "layout": "timeline"
  },
  {
    "id": "082",
    "slug": "family-budget-envelopes",
    "name": "Cash Envelope Ledger",
    "category": "Personal admin & money",
    "icp": "Cash-budget families",
    "job": "Track balance by spending envelope",
    "query": "cash envelope budget app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 4,
      "safe": 5
    },
    "score": 73,
    "flow": "ledger",
    "fields": [
      {
        "key": "envelope",
        "type": "text",
        "label": "Envelope category",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Deposit or expense amount",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Recorded date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Context",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record envelope entry",
    "layout": "ledger"
  },
  {
    "id": "083",
    "slug": "tax-document-inbox",
    "name": "Tax Document Checklist",
    "category": "Personal admin & money",
    "icp": "Freelancers",
    "job": "Track gathered tax paperwork",
    "query": "tax documents checklist app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 4,
      "safe": 4
    },
    "score": 77,
    "flow": "checklist",
    "fields": [
      {
        "key": "document",
        "type": "text",
        "label": "Tax document name",
        "required": true
      },
      {
        "key": "year",
        "type": "text",
        "label": "Filing year",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Collection status",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add document",
    "layout": "board"
  },
  {
    "id": "084",
    "slug": "security-deposit-evidence",
    "name": "Tenant Move-Out Evidence",
    "category": "Personal admin & money",
    "icp": "Renters",
    "job": "Capture property condition at handover",
    "query": "move out inspection app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 4,
      "safe": 4
    },
    "score": 77,
    "flow": "journal",
    "fields": [
      {
        "key": "room",
        "type": "text",
        "label": "Area or fixture",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Inspection date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Observed condition and photo reference",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record condition",
    "layout": "paper"
  },
  {
    "id": "085",
    "slug": "gift-history",
    "name": "Gift Ideas and History",
    "category": "Personal admin & money",
    "icp": "Families",
    "job": "Remember gifts and recipients",
    "query": "gift tracker app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "journal",
    "fields": [
      {
        "key": "person",
        "type": "text",
        "label": "Recipient",
        "required": true
      },
      {
        "key": "gift",
        "type": "text",
        "label": "Gift",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Given date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Occasion",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Remember gift",
    "layout": "paper"
  },
  {
    "id": "086",
    "slug": "charity-donation-ledger",
    "name": "Donation Receipt Ledger",
    "category": "Personal admin & money",
    "icp": "Donors",
    "job": "Record giving and receipt dates",
    "query": "charitable donation tracker",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 4,
      "safe": 5
    },
    "score": 70,
    "flow": "ledger",
    "fields": [
      {
        "key": "recipient",
        "type": "text",
        "label": "Charity name",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Giving date",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Donation amount",
        "required": true
      },
      {
        "key": "ref",
        "type": "text",
        "label": "Receipt reference",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record donation",
    "layout": "ledger"
  },
  {
    "id": "087",
    "slug": "shared-cost-split-offline",
    "name": "Trip Cost Split Notebook",
    "category": "Personal admin & money",
    "icp": "Travel groups",
    "job": "Settle manual shared expenses",
    "query": "group travel expenses split",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 4
    },
    "score": 71,
    "flow": "calculator",
    "fields": [
      {
        "key": "event",
        "type": "text",
        "label": "Trip or event",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Shared expense amount",
        "required": true
      },
      {
        "key": "people",
        "type": "number",
        "label": "Number of people",
        "required": true
      }
    ],
    "rule": "split",
    "cta": "Calculate split",
    "layout": "ledger"
  },
  {
    "id": "088",
    "slug": "cash-savings-goals",
    "name": "Cash Savings Jar",
    "category": "Personal admin & money",
    "icp": "Cash savers",
    "job": "Log deposits toward goal",
    "query": "savings goal tracker offline",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "progress",
    "fields": [
      {
        "key": "goal",
        "type": "text",
        "label": "Savings goal",
        "required": true
      },
      {
        "key": "target",
        "type": "number",
        "label": "Target amount",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Saved so far",
        "required": true
      }
    ],
    "rule": "progress",
    "cta": "Create savings goal",
    "layout": "hero"
  },
  {
    "id": "089",
    "slug": "bill-proof-record",
    "name": "Bill Payment Evidence",
    "category": "Personal admin & money",
    "icp": "Households",
    "job": "Log bills and last-paid confirmations",
    "query": "bill payment tracker offline",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "timeline",
    "fields": [
      {
        "key": "bill",
        "type": "text",
        "label": "Bill or account",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Due date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Proof of payment",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Track bill",
    "layout": "timeline"
  },
  {
    "id": "090",
    "slug": "inventory-insurance",
    "name": "Personal Property Inventory",
    "category": "Personal admin & money",
    "icp": "Homeowners",
    "job": "Catalog belongings for recovery records",
    "query": "home contents inventory insurance",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Possession or asset",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Quantity",
        "required": true
      },
      {
        "key": "room",
        "type": "text",
        "label": "Room",
        "required": false
      },
      {
        "key": "value",
        "type": "number",
        "label": "Estimated replacement cost",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Catalog possession",
    "layout": "shelf"
  },
  {
    "id": "091",
    "slug": "bike-tyre-pressure",
    "name": "Bike Tire Pressure Log",
    "category": "Additional specialist wedges",
    "icp": "Cyclists",
    "job": "Record tire setup by riding surface",
    "query": "bike tire pressure log",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 5
    },
    "score": 74,
    "flow": "measure",
    "fields": [
      {
        "key": "bike",
        "type": "text",
        "label": "Bike or tire",
        "required": true
      },
      {
        "key": "pressure",
        "type": "number",
        "label": "Measured pressure",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Reading date",
        "required": true
      },
      {
        "key": "surface",
        "type": "text",
        "label": "Riding surface",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Log tire setup",
    "layout": "ledger"
  },
  {
    "id": "092",
    "slug": "ski-gear-service",
    "name": "Ski Gear Service Log",
    "category": "Additional specialist wedges",
    "icp": "Skiers",
    "job": "Track edge and wax servicing",
    "query": "ski maintenance tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "timeline",
    "fields": [
      {
        "key": "gear",
        "type": "text",
        "label": "Ski or snowboard",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Next service date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Edge or wax history",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Track gear service",
    "layout": "timeline"
  },
  {
    "id": "093",
    "slug": "wedding-vendor-deposits",
    "name": "Wedding Vendor Deposit Log",
    "category": "Additional specialist wedges",
    "icp": "Couples",
    "job": "Track venue and vendor deposits",
    "query": "wedding payment tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 3,
      "fast": 4,
      "safe": 4
    },
    "score": 77,
    "flow": "ledger",
    "fields": [
      {
        "key": "vendor",
        "type": "text",
        "label": "Vendor",
        "required": true
      },
      {
        "key": "amount",
        "type": "number",
        "label": "Deposit paid",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Payment date",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Contract reference",
        "required": false
      }
    ],
    "rule": "sum",
    "cta": "Record vendor deposit",
    "layout": "ledger"
  },
  {
    "id": "094",
    "slug": "travel-medical-documents",
    "name": "Travel Health Document List",
    "category": "Additional specialist wedges",
    "icp": "Traveling families",
    "job": "Inventory required travel health documents without advice",
    "query": "travel vaccine document checklist",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 4,
      "safe": 3
    },
    "score": 64,
    "flow": "checklist",
    "fields": [
      {
        "key": "document",
        "type": "text",
        "label": "Required travel health document",
        "required": true
      },
      {
        "key": "traveler",
        "type": "text",
        "label": "Traveler",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Original issuer details",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add document",
    "layout": "board"
  },
  {
    "id": "095",
    "slug": "home-plant-cuttings",
    "name": "Plant Propagation Journal",
    "category": "Additional specialist wedges",
    "icp": "Plant collectors",
    "job": "Track cuttings and rooted outcomes",
    "query": "plant propagation tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 5,
      "safe": 4
    },
    "score": 84,
    "flow": "journal",
    "fields": [
      {
        "key": "plant",
        "type": "text",
        "label": "Plant cutting",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Propagation date",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "Rooting observation",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Record cutting",
    "layout": "paper"
  },
  {
    "id": "096",
    "slug": "classroom-materials-checkout",
    "name": "Classroom Materials Ledger",
    "category": "Additional specialist wedges",
    "icp": "Teachers",
    "job": "Track loaned classroom resources",
    "query": "classroom equipment checkout",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "item",
        "type": "text",
        "label": "Classroom resource",
        "required": true
      },
      {
        "key": "borrower",
        "type": "text",
        "label": "Borrower",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Quantity borrowed",
        "required": true
      },
      {
        "key": "note",
        "type": "notes",
        "label": "Expected return",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Loan materials",
    "layout": "board"
  },
  {
    "id": "097",
    "slug": "freelance-retainer-hours",
    "name": "Retainer Hours Ledger",
    "category": "Additional specialist wedges",
    "icp": "Freelance developers",
    "job": "Reconcile prepaid hours against work",
    "query": "retainer hours tracker",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "calculator",
    "fields": [
      {
        "key": "client",
        "type": "text",
        "label": "Client or retainer",
        "required": true
      },
      {
        "key": "paidHours",
        "type": "number",
        "label": "Prepaid hours",
        "required": true
      },
      {
        "key": "usedHours",
        "type": "number",
        "label": "Hours delivered",
        "required": true
      }
    ],
    "rule": "difference",
    "cta": "Reconcile hours",
    "layout": "ledger"
  },
  {
    "id": "098",
    "slug": "coffee-roast-journal",
    "name": "Home Coffee Brew Journal",
    "category": "Additional specialist wedges",
    "icp": "Coffee hobbyists",
    "job": "Record dose and flavor results per bean",
    "query": "coffee brew log app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 4,
      "fast": 5,
      "safe": 5
    },
    "score": 77,
    "flow": "journal",
    "fields": [
      {
        "key": "bean",
        "type": "text",
        "label": "Coffee bean or roast",
        "required": true
      },
      {
        "key": "date",
        "type": "date",
        "label": "Brew date",
        "required": true
      },
      {
        "key": "recipe",
        "type": "notes",
        "label": "Dose grind and taste",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Save brew note",
    "layout": "paper"
  },
  {
    "id": "099",
    "slug": "small-event-rsvp",
    "name": "Offline Guest RSVP Ledger",
    "category": "Additional specialist wedges",
    "icp": "Event organizers",
    "job": "Track invite and attendance manually",
    "query": "guest RSVP tracker app",
    "ratings": {
      "intent": 3,
      "pay": 3,
      "repeat": 3,
      "fast": 5,
      "safe": 4
    },
    "score": 71,
    "flow": "checklist",
    "fields": [
      {
        "key": "guest",
        "type": "text",
        "label": "Guest name",
        "required": true
      },
      {
        "key": "event",
        "type": "text",
        "label": "Event",
        "required": true
      },
      {
        "key": "notes",
        "type": "notes",
        "label": "RSVP or dietary note",
        "required": false
      }
    ],
    "rule": "none",
    "cta": "Add invitation",
    "layout": "board"
  },
  {
    "id": "100",
    "slug": "craft-supply-reorder",
    "name": "Craft Supply Reorder List",
    "category": "Additional specialist wedges",
    "icp": "Hobby sellers",
    "job": "Track consumables and reorder thresholds",
    "query": "craft supplies inventory app",
    "ratings": {
      "intent": 4,
      "pay": 4,
      "repeat": 4,
      "fast": 4,
      "safe": 4
    },
    "score": 80,
    "flow": "inventory",
    "fields": [
      {
        "key": "supply",
        "type": "text",
        "label": "Material",
        "required": true
      },
      {
        "key": "quantity",
        "type": "number",
        "label": "Units available",
        "required": true
      },
      {
        "key": "threshold",
        "type": "number",
        "label": "Reorder threshold",
        "required": true
      },
      {
        "key": "supplier",
        "type": "text",
        "label": "Supplier",
        "required": false
      }
    ],
    "rule": "reorder",
    "cta": "Track material",
    "layout": "board"
  }
];
export function findIdea(slug:string): IdeaSpec | undefined {return ideaSpecs.find((idea)=>idea.slug===slug);}
