const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files serve
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "muqsit2313",
  database: "ecommerce"
});

db.connect(err => {
  if (err) {
    console.log("DB error:", err);
    return;
  }
  console.log("MySQL connected");
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
