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
	    'select * from salesperson'
	)
	
	console.log(result.rows);
    } catch (error) {
	console.log(error);
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

run();
