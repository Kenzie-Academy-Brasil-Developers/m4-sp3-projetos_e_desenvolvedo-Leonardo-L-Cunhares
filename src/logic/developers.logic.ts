import { Request, Response } from 'express';
import format from 'pg-format';
import {  DevelopersInfosResult, DevelopersResult, IDevelopers, IDevelopersInfos, IDevelopersRequest,  RequeridKeys, RequeridKeysInfos } from '../interface/developers.interface';
import {client} from '../database'
import { QueryConfig } from 'pg';

const createDeveloper = async (req:Request, res:Response) :Promise<Response> => {

    const keys: Array<string> = Object.keys(req.body);
    const requiredKeys: Array<RequeridKeys> = ['name', 'email'];

    const containsAllRequired: boolean = requiredKeys.every((key: string) => {
      return keys.includes(key);
    });

    if (!containsAllRequired) {
      return res.status(400).json({
        message: (`Required Keys are: ${requiredKeys}`)
      })
    }

    const { name, email } = req.body;

    const correctData: IDevelopersRequest = {
      name,
      email,
    };

    const queryString: string = format(
      `
            INSERT INTO
                developers(%I)
            VALUES
                (%L)    
            RETURNING*;
        `,
      Object.keys(correctData),
      Object.values(correctData)
    );

    const queryResult: DevelopersResult = await client.query(queryString);

    return res.status(201).json(queryResult.rows[0]);
    
    
}

const listDevelopers = async (req:Request, res:Response):Promise<Response> => {
    let queryString:string = `
        SELECT 	
            de.id,
            de."name",
            de.email,
            de."developerInfoId",
            di."developerSince",
            di."preferredOS" 
        FROM 
            developers de
        FULL OUTER JOIN 
            developer_infos di  
        ON 
            de."developerInfoId"= di.id
        ORDER BY de.id; 
    `
    let queryResult:DevelopersResult = await client.query(queryString)
    
    return res.status(200).json(queryResult.rows)
}
const listUniqueDeveloper = async (req:Request , res:Response):Promise<Response> =>{
    const id:number = parseInt(req.params.id)

    const queryString:string = `
        SELECT 	
            de.id,
            de.name,
            de.email,
            de."developerInfoId",
            di."developerSince",
            di."preferredOS" 
        FROM 
            developers de 
        LEFT JOIN
            developer_infos di  
        ON 
            de."developerInfoId"= di.id
        WHERE de.id = $1; 
    `

    const queryConfig:QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult:DevelopersResult = await client.query(queryConfig)

    return res.status(200).json(queryResult.rows[0])
}

const createDeveloperInfos = async (req:Request, res: Response):Promise<Response> => {
    const keys: Array<string> = Object.keys(req.body);
    const id:number = parseInt(req.params.id)
    const requiredKeys: Array<RequeridKeysInfos> = ['developerSince', 'preferredOS'];
  
    const containsAllRequired: boolean = requiredKeys.every((key: string) => {
      return keys.includes(key);
    });

    if (!containsAllRequired) {
      return res.status(400).json({
        message: (`Required Keys are: ${requiredKeys}`)
      })
    }
    
    const {developerSince,preferredOS} = req.body
    
    if(preferredOS !== 'Windows' && preferredOS !== 'Linux' && preferredOS !== 'MacOS'){
        return res.status(400).json({
            message: 'preferredOS : Inputs valids are : Windows, Linux, MacOS'
        })
    }
    
    
    const correctData:IDevelopersInfos = {
        developerSince,
        preferredOS
    }


    let queryString:string = format(`
        INSERT INTO
            developer_infos(%I)
        VALUES(%L)
        RETURNING*;    
    `,
    Object.keys(correctData),
    Object.values(correctData)
    )

    let queryResult:DevelopersInfosResult = await client.query(queryString)
    
    queryString = `
        UPDATE
            developers
        SET 
            "developerInfoId" = $1
        WHERE id = $2
        RETURNING*;        
    
    `
    const queryConfig:QueryConfig = {
        text:queryString,
        values: [queryResult.rows[0].id,id]
    }

    await client.query(queryConfig)

    return res.status(201).json(queryResult.rows[0])
}

const updateDevelopers = async (req:Request, res:Response):Promise<Response> => {
    const id:number = parseInt(req.params.id)
    

    if (!req.body.name && !req.body.email) {
      return res.status(400).json({
        message: 'At least one of those keys must be send.',
        keys:[ 'name', 'email' ]
      })
    }
    if(req.body.developerInfoId){
        return res.status(400).json({
            message: 'Cannot update :developerInfoId'
        })
    }

    const { name, email } = req.body;
    let correctData:Partial<IDevelopersRequest> = {}
    
    if(name){correctData.name = name}
    if(email){correctData.email = email}
    
    const queryString:string = format(`
        UPDATE
            developers
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING*;
    `,
    Object.keys(correctData),
    Object.values(correctData)
    )
    const queryConfig:QueryConfig = {
        text: queryString,
        values:[id]
    }

    const queryResult:DevelopersResult = await client.query(queryConfig)

    return res.status(200).json(queryResult.rows[0])
}
const upadateDevelopersInfos = async (req: Request, res:Response):Promise<Response> => {
    const { developerSince, preferredOS } = req.body;
    const id:number = parseInt(req.params.id)
    

    if (!req.body.developerSince && !req.body.preferredOS) {
      return res.status(400).json({
        message: 'At least one of those keys must be send.',
        keys:[ 'developerSince', 'preferredOS' ]
      })
    }
    if(preferredOS){
        if(preferredOS !== 'Windows' && preferredOS !== 'Linux' && preferredOS !== 'MacOS'){
            return res.status(400).json({
                message: 'preferredOS : Inputs valids are : Windows, Linux, MacOS'
            })
        }
    }
    
    let correctData:Partial<IDevelopersInfos> = {}
    
    if(developerSince){correctData.developerSince = developerSince}
    if(preferredOS){correctData.preferredOS = preferredOS}
    
    const queryString:string = format(`
        UPDATE
            developer_infos
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING*;
    `,
    Object.keys(correctData),
    Object.values(correctData)
    )
    const queryConfig:QueryConfig = {
        text: queryString,
        values:[id]
    }

    const queryResult:DevelopersResult = await client.query(queryConfig)

    return res.status(200).json(queryResult.rows[0])
}

const deleteDeveloper = async (req:Request, res:Response):Promise<Response> => {
    const id:number = parseInt(req.params.id)

    let queryString:string = `
        SELECT
            *
        FROM
            developers
        WHERE id = $1;    
    `
    let queryConfig:QueryConfig = {
        text: queryString,
        values: [id]
    }
   
    let queryResult:DevelopersResult= await client.query(queryConfig)
    if(queryResult.rows[0].developerInfoId == null){
        queryString = `
            DELETE FROM
                developers
            WHERE id = $1    
        `
        queryConfig = {
            text:queryString,
            values:[id]
        }
        await client.query(queryConfig)
    }
    queryString = `
        DELETE FROM
            developer_infos
        WHERE id = $1;    
    
    `
    queryConfig = {
        text:queryString,
        values: [+queryResult.rows[0].developerInfoId!]
    }
    
     await client.query(queryConfig)
    
    return res.status(204).send()
}
export {createDeveloper,listDevelopers, listUniqueDeveloper,createDeveloperInfos,updateDevelopers,upadateDevelopersInfos,deleteDeveloper}