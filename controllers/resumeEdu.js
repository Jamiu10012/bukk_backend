import db from "../db.js";
export const createEducation = async (req, res) => {
  try {
    const { schoolname, location, degree, course, start_date, end_date } =
      req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO education ( schoolname, location, degree, course, start_date, end_date, resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?,?,?)
      `;

    const values = [
      schoolname,
      location,
      degree,
      course,
      start_date,
      end_date,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating education:", err);
        return res
          .status(500)
          .json({ error: "Could not create the education" });
      }

      res.status(201).json({ message: "education created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "education created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the education" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the education" });
  }
};

export const updateEducationByUserAndEducationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const educationId = req.params.educationId;
    const { schoolname, location, degree, course, start_date, end_date } =
      req.body;

    // Ensure that the education belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM education WHERE id = ?";
    const ownershipValues = [educationId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not update the education" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the education
      const updateQuery = `
          UPDATE education
          SET schoolname = COALESCE(?, schoolname), location=COALESCE(?, location), 
         degree=COALESCE(?, degree), course=COALESCE(?, course), start_date=COALESCE(?, start_date), 
         end_date=COALESCE(?, end_date)
          WHERE id=?
        `;

      const values = [
        schoolname,
        location,
        degree,
        course,
        start_date,
        end_date,
        educationId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating education:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the education" });
        }

        res.json({ message: "education updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the education" });
  }
};

export const getEducationByUserAndEducationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const educationId = req.params.educationId;

    // Ensure that the education belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM education WHERE id = ? AND resume_id = ?";
    const ownershipValues = [educationId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the education" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the education if the user owns it
      const selectQuery =
        "SELECT * FROM education WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching education:", selectErr);
          return res
            .status(500)
            .json({ error: "Could not fetch the education" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "education not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the education" });
  }
};
