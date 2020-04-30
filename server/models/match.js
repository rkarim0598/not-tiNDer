const run = require('../db-query');
const oracledb = require('oracledb');

module.exports = class Match {
    static fields = [
        'match_id',
        'first_user',
        'second_user',
        'matched_with_user',
        'event_id'
    ];

    // one way matches where first_user is the instigator
    static async findMatchWithUser(user_id, other_id) {
        let results = await run(
            'select * from matches where first_user = :user_id and second_user = :other_id ',
            [user_id, other_id]
        );
        if(results.error) {
            throw results.error;
        }
        if(results.rows.length > 0) {
            return new Match(results.rows[0]);
        }
        return null;
    }

    // two way matches
    static async findAllByUserId(id) {
        let results = await run(
            'select first_user as query_user_id, second_user AS other_user_id, matches.* from matches where first_user = :id'
            + ' union '
            + 'select second_user as query_user_id, first_user AS other_user_id, matches.* from matches where second_user = :id',
            [id, id]
        );
        let data = results.rows.map(dbObj => ({ ...dbObj, 'MATCHED_WITH_USER': dbObj['OTHER_USER_ID']}));
        return data.map(dbObj => new Match(dbObj));
    }

    static async create({ other_user_id, event_id = null, user_id }) {

        let result = event_id ?
            await run(
                `begin
                    :ret := insert_return_match_for_event(:first_user, :second_user, :event_id);
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

    async other_user() {
        const User = require('./user');
        return await User.findById(this.second_user);
    }

    async messages() {
        const Message = require('./message');
        return await Message.findAllForUsers(this.first_user, this.second_user);
    }
    
    async matched_back() {
        return !!(await Match.findMatchWithUser(second_user, first_user));
    }

    async latest_message() {
        const messages = await this.messages();
        if(messages && messages.length) {
            return messages[messages.length - 1];
        }
        return null;
    }
}