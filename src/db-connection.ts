import { Pool } from 'pg';


//localhost

const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432, // default Postgres port
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





export function query(text: any): any {
    return pool.query(text);
};