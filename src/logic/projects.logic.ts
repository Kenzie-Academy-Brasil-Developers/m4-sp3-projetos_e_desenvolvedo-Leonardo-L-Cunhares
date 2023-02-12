import { Request ,Response } from 'express';
import { QueryConfig } from 'pg';
import format from 'pg-format';
import {client} from '../database'
import { IProjectsRequest, ProjectsKeys, ProjectsResult, ProjectTechnologiesResult } from '../interface/projects.interface';

const createProjects = async (req: Request, res: Response):Promise<Response> =>{
    const keys: Array<string> = Object.keys(req.body);
    const requiredKeys:ProjectsKeys = ['name','description','estimatedTime','repository','startDate','developerId'];

    const containsAllRequired: boolean = requiredKeys.every((key: string) => {
      return keys.includes(key);
    });
    const missingKeys = requiredKeys.filter((key:string)=> {
        return !keys.includes(key)
    })
  
    if (!containsAllRequired) {
      return res.status(400).json({
        message: (`keys are missing: ${missingKeys}`)
      })
    }
    const {name , description ,estimatedTime,
        repository,startDate,developerId }:IProjectsRequest = req.body

    const projectsData = {
        name,
        description,
        estimatedTime,
        repository,
        startDate,
        developerId
    }
    
    const queryString:string = format(`
        INSERT INTO
            projects(%I)
        VALUES(%L)
        RETURNING*;    
    `,
    Object.keys(projectsData),
    Object.values(projectsData)
    )

    const QueryResult:ProjectsResult = await client.query(queryString)

    return res.status(201).json(QueryResult.rows[0])
}
const listProjects = async (req:Request, res: Response):Promise<Response> => {
    const queryString:string = `
      SELECT 
        pr.*,
        pt."technologyId" ,
        t."name" technologyName
      FROM 
        projects pr
      LEFT JOIN
        projects_technologies pt 
      ON 
        pt."projectId" = pr.id
      LEFT JOIN 
        technologies t 
      ON 
        t.id  = pt."technologyId"
      ORDER BY id;	
      `
     
      const QueryResult:ProjectTechnologiesResult = await client.query(queryString)

      return res.status(200).json(QueryResult.rows)
}
const listProjectsPerId = async (req:Request, res:Response):Promise<Response> => {
  const id:number = parseInt(req.params.id)

  const queryString:string = `
      SELECT 
        p.id as "projectID",
        p."name" as "projectName",
        p.description as "projectDescription",
        p."estimatedTime" as "projectEstimatedTime",
        p.repository as "projectRepository",
        p."startDate"  as "projectStartDate",
        p."endDate" as "projectEndDate",
        p."developerId" as "projectDeveloperID",
        t.id as "technologyId",
        t.name as "technologyName"
      FROM 
        projects_technologies pt
      FULL OUTER JOIN 
        projects p 
      ON pt."projectId"  = p.id 
      FULL OUTER JOIN 
        technologies t 
      ON pt."technologyId" = t.id
      WHERE p.id = 1;
    `

    const QueryResult:ProjectTechnologiesResult = await client.query(queryString)
  
    return res.status(200).json(QueryResult.rows)
}

const updateProjects = async (req:Request, res:Response):Promise<Response> => {
  const id:number = parseInt(req.params.id)

  
  if(!req.body.name && !req.body.description && !req.body.estimatedTime 
    && !req.body.repository && !req.body.startDate && !req.body.endDate && !req.body.developerId){
    return res.status(400).json({
      message: 'At least one of those keys must be send.',
    keys: [
        'name',
        'description',
        'estimatedTime',
        'repository',
        'startDate',
        'endDate',
        'developerId'
    ]
    })
  }

  const{
    name,description,estimatedTime,
    repository,startDate,endDate,
    developerId
  }:IProjectsRequest = req.body


  let correctData:Partial<IProjectsRequest> = {}

  if(name){correctData.name = name}
  if(description){correctData.description = description}
  if(estimatedTime){correctData.estimatedTime = estimatedTime}
  if(repository){correctData.repository = repository}
  if(startDate){correctData.startDate = startDate}
  if(endDate){correctData.endDate = endDate}
  if(developerId){correctData.developerId = developerId}

  
  
  const queryString:string = format(`
      UPDATE
        projects
      SET (%I) = ROW(%L)
      WHERE id = $1
      RETURNING*;  
    `,
    Object.keys(correctData),
    Object.values(correctData)
    )
  const queryConfig:QueryConfig ={
    text:queryString,
    values: [id]
  }
  
  const queryResult:ProjectsResult = await client.query(queryConfig)

  return res.status(200).json(queryResult.rows[0])
}

const deleteProject = async(req:Request, res:Response):Promise<Response> => {
  const id:number = parseInt(req.params.id)

  const queryString:string = `
    DELETE FROM
        projects
    WHERE id = $1;
    `
  
  const queryConfig:QueryConfig = {
    text: queryString,
    values: [id]
  } 
  
  await client.query(queryConfig)

  return res.status(204).send()
}

export {
createProjects,listProjects,listProjectsPerId,
updateProjects,deleteProject
}