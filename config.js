const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/xiongayi'
  },
  fee:{
    water:12,
    electricity:2.3
  }
}

module.exports = config
