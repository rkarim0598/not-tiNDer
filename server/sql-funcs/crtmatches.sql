drop table matches cascade constraints;

create table matches
 (
  match_id number(10) primary key,
  first_user varchar2(30) not null,
  second_user varchar2(30) not null,
  event_id number(10),
	foreign key(first_user) references users(user_id),
  foreign key(second_user) references users(user_id),
  foreign key(event_id) references events(event_id)
  );

create index matches_first_user_i on matches(first_user);
create index matches_second_user_i on matches(second_user);

drop sequence matches_id_sequence;
create sequence matches_id_sequence start with 1;

create or replace trigger matches_id_trigger 
before insert on matches 
for each row

begin
  select matches_id_sequence.NEXTVAL
  into   :new.match_id
  from   dual;
end;
/