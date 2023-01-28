import path from 'path'
import config from 'dotenv'
import http, {Server} from 'http'
import type {validation} from "@blackglobe-cz/app-utils";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config.config({
    path: path.join(__dirname, '..', '..', '.env')
});

import {clean, schema} from "../../db/lib.js";
import {policy} from '../src/modules/Policy.js'
import {Logger} from '../src/modules/Logger.js'
import {fileURLToPath} from "url";

const testLogger = Logger.getLogger('test')


const credentials = [{
    id: 'users/1', email: 'user@user.cz', password: 'user'
}, {
    id: 'users/2', email: 'admin@admin.cz', password: 'admin',
}];


import {app} from '../src/app.js'

const server: Server = http.createServer(app)

export const logUser = async (credentials: validation.RequestSessionAudit<string>): Promise<string> => (await policy.createToken(credentials)).accessToken;

export const logUsers = async (): Promise<Array<string>> => {
    const items = [];
    for (const credential of credentials) {
        items.push(await logUser({user: credential}));
    }
    return items;
}

export const resetDatabase = async () => {
    await clean(testLogger)
    await schema(testLogger)
    // await custom(testLogger, __dirname + '/data/seed -q')
};

export {
    server
}