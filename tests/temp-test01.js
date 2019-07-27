var axios = require('axios');

const user = {
  email: 'test@test.com',
  password: '123456'
};
const url = 'http://localhost:443/api/v1/';

let token = '';


axios.post(url + 'signup', user)
.then(res => {
  console.log(res.data.message)
  axios.post(url + 'login', user)
  .then(response => {
    headers = {'Authorization': 'Bearer ' + response.data.token }
    axios({
      method: 'post',
      url: url + 'new-trip',
      headers
    }).then(re => {
      console.log(re.data.message)
    }).catch(error => {
      console.log(error)
    });
  }).catch(err => {
    console.log(err);
  })
}).catch(er => {
  console.log(er);
})

// 
//   headers: {'Authorization': 'Bearer ' + token }
// }).then(re => {
//   console.log(re.data.message)
// }).catch(error => {
//   console.log(error)
// })
