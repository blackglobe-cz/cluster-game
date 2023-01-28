import fs from 'fs'
import pg from 'pg'
import path from 'path'
import winston from 'winston'
import {Sequelize, Model, ModelStatic} from 'sequelize'

pg.defaults.parseInt8 = true

export type Configuration = {
    database: string;
    user: string;
    password: string;
}

export class ModelManager {

    private logger: winston.Logger
    private readonly sequelize: Sequelize
    static Instance: ModelManager

    private constructor(logger: winston.Logger, sequelize: Sequelize) {
        this.logger = logger
        this.sequelize = sequelize
        ModelManager.Instance = this
    }

    static async init(config: Configuration, logger: winston.Logger, resourcesPaths: Array<string>): Promise<ModelManager> {
        const sequelize = new Sequelize(config.database, config.user, config.password, {
            ...config,
            logging: (...msg) => logger.debug('Query', msg),
            dialectOptions: {
                decimalNumbers: true
            },
            minifyAliases: true,
            define: {
                underscored: true,
                timestamps: true,
                paranoid: true
            }
        })
        for (const resourcePath of resourcesPaths) {
            const files = fs.readdirSync(resourcePath)
            for (const file of files) {
                if (file.includes('.d.ts')) {
                    continue
                }

                const schemaPath = path.join(resourcePath, file, 'model')
                if (fs.existsSync(`${schemaPath}.js`) || fs.existsSync(`${schemaPath}.ts`)) {
                    logger.debug('Importing model', {path: schemaPath})
                    const {createModel} = await import(`${schemaPath}.js`)
                    createModel(sequelize, this)
                }
            }
        }

        Object.keys(sequelize.models).forEach(modelName => {
            const model = sequelize.models[modelName] as any
            if (model.associate) {
                model.associate(sequelize.models)
            }
        })

        return new ModelManager(logger, sequelize)
    }

    get transaction() {
        return this.sequelize.transaction.bind(this.sequelize)
    }

    getModel<K extends Model>(name: string): ModelStatic<K> {
        const model = this.sequelize.models[name]
        if (!model) {
            this.logger?.debug('Models', {models: this.sequelize.models})
            throw new Error(`Model '${name}' not defined.`)
        }
        return model as ModelStatic<K>
    }
}