import {ModelManager} from "../../modules/ModelManager.js";
import {Character} from "./model.js";
import {AppRequest, AppResponse} from "../../app.js";

const characterModel = ModelManager.Instance.getModel<Character>('Character')

export const list = async (req: AppRequest, res: AppResponse) => {
    const characters = await characterModel.findAll({where: {externalAccountId: req.session}})
    res.json(characters)
}