const run = require('../db/query');

module.exports = class GenderInterest {
    static fields = [
        'gender_interest_id',
        'name',
        'user_id',
        'gender_id',
    ];

    static async findById(id) {
        let results = await run(
            'select * from genders natural join (select * from gender_interests where user_id = :id)',
            [id]
        );
        return results.rows.map(dbObj => new GenderInterest(dbObj));
    }

    constructor(dbObj) {
        for(let field of GenderInterest.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}