import { Message, MessageOptions } from "discord.js";
import { Channel } from "../sequelize/models/channel.js";
import { Portal, PortalType } from "../sequelize/models/portal.js";

export class PortalListeners {
  static async main(msg: Message) {
    const channel = await db.models.Channel.findByPk(msg.channel.id, {
      include: {
        model: db.models.Portal,
        include: [db.models.Channel],
      },
    });
    if (!channel) return;
    for (const portal of channel.Portals) {
      PortalListeners[portal.type as PortalType](msg, portal);
    }
  }

  static async basic(msg: Message, portal: Portal) {
    for (const channel of portal.Channels as Channel[]) {
      if (channel.id === msg.channel.id) continue;
      const channelObj = await channel.fetchDiscord();
      let sendOpts: MessageOptions = {};
      if (msg.content) {
        sendOpts.content = msg.content;
      }
      if (msg.attachments.size > 0) {
        sendOpts.files = msg.attachments.map((attachment) => attachment.url);
      }
      if (msg.embeds.length > 0) {
        sendOpts.embeds = msg.embeds;
      }
      if (msg.components.length > 0) {
        sendOpts.components = msg.components;
      }
      sendOpts.tts = msg.tts;
      channelObj.send(sendOpts).catch(() => {
        console.error(
          "Je n'arrive pas à envoyer un message dans le salon " + channelObj.id
        );
      });
    }
  }
}
