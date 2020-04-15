load data infile 'alldorms.csv'
insert into table dorms
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(dorm_id,name,gender_id,lat,lng)