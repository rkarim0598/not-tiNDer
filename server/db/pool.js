var oracledb = require('oracledb');
var config = require('./config');

let pool = null;

module.exports = async function() {
    if(pool == null) {
        pool = await oracledb.createPool(config);
    }
    return pool.getConnection();
};