const run = require('../db/query');

module.exports = class Event {
    static fields = [
        'event_id',
        'name',
        'user_id',
        'location',
        'sdate',
        'description',
        'photo'
    ];

    static async findById(id) {
        let results = await run(
            'select * from events where event_id = :id',
            [id]
        );

        if (results.error) {
            throw results.error;
        }
        if (results.rows.length > 0) {
            return new Event(results.rows[0]);
        }
        return null;
    }

    static async findAll() {
        let results = await run('select * from events');

        return results.rows.map(dbObj => new Event({ ...dbObj, sdate: dbObj['sdate'] + "" }));
    }

    constructor(dbObj) {
        for (let field of Event.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}