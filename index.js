import express from "express";
import cors from "cors";
import "./database/initial.db.js";
import Router from "./routes/user-routes.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/v1/api/users", Router);

const port = 3005;

app.listen(port, () => console.log(`server Started on port ${port}`));
