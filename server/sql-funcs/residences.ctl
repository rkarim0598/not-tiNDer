load data infile 'allresidences.csv'
insert into table residences
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(name,on_campus,lat,lng)