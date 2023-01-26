import path from 'path'
import express, {Request, Response} from 'express'
import {fileURLToPath} from 'url'
import {CustomEmitter, resources, validation} from '@blackglobe-cz/app-utils'

import config from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Logger from './modules/Logger.js'
import {ModelManager} from './modules/ModelManager.js'

export type AppRequest = Request & { session?: validation.RequestSessionAudit<string>, token?: string }
export type AppResponse = Response

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

await ModelManager.init(config.database, Logger.getLogger('Database'), [path.join(__dirname, 'resources')])

await resources.loadResources(app, Logger.getLogger('resources'), new CustomEmitter(Logger.getLogger('events')), '/api', `${__dirname}/resources`)

export {
    app
}
