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

