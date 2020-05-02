const run = require('../db/query');

module.exports = class Gender {
    static fields = [
        'gender_id',
        'name'
    ];

    static async findById(id) {
        let results = await run(
            'select * from genders where gender_id = :id',
            [id]
        );

        return new Gender(results.rows[0]);
    }

    static async findAll() {
        let results = await run('select * from genders');

        return results.rows.map(dbObj => new Gender(dbObj));
    }

    constructor(dbObj) {
        for(let field of Gender.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}