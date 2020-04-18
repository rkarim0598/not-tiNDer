drop table messages cascade constraints;

create table messages
 (
  message_id number(10) primary key,
  match_id number(10) not null,
  message varchar2(200) not null,
  timestamp number(15) not null,
  user_id varchar2(30) not null,
  foreign key(user_id) references users(user_id),
  foreign key(match_id) references matches(match_id)
  );