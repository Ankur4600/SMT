const mongoose = require("mongoose");
const {Schema}= mongoose;
const siteSchema = new Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    // maxlength: [100, 'Site name cannot exceed 100 characters']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  supervisorId: {
    type: Schema.Types.ObjectId,
    ref: 'Supervisor',
  
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'under_construction', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Cannot be modified after creation
  }
})

const Site = mongoose.model("Site",siteSchema)
module.exports = Site;
