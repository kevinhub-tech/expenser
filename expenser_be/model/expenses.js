const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    totalAmount: Number,
    savingPercent: Number,
    estiBill: Number
}, { collection: 'expenser' })

module.exports = mongoose.model("Expense", expenseSchema);