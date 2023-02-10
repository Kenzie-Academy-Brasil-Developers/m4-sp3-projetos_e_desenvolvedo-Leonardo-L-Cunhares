import { Request, Response, NextFunction } from 'express';
import { QueryConfig } from 'pg';
import {client} from '../database'

const varifyEmail = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> => {
    const email = req.body.email

    const queryString = `
        SELECT
            "email"
        FROM 
            developers;    
         `
    const queryResult = await  client.query(queryString)
    
    const verifyEmail = queryResult.rows.find(element => element.email == email)
    
    if(verifyEmail){
       return  res.status(400).json({
            message: 'Email already exists.'
        })
    }

    next()
}
const ensureDeveloperExists = async (req:Request, res:Response, next:NextFunction):Promise<void | Response> => {
    const id:number = parseInt(req.params.id)

    const queryString = `
        SELECT
            COUNT(*)
        FROM
            developers
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
        message: 'Developer not found.'
    })
}
export {varifyEmail,ensureDeveloperExists}