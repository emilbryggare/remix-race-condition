import Database from "better-sqlite3";

let db = getClient();

function getClient() {
  let database = new Database("db.sqlite");
  database
    .prepare("CREATE TABLE IF NOT EXISTS post (id int, title char, votes int);")
    .run();
  let posts = database.prepare("SELECT * FROM post;").all();
  if (posts.length === 0) {
    database.prepare("INSERT INTO post VALUES (1, 'Post 1', 0);").run();
    database.prepare("INSERT INTO post VALUES (2, 'Post 2', 0);").run();
  }
  return database;
}
export { db };
