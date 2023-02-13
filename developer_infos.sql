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
values ('JavaScript'),	
values ('Python'),
values ('React'),
values ('Express.js'),
values ('HTML'),
values ('CSS'),
values ('Django'),
values ('PostgreSQL'),
values ('MongoDB');



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

ALTER TABLE developer_infos  
RENAME COLUMN current_ TO "preferredOS";

INSERT INTO
    developers(%I)
VALUES
    (%L)    
RETURNING*;

SELECT 	
    de.id AS "developerID",
    de."name" AS "developerName",
    de.email AS "developerEmail",
    de."developerInfoId" ,
    di."developerSince" AS "developerInfoDeveloperSince",
    di."preferredOS" AS "developerInfoPreferredOS" 
FROM 
    developers de
FULL OUTER JOIN 
    developer_infos di  
ON 
     de."developerInfoId"= di.id
ORDER BY de.id;

SELECT 	
    de.id AS "developerID",
    de."name" AS "developerName",
    de.email AS "developerEmail",
    de."developerInfoId" ,
    di."developerSince" AS "developerInfoDeveloperSince",
    di."preferredOS" AS "developerInfoPreferredOS" 
FROM 
    developers de 
LEFT JOIN
    developer_infos di  
ON 
    de."developerInfoId"= di.id
WHERE de.id = $1;

INSERT INTO
    developer_infos(%I)
VALUES(%L)
RETURNING*;

UPDATE
    developers
SET 
    "developerInfoId" = $1
WHERE id = $2
RETURNING*; 

UPDATE
    developers
SET (%I) = ROW(%L)
WHERE id = $1
RETURNING*;

UPDATE
    developer_infos
SET (%I) = ROW(%L)
WHERE id = $1
RETURNING*;

SELECT
    *
FROM
    developers
WHERE id = $1; 

DELETE FROM
    developers
WHERE id = $1;

DELETE FROM
    developer_infos
WHERE id = $1;

INSERT INTO
    projects(%I)
VALUES(%L)
RETURNING*;

SELECT 
	pr.id as "projectID",
    pr."name" as "projectName",
    pr.description as "projectDescription",
    pr."estimatedTime" as "projectEstimatedTime",
    pr.repository as "projectRepository",
    pr."startDate"  as "projectStartDate",
    pr."endDate" as "projectEndDate",
    pr."developerId" as "projectDeveloperID",
    t.id as "technologyId",
    t.name as "technologyName"
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
ORDER BY pr.id;

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
WHERE p.id = $1;

UPDATE
    projects
SET (%I) = ROW(%L)
WHERE id = $1
RETURNING*;

DELETE FROM
    projects
WHERE id = $1;

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

SELECT
    *
FROM
	technologies
WHERE name = $1;

INSERT INTO
    projects_technologies("addedIn","projectId","technologyId")
VALUES($1,$2,$3)
RETURNING*;

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

SELECT 
	*
FROM 	
	technologies 
WHERE name = $1;

DELETE FROM
    projects_technologies
WHERE
    "technologyId" = $1 AND "projectId" = $2
RETURNING*;    
