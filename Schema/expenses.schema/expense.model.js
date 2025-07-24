const mongoose = require('mongoose');
const {Schema} = mongoose;

const expenseSchema = new Schema({
  supervisor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Supervisor',
    required: true
  },
  site_name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['travel', 'materials', 'food', 'lodging', 'equipment', 'other'] 
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  receiptURL: {
    type: String,
    required: false 
  },
  status: {
    type: String,
    // required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComment: {
    type: String,
    required: false
  }
}, {
  timestamps: true 
});

const Expense = mongoose.model("Expense",expenseSchema)

module.exports = Expense;