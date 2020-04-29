load data infile 'allevents.csv'
insert into table events
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(event_name,user_id,location,sdate,event_description,photo)