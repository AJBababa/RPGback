"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
var pg_1 = require("pg");
//localhost
var pool = new pg_1.Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'RPG'
});
//render
/*
const pool = new Pool({
  user: 'r6smashorpassdb_user',
  password: 'rcNq7PaQj9RaXQA3Gu6zCYBMyLCQ08Ai',
  host: 'dpg-d08eu0fgi27c738hedh0-a',
  port: 5432, // default Postgres port
  database: 'r6smashorpassdb'
});
*/
function query(text) {
    return pool.query(text);
}
exports.query = query;
;
