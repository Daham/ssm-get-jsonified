# ssm-get-jsonified

## Table of Contents

- [Problem](#problem)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
 
## Problem

AWS System Manager's Parameter Store has the capability of storing parameters in a hierachical manner.

Refer: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html

e.g
```console
    $ aws ssm put-parameter --name /myApp/prod/dbConfig/password --value complexPasswprd --type SecureString
    $ aws ssm put-parameter --name /myApp/prod/dbConfig/url --value dbUrl --type String
    $ aws ssm put-parameter --name /myApp/prod/salesforce/loginUrl --value sfLoginUrl --type String
    $ aws ssm put-parameter --name /myApp/prod/salesforce/username --value sfLoginUserName --type String
    $ aws ssm put-parameter --name /myApp/prod/salesforce/password --value sfLoginPassword --type SecureString
    $ aws ssm put-parameter --name /myApp/prod/salesforce/sso/redirectUrl --value sfSSORedirectUrl --type SecureString
    $ admins-MacBook-Pro:ssm-get-jsonified dahamp$ 
```
By stroing as in above, parameters can be retrieved for any given path onwards.

#### e.g To get database configs

```console
    $ aws ssm get-parameters-by-path --path /myApp/prod/dbConfig/ --recursive --with-decryption
```
Output:

```console
    {
        "Parameters": [
            {
                "Name": "/myApp/prod/dbConfig/password",
                "Type": "SecureString",
                "Value": "complexPasswprd",
                "Version": 1,
                "LastModifiedDate": 1558252777.295,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/dbConfig/password"
            },
            {
                "Name": "/myApp/prod/dbConfig/url",
                "Type": "String",
                "Value": "dbUrl",
                "Version": 1,
                "LastModifiedDate": 1558252814.22,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/dbConfig/url"
            },
            {
                "Name": "/myApp/prod/dbConfig/username",
                "Type": "String",
                "Value": "myDBUser",
                "Version": 1,
                "LastModifiedDate": 1558252684.218,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/dbConfig/username"
            }
         ]
    }
```
#### e.g To get salesforce configs

```console
    $ aws ssm get-parameters-by-path --path /myApp/prod/salesforce/  --recursive --with-decryption
```
Output:

```console
    {
        "Parameters": [
            {
                "Name": "/myApp/prod/salesforce/loginUrl",
                "Type": "String",
                "Value": "sfLoginUrl",
                "Version": 1,
                "LastModifiedDate": 1558252855.452,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/salesforce/loginUrl"
            },
            {
                "Name": "/myApp/prod/salesforce/password",
                "Type": "SecureString",
                "Value": "sfLoginPassword",
                "Version": 1,
                "LastModifiedDate": 1558252912.342,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/salesforce/password"
            },
            {
                "Name": "/myApp/prod/salesforce/sso/entityId",
                "Type": "SecureString",
                "Value": "sfSSOEntityId",
                "Version": 1,
                "LastModifiedDate": 1558253003.0,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/salesforce/sso/entityId"
            },
            {
                "Name": "/myApp/prod/salesforce/sso/redirectUrl",
                "Type": "SecureString",
                "Value": "sfSSORedirectUrl",
                "Version": 1,
                "LastModifiedDate": 1558252969.846,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/salesforce/sso/redirectUrl"
            },
            {
                "Name": "/myApp/prod/salesforce/username",
                "Type": "String",
                "Value": "sfLoginUserName",
                "Version": 1,
                "LastModifiedDate": 1558252882.669,
                "ARN": "arn:aws:ssm:us-west-2:429869777392:parameter/myApp/prod/salesforce/username"
            }
        ]
    }
```
However, this is cumbersome for an application stores its configurations which have considerable amount of parameters in each of them following complex hierachical structures.

#### ssm-get-jsonified can retrieve configurations for a given path prefix in JSON format while preserving it's hierachical structure.

## Installation
To install the stable version:
```console
    $ npm install ssm-get-jsonified
```

## Setting AWS Credentials

Set credentials in the AWS credentials profile file on your local system, located at:

`~/.aws/credentials` on Linux, macOS, or Unix

`C:\Users\USERNAME\.aws\credentials` on Windows

This file should contain lines in the following format:

```console
[default]
aws_access_key_id = your_access_key_id
aws_secret_access_key = your_secret_access_key
```
Substitute your own AWS credentials values for the values your_access_key_id and your_secret_access_key.

## Usage

### Fetch Configurations Asynchronously

To get database configurations in `/myApp/prod/dbConfigs`

#### Using Callbacks

```js
    const ssmJsonified = require('ssm-get-jsonified');

    ssmJsonified.ssmGetJsonifiedAsync('us-west-2', '/myApp/prod/dbConfig', function(configuration) {
      
        // Logic to process required configuration

        // configuration - configurations in path prefix onwards.
        /**
         * {
         *       "password": "complexPasswprd",
         *       "url": "dbUrl",
         *       "username": "myDBUser"
         *   }
         * 
         *  */ 
    });
```
#### Using Promises

```js
ssmJsonified.ssmGetJsonifiedAsync('us-west-2', '/myApp/prod/salesforce')
    .then(configuration => {
        // Logic to process required configuration

        // configuration - configurations in path prefix onwards.
        /**
         * {
         *       "password": "complexPasswprd",
         *       "url": "dbUrl",
         *       "username": "myDBUser"
         *   }
         * 
         *  */ 
    })
    .catch((err) => {
        
    })

```


To get database configurations in `/myApp/prod/salesforce`

#### Using Callbacks
```js
    const ssmJsonified = require('ssm-get-jsonified');

    ssmJsonified.ssmGetJsonifiedAsync('us-west-2', '/myApp/prod/salesforce', function(configuration) {
      
        // Logic to process required configuration

        // configuration - configurations in path prefix onwards.
        /**
         * {
         *       "loginUrl": "sfLoginUrl",
         *       "password": "sfLoginPassword",
         *       "sso": {
         *                "entityId": *"sfSSOEntityId",
         *                "redirectUrl": *"sfSSORedirectUrl"
         *               },
         *       "username": "sfLoginUserName"
         *   }
         *  */ 
    });
```
#### Using Promises

```js
ssmJsonified.ssmGetJsonifiedAsync('us-west-2', '/myApp/prod/salesforce')
    .then(configuration => {
         // Logic to process required configuration

        // configuration - configurations in path prefix onwards.
        /**
         * {
         *       "loginUrl": "sfLoginUrl",
         *       "password": "sfLoginPassword",
         *       "sso": {
         *                "entityId": *"sfSSOEntityId",
         *                "redirectUrl": *"sfSSORedirectUrl"
         *               },
         *       "username": "sfLoginUserName"
         *   }
         *  */ 
    })
    .catch((err) => {
        
    })

```

### Fetch Configurations Synchronously

To get database configurations in `/myApp/prod/dbConfigs`
```js
let configuration = smJsonified.ssmGetJsonifiedSync('us-west-2', '/myApp/prod/salesforce')

  // configuration - configurations in path prefix onwards.
        /**
         * {
         *       "password": "complexPasswprd",
         *       "url": "dbUrl",
         *       "username": "myDBUser"
         *   }
         * 
         *  */ 
```

To get database configurations in `/myApp/prod/salesforce`

```js
let configuration = smJsonified.ssmGetJsonifiedSync('us-west-2', '/myApp/prod/salesforce')

 // configuration - configurations in path prefix onwards.
        /**
         * {
         *       "loginUrl": "sfLoginUrl",
         *       "password": "sfLoginPassword",
         *       "sso": {
         *                "entityId": *"sfSSOEntityId",
         *                "redirectUrl": *"sfSSORedirectUrl"
         *               },
         *       "username": "sfLoginUserName"
         *   }
         *  */ 
```

## License

    MIT License

    Copyright (c) [year] [fullname]

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
