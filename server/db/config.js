module.exports = {
    user: process.env.ORACLEDB_USER || 'guest',
    password: process.env.ORACLEDB_PASSWORD || 'guest',
    _enableStats: true,
    poolMin: 19,
    poolMax: 20,
    poolTimeout: 5000
};