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
    ]
}

module.exports = constants;
