const db = require('../config/db');
const helper = require('../config/helper');
//const config = require('../config/database');

async function getMultiple(page = 1){
 // const offset = helper.getOffset(page, config.listPerPage);
 //`SELECT * FROM posts LIMIT ${offset},${config.listPerPage}`
 const rows = await db.query(
    `SELECT * FROM posts`
  );
  const data = helper.emptyOrRows(rows);
  //const meta = {page};
  return {
    data
   // meta
  }
}


module.exports = {
  getMultiple
}