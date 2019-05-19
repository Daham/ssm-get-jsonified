var ssmReader = require('./ssmReader');
var testConstants = require('./testConstants');
var AWS = require('aws-sdk-mock');
var sinon = require('sinon');

afterEach(() => {
    AWS.restore('SSM', 'getParametersByPath');
});

test('ssm getParametersByPath is called with necessary parameters', () => {
    const getParametersByPathSpy = sinon.spy();
    AWS.mock('SSM', 'getParametersByPath', getParametersByPathSpy);

    ssmReader.ssmOutputToJson('us-west-2', '/any/given/path', (data) => {
        expect(getParametersByPathSpy.calledOnceWith({ Path: '/any/given/path', Recursive: true, WithDecryption: true })).toBe(true);
    })
});

test('gets parameters from ssm for a given path prefix of an root location in hierachical json format', () => {

    AWS.mock('SSM', 'getParametersByPath', function(params, callback) {
        callback(null, testConstants.hierachicalSSMOutputRoot);
    });

    ssmReader.ssmOutputToJson('us-west-2', '/', (data) => {
        expect(typeof data).toEqual('object');

        // Validate simple property types.
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
    })
});

test('gets parameters from ssm for a given path prefix of a next to root location in hierachical json format', () => {

    AWS.mock('SSM', 'getParametersByPath', function(params, callback) {
        callback(null, testConstants.hierachicalSSMOutputNextToRoot);
    });

    ssmReader.ssmOutputToJson('us-west-2', '/myApp', (data) => {
        expect(typeof data).toEqual('object');

        // Validate simple property types.
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
})

test('gets parameters from ssm for a given path prefix of an intermediate location in hierachical json format', () => {

    AWS.mock('SSM', 'getParametersByPath', function(params, callback) {
        callback(null, testConstants.hierachicalSSMOutputModerate);
    });

    ssmReader.ssmOutputToJson('us-west-2', '/myApp/platformConfigs', (data) => {
        expect(typeof data).toEqual('object');

        // Validate simple property types.
        expect(typeof data.salesforce).toEqual('object');
        expect(typeof data.salesforce.saml).toEqual('object');
        expect(typeof data.salesforce.sso).toEqual('object');
        expect(typeof data.salesforce.saml.password).toEqual('string');
        expect(typeof data.salesforce.saml.username).toEqual('string');
        expect(typeof data.salesforce.saml.sso.url).toEqual('string');
        expect(typeof data.salesforce.sso.loginUrl).toEqual('string');
        expect(typeof data.salesforce.sso.password).toEqual('string');
    })
});

test('throws on ssm parameters retrieval', () => {
    AWS.mock('SSM', 'getParametersByPath', function(params, callback) {
        throw Error();
    });

    expect(() => {
        ssmReader.ssmOutputToJson('us-west-2', '/myApp/platformConfigs')
    }).toThrow();
});