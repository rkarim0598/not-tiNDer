load data infile 'allresidences.csv'
insert into table residences
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(residence_id,residence_name,gender_id,on_campus,lat,lng)