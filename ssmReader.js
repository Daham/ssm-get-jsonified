const AWS = require('aws-sdk');

var paramJson = {};
var ref;

var ssmOutputToJson = function(region, pathPrefix, callback) {
    AWS.config.update({ region: region });
    const ssm = new AWS.SSM();

    const params = { Path: pathPrefix, Recursive: true, WithDecryption: true }

    ssm.getParametersByPath(params, (err, hierachicalOutput) => {
        if (err) throw err
        return callback(hierachicalToJson(hierachicalOutput, pathPrefix))
    })
}

var hierachicalToJson = function(hierachicalOutput, pathPrefix) {
    var skipCount = pathPrefix.split('/')[1] === '' ? 1 : pathPrefix.split('/').length;

    hierachicalOutput.Parameters.forEach((param) => {
        ref = paramJson;
        var keyArray = param.Name.split('/');
        keyArray.splice(0, skipCount);
        recursiveJson(param.Value, keyArray);
    });

    return paramJson;
}

var recursiveJson = function(value, keyArray) {
    var currKey = keyArray.shift();

    if (!keyArray.length) {
        ref[currKey] = value;
        return;
    } else {
        if (!ref[currKey]) {
            ref[currKey] = {}
        }
        ref = ref[currKey];
        return recursiveJson(value, keyArray);
    }
}

exports.ssmOutputToJson = ssmOutputToJson;