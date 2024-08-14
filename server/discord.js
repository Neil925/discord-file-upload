const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });
const channelid = "1271993511616712820";

/**
* @type {import('discord.js').TextChannel}
*/
let uploadPool = null

module.exports = class Discord {
  constructor() {
    client.on('ready', this.#onReady);

    client.login(process.env.DISCORD_BOT_TOKEN);
  }


  /**
   * @typedef {Object} DiscordMessageUpload
   * @property {string} messageid
   * @property {string[]} attachmentUrls
   */

  /**
  * @returns {Promise<DiscordMessageUpload>}
  */
  async uploadFiles(files) {
    if (uploadPool === null)
      throw new Error("Channel is null!");

    if (!Array.isArray(files))
      files = [files];

    let message = await uploadPool.send({ files: files });

    return { id: message.id, attachmentUrls: message.attachments.map(x => x.url) };
  }

  async deleteFile(messageid, url) {
    let message = await uploadPool.messages.fetch(messageid);

    return message.attachments.delete(message.attachments.findKey(x => x.url == url));
  }

  async #onReady() {
    console.log(`Logged in as ${client.user.tag}!`);

    let channel = await client.channels.fetch(channelid)

    if (channel === null || !channel.isTextBased())
      throw new Error(`Channel id ${channelid} is not a text based channel!`);

    uploadPool = channel;
  }
}
