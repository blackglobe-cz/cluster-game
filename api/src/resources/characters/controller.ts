import type {Request, Response} from 'express'

import type {Character} from "./model.js";
import {ModelManager} from "../../modules/ModelManager.js";

const characterModel = ModelManager.Instance.getModel<Character>('Character')

export const list = async (req: Request, res: Response) => {
    const characters = await characterModel.findAll({where: {externalAccountId: req.session.user.id}})
    res.json(characters)
}

export const create = async (req: Request, res: Response) => {
    console.log(req.validatedBody);
    const character = await characterModel.create({
        ...req.validatedBody,
        externalAccountId: req.session.user.id,
    })
    res.status(201).json(character)
}