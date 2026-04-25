fetch('http://localhost:4000/api/employees')
  .then(res => {
    console.log('STATUS:', res.status);
    return res.text();
  })
  .then(text => console.log('BODY:', text))
  .catch(err => console.error('ERROR:', err));
