import db from "../db.js";
export const createPublication = async (req, res) => {
  try {
    const { publication_title, link, date, description } = req.body;
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const insertQuery = `
        INSERT INTO publication ( publication_title, link, date, description,  resume_id, user_id)
        VALUES (?, ?, ?, ?,?,?)
      `;

    const values = [
      publication_title,
      link,
      date,
      description,
      resumeId,
      userId,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating publication:", err);
        return res
          .status(500)
          .json({ error: "Could not create the publication" });
      }

      res.status(201).json({ message: "publication created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "publication created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the publication" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the publication" });
  }
};

export const updatePublicationByUserAndPublicationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const publicationId = req.params.publicationId;
    const { publication_title, link, date, description } = req.body;

    // Ensure that the publication belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM publication WHERE id = ?";
    const ownershipValues = [publicationId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not update the publication" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the publication
      const updateQuery = `
          UPDATE publication
          SET publication_title = COALESCE(?, publication_title), link	=COALESCE(?, link	), 
         date=COALESCE(?, date), description=COALESCE(?, description)
          WHERE id=?
        `;

      const values = [
        publication_title,
        link,
        date,
        description,
        publicationId,
      ];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating publication:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the publication" });
        }

        res.json({ message: "publication updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the publication" });
  }
};

export const getPublicationByUserAndPublicationId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumeId = req.params.resumeId;
    const publicationId = req.params.publicationId;

    // Ensure that the publication belongs to the specified user
    const checkOwnershipQuery =
      "SELECT user_id FROM publication WHERE id = ? AND resume_id = ?";
    const ownershipValues = [publicationId, resumeId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res
          .status(500)
          .json({ error: "Could not fetch the publication" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the publication if the user owns it
      const selectQuery =
        "SELECT * FROM publication WHERE user_id = ? AND resume_id = ?";
      const values = [userId, resumeId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching publication:", selectErr);
          return res
            .status(500)
            .json({ error: "Could not fetch the publication" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "publication not found" });
        }

        res.json(results);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the publication" });
  }
};
