import "dotenv/config";

import express from "express";

import { pool } from "./db";

const app = express();

app.use(express.json());

app.get("/health", async (_req, res) => {
     await pool.query("select 1");
     res.json({ status: "ok" });
   });

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server listening on ${port}`));
