const { Pool } = require('pg');

const poolNisa = new Pool({
    user: 'noc',
    host: '172.17.32.193',
    database: 'nisa',
    password: 'noc123!',
    port: 5432,
  });

module.exports = poolNisa;