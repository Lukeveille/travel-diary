const axios = require('axios');
const uuidv1 = require('uuid');

process.env.NODE_ENV = 'testing';

console.log(process.env.NODE_ENV)

const user = {
  email: uuidv1().slice(0, 8) + '@test.com',
  password: '123456'
};
const url = 'http://localhost:443/api/v1/';

const handleError = err => {
  console.log(err);
};

const login = res => {
  console.log(res.data.message)
  axios.post(url + 'login', user)
  .then(newTrip)
  .catch(handleError);
};

const newTrip = res => {
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + res.data.token
  }
  const request = {
    method: 'post',
    url: url + 'new-trip',
    headers
  }
  axios(request)
  .then(newEntry)
  .catch(handleError);
}
const newEntry = res => {
  console.log(res.data.message)
  const request = {
    method: 'post',
    url: url + res.data.id,
    headers: {'Authorization': res.config.headers.Authorization}
  }
  axios(request)
  .then(res => {
    console.log(res.data.message)
  })
  .catch(handleError)
}

axios.post(url + 'signup', user)
.then(login)
.catch(handleError)

// axios.post(url + 'login', user)
// .then(login)
// .catch(er => {
//   console.log(er);
// })