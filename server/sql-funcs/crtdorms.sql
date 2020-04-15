drop table dorms cascade constraints;

create table dorms
 (
  dorm_id number(2) primary key,
  name varchar2(30) not null,
  gender_id number(1),
	lat number(8, 6),
	lng number(8, 6)
  );