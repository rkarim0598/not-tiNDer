select users.user_id
from users
where users.user_id = 'mbuzar@nd.edu' and users.user_id in (
    select user_id from gender_interests where gender_id = (
        select gender_id from users where user_id = 'soverc@nd.edu')
)
intersect
    select users.user_id
    from users
    where users.gender_id in (
        select gender_interests.gender_id from gender_interests where gender_interests.user_id = 'soverc@nd.edu'
    )
    intersect
        (select users.user_id from users
            minus 
                (select blockee_id from blocks where blocker_id = 'soverc@nd.edu') 
            union 
                (select blocker_id from blocks where blockee_id = 'soverc@nd.edu') 
            minus 
                (select user_id from users where user_id = 'soverc@nd.edu')
        ) 
    union 
        (select users.user_id from users where users.user_id in 
            ((select matches.first_user as id from matches where matches.second_user = 'soverc@nd.edu' and matches.event_id is null) 
            union 
            (select matches.second_user as id from matches where matches.first_user = 'soverc@nd.edu' and matches.event_id is null)
            )
        ) minus (select matches.second_user as id from matches where matches.first_user = 'soverc@nd.edu' and matches.event_id is not null)
;
