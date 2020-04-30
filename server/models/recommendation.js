const User = require('./user');
const run = require('../db-query');

module.exports = class Recommendation {
    static fields = [
        'user_id',
        'first_name',
        'last_name',
        'gender_id',
        'biography',
        'nickname',
        'residence_name',
        'personality_id'
    ];

    constructor(dbObj) {
        for (let field of Recommendation.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    static async findRecommendations({ event_id, user_id }) {
        console.log(user_id);
        let personality = await User.findById(user_id);
        personality = personality.personality_id;
        console.log(event_id);
        let sql = `select users.*, residences.name as residence_name 
        from users 
        left join residences on users.residence_id = residences.residence_id
        where users.user_id in (
            select users.user_id
            from users
            where users.user_id in (
            select user_id from gender_interests where gender_id = (
                select gender_id from users where user_id = :user_id)
            )
            intersect
            select users.user_id
            from users
            where users.gender_id in (
                select gender_interests.gender_id from gender_interests where gender_interests.user_id = :user_id
            )
        ) and users.user_id not in 
            (
                (select blockee_id from blocks where blocker_id = :user_id) 
                union 
                (select blocker_id from blocks where blockee_id = :user_id) 
                minus 
                (select user_id from users where user_id = :user_id)
            )
        and users.user_id not in (
            (
                (select matches.first_user as id from matches where matches.second_user = :user_id and matches.event_id is null)
                intersect
                (select matches.second_user as id from matches where matches.first_user = :user_id and matches.event_id is null)
            )
        ) and users.user_id not in (
            select matches.second_user from matches where matches.first_user = :user_id
        ) order by
            case
                when users.personality_id = (select personalities.duality_id from personalities where personalities.personality_id = :personality)
                    then 1
                when users.personality_id = (select personalities.mirage_id from personalities where personalities.personality_id = :personality)
                    then 2
                when users.personality_id = (select personalities.semi_duality_id from personalities where personalities.personality_id = :personality)
                    then 3
                else 4
            end`;
        let bindList = [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, personality, personality, personality];
        
        if (event_id !== null) {
            sql = `select users.user_id, users.first_name, users.last_name, users.gender_id, users.biography, users.nickname, users.personality_id, residences.name as residence_name 
            from users 
            left join residences on users.residence_id = residences.residence_id
            where users.user_id in (
                select users.user_id
                from users
                where users.user_id in (
                select user_id from gender_interests where gender_id = (
                    select gender_id from users where user_id = :user_id)
                )
                intersect
                select users.user_id
                from users
                where users.gender_id in (
                    select gender_interests.gender_id from gender_interests where gender_interests.user_id = :user_id
                )
            ) and users.user_id not in 
                (
                    (select blockee_id from blocks where blocker_id = :user_id) 
                    union 
                    (select blocker_id from blocks where blockee_id = :user_id) 
                    minus 
                    (select user_id from users where user_id = :user_id)
                )
            and users.user_id not in (
                (
                    (select matches.first_user as id from matches where matches.second_user = :user_id and matches.event_id = :event_id)
                    intersect
                    (select matches.second_user as id from matches where matches.first_user = :user_id and matches.event_id = :event_id)
                )
            ) and users.user_id not in (
                select matches.second_user from matches where matches.first_user = :user_id
            ) order by
                case
                    when users.personality_id = (select personalities.duality_id from personalities where personalities.personality_id = :personality)
                        then 1
                    when users.personality_id = (select personalities.mirage_id from personalities where personalities.personality_id = :personality)
                        then 2
                    when users.personality_id = (select personalities.semi_duality_id from personalities where personalities.personality_id = :personality)
                        then 3
                    else 4
                end`;
            bindList = [user_id, user_id, user_id, user_id, user_id, user_id, event_id, user_id, event_id, user_id, personality, personality, personality];
        }

        let results = await run(
            sql,
            bindList
        )

        if (results.error) {
            throw results.error;
        }
        return results.rows.map(dbObj => new Recommendation(dbObj));
    }

    async avatar() {
        return ((await this.photos)[0] || {photo_id: null}).photo_id;
    }

    async photos() {
        const Photo = require('./photo');
        return (await Photo.findAllByUserId(this.user_id)).map(photo => photo.photo_id);
    }
}