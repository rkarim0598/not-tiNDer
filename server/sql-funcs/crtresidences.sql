drop table residences cascade constraints;

create table residences
(
  residence_id number(2) primary key,
  name varchar2(30) not null,
  on_campus number(1),
	lat number(8, 6),
	lng number(8, 6)
);

drop sequence residences_id_sequence;
create sequence residences_id_sequence start with 1;

create or replace trigger residences_id_trigger 
before insert on residences 
for each row

begin
  select residences_id_sequence.NEXTVAL
  into   :new.residence_id
  from   dual;
end;
/
