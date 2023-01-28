import path from 'path'
import {fileURLToPath} from 'url'
import {APIError, resources, CustomEmitter} from '@blackglobe-cz/app-utils'

import {Logger} from '../modules/logger.js'
// import eventEmitter from '../modules/eventEmitter.js'
import type {Request, Response, Express, NextFunction} from "express";

const log = Logger.getLogger('app:resources')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const loadResources = async (app: Express) => {

    app.use(Logger.getRequestLogger())

    await resources.loadResources(app, log, new CustomEmitter(Logger.getLogger('Events')), '/api', path.join(__dirname, '.'))

    app.use('*', (req: Request, res: Response) => {
        if (!res.writableEnded) {
            log.warn(`Non existing route: ( ${req.method} ) ${req.originalUrl}`)
            res.status(404).json({message: 'Route not found.'})
        }
    })

    app.use((err: any, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line no-unused-vars
        if (typeof err === 'number') {
            return res.sendStatus(err)
        }

        if (err instanceof APIError || err.name === 'APIError') {
            // eslint-disable-next-line no-unused-vars
            const {status, stack, message, name, ...rest} = err
            if (status < 400 || status > 499) {
                log.error(err, req)
            }
            return res.status(status).json({error: message, ...rest})
        }

        if (err && err.parent && err.parent.code === '23505') {
            log.error(err.message, {stack: err.stack})
            return res.status(409).json({error: 'already_exist'})
        }
        log.error(err.message, {stack: err.stack})
        return res.status(500).json({error: 'server_error'})
    })
}