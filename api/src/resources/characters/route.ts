import {Router} from 'express'
import {controllerMethods, validation} from '@blackglobe-cz/app-utils'

import * as forms from './forms.js'
import * as controller from './controller.js'
import {policy} from "../../modules/Policy.js";

const router = Router();

const base = '/status';

router.post(
    base,
    policy.isSignedIn,
    forms.create,
    validation.checkErrors,
    controllerMethods.asyncHandler(controller.create)
);

router.get(
    base,
    policy.isSignedIn,
    controllerMethods.asyncHandler(controller.list)
);

export default router