const db = require("../utils/database");
const TABLE_NAME = "diary";

module.exports = {
  //---------------------default query----------------------------
  getAll() {
    return db.load(`select * from ${TABLE_NAME} where isDel=false`);
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
    const rows = await db.load(
      `select * from ${TABLE_NAME} where id = ${id} and isDel=false`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  getAllByUserId(id_user) {
    return db.load(
      `select * from ${TABLE_NAME} where id_user=${id_user} and isDel=false`
    );
  },

  //---------------------others update----------------------------

  //function to update avatar link with id and link
  setAvatar(id, link) {
    return db.load(
      `update ${TABLE_NAME} set avatar='${link}' where id=${id} and isDel=false`
    );
  },
};
