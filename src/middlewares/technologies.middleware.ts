import { Request, Response, NextFunction } from 'express';
import { QueryConfig } from 'pg';
import { client } from '../database'


const verifyNameTechnologies = async (req: Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const { name } = req.body || req.params
    const queryString:string = `
        SELECT
            COUNT(*)
        FROM
            technologies
        WHERE name = $1;
    `
    const queryConfig = {
        text:queryString,
        values:[name]
    }
    const queryResult = await client.query(queryConfig)
    console.log(queryResult.rows[0].count)
   
    if(queryResult.rows[0].count == 1){
        return next()
    }

    return res.status(400).json({
        message: 'Technology not supported.',
    options: [
        'JavaScript',
        'Python',
        'React',
        'Express.js',
        'HTML',
        'CSS',
        'Django',
        'PostgreSQL',
        'MongoDB'
    ]
    })
}
const verifyNameParams = async (req: Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const { name } =  req.params
    const queryString:string = `
        SELECT
            COUNT(*)
        FROM
            technologies
        WHERE name = $1;
    `
    const queryConfig = {
        text:queryString,
        values:[name]
    }
    const queryResult = await client.query(queryConfig)
 
   
    if(queryResult.rows[0].count == 1){
        return next()
    }

    return res.status(400).json({
        message: 'Technology not supported.',
    options: [
        'JavaScript',
        'Python',
        'React',
        'Express.js',
        'HTML',
        'CSS',
        'Django',
        'PostgreSQL',
        'MongoDB'
    ]
    })
}


export {verifyNameTechnologies,verifyNameParams}