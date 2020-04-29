const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

/**
 * 
 * @param {String} query 
 * @param {String[]} bindList 
 */
module.exports = async function run(query, bindList = [], connection = undefined) {
    let shouldClose = true;
    try {
        if(connection) {
            shouldClose = false;
        }
        connection = connection || await oracledb.getConnection(dbConfig);

        const results = await connection.execute(
            query,
            bindList,
            { autoCommit: true } // necessary for changes to actually store in the db, set to false if you don't want changes to persist in db
        )

        return results;
    } catch (error) {
        console.log(error);
        return { error }
    } finally {
        if (connection && shouldClose) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
