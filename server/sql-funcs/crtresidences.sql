drop table residences cascade constraints;

create table residences
 (
  residence_id number(2) primary key,
  residence_name varchar2(30) not null,
  gender_id number(1),
  on_campus number(1),
	lat number(8, 6),
	lng number(8, 6),
  foreign key(gender_id) references genders(gender_id)
  );