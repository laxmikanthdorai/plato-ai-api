require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging: Log API Key (This is temporary, remove after testing)
console.log("Using OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "MISSING");

app.post("/chat", async (req, res) => {
    if (!req.body || !req.body.messages) {
        return res.status(400).json({ error: "Missing 'messages' in request body" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: req.body.messages
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "API Request Failed", details: error.message });
    }
});

// ✅ Add a GET route to check if API is running
app.get("/", (req, res) => {
    res.send("Plato AI API is running!");
});

// ✅ Ensure the API listens on the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
