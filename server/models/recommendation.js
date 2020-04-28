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
        for(let field of Recommendation.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    static async findRecommendations(id) {
        let results = await run(
            'select users.user_id, users.first_name, users.last_name, users.gender_id, ' + 
            'users.bio, users.nickname, users.personality_results, residences.name as residence_name ' + 
            'from users ' +
            'left join residences on users.residence_id = residences.residence_id ' + 
            'where users.user_id != :user_id',
            [id]
        )

        return results.rows.map(dbObj => new Recommendation(dbObj));
    }
}