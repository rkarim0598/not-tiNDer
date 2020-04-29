load data infile 'allusers.csv'
insert into table users
fields terminated by "," optionally enclosed by '"'
TRAILING NULLCOLS
(user_id,password,first_name,last_name,gender_id,biography,nickname,confirmed_account,reset_token,dorm_id,joined)