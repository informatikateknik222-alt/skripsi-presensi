const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres:rahasia123@localhost:5432/db_presensi"
});

client.connect()
  .then(() => {
    console.log('Connected to database');
    return client.query('SELECT current_database()');
  })
  .then(res => {
    console.log('Current database:', res.rows[0].current_database);
    client.end();
  })
  .catch(err => {
    console.error('Database connection error:', err.stack);
    process.exit(1);
  });
