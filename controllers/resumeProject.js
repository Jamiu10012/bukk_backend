import db from "../db.js";
export const createProject = async (req, res) => {
  try {
    const { project_title, sub_title, description, start_date, end_date } =
      req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO project ( project_title, sub_title, description, start_date, end_date, resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?,?)
      `;

    const values = [
      project_title,
      sub_title,
      description,
      start_date,
      end_date,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating project:", err);
        return res.status(500).json({ error: "Could not create the project" });
      }

      res.status(201).json({ message: "project created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "project created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the project" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the project" });
  }
};

export const updateProjectByUserAndProjectId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const { project_title, sub_title, description, start_date, end_date } =
      req.body;

    // Ensure that the project belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM project WHERE id = ?";
    const ownershipValues = [projectId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not update the project" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the project
      const updateQuery = `
          UPDATE project
          SET project_title = COALESCE(?, project_title), sub_title=COALESCE(?, sub_title), 
        description=COALESCE(?, description), start_date=COALESCE(?, start_date), 
         end_date=COALESCE(?, end_date)
          WHERE id=?
        `;

      const values = [
        project_title,
        sub_title,
        description,
        start_date,
        end_date,
        projectId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating project:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the project" });
        }

        res.json({ message: "project updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the project" });
  }
};

export const getProjectByUserAndProjectId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const projectId = req.params.projectId;

    // Ensure that the project belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM project WHERE id = ? AND resume_id = ?";
    const ownershipValues = [projectId, resumeId];

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
