import * as path from "path";
import { Sequelize, Model, ModelValidateOptions, ModelStatic } from "sequelize";
import { dirname } from "dirname-filename-esm";
import { Portal, initModel as initPortal } from "./portal.js";
import { Channel, initModel as initChannel } from "./channel.js";
import { Message, initModel as initMessage } from "./message.js";
import {
  DiscordMessage,
  initModel as initDiscordMessage,
} from "./discordmessage.js";

const __dirname = dirname(import.meta);

export const snowflakeValidate: ModelValidateOptions = {
  len: [18, 18],
  isInt: true,
};

export interface ModelWithAssociate<M extends Model<any, any> = Model<any, any>>
  extends ModelStatic<M> {
  associate?: () => void;
}

export interface Models {
  Portal?: ModelStatic<Portal>;
  Channel?: ModelStatic<Channel>;
  Message?: ModelStatic<Message>;
  DiscordMessage?: ModelStatic<DiscordMessage>;
  [key: string]: ModelStatic<Model<any, any>>;
}

export interface SequelizeWithModels extends Sequelize {
  readonly models: Models;
}

global.db = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../..", "db.sqlite"),
  logging: false,
});

initPortal();
initChannel();
initMessage();
initDiscordMessage();

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
