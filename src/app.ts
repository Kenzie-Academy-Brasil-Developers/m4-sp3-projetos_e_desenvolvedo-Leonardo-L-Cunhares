import express, { Application } from 'express'
import {startDatabase} from './database'
import {createDeveloper, createDeveloperInfos, deleteDeveloper, listDevelopers, listUniqueDeveloper, upadateDevelopersInfos, updateDevelopers} from './logic/developers.logic'
import { ensureDeveloperExists, varifyEmail } from './middlewares/developers.middleware'
import { ensureDeveloperProject, ensureProjectsExists } from './middlewares/projects.middlewate'
import { createProjects, deleteProject, listProjects, listProjectsPerId, updateProjects } from './logic/projects.logic'


const app:Application = express()
app.use(express.json())

app.post('/developers',varifyEmail,createDeveloper)
app.get('/developers',listDevelopers)
app.get('/developers/:id',ensureDeveloperExists,listUniqueDeveloper)
app.post('/developers/:id/infos',ensureDeveloperExists,createDeveloperInfos)
app.patch('/developers/:id',ensureDeveloperExists,varifyEmail,updateDevelopers)
app.patch('/developers/:id/infos',ensureDeveloperExists,upadateDevelopersInfos)
app.delete('/developers/:id',ensureDeveloperExists,deleteDeveloper)


app.post('/projects',ensureDeveloperProject,createProjects)
app.get('/projects',listProjects)
app.get('/projects/:id',ensureProjectsExists,listProjectsPerId)
app.patch('/projects/:id',ensureProjectsExists,updateProjects)
app.delete('/projects/:id',ensureProjectsExists,deleteProject)


app.listen(3000, async ()=> {
    console.log('Server is running')
    await startDatabase()
})