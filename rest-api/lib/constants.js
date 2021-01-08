const helpers = require('./helpers')

const constants = {
        fields: (data) => [
        {
            name: 'firstName',
            value: helpers.validateStringData(data.payload.firstName?.trim(), 'string', 0, false)
        },
        {
            name: 'lastName',
            value: helpers.validateStringData(data.payload.lastName?.trim(), 'string', 0, false)
        },
        {
            name: 'phone',
            value: helpers.validateStringData(data.payload.phone?.trim(), 'string', 10, true)
        },
        {
            name: 'password',
            value: helpers.validateStringData(data.payload.password?.trim(), 'string', 0, false)
        },
        {
            name: 'tosAgreement',
            value: typeof data.payload.tosAgreement === 'boolean' ? data.payload.tosAgreement : false
        }
    ],
    editFields: (data) => [
        {
            name: 'firstName',
            value: helpers.validateStringData(data.payload.firstName?.trim(), 'string', 0, false)
        },
        {
            name: 'lastName',
            value: helpers.validateStringData(data.payload.lastName?.trim(), 'string', 0, false)
        },
        {
            name: 'password',
            value: helpers.validateStringData(data.payload.password?.trim(), 'string', 0, false)
        }
    ],
    tokens: (data) => [
        {
            name: 'phone',
            value: helpers.validateStringData(data.payload.phone?.trim(), 'string', 10, true)
        },
        {
            name: 'password',
            value: helpers.validateStringData(data.payload.password?.trim(), 'string', 0, false)
        }
    ],
    checks: (data) => [
        {
            name: 'protocol',
            value: helpers.validateAvailableValues(data.payload.protocol, ['https', 'http'])
        },
        {
            name: 'url',
            value: helpers.validateStringData(data.payload.url?.trim(), 'string', 0, false)
        },
        {
            name: 'methods',
            value: helpers.validateAvailableValues(data.payload.methods, ['post', 'get', 'put', 'delete'])
        },
        {
            name: 'successCodes',
            value: helpers.validateArray(data.payload.successCodes)
        },
        {
            name: 'timeOutSeconds',
            value: helpers.validateNumber(data.payload.timeoutSeconds, 5)
        }
    ]
}

module.exports = constants;
