import path from 'path'
import dotenv from 'dotenv'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, '..', '..', '.env'),
})

export default {
    server: {
        port: parseInt(process.env.SERVER_PORT || '3001', 10)
    },
    rollbar: {
        enable: process.env.ROLLBAR_ENABLE === 'true',
        token: process.env.ROLLBAR_TOKEN,
        environment: process.env.ROLLBAR_ENVIRONMENT,
    },
    logger: {
        logLevel: process.env.LOG_LEVEL || 'info',
        logPretty: process.env.LOG_PRETTY === 'true',
    },
    database: {
        database: process.env.DATABASE_NAME || '',
        user: process.env.DATABASE_USER || '',
        password: process.env.DATABASE_PASSWORD || '',
        host: process.env.DATABASE_HOST || '',
        port: process.env.DATABASE_PORT || 5432,
        dialect: process.env.DATABASE_DIALECT || 'postgres',
        replication: {
            read: process.env.DATABASE_READ_HOSTS ?
                JSON.parse(process.env.DATABASE_READ_HOSTS) :
                [{host: process.env.DATABASE_HOST}],
            write: {host: process.env.DATABASE_HOST}
        },
        pool: {
            max: parseInt(process.env.DATABASE_POOL_MAX || '5', 10),
            min: parseInt(process.env.DATABASE_POOL_MIN || '0', 10),
            acquire: 30000,
            idle: 10000
        }
    },
    policy: {
        accessTokenName: process.env.ACCESS_TOKEN_NAME || 'cluster-token',
        tokenExpiration: process.env.TOKEN_EXPIRATION ? parseInt(process.env.TOKEN_EXPIRATION, 10) : undefined,
        localEnabled: process.env.TOKEN_LOCAL_ENABLED === 'true',
        tokenDomain: process.env.TOKEN_DOMAIN || '.cluster.blackglobe.cz',
        tokenSecret: process.env.TOKEN_SECRET || 'fkdjfldsjflewjwmflkwemflkwemf',
    }
}
