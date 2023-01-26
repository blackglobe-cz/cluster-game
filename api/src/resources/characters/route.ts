import {Router} from 'express'
import {controllerMethods} from '@blackglobe-cz/app-utils'

import * as controller from './controller.js'
import {policy} from "../../modules/Policy.js";

const router = Router();

const base = '/status';

router.get(
    base,
    policy.isSignedIn,
    controllerMethods.asyncHandler(controller.list)
);

export default router