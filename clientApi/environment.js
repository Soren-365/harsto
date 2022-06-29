import dotenv from 'dotenv'
dotenv.config();


// warning!! :  in docker container process.env.NODE_ENV returns "production" instead of production
console.log("process.env.NODE_ENV:", process.env.NODE_ENV)
console.log("process.env.PORT:", process.env.PORT)
// let port = 3000
// console.log("envs",process.env.NODE_ENV, process.env.API_PRODUCTION_PORT  )
// // process.env.NODE_ENV === "production" ? port=process.env.API_PRODUCTION_PORT : null
console.log("port", process.env.PORT)
const environment = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    api_host: process.env.API_HOST,
    api_port: process.env.API_PORT,
    supabase_conn_string: process.env.SUPABASE_CONN_STRING,    
    supabase_pool_conn_string: process.env.SUPABASE_POOL_CONN_STRING    
};

export {environment}

