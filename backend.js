const express = require("express");
const cors = require("cors");
//const { sql } = require("@vercel/postgres");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// save employee
app.post("/employees", async (req, res) => {
  try {
    const { name, email, salary, department } = req.body;

    await pool.query(
      `INSERT INTO employees(name, email, salary, department)
             VALUES($1, $2, $3, $4)`,
      [name, email, salary, department],
    );

    res.status(201).json({
      success: true,
      message: "Employee saved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});
// get all employees
app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees ORDER BY id");

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});
module.exports = app;