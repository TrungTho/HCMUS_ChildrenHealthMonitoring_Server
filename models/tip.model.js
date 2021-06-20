const db = require("../utils/database");
const TABLE_NAME = "tip";

module.exports = {
  //---------------------default query----------------------------
  getAll() {
    return db.load(`select * from ${TABLE_NAME} where isApproved=true`);
  },

  getAllWithPaging(pageNo, itemNo) {
    return db.load(
      `select * from ${TABLE_NAME} where isApproved=true limit ${
        pageNo * itemNo
      }, ${itemNo}`
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

  //---------------------others select----------------------------
  //get an single user by user id
  async getSingle(id) {
    const rows = await db.load(
      `select * from ${TABLE_NAME} where id = ${id} and isApproved=true`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  //function to get all tus with any approval state
  adminGetAll() {
    return db.load(`select * from ${TABLE_NAME}`);
  },

  //get all post of editor by user id
  editorGetAllById(id) {
    return db.load(
      `select * from ${TABLE_NAME} join editor_post on ${TABLE_NAME}.id=editor_post.id_post and editor_post.typeOfPost='${TABLE_NAME}' where id_user=${id}`
    );
  },

  async editorGetSingle(id) {
    const rows = await db.load(`select * from ${TABLE_NAME} where id = ${id} `);
    if (rows.length === 0) return null;
    return rows[0];
  },

  //fulltext search with querystring
  searchAll(querystring) {
    return db.load(
      `SELECT * FROM ${TABLE_NAME} WHERE MATCH (shortdes, fulldes) AGAINST ('${querystring}' );`
    );
  },

  //count all row
  async countRows() {
    const rows = await db.load(
      `select count(*) from ${TABLE_NAME} where isApproved=true`
    );
    if (rows.length === 0) return null;
    return rows[0]["count(*)"];
  },

  //---------------------others update----------------------------

  //function to update main cover link with id and link
  changeMainCover(id, link) {
    return db.load(
      `update ${TABLE_NAME} set main_cover='${link}' where id=${id} and isApproved=true`
    );
  },

  //function to flip state approval of tus
  flipApproval(id) {
    return db.load(
      `update ${TABLE_NAME} set isApproved=not(isApproved) where id=${id}`
    );
  },
};
