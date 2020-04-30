const run = require('../db-query');

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
        'personality_id'
    ];

    static async findById(id) {
        let results = await run(
            'select * from users where user_id = :id',
            [id]
        );

        return new User(results.rows[0]);
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
        const Photo = require('./photo');
        return (await Photo.findAllByUserId(this.user_id))[0] || null;
    }
  }