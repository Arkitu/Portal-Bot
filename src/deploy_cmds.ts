import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import { join } from "path";
import { dirname } from "dirname-filename-esm";
import * as upath from 'upath';

class SlashCommandBuilderWithPerms extends SlashCommandBuilder {
    perms: "admin" | "everyone";
}

let __dirname = upath.toUnix(dirname(import.meta));

global.config = new JsonDB(new Config("./config", true, true, '/'));
global.constants = new JsonDB(new Config("./constants", true, true, '/'));


const path = {
    admin: join(__dirname, "commands", "admin"),
    everyone: join(__dirname, "commands", "everyone")
}

const commandFiles = {
    admin: readdirSync(path.admin).filter(file => file.endsWith(".js")),
    everyone: readdirSync(path.everyone).filter(file => file.endsWith(".js"))
};

(async () => {
    const rest = new REST({ version: "9" }).setToken(config.getData("/token"));

    console.log("Started refreshing application (/) commands.");

    constants.delete("/commands");

    let cmds: {
        admin: SlashCommandBuilderWithPerms[],
        everyone: SlashCommandBuilderWithPerms[]
    } = {
        admin: [],
        everyone: []
    };
    for (let file of commandFiles.admin) {
        cmds.admin.push(await (await import(join(path.admin, file))).data.toJSON() as SlashCommandBuilderWithPerms);
    }
    for (let file of commandFiles.everyone) {
        cmds.everyone.push(await (await import(join(path.everyone, file))).data.toJSON() as SlashCommandBuilderWithPerms);
    }

    console.log(cmds);

    await rest.put(
        Routes.applicationCommands(config.getData("/app_id")),
        { body: cmds.everyone }
    );
    await rest.put(
        Routes.applicationGuildCommands(config.getData("/app_id"), config.getData("/admin_server_id")),
        { body: cmds.admin }
    );

    for (let cmd of cmds.admin) {
        cmd.perms = "admin";
    }
    for (let cmd of cmds.everyone) {
        cmd.perms = "everyone";
    }

    constants.push("/commands", cmds.admin.concat(cmds.everyone));

    console.log("Finished refreshing application (/) commands.");
})();
