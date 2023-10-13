import db from "../db.js";
export const createProduct = async (req, res) => {
  try {
    const { productname, productprice, product_picture } = req.body;
    const userId = req.params.userId;
    const insertQuery = `
        INSERT INTO product ( productname, productprice, product_picture, user_id)
        VALUES (?, ?, ?, ?)
      `;

    const values = [productname, productprice, product_picture, userId];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({ error: "Could not create the product" });
      }

      res.status(201).json({ message: "product created successfully" });
    });
    // if (result.affectedRows === 1) {
    //   res.status(201).json({ message: "product created successfully" });
    // } else {
    //   res.status(500).json({ error: "Could not create the product" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the product" });
  }
};

export const updateProductByUserAndProductId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const { productname, productprice, product_picture } = req.body;

    // Ensure that the product belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM product WHERE id = ?";
    const ownershipValues = [productId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not update the product" });
      }
      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with the update if the user owns the product
      const updateQuery = `
          UPDATE product
          SET productname = COALESCE(?, productname), productprice=COALESCE(?, productprice), 
         product_picture=COALESCE(?, product_picture)
          WHERE id=?
        `;

      const values = [productname, productprice, product_picture, productId];

      db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("Error updating product:", updateErr);
          return res
            .status(500)
            .json({ error: "Could not update the product" });
        }

        res.json({ message: "Product updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the resume" });
  }
};

export const getProductByUserAndProductId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Ensure that the product belongs to the specified user
    const checkOwnershipQuery = "SELECT user_id FROM product WHERE id = ?";
    const ownershipValues = [productId];

    db.query(checkOwnershipQuery, ownershipValues, (err, ownershipResults) => {
      if (err) {
        console.error("Error checking ownership:", err);
        return res.status(500).json({ error: "Could not fetch the product" });
      }

      const user_id = ownershipResults[0].user_id;
      const userIdString = user_id.toString();

      if (ownershipResults.length === 0 || userIdString !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Continue with fetching the product if the user owns it
      const selectQuery = "SELECT * FROM product WHERE id = ?";
      const values = [productId];

      db.query(selectQuery, values, (selectErr, results) => {
        if (selectErr) {
          console.error("Error fetching product:", selectErr);
          return res.status(500).json({ error: "Could not fetch the product" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "product not found" });
        }

        const product = results[0];
        res.json(product);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the product" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products
    const selectQuery = "SELECT * FROM product";

    db.query(selectQuery, (selectErr, results) => {
      if (selectErr) {
        console.error("Error fetching products:", selectErr);
        return res.status(500).json({ error: "Could not fetch products" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch products" });
  }
};
