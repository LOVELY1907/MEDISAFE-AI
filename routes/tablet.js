const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");
const Tablet = require("../models/Tablet");
const { generateText } = require("../services/geminiServices");

const router = express.Router();

/* ----------------------------------
   SEARCH TABLETS (OpenFDA)
----------------------------------- */
router.get("/search", async (req, res) => {
  try {
    const name = req.query.name;
    if (!name || name.length < 2) {
      return res.json([]);
    }

    const encodedName = encodeURIComponent(name);

    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${encodedName}+OR+openfda.generic_name:${encodedName})&limit=5`
    );

    return res.json(response.data.results || []);
  } catch (error) {
    if (error.response?.status === 404) return res.json([]);
    console.error("OpenFDA search error:", error.message);
    return res.json([]);
  }
});

/* ----------------------------------
   GET PURPOSES
----------------------------------- */
router.get("/purpose",auth, async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.json([]);

    const encodedName = encodeURIComponent(name);

    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${encodedName}+OR+openfda.generic_name:${encodedName})&limit=1`
    );

    const result = response.data?.results?.[0];

    let rawText =
      result?.indications_and_usage?.[0] ||
      result?.purpose?.[0] ||
      "";

    if (!rawText) return res.json([]);

    let purposes = rawText
      .replace(/Uses\s*[:]?/i, "")
      .split(/•|\n|\./)
      .map(p => p.trim())
      .filter(p => p.length > 5)
      .slice(0, 10);

    res.json(purposes);
  } catch (error) {
    if (error.response?.status === 404) return res.json([]);
    console.error("Purpose error:", error.message);
    res.status(500).json([]);
  }
});

/* ----------------------------------
   SAVE TABLET
----------------------------------- */
router.post("/add",auth, async (req, res) => {
  try {
    const { tabletName, purposes } = req.body;

    if (!tabletName || !Array.isArray(purposes) || purposes.length === 0) {
      return res.status(400).json({ error: "Tablet name or purposes missing" });
    }

    const tablet = await Tablet.create({
      tabletName,
      purposes,
      UserId: req.userId,
      isActive: true
    });

    res.json(tablet);
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: "Failed to save tablet" });
  }
});

/* ----------------------------------
   GET USER TABLETS
----------------------------------- */
router.get("/my", auth, async (req, res) => {
  try {
    const tablets = await Tablet.findAll({
      where: { UserId: req.userId, isActive: true },
      order: [["createdAt", "DESC"]]
    });

    res.json(tablets);
  } catch (err) {
    console.error("Fetch tablets error:", err);
    res.status(500).json({ error: "Failed to fetch tablets" });
  }
});

/* ----------------------------------
   TABLET ANALYSIS (Gemini)
----------------------------------- */
router.post("/analysis", auth, async (req, res) => {
  try {
    const { tabletName, purposes } = req.body;

    if (!tabletName || !purposes?.length) {
      return res.status(400).json({ error: "Missing data" });
    }

    const prompt = `
Tablet: ${tabletName}
Purposes: ${purposes.join(", ")}

Give:
1. Advantages
2. Side effects
Short bullet points.
`;

    const result = await generateText(prompt);

    res.json({ result });

  } catch (err) {
    console.error("GEMINI ERROR FULL:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
});
/* ----------------------------------
   TABLET INTERACTION (Gemini)
----------------------------------- */
router.post("/interaction",auth, async (req, res) => {
  try {
    const { tablets } = req.body;

    if (!tablets || tablets.length < 2) {
      return res.status(400).json({ error: "Need 2+ tablets" });
    }

    const prompt = `
Tablets taken together:
${tablets.join(", ")}

Explain:
- Possible interactions
- Safety warnings
- General advice

No diagnosis.
`;

    const result = await generateText(prompt);

    res.json({ result });

  } catch (err) {
    console.error("Interaction ERROR:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

/* ----------------------------------
   SOFT DELETE
----------------------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Tablet.update(
      { isActive: false },
      { where: { id: req.params.id, UserId: req.userId } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;