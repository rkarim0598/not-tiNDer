const run = require('../db-query');

module.exports = class Match {
    static fields = [
        'match_id',
        'query_user_id',
        'other_user_id'
    ];

    static async findByIdAndUser(id, user) {
        let results = await run(
            'select :query_user, second_user AS other_user, * from match_id where match_id = :id',
            [id, user]
        );

        return new Match(results.rows[0]);
    }

    static async findAllByUserId(id) {
        let results = await run(
            'select first_user as query_user_id, second_user AS other_user_id, * from matches where first_user = :id'
            + ' union '
            + 'select second_user as query_user_id, first_user AS other_user_id, * from matches where second_user = :id',
            [id, id]
        );
        
        return results.rows.map(dbObj => new User(dbObj));
    }

    constructor(dbObj) {
        for(let field of Photo.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    // async query_user() {
    //     return await User.findById(this.query_user_id);
    // }

    async other_user() {
        return await User.findById(this.other_user_id);
    }

    async messages() {
        return await Message.findAllByMatchId(this.match_id);
    }
}