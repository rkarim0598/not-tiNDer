select users.user_id, users.first_name, users.last_name, users.gender_id, users.biography, users.nickname, users.personality_id, residences.name as residence_name 
from users 
left join residences on users.residence_id = residences.residence_id
where users.user_id in (
    select users.user_id
    from users
    where users.user_id in (
    select user_id from gender_interests where gender_id = (
        select gender_id from users where user_id = 'soverc@nd.edu')
    )
    intersect
    select users.user_id
    from users
    where users.gender_id in (
        select gender_interests.gender_id from gender_interests where gender_interests.user_id = 'soverc@nd.edu'
    )
) and users.user_id not in 
    (
        (select blockee_id from blocks where blocker_id = 'soverc@nd.edu') 
        union 
        (select blocker_id from blocks where blockee_id = 'soverc@nd.edu') 
        minus 
        (select user_id from users where user_id = 'soverc@nd.edu')
    )
and users.user_id not in (
    (
        (select matches.first_user as id from matches where matches.second_user = 'soverc@nd.edu' and matches.event_id is null)
        intersect
        (select matches.second_user as id from matches where matches.first_user = 'soverc@nd.edu' and matches.event_id is null)
    )
) and users.user_id not in (
    select matches.second_user from matches where matches.first_user = 'soverc@nd.edu'
) order by
    case
        when users.personality_id = (select personalities.duality_id from personalities where personalities.personality_id = 'INFJ')
            then 1
        when users.personality_id = (select personalities.mirage_id from personalities where personalities.personality_id = 'INFJ')
            then 2
        when users.personality_id = (select personalities.semi_duality_id from personalities where personalities.personality_id = 'INFJ')
            then 3
        else 4
    end;