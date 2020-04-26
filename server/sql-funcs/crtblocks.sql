drop table blocks cascade constraints;

create table blocks
 (
  block_id number(10) primary key,
  blocker_id varchar2(30) not null,
  blockee_id varchar2(30) not null,
	foreign key(blocker_id) references users(user_id),
  foreign key(blockee_id) references users(user_id)
  );

drop sequence blocks_id_sequence;
create sequence blocks_id_sequence start with 1;

create or replace trigger blocks_id_trigger 
before insert on blocks  
for each row

begin
  select blocks_id_sequence.NEXTVAL
  into   :new.block_id
  from   dual;
end;
/
