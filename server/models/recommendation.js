const User = require('./user');
const run = require('../db-query');

module.exports = class Recommendation {
    static fields = [
        'user_id',
        'first_name',
        'last_name',
        'gender_id',
        'bio',
        'nickname',
        'residence_name',
        'personality_id'
    ];

    constructor(dbObj) {
        for (let field of Recommendation.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    static async findRecommendations(id) {
        let personality = await User.findById(id);
        personality = personality.personality_id;

        let results = await run(
            `select users.user_id, users.first_name, users.last_name, users.gender_id, users.bio, users.nickname, users.personality_id, residences.name as residence_name 
            from users 
            left join residences on users.residence_id = residences.residence_id
            where users.user_id in (
                        select users.user_id
                        from users
                        where users.user_id in (
                        select user_id from gender_interests where gender_id = (
                            select gender_id from users where user_id = :id)
                        )
                    intersect
                        select users.user_id
                        from users
                        where users.gender_id in (
                            select gender_interests.gender_id from gender_interests where gender_interests.user_id = :id
                        )
                intersect
                    (select users.user_id from users
                    minus 
                        (select blockee_id from blocks where blocker_id = :id) 
                        union 
                        (select blocker_id from blocks where blockee_id = :id) 
                        minus 
                        (select user_id from users where user_id = :id)) 
                union 
                    (select users.user_id from users where users.user_id in 
                        ((select matches.first_user as id from matches where matches.second_user = :id) 
                        minus 
                        (select matches.second_user as id from matches where matches.first_user = :id)
                        )
                ) minus 
                (select matches.second_user from matches where matches.first_user = :id)
            ) order by 
                case
                    when users.personality_id = (select personalities.duality_id from personalities where personalities.personality_id = :personality_id)
                        then 1
                    when users.personality_id = (select personalities.mirage_id from personalities where personalities.personality_id = :personality_id)
                        then 2
                    when users.personality_id = (select personalities.semi_duality_id from personalities where personalities.personality_id = :personality_id)
                        then 3
                    else 4
                end
            `,
            [id, id, id, id, id, id, id, id, personality, personality, personality]
        )

        /*
select users.user_id from users minus (select blockee_id from blocks where blocker_id = 'rkarim@nd.edu') minus (select user_id from users where user_id = 'rkarim@nd.edu');
        */

        /*
select users.user_id, users.first_name, users.last_name from users where users.user_id in (select users.user_id from users minus (select blockee_id from blocks where blocker_id = 'rkarim@nd.edu') minus (select user_id from users where user_id = 'rkarim@nd.edu'));
        */

        /*
        this gets all users that have not been blocked by the user and have not blocked the user
select users.user_id, users.first_name, users.last_name from users where users.user_id in (select users.user_id from users minus (select blockee_id from blocks where blocker_id = 'rkarim@nd.edu') union (select blocker_id from blocks where blockee_id = 'rkarim@nd.edu') minus (select user_id from users where user_id = 'rkarim@nd.edu'));
        */

        /*
        this gets all users that have matched with the user
        select users.user_id from users where users.user_id in (select matches.first_user from matches where matches.first_user != 'rkarim@nd.edu' and matches.second_user = 'rkarim@nd.edu');
        */
        /*
        this gets all users that the user hasn't matched with or have tried to match with the user
        select users.user_id from users where users.user_id in ((select matches.first_user as id from matches where matches.first_user != 'hgborbu@nd.edu' and matches.second_user = 'hgorbu@nd.edu') minus (select matches.second_user as id from matches where matches.second_user != 'hgborbu@nd.edu' and matches.first_user = 'hgorbu@nd.edu')); 
        */

        /*
        this gets all users that have not been blocked by the user and have not blocked the user
        and that the user hasn't matched with or users who have tried to match with the user
        */
        return results.rows.map(dbObj => new Recommendation(dbObj));
    }
}