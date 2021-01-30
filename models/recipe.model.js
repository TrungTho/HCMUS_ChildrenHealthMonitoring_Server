const db = require("../utils/database");
const TABLE_NAME = "recipe";

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

  //fulltext search with querystring
  searchAll(querystring) {
    return db.load(
      `SELECT * FROM ${TABLE_NAME} WHERE MATCH (name, fulldes) AGAINST ('${querystring}' );`
    );
  },

  //---------------------others update----------------------------

  //function to update main cover link with id and link
  changeMainCover(id, link) {
    return db.load(
      `update ${TABLE_NAME} set main_cover='${link}' where id=${id}`
    );
  },
};
