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

// Get Employee by ID
app.get("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});
// Update Employee
app.put("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, salary, department } = req.body;

    const result = await pool.query(
      `UPDATE employees
       SET name = $1,
           email = $2,
           salary = $3,
           department = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, salary, department, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});
// Delete employee (auto prompt by AI)
// app.delete("/employees/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query("DELETE FROM employees WHERE id = $1", [
//       id,
//     ]);
//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }
//     res.json({
//       success: true,
//       message: "Employee deleted successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(err.message);
//   }
// });
// Delete Employee (code by lecturer)
app.delete("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
      employee: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});
module.exports = app;