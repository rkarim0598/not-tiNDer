drop table personalities cascade constraints;

create table personalities
 (
  personality_id varchar2(4) primary key,
  description varchar2(300),
  duality_id varchar2(4) not null,
  mirage_id varchar2(4) not null,
  semi_duality_id varchar2(4)
  );
