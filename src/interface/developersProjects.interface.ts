import { QueryResult } from "pg";

interface IDeveloperAllProjects  {
    id:number,
	name : string,
	email: string,
    developerSince: string,
	preferredOS: string,
	description: string,
	estimatedTime: string,
	repository: string,
	startDate: Date,
	endDate: Date,
	
}
interface ITechnologiesRequest {
    id?:number,
    name:string
}
interface IProjectWithTech {
    id: number,
    name :string,
    description:string,
    estimatedTime:string,
    repository:string,
    startDate:Date,
    endDate: Date
}

type DeveloperAllProjectsResult =QueryResult<IDeveloperAllProjects>
type TechnologiesResult = QueryResult<ITechnologiesRequest>
type ProjectWithTechResult = QueryResult<IProjectWithTech>

export {DeveloperAllProjectsResult,TechnologiesResult,ProjectWithTechResult}