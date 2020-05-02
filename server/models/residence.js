const run = require('../db/query');

module.exports = class Residence {
    static fields = [
        'residence_id',
        'name',
        'on_campus',
        'lat',
        'lng'
    ];

    static async findById(id) {
        let results = await run(
            'select * from residences where residence_id = :id',
            [id]
        );

        return new Residence(results.rows[0]);
    }

    static async findAll() {
        let results = await run('select * from residences');

        return results.rows.map(dbObj => new Residence(dbObj));
    }

    constructor(dbObj) {
        for(let field of Residence.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}