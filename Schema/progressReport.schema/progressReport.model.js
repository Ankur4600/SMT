const mongoose = require("mongoose")

const progressReportSchema = new mongoose.Schema({
  // Required References
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: [true, 'Site reference is required']
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supervisor reference is required']
  },
//   project: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Project',
//     required: true
//   },

  // Report Metadata
  reportDate: {
    type: Date,
    default: Date.now,
    required: true
  },
//   reportPeriod: {
//     from: { type: Date, required: true },
//     to: { type: Date, required: true }
//   },

  // Daily Progress
  dailyUpdates: [{
    date: { type: Date, required: true },
    workDescription: { type: String, required: true },
    completedTasks: [String],
    photos: [{
      url: String,
      caption: String,
      timestamp: { type: Date, default: Date.now }
    }],
    // workforce: {
    //   laborers: Number,
    //   skilledWorkers: Number,
    //   subcontractors: Number
    // }
  }],

  // Materials Tracking
  materialsUsed: [{
    material: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'bags', 'liters', 'units'], required: true },
    supplier: String
  }],

  // Milestones
//   achievedMilestones: [{
//     name: String,
//     achievedDate: Date,
//     percentageCompleted: { type: Number, min: 0, max: 100 }
//   }],

  // Issues & Risks
  issues: [{
    description: String,
    category: { type: String, enum: ['safety', 'quality', 'schedule', 'other'] },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    resolutionStatus: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' }
  }],

  // Safety Compliance
  safetyChecks: {
    incidents: Number,
    inspections: [{
      type: { type: String, enum: ['scaffolding', 'electrical', 'ppe', 'equipment'] },
      passed: Boolean,
      notes: String
    }]
  },

  // Verification
//   verifiedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   verificationDate: Date,

  // Custom Fields
//   additionalNotes: String,
//   nextPeriodPlan: String,

  // System Fields
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  }
}, { 
  timestamps: true,
});

const Progress = mongoose.model("Progress",progressReportSchema);
module.exports = Progress
















// {
//   "site": "65a1b2c3d4e5f6a7b8c9d0e1",       
//   "supervisor": "65a1b2c3d4e5f6a7b8c9d0e2", 
  
//    // Daily Progress (at least 1 entry required)
//   "dailyUpdates": [
//     {
//       "date": "2023-11-20",                // ISO date string (required)
//       "workDescription": "Completed foundation work", // String (required)
//       "completedTasks": ["Excavation", "Rebar installation"],
//       "photos": [
//         {
//           "url": "https://cloud-storage.com/foundation.jpg",
//           "caption": "West wall foundation"
//         }
//       ]
//     }
//   ],

//   // Materials Used (optional)
//   "materialsUsed": [
//     {
//       "material": "Cement",                // String (required)
//       "quantity": 50,                      // Number (required)
//       "unit": "bags",                      // enum: kg/bags/liters/units (required)
//       "supplier": "ABC Suppliers"           // String (optional)
//     }
//   ],

//   // Issues (optional)
//   "issues": [
//     {
//       "description": "Concrete delivery delay", // String (required)
//       "category": "schedule",               // enum: safety/quality/schedule/other
//       "severity": "medium",                 // enum: low/medium/high/critical
//       "resolutionStatus": "open"            // enum: open/in-progress/resolved
//     }
//   ],

//   // Safety Checks (optional)
//   "safetyChecks": {
//     "incidents": 1,                        // Number (default: 0)
//     "inspections": [
//       {
//         "type": "ppe",                     // enum: scaffolding/electrical/ppe/equipment
//         "passed": true,                    // Boolean (required)
//         "notes": "All workers had helmets"  // String (optional)
//       }
//     ]
//   },

//   // System Field (optional, defaults to 'draft')
//   "status": "submitted"                    // enum: draft/submitted/approved/rejected
// }