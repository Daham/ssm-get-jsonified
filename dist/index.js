const ssmReader = require('./ssmReader');

const jsonifier = require('./utils/jsonifier');

const ssmGetJsonifiedAsync = (region, pathPrefix, callback) => {
  if (callback === undefined) {
    return new Promise((resolve, reject) => {
      ssmReader.ssmOutputToJson(region, pathPrefix).then(data => {
        resolve(jsonifier.hierachicalToJson(data, pathPrefix));
      }).catch(err => {
        reject({
          error: err
        });
      });
    });
  }

  ssmReader.ssmOutputToJson(region, pathPrefix).then(data => callback(null, jsonifier.hierachicalToJson(data, pathPrefix))).catch(err => callback(true, {
    error: err
  }));
};

const ssmGetJsonifiedSync = (region, pathPrefix) => {
  let done = false;
  let data;
  ssmReader.ssmOutputToJsonAsync(region, pathPrefix, function cb(res) {
    data = jsonifier.hierachicalToJson(res, pathPrefix);
    done = true;
  });

  require('deasync').loopWhile(function () {
    return !done;
  });

  return data;
};

module.exports = {
  ssmGetJsonifiedAsync: ssmGetJsonifiedAsync,
  ssmGetJsonifiedSync: ssmGetJsonifiedSync
}; // console.log('start')

ssmGetJsonifiedAsync('us-west-2', '/myApp/prod/salesforce').then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
}); // console.log('end')

console.log('===========');
console.log('start1'); //console.log(ssmJsonified.ssmGetJsonifiedSync('us-west-2', '/myApp/prod/salesforce'))

console.log('end1');