import path from "path";
import dotenv from 'dotenv'
import {fileURLToPath} from "url";
import {exec} from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, '..', '.env'),
})

const baseCmd = `flyway -table=flyway_schema_history -user=${process.env.DATABASE_USER} -password=${process.env.DATABASE_PASSWORD} -url=jdbc:postgresql://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`
const locations = `-locations=filesystem:${__dirname}/../sql/schema`
const envFolder = `,filesystem:${__dirname}/../sql/base,filesystem:${__dirname}/../sql/`

export type CommandType = 'clean' | 'test' | 'dev' | 'schema'

export interface Logger {
    debug: (msg: string, params?: any) => void,
    error: (msg: string) => void,
    info: (msg: string, params?: any) => void,
}


const _runfile = (s: string, logger: Logger): Promise<void> => {
    logger.info('db.runfile')
    return new Promise((resolve, reject) => exec(`${baseCmd} ${locations}${envFolder}${s} migrate`, (err, stdout) => {
        logger.info(stdout)
        if (err) {
            return reject(err)
        }
        return resolve()
    }))
}

export const custom = (logger: Logger, path: string | null = null): Promise<void> => {
    logger.info('db.custom', {path})
    return new Promise((resolve, reject) => exec(`${baseCmd} ${locations}${path ? `,filesystem:${path}` : ''} migrate`, (err, stdout) => {
        logger.info(stdout)
        if (err) {
            return reject(err)
        }
        return resolve()
    }))
}

export const schema = async (logger: Logger): Promise<void> => {
    logger.info('db.schema', `${baseCmd} ${locations},filesystem:${__dirname}/../sql/schema migrate`)
    return new Promise((resolve, reject) => exec(`${baseCmd} ${locations},filesystem:${__dirname}/../sql/base migrate`, (err, stdout) => {
        logger.info(stdout)
        if (err) {
            return reject(err)
        }
        return resolve()
    }))
}

export const dev = async (logger: Logger): Promise<void> => {
    logger.info('db.dev')
    return _runfile('dev', logger)
}

export const test = async (logger: Logger): Promise<void> => {
    logger.info('db.test')
    return _runfile('test', logger)
}

export const clean = async (logger: Logger): Promise<void> => {
    logger.info('db.clean')
    return new Promise((resolve, reject) => exec(`${baseCmd} clean`, (err) => {
        if (err) {
            return reject(err)
        }
        resolve()
    }))
}

const methods: { [key in CommandType]: (logger: Logger) => Promise<void> } = {
    clean,
    test,
    dev,
    schema
}

export default methods