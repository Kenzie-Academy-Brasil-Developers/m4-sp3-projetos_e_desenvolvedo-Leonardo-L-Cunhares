import { Client } from 'pg';
import 'dotenv/config'

const client:Client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!)
})

export default client