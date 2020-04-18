drop table photos cascade constraints;

create table photos
 (
  user_photo_id number(10) primary key,
  user_id varchar2(30) not null,
  photo varchar2(200) not null,
	foreign key(user_id) references users(user_id)
  );