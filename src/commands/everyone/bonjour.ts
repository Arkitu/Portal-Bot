import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("bonjour")
  .setDescription("Répond Bonjour!");
export async function execute(interaction: CommandInteraction) {
  interaction.reply("🖐️ Bonjour!");
}
