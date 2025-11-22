import dotenv from 'dotenv'
// Load .env without verbose debug messages. If you need debug output later,
// set { debug: true } or set DOTENV_DEBUG=1 in the environment.
dotenv.config({ debug: false })

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-dev-only',
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/mernproject',
}
 export default config
