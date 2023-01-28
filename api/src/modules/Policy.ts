import config from '../config.js';
import {Policy} from '@blackglobe-cz/app-utils';
import {Logger} from './Logger.js';

export const policy = new Policy(config.policy, Logger.getLogger('Policy'));