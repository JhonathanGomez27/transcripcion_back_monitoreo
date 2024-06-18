const pg = require('pg');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const monitoreo = new pg.Pool({
    user: process.env.DATABASE_USER_MONITOREO,
    host: process.env.DATABASE_HOST_MONITOREO,
    database: process.env.DATABASE_NAME_MONITOREO,
    password: `${process.env.DATABASE_PASSWORD_MONITOREO}`,
    port: process.env.DATABASE_PORT_MONITOREO
});

module.exports = { monitoreo };