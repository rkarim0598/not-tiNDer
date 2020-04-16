load data infile 'allgenders.csv'
insert into table genders
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(gender_id,gender_name,gender_description)