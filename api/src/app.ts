import config from "./config.js";
import path from 'path'
import express from 'express'
import {fileURLToPath} from 'url'

import {Logger} from './modules/Logger.js'
import {loadResources} from "./resources/index.js";
import {ModelManager} from "./modules/ModelManager.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

await ModelManager.init(config.database, Logger.getLogger('Database'), [path.join(__dirname, 'resources')])

await loadResources(app)

export {
    app
}
