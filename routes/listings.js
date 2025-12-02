const express = require('express');
const router = express.Router();
const listing = require('../models/upload');

// CREATE LISTING
router.post('/', async (req, res) => {
    try {
        const data = await listing.create(req.body);

        // broadcast real-time
        if (req.app.locals.primus) {
            req.app.locals.primus.write({ event: 'new_listing', data });
        }

        res.status(201).json({ message: "Uploaded", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// RANDOM 40
router.get('/', async (req, res) => {
    try {
        const data = await listing.aggregate([
            { $sample: { size: 40 } }
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const data = await listing.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// SEARCH
router.post('/search', async (req, res) => {
    try {
        const term = req.body.search;

        const data = await listing.find({
            listing_property: { $regex: term, $options: 'i' },
            $or: [
                { location: { $regex: term, $options: 'i' } },
                { state: { $regex: term, $options: 'i' } },
                { city: { $regex: term, $options: 'i' } },
                { country: { $regex: term, $options: 'i' } }
            ]
        });

        // Real-time broadcast
        if (req.app.locals.primus) {
            req.app.locals.primus.write({ event: 'search', data });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
