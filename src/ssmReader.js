const AWS = require('aws-sdk');

const ssmOutputToJson = (region, pathPrefix) => {

    AWS.config.update({ region: region });
    const ssm = new AWS.SSM();

    const params = { Path: pathPrefix, Recursive: true, WithDecryption: true };

    const getParametersByPathPromise = ssm.getParametersByPath(params).promise();

    return new Promise((resolve, reject) => {
        getParametersByPathPromise
            .then(function(hierachicalOutput) {
                return resolve(hierachicalOutput);
            })
            .catch(function(err) {
                return reject();
            });
    })

}

const ssmOutputToJsonAsync = (region, pathPrefix, callback) => {

    AWS.config.update({ region: region });
    const ssm = new AWS.SSM();

    const params = { Path: pathPrefix, Recursive: true, WithDecryption: true };

    ssm.getParametersByPath(params, (err, hierachicalOutput) => {
        if (err) throw err
        return callback(hierachicalOutput)
    });
}


module.exports = {
    ssmOutputToJson: ssmOutputToJson,
    ssmOutputToJsonAsync: ssmOutputToJsonAsync
};