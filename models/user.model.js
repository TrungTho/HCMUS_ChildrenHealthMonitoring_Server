const db = require("../utils/database");
const TABLE_NAME = "users";

module.exports = {
  all() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  //function to disable an user by param id of this user
  disableUser(id) {
    return db.load(
      `update ${TABLE_NAME} set isdisable=not(isdisable) where id=${id}`
    );
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

  //get an single user by user id
  async getSingle(id) {
    const rows = await db.load(`select * from ${TABLE_NAME} where id = ${id} `);
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getSingleByUsername(username) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where username = "${username}" and isDisable = 0`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async getSingleByEmail(email) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where email = "${email}" `
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};
