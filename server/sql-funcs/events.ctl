load data infile 'allevents.csv'
insert into table events
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(name,user_id,location,sdate,description,photo)