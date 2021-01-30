const db = require("../utils/database");
const TABLE_NAME = "lullaby";

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
      `SELECT * FROM ${TABLE_NAME} WHERE MATCH (name,shortdes) AGAINST ('${querystring}' );`
    );
  },

  //---------------------others update----------------------------

  //function to update avatar link with id and link
  setLink(id, link) {
    return db.load(`update ${TABLE_NAME} set link='${link}' where id=${id}`);
  },
};
