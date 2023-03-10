import type {InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize'
import {DataTypes, Model, Sequelize} from 'sequelize'

export class Character extends Model<InferAttributes<Character>, InferCreationAttributes<Character>> {
    declare id: CreationOptional<string>
    declare name: string
    declare level: CreationOptional<number>
    declare gender: string
    declare externalAccountId: string

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;

    // static associate = (_models: any): void => {

    // }
}

export const createModel = (sequelize: Sequelize) => {

    Character.init({
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        name: DataTypes.STRING,
        level: DataTypes.INTEGER,
        gender: DataTypes.STRING,
        externalAccountId: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {
        sequelize
    })

    return Character
}