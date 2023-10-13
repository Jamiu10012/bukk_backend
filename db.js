import mysql from "mysql";

const connection = mysql.createConnection({
  host: "b2ckng0tsq4pcq04cgww-mysql.services.clever-cloud.com",
  user: "unft6jz72iemjx51",
  password: "H931fO4CwP06XGBdU3pf",
  database: "b2ckng0tsq4pcq04cgww",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Middleware function to attach the MySQL connection to req
export const dbMiddleware = (req, res, next) => {
  req.db = connection;
  next();
};

export default connection;
