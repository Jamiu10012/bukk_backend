import db from "../db.js";
export const createCertification = async (req, res) => {
  try {
    const { certificate_title, certificate_issuer, reason, date, description } =
      req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO certification ( certificate_title, certificate_issuer, reason, date, description, resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?,?)
      `;

    const values = [
      certificate_title,
      certificate_issuer,
      reason,
      date,
      description,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating certification:", err);
        return res
          .status(500)
          .json({ error: "Could not create the certification" });
      }

      res.status(201).json({ message: "certification created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "certification created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the certification" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the certification" });
  }
};

export const updateCertificationByUserAndCertificationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const certificationId = req.params.certificationId;
    const { certificate_title, certificate_issuer, reason, date, description } =
      req.body;

    // Ensure that the certification belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM certification WHERE id = ?";
    const ownershipValues = [certificationId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not update the certification" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the certification
      const updateQuery = `
          UPDATE certification
          SET certificate_title = COALESCE(?, certificate_title), certificate_issuer=COALESCE(?, certificate_issuer), 
        reason=COALESCE(?, reason), date=COALESCE(?, date), 
         description=COALESCE(?, description)
          WHERE id=?
        `;

      const values = [
        certificate_title,
        certificate_issuer,
        reason,
        date,
        description,
        certificationId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating certification:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the certification" });
        }

        res.json({ message: "certification updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the certification" });
  }
};

export const getCertificationByUserAndCertificationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const certificationId = req.params.certificationId;

    // Ensure that the certification belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM project WHERE id = ? AND resume_id = ?";
    const ownershipValues = [certificationId, resumeId];

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
