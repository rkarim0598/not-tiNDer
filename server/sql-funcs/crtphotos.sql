drop table photos cascade constraints;

create table photos
 (
  photo_id number(10) primary key,
  user_id varchar2(30) not null,
  photo blob not null,
	foreign key(user_id) references users(user_id)
  );

drop sequence photos_id_sequence;
create sequence photos_id_sequence start with 1;

create or replace trigger photos_id_trigger 
before insert on photos 
for each row

begin
  select photos_id_sequence.NEXTVAL
  into   :new.photo_id
  from   dual;
end;
/