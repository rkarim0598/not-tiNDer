drop table matches cascade constraints;

create table matches
 (
  match_id number(10) primary key,
  first_user varchar2(30) not null,
  second_user varchar2(30) not null,
	foreign key(first_user) references users(user_id),
  foreign key(second_user) references users(user_id)
  );