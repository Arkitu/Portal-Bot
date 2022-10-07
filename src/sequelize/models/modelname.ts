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
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    example_attribute: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

export class ModelName extends Model<InferAttributes<ModelName>, InferCreationAttributes<ModelName>> {
    declare id: CreationOptional<number>;
    declare example_attribute: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
        // define association here
    }
}

export function initModel() {
    ModelName.init(initArgs, {
        sequelize: db,
        modelName: 'ModelName'
    });
    console.log(`Initialized model ${ModelName.name}`);
}