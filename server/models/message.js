const run = require('../db-query');

module.exports = class Match {
    static fields = [
        'message_id',
        'match_id',
        'message',
        'timestamp',
        'user_id'
    ];

    static async findById(id) {
        let results = await run(
            'select * from messages where message_id = :id',
            [id]
        );

        return new Message(results.rows[0]);
    }

    static async findAllByMatchId(id) {
        let results = await run(
            'select * from messages where match_id = :id',
            [id]
        );

        return results.rows.map(dbObj => new Message(dbObj));
    }

    constructor(dbObj) {
        for(let field of Match.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }

    async sender() {
        return await User.findById(this.user_id);
    }
}