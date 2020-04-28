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
        'personality_results'
    ];

    constructor(dbObj) {
        for (let field of Recommendation.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    static async findRecommendations(id) {
        let results = await run(
            `select users.user_id, users.first_name, users.last_name, users.gender_id, users.bio, users.nickname, users.personality_results, residences.name as residence_name 
            from users 
            left join residences on users.residence_id = residences.residence_id
            where users.user_id in (
                (select users.user_id from users minus 
                    (
                        select blockee_id from blocks 
                        where blocker_id = :id
                    ) union 
                    (
                        select blocker_id from blocks 
                        where blockee_id = :id
                    ) 
                    minus (select user_id from users where user_id = :id)
                ) union 
                    (select users.user_id from users where users.user_id in 
                        (
                            (
                                select matches.first_user as id from matches 
                                where matches.first_user != :id 
                                and matches.second_user = :id
                            ) minus 
                            (
                                select matches.second_user as id from matches where matches.second_user != :id 
                                and matches.first_user = :id
                            )
                        )
                    ) minus (select matches.second_user from matches where matches.first_user = :id)
                )
            `,
            [id, id, id, id, id, id, id, id]
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