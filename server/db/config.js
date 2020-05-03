module.exports = {
    user: process.env.ORACLEDB_USER || 'guest',
    password: process.env.ORACLEDB_PASSWORD || 'guest',
    _enableStats: true,
    poolMin: 4,
    poolMax: 5
};