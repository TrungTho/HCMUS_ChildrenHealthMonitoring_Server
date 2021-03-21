const db = require("../utils/database");
const TABLE_NAME = "editor_post";

module.exports = {
  //---------------------default query----------------------------
  getAll() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  add(newObj) {
    return db.add(newObj, TABLE_NAME);
  },

  del(Obj) {
    const condition = { id: Obj.id };
    return db.del(condition, TABLE_NAME);
  },

  update(Obj) {
    const condition = { id: Obj.id };
    return db.update(Obj, condition, TABLE_NAME);
  },

  //---------------------others select----------------------------
  //get an single user by user id
  async getSingle(id) {
    const rows = await db.load(`select * from ${TABLE_NAME} where id = ${id} `);
    if (rows.length === 0) return null;
    return rows[0];
  },

  //get id of editor of post that has id as param
  async getEditorIdByPostId(id) {
    const rows = await db.load(
      `select id_user from ${TABLE_NAME} where id_post = ${id} `
    );
    if (rows.length === 0) return null;
    return rows[0].id_user;
  },

  //get all post of particular editor by this one's id
  getAllPostIdByUserId(id) {
    return db.load(`select id_post from ${TABLE_NAME} where id_user=${id}`);
  },

  //---------------------others update----------------------------
};
