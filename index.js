//var Memcached = require('memcached');

//var memcached = new Memcached(['172.16.0.45:11210', '172.16.0.45:11211', '172.16.0.45:11212','172.16.0.45:11214', '172.16.0.46:11211', '172.16.0.47:11211']);

function longWaitA() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('long return A');
      }, 3000); // 2s后执行
    });
  }
  
  function longWaitB() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('long return B');
      }, 1000); // 2s后执行
    });
  }
  
  /*function getAll() {
    Promise.all([longWaitA(), longWaitB()])
      .then((result) => {
        console.log('get result = ', result);  // get all response after 2s
      })
      .catch((e) => {
        console.log('catch error = ', e);
      })
  }*/

  async function getAll() {
    try {
      let A = await longWaitA();    // need wait 2s
      let B = await longWaitB();    // need wait 2s
      console.log('A = ' + A + ' B = ' + B);  // get all response after 4s!!!
    } catch(e) {
      console.log('catch error = ', e);
    }
  }

  getAll();