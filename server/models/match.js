const run = require('../db-query');

module.exports = class Match {
    static fields = [
        'match_id',
        'query_user_id',
        'other_user_id'
    ];

    static async findByMatchIdAndUser(id, user) {
        let results = await run(
            'select query_user_id, other_user_id, match_union.* from '
            + '(select matches.*, first_user as query_user_id, second_user as other_user_id from matches union select matches.*, second_user as query_user_id, first_user as other_user_id from matches) match_union'
            + ' where match_id = :match_id and query_user_id = :user_id',
            [id, user]
        );
        if(results.error) {
            throw results.error;
        }
        if(results.rows.length > 0) {
            return new Match(results.rows[0]);
        }
        return null;
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
        for(let field of Match.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    async query_user() {
        const User = require('./user');
        return await User.findById(this.query_user_id);
    }

    async other_user() {
        const User = require('./user');
        return await User.findById(this.other_user_id);
    }

    async messages() {
        const Message = require('./message');
        return await Message.findAllByMatchId(this.match_id);
    }
}