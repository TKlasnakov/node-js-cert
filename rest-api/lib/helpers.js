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
    createRandomString(length) {
        const strLength = typeof length === 'number' && length ? length : false;
        if(!strLength) {
            return false;
        }

        const possibleChars = 'abcdefghijklmnoprstuvwxyz1234567890';
        let randomString = '';

        for (let i = 0; i < strLength; i++) {
            randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }

        return randomString;
    }
};

module.exports = helpers;
