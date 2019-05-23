var ssmReader = require('../src/ssmReader');
var testConstants = require('./testConstants');
const AWS = require('aws-sdk')
var sinon = require('sinon');

test('ssm getParametersByPath is called with necessary parameters', async() => {


    const getParametersByPathMockFn = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
            Parameter: [{
                    Name: 'NAME_1',
                    Type: 'SecureString_1',
                    Value: 'VALUE_1',
                    Version: 1,
                    LastModifiedDate: 1546551668.495,
                    ARN: 'arn:aws:ssm:ap-southeast-2:123:NAME_1'
                },
                {
                    Name: 'NAME_2',
                    Type: 'SecureString_2',
                    Value: 'VALUE_2',
                    Version: 1,
                    LastModifiedDate: 1546551668.495,
                    ARN: 'arn:aws:ssm:ap-southeast-2:123:NAME_2'
                }
            ]
        })
    });
    
    AWS.SSM = jest.fn().mockImplementation(() => ({
        getParametersByPath: getParametersByPathMockFn
    }))


    await ssmReader.ssmOutputToJson('us-west-2', '/any/given/path');
    expect(getParametersByPathMockFn).toHaveBeenCalledWith({ Path: '/any/given/path', Recursive: true, WithDecryption: true });
    getParametersByPathMockFn.mockReset();
});