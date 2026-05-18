const { Client } = require('pg');

async function check() {
  const dbs = ['auth_db', 'employee_db', 'attendance_db', 'payroll_db'];
  const results = {};

  for (const db of dbs) {
    const client = new Client({ connectionString: `postgresql://postgres:rahasia123@localhost:5432/${db}` });
    try {
      await client.connect();
      let table = '';
      if (db === 'auth_db') table = '"User"';
      else if (db === 'employee_db') table = '"Employee"';
      else if (db === 'attendance_db') table = '"Attendance"';
      else if (db === 'payroll_db') table = '"PayrollRecord"';
      
      const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
      results[db] = res.rows[0].count;
    } catch (e) {
      results[db] = 'error: ' + e.message;
    } finally {
      await client.end();
    }
  }
  console.log(JSON.stringify(results));
}

check();
