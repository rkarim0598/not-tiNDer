drop table users;

create table users
 (
  user_id varchar2(20) primary key,
  password varchar2(60) not null,
  first_name varchar2(30) not null,
  last_name varchar2(30) not null,
  gender_id number(10),
  bio varchar2(200),
  nickname varchar2(30),
  confirmed_account char(1),
  reset_token varchar2(50),
  dorm varchar2(30),
  joined char(1)
  );

exit;