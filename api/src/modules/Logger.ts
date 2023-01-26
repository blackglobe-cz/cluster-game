import config from '../config.js'
import {createRequire} from 'module'
import {Logger} from '@blackglobe-cz/app-utils'
import {AsyncLocalStorage} from 'node:async_hooks'
// @ts-ignore
import RollbarTransport from 'winston-transport-rollbar-3'

const require = createRequire(import.meta.url)
const packageJson = require('../../../package.json')

const asyncLocalStorage = new AsyncLocalStorage<string>()

const logger = new Logger<string>({...config.logger, asyncStorage: asyncLocalStorage})
const createRollbarTransport = () =>
    new RollbarTransport({
        rollbarConfig: {
            captureUncaught: true,
            captureUnhandledRejections: true,
            accessToken: config.rollbar.token,
            environment: config.rollbar.environment,
            codeVersion: packageJson.version
        },
        level: 'error',
    })

config.rollbar.enable && logger.addCustomTransport(createRollbarTransport)

export default logger
