const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "user_auth"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL Database.");
});

// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
  db.query(sql, [username, email, passwordHash], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).send("Username or Email already exists.");
      } else {
        res.status(500).send("Error creating account.");
      }
    } else {
      res.send("Signup successful!");
    }
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
      if (isPasswordCorrect) {
        res.send("Login successful!");
      } else {
        res.status(401).send("Invalid password.");
      }
    } else {
      res.status(404).send("User not found.");
    }
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
