const run = require('../db-query');

module.exports = class Message {
    static fields = [
        'message_id',
        'match_id',
        'content',
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

    static async create({match_id, content, user_id}) {
        let result = await run(
            'insert into messages (match_id, content, timestamp, user_id)' +
            'values (:match_id, :content, :timestamp, :user_id)',
            [match_id, content, new Date().getTime(), user_id]
        );
        if(result.error) {
            throw result.error;
        }
        result = await run(
            'select * from messages where rowid = :id',
            [result.lastRowid]
        );
        return new Message(result.rows[0]);
    }

    constructor(dbObj) {
        for(let field of Message.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
        this.timestamp = this.timestamp + '';
    }

    async sender() {
        const User = require('./user');
        return await User.findById(this.user_id);
    }
}