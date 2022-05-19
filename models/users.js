const db = require('../config/db');
const helper = require('../config/helper');


async function getSingle(id) {
  // const offset = helper.getOffset(page, config.listPerPage);
  //`SELECT * FROM posts LIMIT ${offset},${config.listPerPage}`
  const rows = await db.query(
    `SELECT * FROM users where googleid = ${id}`
  );
  const data = helper.emptyOrRows(rows);
  //const meta = {page};
  return {
    data
  }
}

async function getType(id) {
  // const offset = helper.getOffset(page, config.listPerPage);
  //`SELECT * FROM posts LIMIT ${offset},${config.listPerPage}`
  const rows = await db.query(
    `SELECT type FROM users where googleid = ${id}`
  );
  const data = helper.emptyOrRows(rows);
  //const meta = {page};
  return {
    data
  }
}



async function create(user) {
  const result = await db.query(
    `INSERT INTO users(id,googleid,name,type) VALUES (default,'${user.googleid}','${user.name}',default)`
  );

  let message = 'Error in creating User';

  if (result.affectedRows) {
    message = 'User created successfully';
  }

  return {
    message
  };
}


module.exports = {
  create,
  getSingle,
    getType
}