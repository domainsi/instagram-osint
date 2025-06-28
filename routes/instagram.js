
const express = require("express");
const router = express.Router();
const { scrapeInstagram } = require("../controllers/instagramController");

router.get("/", (req, res) => {
    res.render("index");
});

router.post("/scan", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send("Username is required");

    try {
        const result = await scrapeInstagram(username);
        res.render("index", { result });
    } catch (error) {
        res.status(500).send("Scraping failed. " + error.message);
    }
});

module.exports = router;
