load data infile 'allpersonalities.csv'
insert into table personalities
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(personality_id,description,duality_id,mirage_id,semi_duality_id)