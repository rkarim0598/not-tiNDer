drop table genders cascade constraints;

create table genders
 (
  gender_id number(2) primary key,
  name varchar2(30) not null
);