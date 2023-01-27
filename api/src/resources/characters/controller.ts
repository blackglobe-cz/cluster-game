import {ModelManager} from "../../modules/ModelManager.js";
import type {Character} from "./model.js";
import type {AppRequest, AppResponse, PostRequest} from "../../app.js";

const characterModel = ModelManager.Instance.getModel<Character>('Character')

export const list = async (req: AppRequest, res: AppResponse) => {
    const characters = await characterModel.findAll({where: {externalAccountId: req.session}})
    res.json(characters)
}

export const create = async (req: PostRequest<{ name: string, gender: string }>, res: AppResponse) => {
    const character = await characterModel.create({
        ...req.validatedBody,
        externalAccountId: req.session.user.id,
    })
    res.status(201).json(character)
}