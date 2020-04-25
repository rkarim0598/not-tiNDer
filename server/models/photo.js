const run = require('../db-query');

module.exports = class Photo {
    static fields = [
        'photo_id',
        'user_id',
        'photo'
    ];

    static async findById(id) {
        let results = await run(
            'select * from photos where photo_id = :id',
            [id]
        );

        return new Photo(results.rows[0]);
    }

    static async findAllByUserId(id) {
        let results = await run(
            'select * from photos where user_id = :id',
            [id]
        );

        return results.rows.map(dbObj => new Photo(dbObj));
    }

    constructor(dbObj) {
        for(let field of Photo.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}