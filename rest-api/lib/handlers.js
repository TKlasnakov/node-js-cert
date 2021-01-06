const _data = require('./data');
const helpers = require('./helpers');
const constants = require('../lib/constants')


const _users = {
    get: (data, callback) => {
        const phone = helpers.validateStringData(data.queryStringObject.phone?.trim(), 'string', 10, true);
        if(phone) {
            _data.read('users', phone, (err, data) => {
                if(!err && data) {
                    delete data.password;
                    callback(200, data);
                } else {
                    callback(404);
                }
            })
        } else {
            callback(400, {error: 'Missing required field!'})
        }
    },
    post: (data, callback) => {
        const fields = constants.fields(data);
        const failedValidations = helpers.checkFailedValidation(fields);

        if (failedValidations.length) {
            return callback(400, { error: `Failed, validations: ${failedValidations.join(', ')}.`});
        }

        const firstName = helpers.getFieldByName(fields, 'firstName').value;
        const lastName = helpers.getFieldByName(fields, 'lastName').value;
        const password = helpers.getFieldByName(fields, 'password').value;
        const phone = helpers.getFieldByName(fields, 'phone').value;
        const tosAgreement = helpers.getFieldByName(fields, 'tosAgreement').value;

        _data.read('users', phone, (err, data) => {
            if(err) {
                const hashPassword = helpers.hashPassword(password);
                if(hashPassword) {
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        password: hashPassword,
                        tosAgreement
                    }

                    _data.create('users', phone, userObject, (err) => {
                        if(err) {
                            console.log(err);
                            callback(500, 'Could not create new user');
                        } else {
                            callback(200);
                        }
                    })
                } else {
                    callback(500, { error : 'Could not has the user\'s password'});
                }
            } else {
                callback(400, { error: `User with phone number ${phone} already exist` })
            }
        })
    },
    put: (data, callback) => {
        const phone = helpers.validateStringData(data.payload.phone?.trim(), 'string', 10, true);
        if (!phone) {
            return callback(404, 'Missing phone number');
        }
        const fields = constants.editFields(data);

        const isAtLeastOneInputPresent = fields.some(field => field.value);

        if(!isAtLeastOneInputPresent) {
           return callback(400, { error: 'No update field provided'});

        }

        _data.read('users', phone, (err, userData) => {
            if (err || !userData) {
                return callback(404, { error: 'No such user'});
            }

            fields.forEach(field => {
                if (field.value) {
                    userData[field.name] = field.value
                }

                if (field.name === 'password' && field.value) {
                    userData.password = helpers.hashPassword(field.value);
                }
            })

            _data.update('users', phone, userData, (err) => {
                if(err) {
                    console.log(err);
                    return callback(500, { error: 'Failed to update user'});
                }

                return callback(200);
            })
        })


    },
    delete: (data, callback) => {
        const phone = helpers.validateStringData(data.queryStringObject.phone?.trim(), 'string', 10, true);
        if(!phone) {
            return callback(400, {error: 'No phone provided'});
        }

        _data.delete('users', phone, (err, data) => {
            if (err) {
                return callback(500, {error: 'Can not delete user'});
            }

            return callback(200);
        })
    },
}

const handlers = {
    ping: (data, callback) => {
        callback(200)
    },
    users: (data, callback) => {
      const acceptableMethods = ['post', 'get', 'put', 'delete'];

      if (acceptableMethods.includes(data.method)) {
          _users[data.method](data, callback)
      } else {
          callback(405);
      }
    },
    notFound: (data, callback) => {
        callback(404);
    }
}

module.exports = handlers;
