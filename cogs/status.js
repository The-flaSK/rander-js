const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get bot status"),
  async execute(interaction) {
    let initResources;
     fetch(`https://panel.pylexnodes.net/api/client/servers/${process.env.pylexServerId}`, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.pylexServerApiKey}`,
  }
}).then((data) => {
return data.json()
}).then((data) => {
initResources = data;
});
    const status = await fetch(
      `https://panel.pylexnodes.net/api/client/servers/${process.env.pylexServerId}/resources`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.pylexServerApiKey}`,
        },
      }
    );
    status.json().then((data) => {
      const statusEmbed = new EmbedBuilder()
        .setTitle(`Status -> ${data.attributes.current_state}`)
        .addFields(
          {
            name: "`CPU`",
            value: `\`\`\`js\n${data.attributes.resources.cpu_absolute}% from ${initResources.attributes.limits.cpu}%\`\`\``,
            inline: false,
          },
          {
            name: "`Ram`",
            value: `\`\`\`js\n${Math.floor(
              data.attributes.resources.memory_bytes / 1_000_000
            )} MB from ${initResources.attributes.limits.memory} MB\`\`\``,
            inline: false,
          },
          {
            name: "`Disk`",
            value: `\`\`\`js\n${Math.floor(
              data.attributes.resources.disk_bytes / 1_000_000
            )} MB from ${initResources.attributes.limits.disk} MB\`\`\``,
            inline: false,
          },
          {
            name: "`Uptime`",
            value: `\`\`\`js\n${Math.floor(
              data.attributes.resources.uptime / 60 / 60 / 1000
            )} hours\`\`\``,
            inline: false,
          }
        );
      interaction.reply({ embeds: [statusEmbed] });
    });
  },
};
