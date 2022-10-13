import * as path from 'path';
import { Sequelize, Model, ModelValidateOptions, ModelStatic } from 'sequelize';
import { dirname, filename } from 'dirname-filename-esm';
import { Portal, initModel as initPortal } from './portal.js';
import { Channel, initModel as initChannel } from './channel.js';

const __dirname = dirname(import.meta);
const __filename = filename(import.meta);

export const snowflakeValidate: ModelValidateOptions = {
    len: [18, 18],
    isInt: true
}

export interface ModelWithAssociate<M extends Model<any, any> = Model<any, any>> extends ModelStatic<M> {
    associate?: () => void
}

export interface Models {
    Portal?: ModelStatic<Portal>,
    Channel?: ModelStatic<Channel>,
    [key: string]: ModelStatic<Model<any, any>>
}

export interface SequelizeWithModels extends Sequelize {
    readonly models: Models;
}

const basename = path.basename(__filename);

global.db = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, "../../..", "db.sqlite"),
    logging: false
});

initPortal();
initChannel();

for (let model of Object.values(db.models)) {
    if ("associate" in model) {
        console.debug(`Associating model ${(model as ModelWithAssociate).name}`);
        (model as ModelWithAssociate).associate();
    }
}

// Sync the db
await db.sync();

console.debug("Database synced");

export default db;