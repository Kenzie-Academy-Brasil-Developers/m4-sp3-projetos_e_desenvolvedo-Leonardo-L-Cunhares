import { Request, Response, NextFunction } from 'express';
import { QueryConfig } from 'pg';
import { client } from '../database'


const ensureDeveloperProject = async (req: Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const developerId = req.body.developerId

    const queryString = `
        SELECT
            COUNT(*)
        FROM
            developers
        WHERE id = $1    
    `

    const queryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult = await client.query(queryConfig)

    if(Number(queryResult.rows[0].count) > 0){
        return next()
    }

    return res.status(404).json({
        message: 'Developer not found.'
    })
}
const ensureProjectsExists = async (req:Request, res:Response, next:NextFunction):Promise<void | Response> => {
    const id:number = parseInt(req.params.id)

    const queryString = `
        SELECT
            COUNT(*)
        FROM
            projects
        WHERE id = $1
    `
    const queryConfig:QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult = await client.query(queryConfig)

    if(Number(queryResult.rows[0].count) > 0){
        return next()
    }

    return res.status(404).json({
        message: 'Project  not found.'
    })
}



export { ensureDeveloperProject, ensureProjectsExists}