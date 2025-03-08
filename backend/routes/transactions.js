const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authenticateUser = require("../middleware/authMiddleware");

// Add a new transaction
router.post("/", authenticateUser, async (req, res) => {
    try {
        const { title, type, amount, category, date } = req.body;

        // Debugging logs
        console.log("Request Body:", req.body);
        console.log("User ID from token:", req.user.userId);

        // Validate type
        if (!["income", "expense","savings"].includes(type)) {
            return res.status(400).json({ error: "Type must be 'income' or 'expense'" });
        }

        const transaction = new Transaction({ 
            userId: req.user.userId, 
            title,
            type, 
            amount, 
            category, 
            date 
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Get all transactions for logged-in user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Update a transaction
router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { title, type, amount, category, date } = req.body;

        // Validate type
        if (!["income", "expense", "savings"].includes(type)) {
            return res.status(400).json({ error: "Type must be 'income' or 'expense'" });
        }

        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId }, 
            { title, type, amount, category, date },
            { new: true } // Return updated transaction
        );

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Delete a transaction
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;