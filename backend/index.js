require('dotenv').config();
import express from "express";

import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "./src/controllers/user.js";

import { createSearch, listSearch, listMySearches,deleteSearch, updateSearch } from "./src/controllers/search.js"

import { authMiddleware } from "./src/middlewares/auth.js";

import { upload } from './src/config/multer.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Authorization",
  );

  next();
});


const PORT = process.env.PORT || 3000;

app.get("/users", listUsers);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

app.post("/login", loginUser);

app.get("/search", listSearch)
app.get("/my-searches", authMiddleware, listMySearches)
app.post("/search", authMiddleware, upload.single('img'), createSearch);
app.delete("/search/:id", authMiddleware, deleteSearch);
app.put("/search/:id", authMiddleware, upload.single('img'), updateSearch);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
