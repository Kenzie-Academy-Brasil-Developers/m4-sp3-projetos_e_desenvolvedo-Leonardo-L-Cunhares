import { Request, Response } from 'express';
import { QueryConfig } from 'pg';
import { client } from '../database'
import { DeveloperAllProjectsResult,TechnologiesResult,ProjectWithTechResult } from '../interface/developersProjects.interface';

const listAllDeveloperProjects = async(req:Request , res: Response):Promise<Response> =>{
    const id:number = parseInt(req.params.id)

    const queryString:string = `
        SELECT 
            d.id  AS "developerID",
            d."name" AS "developerName",
            d.email AS "developerEmail",
            di.id  AS "developerInfoID",
            di."developerSince" AS "developerInfoDeveloperSince",
            di."preferredOS" AS "developerInfoPreferredOS",
            p.id AS "projectID",
            p."name" AS "projectName",
            p.description AS "projectDescription",
            p."estimatedTime" AS "projectEstimatedTime",
            p.repository AS "projectRepository",
            p."startDate" AS "projectStartDate",
            p."endDate" AS "projectEndDate",
            t.id AS "technologyId",
            t."name" AS "technologyName"
        FROM 	
	        projects p 
        FULL OUTER JOIN
	        developers d
        ON p."developerId" = d.id 
        FULL OUTER JOIN 
	        developer_infos di 
        ON d."developerInfoId" = di.id 
        FULL OUTER JOIN 
	        projects_technologies pt 
        ON pt."projectId" = p.id 
        FULL OUTER JOIN 
	        technologies t 
        ON pt."technologyId" = t.id 
        WHERE d.id = $1;
    `
    const queryConfig:QueryConfig = {
        text:queryString,
        values: [id]
    }

    const queryResult:DeveloperAllProjectsResult = await client.query(queryConfig)

 

    return res.status(200).json(queryResult.rows)
}
const addTechOnProject = async (req:Request, res:Response):Promise<Response> =>{
    const id:number = parseInt(req.params.id)
    const {name} = req.body

    let queryString:string = `
        SELECT
            *
        FROM
            technologies
        WHERE name = $1;    
    `

    let queryConfig:QueryConfig = {
        text:queryString,
        values:[name]
    }

    let queryResult:TechnologiesResult = await client.query(queryConfig)
    
    queryString = `
        INSERT INTO
            projects_technologies("addedIn","projectId","technologyId")
        VALUES($1,$2,$3)
        RETURNING*;    
    `
    queryConfig = {
        text: queryString,
        values:[new Date(),id,queryResult.rows[0].id]
    }


    queryResult = await client.query(queryConfig)

    const queryStringComplete:string = `
        SELECT 
            t.id AS "technologyId",
            t."name"  AS "technologyName",
            p.id AS "projectId",
            p."name"  AS  "projectName",
            p.description AS "projectDescription",
            p."estimatedTime" AS "projectEstimatedTime" ,
            p.repository AS "projectRepository",
            p."startDate" AS "projectStartDate",
            p."endDate" AS "projectEndDate"
        FROM
	        projects_technologies pt
        FULL OUTER JOIN
	        projects p 
        ON pt."projectId"  = p.id 
        FULL OUTER JOIN 
	        technologies t 
        ON pt."technologyId"  = t.id 
        WHERE p.id = $1;
    ` 
    const queryConfigComplete:QueryConfig = {
        text:queryStringComplete,
        values:[id]
    }
    const queryResultComplete:ProjectWithTechResult = await client.query(queryConfigComplete)

    const lastIndex = queryResultComplete.rows.at(-1)
    return res.status(201).json(lastIndex)
}
const deleteTechFromProject = async (req:Request , res:Response):Promise<Response> => {
    const {id , name} = req.params

    let queryString:string = `
    SELECT 
	*
    FROM 	
	    technologies 
    WHERE name = $1;
    `
    let queryConfig:QueryConfig = {
        text:queryString,
        values: [name]
    }

    let queryResult = await client.query(queryConfig)
    
    queryString = `
        DELETE FROM
            projects_technologies
        WHERE
            "technologyId" = $1 AND "projectId" = $2
        RETURNING*;    
    `
    queryConfig = {
        text:queryString,
        values: [queryResult.rows[0].id ,id]
    }
    queryResult = await client.query(queryConfig)
    
    if(queryResult.rowCount != 1){
        return res.status(404).json({
            message:`Technology ${name} not found on this Project.`
        })
    }

    return res.status(204).send()
}
export {listAllDeveloperProjects,addTechOnProject,deleteTechFromProject}