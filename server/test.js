const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = 'guest'  // set mypw to the hr schema password

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(  {
      user          : "guest",
      password      : mypw,
    });

    const result = await connection.execute(
      `SELECT salpers_name
       FROM salesperson
    );
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
