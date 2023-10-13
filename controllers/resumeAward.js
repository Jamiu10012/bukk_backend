import db from "../db.js";
export const createAward = async (req, res) => {
  try {
    const { award_title, award_issuer, link, date, description } = req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO award ( award_title, award_issuer, link, date, description, resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?,?)
      `;

    const values = [
      award_title,
      award_issuer,
      link,
      date,
      description,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating award:", err);
        return res.status(500).json({ error: "Could not create the award" });
      }

      res.status(201).json({ message: "award created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "award created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the award" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the award" });
  }
};

export const updateAwardByUserAndAwardId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const awardId = req.params.awardId;
    const { award_title, award_issuer, link, date, description } = req.body;

    // Ensure that the award belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM award WHERE id = ?";
    const ownershipValues = [awardId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not update the award" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the award
      const updateQuery = `
          UPDATE award
          SET award_title = COALESCE(?, award_title), award_issuer=COALESCE(?, award_issuer), 
        link=COALESCE(?, link), date=COALESCE(?, date), 
         description=COALESCE(?, description)
          WHERE id=?
        `;

      const values = [
        award_title,
        award_issuer,
        link,
        date,
        description,
        awardId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating award:", updateErr);
          return res.status(500).json({ error: "Could not update the award" });
        }

        res.json({ message: "award updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the award" });
  }
};

export const getAwardByUserAndAwardId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const awardId = req.params.awardId;

    // Ensure that the award belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM project WHERE id = ? AND resume_id = ?";
    const ownershipValues = [awardId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the project" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the project if the user owns it
      const selectQuery =
        "SELECT * FROM project WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching project:", selectErr);
          return res.status(500).json({ error: "Could not fetch the project" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "project not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the project" });
  }
};
