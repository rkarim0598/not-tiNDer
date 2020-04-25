drop table blocks cascade constraints;

create table blocks
 (
  block_id number(10) primary key,
  blocker_id varchar2(30) not null,
  blockee_id varchar2(30) not null,
	foreign key(blocker_id) references users(user_id),
  foreign key(blockee_id) references users(user_id)
  );