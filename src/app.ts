import express, { Application } from 'express'
import {startDatabase} from './database'
import {createDeveloper, createDeveloperInfos, deleteDeveloper, listDevelopers, listUniqueDeveloper, upadateDevelopersInfos, updateDevelopers} from './logic/developers.logic'
import { ensureDeveloperExists, varifyEmail } from './middlewares/developers.middleware'


const app:Application = express()
app.use(express.json())

app.post('/developers',varifyEmail,createDeveloper)
app.get('/developers',listDevelopers)
app.get('/developers/:id',ensureDeveloperExists,listUniqueDeveloper)
app.post('/developers/:id/infos',ensureDeveloperExists,createDeveloperInfos)
app.patch('/developers/:id',ensureDeveloperExists,varifyEmail,updateDevelopers)
app.patch('/developers/:id/infos',ensureDeveloperExists,upadateDevelopersInfos)
app.delete('/developers/:id',ensureDeveloperExists,deleteDeveloper)

app.listen(3000, async ()=> {
    console.log('Server is running')
    await startDatabase()
})