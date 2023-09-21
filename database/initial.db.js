import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("DataBase Connected successfully"))
  .catch((err) => console.log("Database Connection Failed", err));
