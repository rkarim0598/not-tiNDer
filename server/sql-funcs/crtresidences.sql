drop table residences cascade constraints;

create table residences
(
  residence_id number(2) primary key,
  name varchar2(30) not null,
  on_campus number(1),
	lat number(8, 6),
	lng number(8, 6)
);