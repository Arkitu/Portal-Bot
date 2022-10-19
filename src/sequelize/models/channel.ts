// Check the sequelize doc: typescript for more informations : https://sequelize.org/docs/v6/other-topics/typescript/
import { TextBasedChannel } from "discord.js";
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsToMany,
  ModelAttributes,
  Optional,
  NonAttribute,
  HasMany,
} from "sequelize";
import { DiscordMessage } from "./discordmessage.js";
import { Portal } from "./portal.js";

export const initArgs = {
  /**
   * The id of the discord channel
   */
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
};

export class Channel extends Model<
  InferAttributes<Channel>,
  InferCreationAttributes<Channel>
> {
  declare id: CreationOptional<string>;
  declare Portals: CreationOptional<Portal[]>;
  declare DiscordMessages: CreationOptional<DiscordMessage[]>;
  static DiscordMessage: HasMany<Channel, DiscordMessage>;
  static Portal: BelongsToMany<Channel, Portal>;

  async fetchDiscord() {
    let channel = await client.channels.fetch(this.id);
    if (!channel.isText()) throw new Error("Channel is not a text channel");
    return channel;
  }

  /**
   * ⚠️ Use this method only if channel is in the cache. If not, use fetchDiscord instead.
   */
  get discord(): NonAttribute<TextBasedChannel> {
    let channel = client.channels.cache.get(this.id);
    if (!channel) throw new Error("Channel not found");
    if (!channel.isText()) throw new Error("Channel is not a text channel");
    return channel;
  }

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    Channel.Portal = db.models.Channel.belongsToMany(db.models.Portal, {
      through: "PortalChannels",
    });
    Channel.DiscordMessage = db.models.Channel.hasMany(
      db.models.DiscordMessage
    );
  }
}

export function initModel() {
  Channel.init(
    initArgs as unknown as ModelAttributes<
      Channel,
      Optional<InferAttributes<Channel, { omit: never }>, never>
    >,
    {
      sequelize: db,
      modelName: "Channel",
    }
  );
  console.log(`Initialized model ${Channel.name}`);
}
