const db = require("../utils/database");
const TABLE_NAME = "weightandheight_standard";
const MAX_MONTH_AGE = 12 * 20;

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

  //get all by type w - weight, h - height; and gender 0/false - male, 1/true - female
  getAllByOption(type, gender, monthAge = MAX_MONTH_AGE) {
    return db.load(
      `select * from ${TABLE_NAME} where type = '${type}' and gender= ${gender} and month<${monthAge} order by month`
    );
  },

  //---------------------others update----------------------------
};
