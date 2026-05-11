const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Client = require('../models/Client');

// Create a client
router.post('/', auth, async (req, res) => {
    try {
        const { name, email, projectName } = req.body;

        const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

        const client = new Client({
            freelancer: req.user.id,
            name,
            email,
            projectName,
            slug
        });

        await client.save();
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all clients for logged in freelancer
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find({ freelancer: req.user.id });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get single client portal by slug (public, no auth)
router.get('/portal/:slug', async (req, res) => {
    try {
        const client = await Client.findOne({ slug: req.params.slug });
        if (!client) return res.status(404).json({ msg: 'Portal not found' });
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add update to client
router.post('/:id/updates', auth, async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, freelancer: req.user.id });
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        client.updates.unshift({ text: req.body.text });
        await client.save();
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update invoice
router.put('/:id/invoice', auth, async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, freelancer: req.user.id });
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        client.invoice = { ...client.invoice, ...req.body };
        await client.save();
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update project status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, freelancer: req.user.id });
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        client.status = req.body.status;
        await client.save();
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;