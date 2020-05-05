var oracledb = require('oracledb');
var config = require('./config');

let pool = null;

async function closePoolAndExit() {
  if(!pool) {
    return;
  }
  console.log('\nClosing pool connection');
  try {
    // Get the pool and close it when no connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await pool.close(10);
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}
  
process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);

module.exports = async function() {
  if(pool == null) {
    pool = await oracledb.createPool(config);
  }

  pool._logStats();
  const connection = pool.getConnection();
  return connection;
};