const crypto = require('crypto');
const config = require('../config');

const helpers = {
    hashPassword: (password) => {
        if(typeof password === 'string' && password.length) {
            return crypto
                .createHmac('sha256', config.hashingSecret)
                .update(password)
                .digest('hex');
        } else {
            return false;
        }
    },
    getFieldByName: (fields, fieldName) => fields.find(field => field.name === fieldName),
    validateStringData: (value, dataType, length, lengthShouldEqual) => {
        if(lengthShouldEqual) {
            return typeof value === dataType && value.length === length
                ? value
                : false;
        }

        return typeof value === dataType && value.length
            ? value
            : false;
    },
    checkFailedValidation: (fields) => fields
        .filter((field) => !field.value)
        .map(field => field.name),
    parseJsonToObject: (data) => {
        try {
            return JSON.parse(data);
        } catch (err) {
            return {};
        }
    },
};

module.exports = helpers;
