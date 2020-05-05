drop table messages cascade constraints;

create table messages
 (
  message_id number(10) primary key,
  content varchar2(200) not null,
  timestamp number(15) not null,
  sender_id varchar2(30) not null,
  receiver_id varchar2(30) not null,
  foreign key(sender_id) references users(user_id),
  foreign key(receiver_id) references users(user_id)
  );

create index messages_sender_id_i on messages(sender_id);
create index messages_receiver_id_i on messages(receiver_id);

drop sequence messages_id_sequence;
create sequence messages_id_sequence start with 1;

create or replace trigger messages_id_trigger 
before insert on messages 
for each row

begin
  select messages_id_sequence.NEXTVAL
  into   :new.message_id
  from   dual;
end;
/