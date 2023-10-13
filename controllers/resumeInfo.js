import db from "../db.js";
export const createResumeInfo = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      middlename,
      email,
      contact_number,
      country,
      city,
      profile_picture,
      summary,
      hobby,
    } = req.body;
    const userId = req.params.userId;
    const insertQuery = `
        INSERT INTO resume (firstname, lastname, middlename, email, contact_number, country, city, user_id, profile_picture, summary, hobby)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
      `;

    const values = [
      firstname,
      lastname,
      middlename !== undefined ? middlename : null,
      email,
      contact_number,
      country,
      city,
      userId,
      profile_picture,
      summary !== undefined ? summary : null,
      hobby,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating resume:", err);
        return res.status(500).json({ error: "Could not create the resume" });
      }

      res.status(201).json({ message: "Resume created successfully" });
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
    const {
      firstname,
      lastname,
      middlename,
      email,
      contact_number,
      country,
      city,
      profile_picture,
      summary,
      hobby,
    } = req.body;

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
          SET firstname = COALESCE(?, firstname), lastname=COALESCE(?, lastname), 
          middlename=COALESCE(?, middlename), email=COALESCE(?, email), contact_number=COALESCE(?, contact_number), 
          country=COALESCE(?, country), city=COALESCE(?, city) , profile_picture=COALESCE(?, profile_picture), summary=COALESCE(?, summary), hobby=COALESCE(?, hobby)
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
        summary,
        hobby,
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

export const getResumeByUserAndResumeId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;

    // Ensure that the resume belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM resume WHERE id = ?";
    const ownershipValues = [resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the resume" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the resume if the user owns it
      const selectQuery = "SELECT * FROM resume WHERE id = ?";
      const values = [resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching resume:", selectErr);
          return res.status(500).json({ error: "Could not fetch the resume" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Resume not found" });
        }

        const resume = results[0];
        res.json(resume);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the resume" });
  }
};
