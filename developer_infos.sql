create database developer;

create type "preferredOS" as enum ('Windows','Linux','MacOS');

create table developer_infos(
	"id" SERIAL primary key,
	"developerSince" DATE NOT NOT,
	"preferredOS"  NOT NULL
);

create table developers (
	"id" SERIAL primary key,
	"name" VARCHAR(50) not null,
	"email" VARCHAR(50) not null,
    "developerInfoId" INTEGER unique,
    add foreign key ("developerInfoId") references developer_infos(id) on delete cascade	

);

create table projects(
	"id" SERIAL primary key,
	name VARCHAR(50) not null,
	"description" text not null,
	"estimatedTime" VARCHAR(50) not null,
	"repository" VARCHAR(120) not null,
	"startDate" DATE not null,
	"endDate" DATE,
    "developerId" INTEGER NOT NULL,
    add foreign key ("developerId") references developerss(id)
);

create table technologies (
	"id" SERIAL primary key,
	"name" VARCHAR(30) not NULL
);

INSERT INTO 
	technologies(name)
VALUES 
    ('JavaScript'),	
    ('Python'),
    ('React'),
    ('Express.js'),
    ('HTML'),
    ('CSS'),
    ('Django'),
    ('PostgreSQL'),
    ('MongoDB');



create table projects_technologies(
	"id" SERIAL primary key,
	"addedIn" DATE not NULL,
    "projectId" INTEGER NOT NULL,
    add foreign key ("projectId") references projects(id),
    "technologyId" INTEGER not null,
    add foreign key ("technologyId") references technologies(id)
);





