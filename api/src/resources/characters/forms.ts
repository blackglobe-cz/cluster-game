import {body} from 'express-validator'
import {errorMessages} from "@blackglobe-cz/app-utils";

export const create = [
    body('name')
        .not().isEmpty().withMessage(errorMessages.required),
    body('gender')
        .not().isEmpty().withMessage(errorMessages.required)
]