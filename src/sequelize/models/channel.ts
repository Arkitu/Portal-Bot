// Check the sequelize doc: typescript for more informations : https://sequelize.org/docs/v6/other-topics/typescript/

import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";


export const initArgs = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    }
};

export class Channel extends Model<InferAttributes<Channel>, InferCreationAttributes<Channel>> {
    declare id: CreationOptional<string>;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
        db.models.Channel.belongsToMany(db.models.User, { through: "PortalChannels" });
    }
}

export function initModel() {
    Channel.init(initArgs, {
        sequelize: db,
        modelName: 'Channel'
    });
    console.log(`Initialized model ${Channel.name}`);
}