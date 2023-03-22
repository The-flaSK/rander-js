const {
  SlashCommandBuilder,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const ytdl = require("ytdl-core");

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
    const urlOF = interaction.options.getString("url");
    const dLink = await fetch("http://127.0.0.1:55581/ytd", {
      method: "POST",
      body: JSON.stringify({ url: urlOF }),
        headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    });
       const videoURL = await dLink.json()
       console.log(videoURL)
       const converting = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Downloaded")
      .setDescription(`Download from the link`)
      .addFields({name:"Link",value:`[Click Here](http://us3.techstar.live:55581/videos/${videoURL.url}.mp4)`})
    interaction.reply({embeds:[converting]});
  },
};
