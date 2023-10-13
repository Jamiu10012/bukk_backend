import db from "../db.js";
export const createResumesummary = async (req, res) => {
  try {
    const { summary } = req.body;
    const userId = req.params.userId;
    const insertQuery = `
        INSERT INTO profile_summary (summary, user_id)
        VALUES (?,?)
      `;

    const values = [summary, userId];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating resume:", err);
        return res.status(500).json({ error: "Could not create the resume" });
      }

      res.status(201).json({ message: "summary created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "Resume created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the resume" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the resume" });
  }
};

export const updateResumeByUserAndResumeId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const { firstname } = req.body;

    // Ensure that the resume belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM resume WHERE id = ?";
    const ownershipValues = [resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not update the resume" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the resume
      const updateQuery = `
          UPDATE resume
          SET firstname=?, lastname=?, middlename=?, email=?, contact_number=?, country=?, city=? , profile_picture=?
          WHERE id=?
        `;

      const values = [
        firstname,
        lastname,
        middlename !== undefined ? middlename : null,
        email,
        contact_number,
        country,
        city,
        profile_picture,
        resumeId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating resume:", updateErr);
          return res.status(500).json({ error: "Could not update the resume" });
        }

        res.json({ message: "Resume updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the resume" });
  }
};
