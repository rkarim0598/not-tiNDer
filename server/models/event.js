const run = require('../db-query');

module.exports = class Event {
    static fields = [
        'event_id',
        'event_name',
        'user_id',
        'location',
        'sdate',
        'event_description',
        'photo'
    ];

    static async findById(id) {
        let results = await run(
            'select * from events where event_id = :id',
            [id]
        );

        return new Event(results.rows[0]);
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