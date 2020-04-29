drop table users cascade constraints;

create table users
 (
  user_id varchar2(20) primary key,
  password varchar2(60) not null,
  first_name varchar2(30) not null,
  last_name varchar2(30) not null,
  gender_id number(1),
  bio varchar2(400),
  nickname varchar2(30),
  confirmed_account char(1),
  reset_token varchar2(50),
  residence_id number(2),
  joined char(1),
  personality_id varchar2(4),
  foreign key(residence_id) references residences(residence_id),
  foreign key(gender_id) references genders(gender_id),
  foreign key(personality_id) references personalities(personality_id)
  );
