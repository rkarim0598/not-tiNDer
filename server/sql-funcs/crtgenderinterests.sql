drop table gender_interests cascade constraints;

create table gender_interests
 (
  gender_interests_id number(3) primary key,
  user_id varchar2(30) not null,
  gender_id number(2) not null,
  foreign key(user_id) references users(user_id),
  foreign key(gender_id) references genders(gender_id)
  );