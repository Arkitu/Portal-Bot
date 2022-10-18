// Check the sequelize doc: typescript for more informations : https://sequelize.org/docs/v6/other-topics/typescript/
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    BelongsToMany,
    ModelAttributes,
    Optional,
    BelongsTo,
} from "sequelize";
import { DiscordMessage } from "./discordmessage.js";
import { Portal } from "./portal.js";


export const initArgs = {
    OriginalMsgId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    PortalId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
};

export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    declare OriginalMsgId: string;
    declare Portal: CreationOptional<Portal>;
    declare DiscordMessages: CreationOptional<DiscordMessage[]>;
    static Portal: BelongsTo<Message, Portal>;
    static DiscordMessage: BelongsToMany<Message, DiscordMessage>;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
        Message.Portal = db.models.Message.belongsTo(db.models.Portal);
        Message.DiscordMessage = db.models.Message.belongsToMany(db.models.DiscordMessage, { through: "DiscordMessageMessages" });
    }
}

export function initModel() {
    Message.init(
        initArgs as unknown as ModelAttributes<Message, Optional<InferAttributes<Message, {omit: never;}>, never>>,
        {
            sequelize: db,
            modelName: 'Message'
        }
    );
    console.log(`Initialized model ${Message.name}`);
}