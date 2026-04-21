import { openDatabase } from "../database.js";

export const createSearch = async (request, response) => {
  let db;
  try {
    const { surname, description, city, community, contact } = request.body;
    const creatorId = request.userId;

    const img = request.file ? request.file.filename : "default.png";

    if (!surname || !city) {
      return response
        .status(400)
        .json({ message: "Campos essenciais faltando!" });
    }

    db = await openDatabase();

    const result = await db.run(
      `
            INSERT INTO search (surname, description, img, city, community, creator, contact)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      [surname, description, img, city, community, creatorId, contact],
    );

    await db.close();
    db = null;

    return response.status(201).json({
      id: result.lastID,
      surname,
      message: "Anúncio criado com sucesso!",
    });
  } catch (error) {
    if (db) {
      await db.close();
    }
    console.error(error);
    return response.status(500).json({ message: "Erro ao criar anúncio." });
  } finally {
    if (db) await db.close();
  }
};

export const listSearch = async (request, response) => {
  let db;
  try {
    db = await openDatabase();
    const ads = await db.all(`SELECT * FROM search`);
    await db.close();

    return response.status(200).json(ads);
  } catch (error) {
    if (db) await db.close();
    return response.status(500).json({ message: "Erro ao buscar anúncios." });
  }
};

export const listMySearches = async (request, response) => {
  let db;
  try {
    db = await openDatabase();

    const userId = request.userId;

    const mySearches = await db.all("SELECT * FROM search WHERE creator = ?", [
      userId,
    ]);

    return response.json(mySearches);
  } catch (error) {
    console.error("Erro ao listar buscas:", error);
    return response.status(500).json({ message: "Erro no servidor." });
  } finally {
    if (db) {
      await db.close();
    }
  }
};

export const deleteSearch = async (request, response) => {
  let db;
  try {
    db = await openDatabase();
    const { id } = request.params;
    const userId = request.userId;

    const result = await db.run(
      "DELETE FROM search WHERE id = ? AND creator = ?",
      [id, userId],
    );

    if (result.changes === 0) {
      return response.status(403).json({
        message: "Não autorizado ou anúncio não encontrado.",
      });
    }

    return response.json({ message: "Anúncio removido com sucesso!" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao excluir anúncio." });
  } finally {
    if (db) await db.close();
  }
};

export const updateSearch = async (request, response) => {
  let db;
  try {
    db = await openDatabase();
    const { id } = request.params;
    const userId = request.userId;
    const { surname, description, city, community, contact } = request.body;

    const newImg = request.file ? request.file.filename : null;

    const search = await db.get(
      "SELECT * FROM search WHERE id = ? AND creator = ?",
      [id, userId],
    );

    if (!search) {
      return response
        .status(403)
        .json({ message: "Não autorizado ou anúncio não encontrado." });
    }

    const finalImg = newImg || search.img;

    await db.run(
      `UPDATE search 
       SET surname = ?, description = ?, img = ?, city = ?, community = ?, contact = ?
       WHERE id = ? AND creator = ?`,
      [
        surname || search.surname,
        description || search.description,
        finalImg,
        city || search.city,
        community || search.community,
        contact || search.contact,
        id,
        userId,
      ],
    );

    return response.json({ message: "Anúncio atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao atualizar anúncio." });
  } finally {
    if (db) await db.close();
  }
};
