var ssmReader = require('./ssmReader');

module.exports = (region, pathPrefix, callback) => {
    return ssmReader.ssmOutputToJson(region, pathPrefix, callback)
}