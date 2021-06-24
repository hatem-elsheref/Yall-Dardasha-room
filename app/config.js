module.exports = {
    serviceName: 'room service',
    serviceDescription: 'room service for create room, join room, leave room, end room, list rooms',
    development: {
        port: 3002,
        url: 'http://localhost:3002'
    },
    production: {
        port: process.env.PORT,
        url: 'https://yalla-dardasha-room.herokuapp.com'
    },
    mongo: {
        mongoDevelopmentUrl: 'mongodb://localhost/gp_clubhouse',
        mongoProductionUrl: 'mongodb+srv://hatem:webserver@cluster0.t0ute.mongodb.net/clubhouse?retryWrites=true&w=majority',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    },
    devEnvironment: false
}
