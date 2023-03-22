const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const search = require("youtube-search");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yts")
    .setDescription("Search for videos")
    .addStringOption((option) => {
      return option
        .setName("search")
        .setDescription("fizz buzz")
        .setRequired(true);
    }),
  async execute(interaction) {
    const opts = {
      maxResults: 10,
      key: process.env.ytApiKey,
    };

    search(
      interaction.options.getString("search"),
      opts,
      function (err, results) {
        if (err) return console.log(err);
        const searchEmbed = new EmbedBuilder()
          .setTitle(
            "Search results for " + interaction.options.getString("search")
          )
          .setColor("Red")
          .setDescription("`Videos`");
        results.forEach((value, index) => {
          searchEmbed.addFields({
            name: `${index + 1}. ${value.title} \nBy ${value.channelTitle} `,
            value: `[Link](${value.link})`,
            inline: false,
          });
        });
        interaction.reply({ embeds: [searchEmbed] });
      }
    );
  },
};
