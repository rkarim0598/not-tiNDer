const Gender = require('./gender');
const Residence = require('./residence');

const run = require('../db-query');

module.exports = class User {
    static fields = [
        'user_id',
        'password',
        'first_name',
        'last_name',
        'gender_id',
        'bio',
        'nickname',
        'confirmed_account',
        'reset_token',
        'residence_id',
        'joined',
        'personality_results'
    ];

    static async findById(id) {
        let results = await run(
            'select * from users where user_id = :id',
            [id]
        );

        console.log(results);

        return new User(results.rows[0]);
    }

    constructor(dbObj) {
        for(let field of User.fields) {
            this[field] = dbObj[field.toUpperCase()];
        }
    }
  
    async gender() {
        return await Gender.findById(this.gender_id);
    }

    async residence() {
        return await Residence.findById(this.residence_id);
    }
  }