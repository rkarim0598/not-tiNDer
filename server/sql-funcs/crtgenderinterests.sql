drop table gender_interests cascade constraints;

create table gender_interests
 (
  gender_interest_id number(3) primary key,
  user_id varchar2(30) not null,
  gender_id number(2) not null,
  foreign key(user_id) references users(user_id),
  foreign key(gender_id) references genders(gender_id)
  );

drop sequence gender_interests_id_sequence;
create sequence gender_interests_id_sequence start with 1;

create or replace trigger gender_interests_id_trigger 
before insert on gender_interests 
for each row

begin
  select gender_interests_id_sequence.NEXTVAL
  into   :new.gender_interest_id
  from   dual;
end;
/