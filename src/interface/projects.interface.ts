import { QueryResult } from "pg"

interface IProjectsRequest {
    name:string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date | null,
    endDate?: Date | null,
    developerId: number
}

interface Iprojects extends IProjectsRequest{
    id: number
    
}

interface IProjectTechnologies extends Iprojects{
    technologyId: number,
    name:string
}

type ProjectsResult = QueryResult<Iprojects>
type ProjectsKeys = ['name', 'description','estimatedTime','repository','startDate','developerId'] 
type ProjectTechnologiesResult = QueryResult<IProjectTechnologies>


export {IProjectsRequest,ProjectsResult,ProjectsKeys,ProjectTechnologiesResult}