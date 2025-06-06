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
  user: 'rpgdb_afcf_user',
  password: 'kgl2SiKWpKCCbEIyAk4mabYqttE9aqag',
  host: 'dpg-d11171q4d50c739t552g-a',
  port: 5432, // default Postgres port
  database: 'RPGDB'
});
*/
function query(text) {
    return pool.query(text);
}
exports.query = query;
;
