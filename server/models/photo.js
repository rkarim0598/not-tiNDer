const run = require('../db-query');
const oracledb = require('oracledb');

module.exports = class Photo {
    static fields = [
        'photo_id',
        'user_id',
        'photo',
        'mimetype'
    ];

    static async findById(id, connection = undefined) {
        let results = await run(
            'select * from photos where photo_id = :id',
            [id],
            connection
        );

        return new Photo(results.rows[0]);
    }

    static async findAllByUserId(id, connection = undefined) {
        let results = await run(
            'select * from photos where user_id = :id',
            [id],
            connection
        );

        return results.rows.map(dbObj => new Photo(dbObj));
    }

    static async create({photo, mimetype, user_id}, connection) {
        const templob = await connection.createLob(oracledb.CLOB);
        photo.pipe(templob);
        await new Promise((success, reject) => {
            templob.on('finish', success);
            templob.on('error', reject);
        });
        let result = await run(
            'insert into photos (photo, mimetype, user_id)' +
            'values (:photo, :mimetype, :user_id)',
            [templob, mimetype, user_id],
            connection
        );
        templob.destroy();
        if(result.error) {
            throw result.error;
        }
        result = await run(
            'select * from photos where rowid = :id',
            [result.lastRowid],
            connection
        );
        return new Photo(result.rows[0]);
    }

    constructor(dbObj) {
        for(let field of Photo.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
}