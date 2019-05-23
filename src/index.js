const ssmReader = require('./ssmReader');
const forceSync = require('sync-rpc');
const jsonifier = require('./utils/jsonifier');

const ssmGetJsonifiedAsync = (region, pathPrefix, callback) => {

    if (callback === undefined) {
        return new Promise((resolve, reject) => {
            ssmReader.ssmOutputToJson(region, pathPrefix)
                .then(data => {
                    resolve(jsonifier.hierachicalToJson(data, pathPrefix));
                })
                .catch(err => {
                    reject(err);
                })
        });
    } else {
        ssmReader.ssmOutputToJson(region, pathPrefix)
            .then(data => {
                return callback(null, jsonifier.hierachicalToJson(data, pathPrefix));
            })
            .catch(err => {
                return callback(true, err);
            })
    }
}

const ssmGetJsonifiedSync = (region, pathPrefix) => {
    let done = false;
    let data;
    ssmReader.ssmOutputToJsonAsync(region, pathPrefix, function cb(res) {
        data = jsonifier.hierachicalToJson(res, pathPrefix);
        done = true;
    });
    require('deasync').loopWhile(function() { return !done; });
    return data;
}

module.exports = {
    ssmGetJsonifiedAsync: ssmGetJsonifiedAsync,
    ssmGetJsonifiedSync: ssmGetJsonifiedSync
};