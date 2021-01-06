const fs = require('fs');
const path = require('path');
const helpers = require('./helpers')


const lib = {
    baseDir: path.join(__dirname, '/../.data/'),
    create: (dir, fileName, data, callback) => {
        fs.open(`${lib.baseDir}${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                const stringData = JSON.stringify(data);

                fs.writeFile(fileDescriptor, stringData, (error) => {
                    if(error) {
                        return callback('Error writing on new file');
                    }
                    fs.close(fileDescriptor, (err) => {
                        if(err) {
                            return callback('Error closing file');
                        }
                        callback(false);
                    })
                });
            } else {
                callback(`Could not create file ${err}`);
            }
        })
    },
    read: (dir, file, callback) => {
        fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
            if(!err && data) {
                const parsedData = helpers.parseJsonToObject(data);
                return callback(false, parsedData);
            }
            callback(err, data);
        });
    },
    update: (dir, file, data, callback) => {
        fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                const stringData = JSON.stringify(data);

                fs.ftruncate(fileDescriptor, (err) => {
                    if(err) {
                        return callback(err);
                    }
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(err) {
                            return callback('Error writing on existing file');
                        }

                        fs.close(fileDescriptor, (err) => {
                            if(err) {
                                return callback('Error closing the file');
                            }
                            return callback(false);
                        })
                    })
                })

            } else {
                callback('Could not open file for updating. It may not exist.')
            }
        })
    },
    delete: (dir, file, callback) => {
        fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
            if(err) {
                return callback(err);
            }

            return callback(false);
        })
    }
};

module.exports = lib;
