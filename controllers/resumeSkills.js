import db from "../db.js";
export const createSkill = async (req, res) => {
  try {
    const { skill, level } = req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO skills ( skill, level, resume_id, user_id)
        VALUES (?, ?, ?, ?)
      `;

    const values = [skill, level, resumeId, userId];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating skill:", err);
        return res.status(500).json({ error: "Could not create the skill" });
      }

      res.status(201).json({ message: "skill created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "skill created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the skill" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the skill" });
  }
};

export const updateSkillByUserAndSkillId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const skillId = req.params.skillId;
    const { skill, level } = req.body;

    // Ensure that the skill belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM skills WHERE id = ?";
    const ownershipValues = [skillId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not update the skill" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the skill
      const updateQuery = `
          UPDATE skills
          SET skill = COALESCE(?, skill), level=COALESCE(?, level)
          WHERE id=?
        `;

      const values = [skill, level, skillId];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating skill:", updateErr);
          return res.status(500).json({ error: "Could not update the skill" });
        }

        res.json({ message: "skill updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the skill" });
  }
};

export const getSkillByUserAndSkillId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const skillId = req.params.skillId;

    // Ensure that the skill belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM skills WHERE id = ? AND resume_id = ?";
    const ownershipValues = [skillId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the skill" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the skill if the user owns it
      const selectQuery =
        "SELECT * FROM skills WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching skill:", selectErr);
          return res.status(500).json({ error: "Could not fetch the skill" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "skill not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the skill" });
  }
};
