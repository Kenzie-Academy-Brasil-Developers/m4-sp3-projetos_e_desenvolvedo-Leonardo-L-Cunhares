create database developer;

create type "preferredOS" as enum ('Windows','Linux','MacOS');
create table developer_infos(
	id SERIAL primary key,
	"developerSince" DATE not null,
	current_"preferredOS"  not NULL
);

create table developers (
	id SERIAL primary key,
	name VARCHAR(50) not null,
	email VARCHAR(50) not null
);

create table projects(
	"id" SERIAL primary key,
	name VARCHAR(50) not null,
	"description" text not null,
	"estimatedTime" VARCHAR(50) not null,
	"repository" VARCHAR(120) not null,
	"startDate" DATE not null,
	"endDate" DATE
);

create table technologies (
	"id" SERIAL primary key,
	"name" VARCHAR(30) not NULL
);

insert into 
	technologies(name)
values ('JavaScript');	
values ('Python');	
values ('React');
values ('Express.js');
values ('HTML');
values ('CSS');
values ('Django');
values ('PostgreSQL');
values ('MongoDB');

select 
	*
from technologies;	


create table projects_technologies(
	"id" SERIAL primary key,
	"addedIn" DATE not NULL
);

alter table 
	developers
add column "developerInfoId" INTEGER unique;

alter table	
	developers 
add foreign key ("developerInfoId") references developer_infos(id);	

SELECT 
	pr.*,
    pt."technologyId" ,
    t."name" 
FROM 
    projects pr
LEFT JOIN
	projects_technologies pt 
ON 
    pt."projectId" = pr.id
LEFT JOIN 
    technologies t 
ON 
t.id  = pt."technologyId";



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