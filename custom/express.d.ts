import * as core from "express-serve-static-core"
import {validation} from "@blackglobe-cz/app-utils"

declare global {
    namespace Express {
        interface Request<P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = core.Query,
            Locals extends Record<string, any> = Record<string, any>> {
            session: validation.RequestSessionAudit<string>
            validatedBody: ReqBody
        }
    }
}