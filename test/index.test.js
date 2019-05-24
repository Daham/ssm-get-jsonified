const indexFile = require('../src/index');
const ssmReader = require('../src/ssmReader');
const testConstants = require('./testConstants');
//const AWS = require('aws-sdk');
const AWS = require('aws-sdk-mock');

beforeAll(() => {
    AWS.mock('SSM', 'getParametersByPath', function(params, callback) {
        if (params.Recursive && params.WithDecryption) {
            if (params.Path === '/') {
                return callback(null, testConstants.hierachicalSSMOutputRoot);
            } else if (params.Path === '/myApp') {
                return callback(null, testConstants.hierachicalSSMOutputNextToRoot);
            } else if (params.Path === '/myApp/platformConfigs') {
                return callback(null, testConstants.hierachicalSSMOutputModerate);
            } else {
                throw new Error('Unknown Path');
            }
        }
        throw new Error('Invalid Params');
    });
});

afterAll(() => {
    jest.restoreAllMocks();
    AWS.restore('SSM', 'getParametersByPath');
});

describe('ssmGetJsonifiedAsync', () => {

    test('gets parameters from ssm for a given path prefix of an root location in hierachical json format', async() => {

        const data = await indexFile.ssmGetJsonifiedAsync('us-west-2', '/');

        expect(typeof data).toEqual('object');

        expect(typeof data.myApp).toEqual('object');
        expect(typeof data.myApp.platformConfigs).toEqual('object');
        expect(typeof data.myApp.platformConfigs.salesforce).toEqual('object');
        expect(typeof data.myApp.platformConfigs.salesforce.saml).toEqual('object');
        expect(typeof data.myApp.platformConfigs.salesforce.sso).toEqual('object');
        expect(typeof data.myApp.platformConfigs.salesforce.saml.password).toEqual('string');
        expect(typeof data.myApp.platformConfigs.salesforce.saml.username).toEqual('string');
        expect(typeof data.myApp.platformConfigs.salesforce.saml.sso.url).toEqual('string');
        expect(typeof data.myApp.platformConfigs.salesforce.sso.loginUrl).toEqual('string');
        expect(typeof data.myApp.platformConfigs.salesforce.sso.password).toEqual('string');

    });

    test('gets parameters from ssm for a given path prefix of a next to root location in hierachical json format', async() => {

        const data = await indexFile.ssmGetJsonifiedAsync('us-west-2', '/myApp');

        expect(typeof data).toEqual('object');

        expect(typeof data.platformConfigs).toEqual('object');
        expect(typeof data.platformConfigs.salesforce).toEqual('object');
        expect(typeof data.platformConfigs.salesforce.saml).toEqual('object');
        expect(typeof data.platformConfigs.salesforce.sso).toEqual('object');
        expect(typeof data.platformConfigs.salesforce.saml.password).toEqual('string');
        expect(typeof data.platformConfigs.salesforce.saml.username).toEqual('string');
        expect(typeof data.platformConfigs.salesforce.saml.sso.url).toEqual('string');
        expect(typeof data.platformConfigs.salesforce.sso.loginUrl).toEqual('string');
        expect(typeof data.platformConfigs.salesforce.sso.password).toEqual('string');

    })

    test('gets parameters from ssm for a given path prefix of an intermediate location in hierachical json format', async() => {

        const data = await indexFile.ssmGetJsonifiedAsync('us-west-2', '/myApp/platformConfigs');

        expect(typeof data).toEqual('object');

        expect(typeof data.salesforce).toEqual('object');
        expect(typeof data.salesforce.saml).toEqual('object');
        expect(typeof data.salesforce.sso).toEqual('object');
        expect(typeof data.salesforce.saml.password).toEqual('string');
        expect(typeof data.salesforce.saml.username).toEqual('string');
        expect(typeof data.salesforce.saml.sso.url).toEqual('string');
        expect(typeof data.salesforce.sso.loginUrl).toEqual('string');
        expect(typeof data.salesforce.sso.password).toEqual('string');

    });

    test('throws on ssm parameters retrieval', async() => {
        try {
            await indexFile.ssmGetJsonifiedAsync('false-region', '/myApp/platformConfigs')
        } catch (object) {
            expect(getParametersByPathMock).toHaveBeenCalledWith([{ Path: '/myApp/platformConfigs', Recursive: true, WithDecryption: true }]);
            expect(object.error).toEqual('Error fetching from AWS ssm');
        }
    });
});

describe('ssmGetJsonifiedSync', () => {

});