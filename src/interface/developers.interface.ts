import { QueryResult } from 'pg';

interface IDevelopersRequest {
    name : string,
    email: string,
}

interface IDevelopers extends IDevelopersRequest {
    id: number,
    developerInfoId?:number
}

interface IDevelopersInfos{
    id?:number,
    developerSince : string,
    preferredOS: string
}



type DevelopersResult = QueryResult<IDevelopers>
type RequeridKeys = 'name'|'email'
type RequeridKeysInfos = 'developerSince'|'preferredOS'
type DevelopersInfosResult = QueryResult<IDevelopersInfos>


export {IDevelopersRequest,IDevelopers,DevelopersResult,RequeridKeys,IDevelopersInfos,DevelopersInfosResult,RequeridKeysInfos}