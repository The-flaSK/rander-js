const {
  SlashCommandBuilder,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const ytdl = require("ytdl-core");

const cooldowns = new Map();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ytd")
    .setDescription("Download youtube videos")
    .addStringOption((option) => {
      return option
        .setName("url")
        .setDescription("https://www.youtube.com/<url>")
        .setRequired(true);
    }),
  async execute(interaction) {
      const { user } = interaction;

        if (cooldowns.has(user.id)) {
            const cooldownTime = 60 * 1000 * 2; // 1 minute in milliseconds
            const timeLeft = cooldowns.get(user.id) + cooldownTime - Date.now();
            if (timeLeft > 0) {
                 const coolEmbed = new EmbedBuilder()
      			.setColor("Yellow")
    			  .setTitle("Cooldown!")
      				.setDescription(`\`\`\`You must wait <${Math.ceil(timeLeft / 1000)}> more seconds before using this command again because we have limited resources to serve multiple users\`\`\``)
                return interaction.reply({embeds:[coolEmbed]});
            }
        }

        // Command logic goes here
       const urlOF = interaction.options.getString("url");
    const dLink = await fetch("http://127.0.0.1:30212/ytd", {
      method: "POST",
      body: JSON.stringify({ url: urlOF }),
        headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    });
       const videoURL = await dLink.json()
       const converting = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Video Downloaded!")
      .setDescription(`Video download link`)
      .addFields({name:"`Link`",value:`[Click Here](http://mum03.pylexnodes.net:30212/videos/${videoURL.url}.mp4)`},{
          name:"`Note:`", value:"```js\nThe link will be valid for 2 min only. Your browser may show the file maliciuous because we do not have https on our server, but it is 100% safe to download.```"
      })
    interaction.reply({embeds:[converting],ephemeral: true});

        cooldowns.set(user.id, Date.now());
        setTimeout(() => cooldowns.delete(user.id), 60 * 1000); // Remove cooldown after 1 minute
  },
};
