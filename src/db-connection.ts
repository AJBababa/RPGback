import { Pool } from 'pg';


//localhost

/*
const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'RPG'
});
*/

//render

const pool = new Pool({
  user: 'rpgdb_afcf_user',
  password: 'kgl2SiKWpKCCbEIyAk4mabYqttE9aqag',
  host: 'dpg-d11171q4d50c739t552g-a',
  port: 5432, // default Postgres port
  database: 'RPGDB'
});






export function query(text: any): any {
    return pool.query(text);
};