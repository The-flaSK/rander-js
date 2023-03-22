const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get bot latency"),
  async execute(interaction) {
    const initPing = new EmbedBuilder()
      .setTitle("Latency")
      .setDescription(`Pinging...`);
    const sent = await interaction.reply({
      embeds: [initPing],
      fetchReply: true,
    });
    const endPing = new EmbedBuilder()
      .setTitle("Ping")
      .setColor("DarkNavy")
      .setDescription(
        `\`In ${sent.createdTimestamp - interaction.createdTimestamp}ms\``
      );

    interaction.editReply({
      embeds: [endPing],
    });
  },
};
