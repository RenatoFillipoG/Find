import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { openDatabase } from "../database.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const listUsers = async (request, response) => {
  try {
    const db = await openDatabase();
    const users = await db.all(`
        SELECT * FROM users    
        `);
    await db.close();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).send({ message: "Erro ao listar usuários." });
  }
};

export const createUser = async (request, response) => {
  let db;
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response
        .status(400)
        .json({ message: "Preencha todos os campos!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    db = await openDatabase();
    const data = await db.run(
      `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)    
        `,
      [name, email, hashedPassword],
    );
    await db.close();
    return response.status(201).json({
      id: data.lastID,
      name,
      email,
    });
  } catch (error) {
    if (db) await db.close();
    console.log(error);
    response.status(500).send({
      message: "Não foi possível cadastrar no banco de dados. Tente novamente!",
    });
  }
};
export const updateUser = async (request, response) => {
  let db;
  try {
    const { name, email, password } = request.body;
    const { id } = request.params;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    db = await openDatabase();

    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);

    if (user) {
      await db.run(
        `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
        [name, email, hashedPassword, id]
      );
      
      await db.close();

      return response.status(200).json({
        id,
        name,
        email,
      });
    }

    await db.close();
    return response.status(404).json({ message: "Usuário não encontrado" });

  } catch (error) {
    if (db) await db.close();
    response.status(500).json({ message: "Erro ao atualizar conta." });
  }
};

export const deleteUser = async (request, response) => {
  let db;
  try {
    const { id } = request.params;
    db = await openDatabase();
    await db.run(`DELETE FROM users WHERE id =?`, [id]);
    
    await db.close();
    
    return response.status(200).json({
      id,
      message: `O usuário ${id} foi deletado com sucesso!`,
    });
  } catch (error) {
    if (db) await db.close();
    response.status(400).json("Não foi possível excluir sua conta.");
  }
};

export const loginUser = async (request, response) => {
  let db;
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios." });
    }
    db = await openDatabase();

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) {
      await db.close();
      return response
        .status(401)
        .json({ message: "E-mail ou senha incorretos." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await db.close();
      return response
        .status(401)
        .json({ message: "E-mail ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, JWT_SECRET,
      { expiresIn: "1h" },
    );

    await db.close();
    return response.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (db) await db.close();
    console.error(error);
    return response.status(500).json({ message: "Erro ao realizar login." });
  }
};
