import type {Request, Response} from "express";

import {createRequire} from 'module'

const require = createRequire(import.meta.url)
const packageJson = require('../../../../package.json')

export const status = async (_req: Request, res: Response) => {
    res.json({name: packageJson.name})
}