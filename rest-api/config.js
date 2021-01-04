const environments = {
    staging: {
        envName: 'staging',
        httpPort: 3000,
        httpsPort: 3001
    },
    production: {
        envName: 'production',
        httpPort: 5000,
        httpsPort: 5001
    }
}

module.exports = process.env.NODE_ENV ?
    environments[process.env.NODE_ENV.toLowerCase()] || environments.staging
    : environments.staging;
