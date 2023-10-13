import db from "../db.js";
export const createReference = async (req, res) => {
  try {
    const { referent_full_name, place_of_work, contact_number, email } =
      req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO reference ( referent_full_name, place_of_work	, contact_number, email,  resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?)
      `;

    const values = [
      referent_full_name,
      place_of_work,
      contact_number,
      email,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating reference:", err);
        return res
          .status(500)
          .json({ error: "Could not create the reference" });
      }

      res.status(201).json({ message: "reference created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "reference created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the reference" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the reference" });
  }
};

export const updateReferenceByUserAndReferenceId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const referenceId = req.params.referenceId;
    const { referent_full_name, place_of_work, contact_number, email } =
      req.body;

    // Ensure that the reference belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM reference WHERE id = ?";
    const ownershipValues = [referenceId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not update the reference" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the reference
      const updateQuery = `
          UPDATE reference
          SET referent_full_name = COALESCE(?, referent_full_name), place_of_work	=COALESCE(?, place_of_work	), 
         contact_number=COALESCE(?, contact_number), email=COALESCE(?, email)
          WHERE id=?
        `;

      const values = [
        referent_full_name,
        place_of_work,
        contact_number,
        email,
        referenceId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating reference:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the reference" });
        }

        res.json({ message: "reference updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the reference" });
  }
};

export const getReferenceByUserAndReferenceId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const referenceId = req.params.referenceId;

    // Ensure that the reference belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM reference WHERE id = ? AND resume_id = ?";
    const ownershipValues = [referenceId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the reference" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the reference if the user owns it
      const selectQuery =
        "SELECT * FROM reference WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching reference:", selectErr);
          return res
            .status(500)
            .json({ error: "Could not fetch the reference" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "reference not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the reference" });
  }
};
