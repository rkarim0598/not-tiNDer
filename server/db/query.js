const oracledb = require('oracledb');
const getConnection = require('./pool');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

/**
 * 
 * @param {String} query 
 * @param {String[]} bindList 
 */
module.exports = async function query(query, bindList = [], connection = undefined) {
    let shouldClose = connection === undefined;
    try {
        connection = connection || await getConnection();
        const start = new Date();
        console.log('Query started', query.replace(/\n/g, ' '));
        const results = await connection.execute(
            query,
            bindList,
            { autoCommit: true } // necessary for changes to actually store in the db, set to false if you don't want changes to persist in db
        )
        const end = new Date();
        console.log('Query took ' + (end - start), query.replace(/\n/g, ' '));

        return results;
    } catch (error) {
        console.log(error);
        return { error }
    } finally {
        if (connection && shouldClose) {
            try {
                await connection.close();
                console.log('closed');
            } catch (err) {
                console.error(err);
            }
        }
    }
}
