// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

// User registration controller
export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, contact_number, password } = req.body;

    // Check if the email already exists in the database
    const checkEmailQuery =
      "SELECT COUNT(*) AS count FROM users WHERE email = ?";

    // Wrap the query in a Promise
    const emailExist = new Promise((resolve, reject) => {
      db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Use await to wait for the promise to resolve
    const result = await emailExist;

    if (result[0].count > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert a new user into the database
    const insertQuery =
      "INSERT INTO users (firstname, lastname, email, contact_number, password) VALUES (?, ?, ?, ?, ?)";
    const values = [firstname, lastname, email, contact_number, hashedPassword];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ message: "Registration failed" });
      }

      res.json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// User login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    db.query(selectQuery, values, async (err, results) => {
      if (err) {
        console.error("Error finding user:", err);
        return res.status(500).json({ message: "Login failed" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ userId: user.id }, "your-secret-key");
      const others = user.id;
      console.log(others);
      //   res.json({ token });
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ token, others });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
