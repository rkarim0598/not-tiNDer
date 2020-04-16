drop table genders cascade constraints;

create table genders
 (
  gender_id number(1) primary key,
  gender_name varchar2(30) not null,
  gender_description varchar2(30)
  );