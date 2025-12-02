const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');
const Listing = require('../models/upload'); // your property model

const FLW_SECRET_KEY = "LhQ6zjwLvbLJXxPEWNtyoCXYusAGOkQE";
const REDIRECT_URL = "https://scillar.netlify.app/confirm";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "scillar45@gmail.com",
        pass: "$cill@r2025"
    }
});

router.post('/pay', async (req, res) => {
    try {
        const { propertyId, email, currency = "NGN" } = req.body;

        if (!propertyId || !email) return res.status(400).json({ message: "Missing propertyId or email" });

        // Fetch property
        const property = await Listing.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const amount = property.price;
        const type = property.type || "buy";

        // Create payment payload
        const payload = {
            tx_ref: "scillar_" + Date.now(),
            amount,
            currency,
            redirect_url: REDIRECT_URL,
            customer: { email },
            customizations: {
                title: "scillar Property Payment",
                description: `Payment for property: ${property.title}`
            },
            subaccounts: [
                { id: type === "buy" ? "RS_A83B219334DD5EC356BA7DB99E38933F" : "RS_08C55A89BC9509676E1A38FC95B4BC93" }
            ]
        };

        // Create payment in Flutterwave
        const response = await axios.post("https://api.flutterwave.com/v3/payments", payload, {
            headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` }
        });

        const paymentLink = response.data.data.link;

        // Wait for the payment to be completed? Usually, you would handle a webhook to know completion.
        // But for demo purposes, let's verify immediately (this won't be paid yet if user hasn't completed)
        // Use tx_ref to verify once payment is complete
        // const verification = await axios.get(`https://api.flutterwave.com/v3/transactions/tx_ref/verify`, {
        //   headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` }
        // });

        // Send email with payment link (receipt before completion)
        await transporter.sendMail({
            from: '"scillar Real Estate" <scillar45@gmail.com>',
            to: email,
            subject: "Your scillar Payment Link & Receipt",
            html: `
        <h2>Payment Details</h2>
        <p>Property: ${property.title}</p>
        <p>Amount: ${currency} ${amount}</p>
        <p>Transaction Reference: ${payload.tx_ref}</p>
        <p>Click here to complete your payment: <a href="${paymentLink}">${paymentLink}</a></p>
        <br><p>Regards,<br>scillar Team</p>
      `
        });

        res.status(200).json({
            status: "success",
            payment_link: paymentLink,
            message: "Payment created and receipt sent"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
