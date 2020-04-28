const run = require('../db-query');
const oracledb = require('oracledb');

module.exports = class Match {
    static fields = [
        'match_id',
        'query_user',
        'other_user',
        'event_id'
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

    static async create({ other_user_id, event_id = null, user_id }) {

        let result = event_id ?
            await run(
                `begin
                    :ret := insert_return_match(:first_user, :second_user, :event_id);
                end;`,
            { 
                'first_user': user_id, 
                'second_user': other_user_id,
                'event_id': event_id,
                ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
            ) :
            await run(
                `begin
                    :ret := insert_return_match(:first_user, :second_user);
                end;`,
                { 
                    'first_user': user_id, 
                    'second_user': other_user_id,
                    ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                }
            )
        if (result.error) {
            throw result.error;
        }

        return result.outBinds.ret;
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