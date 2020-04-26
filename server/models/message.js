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

    static async create({match_id, message, user_id}) {
        let result = await run(
            'insert into messages (match_id, message, timestamp, user_id)' +
            'values (:match_id, :message, :timestamp, :user_id)',
            [match_id, message, new Date().getTime(), user_id]
        );
        if(result.error) {
            throw result.error;
        }
        return new Message(result.rows[0]);
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