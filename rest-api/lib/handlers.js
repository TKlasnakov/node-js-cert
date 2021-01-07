const _data = require('./data');
const helpers = require('./helpers');
const constants = require('../lib/constants')


const _users = {
    get: (data, callback) => {
        const phone = helpers.validateStringData(data.queryStringObject.phone?.trim(), 'string', 10, true);
        const token = data.headers.token;
        console.log(token);
        if(phone) {
            _tokens.verifyTokens(token, phone, (isTokenValid) => {
                if(!isTokenValid) {
                    return callback(403, {error: 'Invalid token'})
                } else {
                    _data.read('users', phone, (err, data) => {
                        if(!err && data) {
                            delete data.password;
                            callback(200, data);
                        } else {
                            callback(404);
                        }
                    })
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
        const token = data.headers.token;

        _tokens.verifyTokens(token, phone, (isTokenValid) => {
            if(!isTokenValid) {
                return callback(403, {error: 'Invalid token'})
            } else {
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


            }
        })
    },
    delete: (data, callback) => {
        const phone = helpers.validateStringData(data.queryStringObject.phone?.trim(), 'string', 10, true);
        if(!phone) {
            return callback(400, {error: 'No phone provided'});
        }

        const token = data.headers.token;

        _tokens.verifyTokens(token, phone, (isTokenValid) => {
            if(!isTokenValid) {
                return callback(403, {error: 'Invalid token'})
            } else {
                _data.delete('users', phone, (err) => {
                    if (err) {
                        return callback(500, {error: 'Can not delete user'});
                    }
                    return callback(200);
                })
            }
        })
    },
}

const _tokens = {
    get: (data, callback) => {
        const id = helpers.validateStringData(data.queryStringObject.id?.trim(), 'string', 20, true);
        if(id) {
            _data.read('tokens', id, (err, data) => {
                if(!err && data) {
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
        const fields = constants.tokens(data);
        const failedValidations = helpers.checkFailedValidation(fields);

        if (failedValidations.length) {
            return callback(400, { error: `Missing required fields: ${failedValidations.join(', ')}.`});
        }

        const password = helpers.getFieldByName(fields, 'password').value;
        const phone = helpers.getFieldByName(fields, 'phone').value;

        _data.read('users', phone, (err, userData) => {
            if(err) {
                return callback(400, {error: 'Could not find the specified user'});
            }

            const hashPassword = helpers.hashPassword(password);

            if(userData.password !== hashPassword) {
                return callback(400, { error: 'Incorrect password' });
            }

            const tokenObject = {
                phone,
                id: helpers.createRandomString(20),
                expires: Date.now() + 1000 * 60 * 60
            }

            _data.create('tokens', tokenObject.id, tokenObject, (err) => {
                if(err) {
                    return callback(500, {error: 'Could not create new token'});
                }

                callback(200, tokenObject);
            })
        })
    },
    put: (data, callback) => {
        const id = helpers.validateStringData(data.payload.id?.trim(), 'string', 20, true);
        if(!id) {
            return callback(400, { error: 'Missing or invalid fields' });
        }
        const extend = data.payload.extend === 'true';

        if(!extend) {
            return callback(400, {error: 'Wrong value for extend'});
        }
        _data.read('tokens', id, (err, tokenData) => {
            if(err || !tokenData) {
                return callback(404);
            }
            if(tokenData.expires < Date.now()) {
                return callback(400, { err: 'Token is already expired'});
            }

            tokenData.expires = Date.now() + 1000 * 60 * 60;

            _data.update('tokens', id, tokenData, (err) => {
                if(err) {
                    console.log(err);
                    return callback(500, { error: 'Failed to update user'});
                }
                return callback(200);
            })
        })
    },
    delete: (data, callback) => {
        const id = helpers.validateStringData(data.queryStringObject.id?.trim(), 'string', 20, true);
        if(!id) {
            return callback(400, {error: 'No id provided'});
        }
        _data.delete('tokens', id, (err) => {
            if (err) {
                return callback(500, {error: 'Can not delete token'});
            }
            return callback(200);
        })
    },
    verifyTokens: (id, phone, callback) => {
        _data.read('tokens', id, (err, tokenData) => {
            if(err || !tokenData) {
                return callback(false);
            }
            if(tokenData.phone === phone && tokenData.expires > Date.now()) {
                return callback(true);
            }

            return callback(false);
        })
    }
}

const handlers = {
    users: (data, callback) => {
      const acceptableMethods = ['post', 'get', 'put', 'delete'];

      if (acceptableMethods.includes(data.method)) {
          _users[data.method](data, callback)
      } else {
          callback(405);
      }
    },
    tokens: (data, callback) => {
        const acceptableMethods = ['post', 'get', 'put', 'delete'];

        if (acceptableMethods.includes(data.method)) {
            _tokens[data.method](data, callback)
        } else {
            callback(405);
        }
    },
    notFound: (data, callback) => {
        callback(404);
    }
}

module.exports = handlers;
