const run = require('../db/query');

module.exports = class User {
    static fields = [
        'user_id',
        'password',
        'first_name',
        'last_name',
        'gender_id',
        'biography',
        'nickname',
        'confirmed_account',
        'reset_token',
        'residence_id',
        'joined',
        'personality_id',
        'seriousness'
    ];

    static async findById(id) {
        let results = await run(
            'select * from users where user_id = :id',
            [id]
        );

        if (results.error) {
            throw results.error;
        }
        if (results.rows.length > 0) {
            return new User(results.rows[0]);
        }
        return null;
    }

    constructor(dbObj) {
        for(let field of User.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
  
    async gender() {
        const Gender = require('./gender');
        return await Gender.findById(this.gender_id);
    }

    async gender_interest() {
        const Gender = require('./gender');
        return await Gender.findInterestsById(this.user_id);
    }

    async residence() {
        const Residence = require('./residence');
        return await Residence.findById(this.residence_id);
    }

    async matches() {
        const Match = require('./match');
        return await Match.findAllByUserId(this.user_id);
    }

    async photos() {
        const Photo = require('./photo');
        return (await Photo.findAllByUserId(this.user_id)).map(photo => photo.photo_id);
    }

    async avatar() {
        return ((await this.photos)[0] || {photo_id: null}).photo_id;
    }
  }