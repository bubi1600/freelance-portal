const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    projectName: { type: String, required: true },
    status: { type: String, default: 'In Progress' },
    slug: { type: String, required: true, unique: true },
    updates: [{ text: String, createdAt: { type: Date, default: Date.now } }],
    files: [{ name: String, url: String, createdAt: { type: Date, default: Date.now } }],
    invoice: {
        amount: Number,
        dueDate: Date,
        paid: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);