load data infile 'allgenders.csv'
insert into table genders
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(name)