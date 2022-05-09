const db = require('../config/db');
const helper = require('../config/helper');


async function getMultiple(page = 1) {
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

async function getSingle(id) {
  // const offset = helper.getOffset(page, config.listPerPage);
  //`SELECT * FROM posts LIMIT ${offset},${config.listPerPage}`
  const rows = await db.query(
    `SELECT * FROM posts where id = ${id}`
  );
  const data = helper.emptyOrRows(rows);
  //const meta = {page};
  return {
    data
  }
}

async function create(post) {
  const result = await db.query(
    `INSERT INTO posts(id, title, des, image) VALUES (default,'${post.title}','${post.descripton}','${post.image}')`
  );

  let message = 'Error in creating Posts';

  if (result.affectedRows) {
    message = 'Post created successfully';
  }

  return {
    message
  };
}

async function update(id, Posts) {
  const result = await db.query(
    `UPDATE posts SET title='${Posts.title}' , des='${Posts.descripton}' WHERE id = ${id}`
  );

  let message = 'Error in updating Post';

  if (result.affectedRows) {
    message = 'Post updated successfully';
  }

  return {
    message
  };
}


async function update_image(id, Posts) {
  const result = await db.query(
    `UPDATE posts SET image='${Posts.image}' WHERE id = ${id}`
  );

  let message = 'Error in updating Post';

  if (result.affectedRows) {
    message = 'Post updated successfully';
  }

  return {
    message
  };
}
async function remove(id) {
  const result = await db.query(
    `DELETE FROM posts WHERE id=${id}`

  );

  let message = 'Error in deleting Posts';

  if (result.affectedRows) {
    message = 'Posts deleted successfully';
  }

  return {
    message
  };
}

module.exports = {
  getMultiple,
  create,
  remove,
  getSingle,
  update,
  update_image,

}