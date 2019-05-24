const indexFile = require('../src/index');
const ssmReader = require('../src/ssmReader');
const AWS = require('aws-sdk');

afterEach(() => {
    jest.restoreAllMocks();
});

describe('ssmGetJsonifiedAsync', () => {
    test('is called with necessary parameters', async() => {
        const ssmOutputToJsonSpy = jest.spyOn(ssmReader, 'ssmOutputToJson');
        await indexFile.ssmGetJsonifiedAsync('us-west-2', '/any/given/path');
        expect(ssmOutputToJsonSpy).toHaveBeenCalledWith('us-west-2', '/any/given/path');
    });

    test('gets parameters from ssm for a given path prefix of an root location in hierachical json format', async() => {
        const data = await indexFile.ssmGetJsonifiedAsync('us-west-2', '/')
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

        const data = await indexFile.ssmGetJsonifiedAsync('us-west-2', '/myApp')
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

        const data = await indexFile.ssmGetJsonifiedAsync('us-west-2', '/myApp/platformConfigs')
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

        const ssm = new AWS.SSM({ region: 'us-west-2' });
        const getParametersByPathMock = jest.fn()
            .mockImplementationOnce(cb => cb(true, { error: 'Error fetching from AWS ssm' }));
        ssm.getParametersByPath = getParametersByPathMock;

        try {
            await indexFile.ssmGetJsonifiedAsync('us-west-2', '/myApp/platformConfigs')
        } catch (object) {
            expect(getParametersByPathMock).toHaveBeenCalledWith({ Path: '/myApp/platformConfigs', Recursive: true, WithDecryption: true });
            expect(object.error).toEqual('Error fetching from AWS ssm');
        }
    });
});

describe('ssmGetJsonifiedSync', () => {

});