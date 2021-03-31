const db = require("../utils/database");
const TABLE_NAME = "notification";

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

  async getAllByDestinationId(id) {
    return db.load(
      `select * from ${TABLE_NAME} where id_to = ${id} and isDel=false`
    );
  },

  async getAllBySenderId(id) {
    return db.load(`select * from ${TABLE_NAME} where id_from = ${id}`);
  },

  //---------------------others update----------------------------

  //function to set isRead = true
  setRead(id) {
    return db.load(`update ${TABLE_NAME} set isread=true where id=${id}`);
  },

  //function to set isDel = true
  setDelete(id) {
    return db.load(`update ${TABLE_NAME} set isdel =true where id=${id}`);
  },
};
