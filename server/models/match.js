const run = require('../db-query');

module.exports = class Match {
    static fields = [
        'match_id',
        'query_user',
        'other_user'
    ];

    static async findByMatchIdAndUser(id, user) {
        let results = await run(
            'select query_user, other_user, * from '
            + '(select matches.*, first_user as query_user, second_user as other_user from matches union select matches.*, second_user as query_user, first_user as other_user from matches)'
            + ' where match_id = :id and query_user = :user',
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