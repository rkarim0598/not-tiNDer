drop table events cascade constraints;

create table events
 (
  event_id number(10) primary key,
  event_name varchar2(30) not null,
  user_id varchar2(30) not null,
  location varchar2(30) not null,
  sdate number(15) not null,
  event_description varchar2(100) not null,
  photo blob,
  foreign key(user_id) references users(user_id)
  );

drop sequence events_id_sequence;
create sequence events_id_sequence start with 1;

create or replace trigger events_id_trigger 
before insert on events 
for each row

begin
  select events_id_sequence.NEXTVAL
  into   :new.event_id
  from   dual;
end;
/