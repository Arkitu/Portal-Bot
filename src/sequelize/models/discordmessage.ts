// Check the sequelize doc: typescript for more informations : https://sequelize.org/docs/v6/other-topics/typescript/
import { Message as DiscordMessageClass } from "discord.js";
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ModelAttributes,
    Optional,
    BelongsTo,
    NonAttribute,
} from "sequelize";
import { Channel } from "./channel.js";
import { Message } from "./message.js";


export const initArgs = {
    /**
     * The id of the discord message
     */
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    }
};

export class DiscordMessage extends Model<InferAttributes<DiscordMessage>, InferCreationAttributes<DiscordMessage>> {
    declare id: CreationOptional<string>;
    declare Messages: CreationOptional<Message[]>;
    declare Channel: CreationOptional<Channel>;
    static Message: BelongsTo<DiscordMessage, Message>;
    static Channel: BelongsTo<DiscordMessage, Channel>;

    async fetchDiscord() {
        return (await this.Channel.fetchDiscord()).messages.fetch(this.id);
    }

    /**
     * ⚠️ Use this method only if the channel and the message are in the cache. If not, use fetchDiscord instead.
     */
    get discord(): NonAttribute<DiscordMessageClass> {
        return this.Channel.discord.messages.cache.get(this.id);
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
        DiscordMessage.Message = db.models.DiscordMessage.belongsToMany(db.models.Message, { through: "DiscordMessageMessages" });
        DiscordMessage.Channel = db.models.DiscordMessage.belongsTo(db.models.Channel);
    }
}

export function initModel() {
    DiscordMessage.init(
        initArgs as unknown as ModelAttributes<DiscordMessage, Optional<InferAttributes<DiscordMessage, {omit: never;}>, never>>,
        {
            sequelize: db,
            modelName: 'DiscordMessage'
        }
    );
    console.log(`Initialized model ${DiscordMessage.name}`);
}