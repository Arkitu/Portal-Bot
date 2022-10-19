import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { PortalType } from "../../sequelize/models/portal";

export const data = new SlashCommandBuilder()
  .setName("init_portal")
  .setDescription("Initialise un portail entre ce salon et un autre")
  .addChannelOption((option) =>
    option
      .setName("target_channel")
      .setDescription("Le salon à connecter")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Le type de portail (par défaut basic)")
      .addChoices([["basic", "basic"]])
  );
export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const opts = {
    target_channel: interaction.options.getChannel("target_channel", true),
    type: (interaction.options.getString("type") || "basic") as PortalType,
  };

  if (!("isText" in opts.target_channel)) return;

  if (!opts.target_channel.isText()) {
    await interaction.editReply("Le salon ciblé n'est pas un salon de texte");
    return;
  }

  db.models.Portal.create(
    {
      Channels: [
        { id: interaction.channel.id },
        { id: opts.target_channel.id },
      ],
      type: opts.type,
    },
    {
      include: [db.models.Channel],
    }
  );

  interaction.editReply(
    `Portail créé entre ${interaction.channel} et ${opts.target_channel}`
  );
}
