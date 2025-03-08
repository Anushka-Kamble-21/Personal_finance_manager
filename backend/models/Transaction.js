const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["income", "expense", "savings"] },
    amount: { type: Number, required: true },
    category: { type: String, required: true, enum: ["Food", "Rent", "Travel", "Entertainment", "Other", "Education"]},
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
