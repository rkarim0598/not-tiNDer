drop table genders cascade constraints;

create table genders
 (
  gender_id number(2) primary key,
  name varchar2(30) not null
);

drop sequence genders_id_sequence;
create sequence genders_id_sequence start with 1;

create or replace trigger genders_id_trigger 
before insert on genders 
for each row

begin
  select genders_id_sequence.NEXTVAL
  into   :new.gender_id
  from   dual;
end;
/
