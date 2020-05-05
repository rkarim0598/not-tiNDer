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
        if (results.error) {
            throw results.error;
        }
        if (results.rows.length > 0) {
            return new Gender(results.rows[0]);
        }
        return null;
    }

    static async findAll() {
        let results = await run('select * from genders');

        return results.rows.map(dbObj => new Gender(dbObj));
    }

    static async findInterestsById(id) {
        let results = await run(
            'select * from genders natural join (select * from gender_interests where user_id = :id)',
            [id]
        );
        return results.rows.map(dbObj => new Gender(dbObj));
    }

    static async create({name}) {
        let result = await run(
            'insert into genders (name)' +
            'values (:name)',
            [name]
        );
        if(result.error) {
            throw result.error;
        }
        result = await run(
            'select * from genders where rowid = :id',
            [result.lastRowid]
        );
        return new Gender(result.rows[0]);
    }

    constructor(dbObj) {
        for(let field of Gender.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}