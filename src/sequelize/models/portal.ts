// Check the sequelize doc: typescript for more informations : https://sequelize.org/docs/v6/other-topics/typescript/

import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";
import pkg from "dottie";

interface Dottie {
    transform: (obj: any)=>any,
    flatten: (obj: any)=>any
}

const dottie = pkg as unknown as Dottie;

export const initArgs = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: "basic"
    },
    stringifiedData: {
        type: DataTypes.TEXT,
        defaultValue: "{}"
    },
    data: {
        type: DataTypes.VIRTUAL,
        get() {
            return JSON.parse(this.stringifiedData);
        },
        set(val: object) {
            this.stringifiedData = JSON.stringify(val);
        }
    }
};

export class Portal extends Model<InferAttributes<Portal>, InferCreationAttributes<Portal>> {
    declare id: CreationOptional<number>;
    declare type: CreationOptional<string>;
    declare stringifiedData: CreationOptional<string>;
    declare data: CreationOptional<object>;

    /**
     * Use this method to set config. If you use config directly, it won't be saved.
     */
    setData(val: object) {
        const flatVal = dottie.flatten(val);
        const flatConfig = dottie.flatten(this.data);
        const flatNewConfig = {...flatConfig, ...flatVal};
        this.data = dottie.transform(flatNewConfig);
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
        db.models.Portal.belongsToMany(db.models.Channel, { through: "PortalChannels" });
    }
}

export function initModel() {
    Portal.init(initArgs, {
        sequelize: db,
        modelName: 'Portal'
    });
    console.log(`Initialized model ${Portal.name}`);
}