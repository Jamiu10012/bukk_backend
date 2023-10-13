import db from "../db.js";
export const createExprience = async (req, res) => {
  try {
    const { job_title, employer, city, country, start_date, end_date } =
      req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO exprience ( job_title, employer, city, country, start_date, end_date, resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?,?,?)
      `;

    const values = [
      job_title,
      employer,
      city,
      country,
      start_date,
      end_date,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating exprience:", err);
        return res
          .status(500)
          .json({ error: "Could not create the exprience" });
      }

      res.status(201).json({ message: "exprience created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "exprience created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the exprience" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the exprience" });
  }
};

export const updateExprienceByUserAndExprienceId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const exprienceId = req.params.exprienceId;
    const { job_title, employer, city, country, start_date, end_date } =
      req.body;

    // Ensure that the exprience belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM exprience WHERE id = ?";
    const ownershipValues = [exprienceId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not update the exprience" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the exprience
      const updateQuery = `
          UPDATE exprience
          SET job_title = COALESCE(?, job_title), employer=COALESCE(?, employer), 
         city=COALESCE(?, city), country=COALESCE(?, country), start_date=COALESCE(?, start_date), 
         end_date=COALESCE(?, end_date)
          WHERE id=?
        `;

      const values = [
        job_title,
        employer,
        city,
        country,
        start_date,
        end_date,
        exprienceId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating exprience:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the exprience" });
        }

        res.json({ message: "exprience updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the resume" });
  }
};

export const getExperienceByUserAndExperienceId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const experienceId = req.params.experienceId;

    // Ensure that the experience belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM exprience WHERE id = ? AND resume_id = ?";
    const ownershipValues = [experienceId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not fetch the experience" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the experience if the user owns it
      const selectQuery =
        "SELECT * FROM exprience WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching experience:", selectErr);
          return res
            .status(500)
            .json({ error: "Could not fetch the experience" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Experience not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the experience" });
  }
};
