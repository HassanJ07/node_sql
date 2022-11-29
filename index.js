import pg from "pg";
import { users } from "./users.mjs";
import * as dotenv from "dotenv";
dotenv.config();



const client = new pg.Client({
    user: "my_new_project_admin",
    host: "localhost",
    port: 5432,
    database: "my_new_project",
    password: `${process.env.PROJECT_KEY}`,
  });

client.connect()
  .then(() =>("Client connected"))

const sqlTable =  `CREATE TABLE IF NOT EXISTS users(
    id SERIAL,
    firstName VARCHAR not null,
    lastName VARCHAR not null,
    email VARCHAR not null,
    ip VARCHAR not null
  )` 
  client
  .query(sqlTable)
  .catch((e) => console.error(e.stack))
  .then(() => 
        users.forEach(user => {
        let {id, firstName, lastName, email, ip} = user
        client.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5)', [id, firstName, lastName, email, ip])            
        }))
    .then(() => client.query ("SELECT DISTINCT * FROM users ORDER BY ID"))
    .then((results)=> console.table(results.rows))
