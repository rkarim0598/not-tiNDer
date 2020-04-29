const run = require('../db-query');
const oracledb = require('oracledb');

module.exports = class Match {
    static fields = [
        'block_id',
        'blocker_id',
        'blockee_id'
    ];

    static async findByBlockIdAndUser(id, user) {
        let results = await run(
            'select blocker_id, blockee_id from '
            + '(select blocks.* from blocks union select blocks.* from blocks)'
            + ' where block_id = :id and blocker_id = :user',
            [id, user]
        );

        return new Match(results.rows[0]);
    }

    static async findAllByUserId(id) {
        let results = await run(
            'select blocker_id, blockee_id from blocks where blocker_id = :id'
            + ' union '
            + 'select blockee_id, blocker_id from matches where blockee_id = :id',
            [id, id]
        );

        return results.rows.map(dbObj => new User(dbObj));
    }

    static async create({ blockee, blocker }) {
        let result = await run(
            `begin
                :ret := insert_return_block(:blocker, :blockee);
            end;`,
            {
                blocker,
                blockee,
                ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        )
        if (result.error) {
            throw result.error;
        }

        return result.outBinds.ret;
    }

    constructor(dbObj) {
        for (let field of Photo.fields) {
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