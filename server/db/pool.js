var oracledb = require('oracledb');
var config = require('./config');

let pool = null;

module.exports = async function() {
    if(pool == null) {
        pool = await oracledb.createPool(config);
    }
    const connection = pool.getConnection();
    return connection.then((connection) => {
        setTimeout(async () => {
            try { await connection.ping(); await connection.break(); } catch {}
        }, 3000);
        return connection;
    });
};
