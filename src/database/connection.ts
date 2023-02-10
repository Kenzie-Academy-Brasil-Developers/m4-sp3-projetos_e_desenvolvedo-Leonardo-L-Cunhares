import client from "./config"

const startDatabase = async ():Promise<void> => {
    await client.connect()
    console.log('database is running')
}

export default startDatabase