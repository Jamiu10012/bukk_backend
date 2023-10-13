import db from "../db.js";
export const createLanguage = async (req, res) => {
  try {
    const { language, level } = req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO language ( language, level, resume_id, user_id)
        VALUES (?, ?, ?, ?)
      `;

    const values = [language, level, resumeId, userId];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating language:", err);
        return res.status(500).json({ error: "Could not create the language" });
      }

      res.status(201).json({ message: "language created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "language created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the language" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the language" });
  }
};

export const updatelanguageByUserAndlanguageId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const languageId = req.params.languageId;
    const { language, level } = req.body;

    // Ensure that the language belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM language WHERE id = ?";
    const ownershipValues = [languageId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not update the language" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the language
      const updateQuery = `
          UPDATE language
          SET language = COALESCE(?, language), level=COALESCE(?, level)
          WHERE id=?
        `;

      const values = [language, level, languageId];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating language:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the language" });
        }

        res.json({ message: "language updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the language" });
  }
};

export const getlanguageByUserAndlanguageId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const languageId = req.params.languageId;

    // Ensure that the language belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM language WHERE id = ? AND resume_id = ?";
    const ownershipValues = [languageId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the language" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the language if the user owns it
      const selectQuery =
        "SELECT * FROM language WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching language:", selectErr);
          return res
            .status(500)
            .json({ error: "Could not fetch the language" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "language not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the language" });
  }
};
