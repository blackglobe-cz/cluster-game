import {Router} from 'express'
import {controllerMethods} from '@blackglobe-cz/app-utils'
import * as controller from './controller.js'

const router = Router();

const base = '/status';

router.get(
    base,
    controllerMethods.asyncHandler(controller.status)
);

export default router