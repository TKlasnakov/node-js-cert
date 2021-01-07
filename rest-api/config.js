const environments = {
    staging: {
        envName: 'staging',
        httpPort: 3000,
        httpsPort: 3001,
        hashingSecret: 'This is a secret'
    },
    production: {
        envName: 'production',
        httpPort: 5000,
        httpsPort: 5001,
        hashingSecret: 'This is also a secret'
    }
}

const tokenFields =

module.exports = process.env.NODE_ENV ?
    environments[process.env.NODE_ENV.toLowerCase()] || environments.staging
    : environments.staging;
