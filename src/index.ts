import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { getUser, login, register } from "./controllers/UserController.js";

const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

if (!mongoURI || !jwtSecret) {
  throw new Error("Missing environment variables");
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("123");
});

app.post("/auth/login", login);
app.post("/auth/register", registerValidation, register);
app.get("/auth/user", getUser);

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(`Server listening on port ${PORT}`);
});
