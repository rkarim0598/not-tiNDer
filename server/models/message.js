const run = require('../db/query');

module.exports = class Message {
    static fields = [
        'message_id',
        'content',
        'timestamp',
        'sender_id',
        'receiver_id'
    ];

    static async findById(id) {
        let results = await run(
            'select * from messages where message_id = :id',
            [id]
        );

        return new Message(results.rows[0]);
    }

    static async findAllForUsers(first_user, second_user) {
        let results = await run(
            'select * from ('
            + 'select * from messages where sender_id = :first_user and receiver_id = :second_user union '
            + 'select * from messages where sender_id = :second_user and receiver_id = :first_user'
            + ') message_union order by timestamp asc',
            [first_user, second_user, second_user, first_user]
        );

        return results.rows.map(dbObj => new Message(dbObj));
    }

    static async create({content, sender_id, receiver_id}) {
        let result = await run(
            'insert into messages (content, timestamp, sender_id, receiver_id)' +
            'values (:content, :timestamp, :sender_id, :receiver_id)',
            [content, new Date().getTime(), sender_id, receiver_id]
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
        return await User.findById(this.sender_id);
    }

    async receiver() {
        const User = require('./user');
        return await User.findById(this.receiver_id);
    }
}