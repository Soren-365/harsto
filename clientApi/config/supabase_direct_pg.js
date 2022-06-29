import { environment } from "../environment.js";

import pg from "pg";
const { Client } = pg;
//import { updateClient } from "../lib/updateClient"

const pgClient = new Client(environment.supabase_conn_string);

pgClient.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected to supabase psql");
  }
});

const query = async (text, params, res, errorMessage) => {
  try {
    return await pgClient.query(text, params);
  } catch (err) {
    console.log(err.stack);
    return res.status(500).send({ message: errorMessage})
    
  }
};

const pgdb = {
  query,
};
export default pgdb;
