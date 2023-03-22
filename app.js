const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { config } = require("dotenv");
const fs = require("node:fs");
const path = require("node:path");
const deploy = require("./deploy.js");

config();
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
client.commands = new Collection();

const clean = (text) => {
  // If our input is a promise, await it before continuing

  // If the response isn't a string, `util.inspect()`
  // is used to 'stringify' the code in a safe way that
  // won't error out on objects with circular references
  // (like Collections, for example)
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });

  // Replace symbols with character code alternatives
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));

  // Send off the cleaned up result
  return text;
};
const commandsPath = path.join(__dirname, "cogs");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith("r!eval")) {
    if (message.author.id === process.env.owner) {
      const initArgs = message.content
        .replaceAll("```js", "")
        .replaceAll("```", "");
      const finalArgs = initArgs.slice(6);
      try {
        const evaled = clean(eval(finalArgs));
        const evalArray = [];
        const len = Math.ceil(evaled.length / 1000);
        for (let i = 0; i < len; i++) {
          evalArray.push(i * 1000);
        }
        const evalEmbeds = [];
        evalArray.forEach((val, ind) => {
          const finalString = codeBlock(
            "js",
            evaled.slice(ind * 1000, evalArray[ind + 1])
          );
          const evalEmbed = new EmbedBuilder()
            .setColor("DarkNavy")
            .setTitle(`Output`)
            .addFields({
              name: "`Terminal`",
              value: `${finalString}`,
            });
          evalEmbeds.push(evalEmbed);
        });
        message.channel.send({ embeds: evalEmbeds }).catch((error) => {
          const evalEmbed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`Error`)
            .addFields({
              name: "`Terminal`",
              value: `${codeBlock("js", error)}`,
            });
          message.channel.send({ embeds: [evalEmbed] });
        });
      } catch (err) {
        const evalEmbed = new EmbedBuilder()
          .setColor("DarkRed")
          .setTitle(`Error`)
          .addFields({
            name: "`Terminal`",
            value: `${codeBlock("js", err)}`,
          });
        message.channel.send({ embeds: [evalEmbed] });
      }
    }
  } else if (message.content.startsWith("r!rename")) {
    if (message.author.id === process.env.owner) {
      fetch(
        `https://game.techstar.live/api/client/servers/${process.env.techStarServerId}/settings/rename`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.techStarServerApiKey}`,
          },
          body: JSON.stringify({
            name: message.content.replace("r!rename", ""),
          }),
        }
      )
        .then((res) => {
          if (res.status === 204) {
            const renameResult = new EmbedBuilder()
              .setColor("Green")
              .setTitle(`Success`)
              .addFields(
                {
                  name: "`Result`",
                  value: `${codeBlock("js", "Status ->" + res.status)}`,
                },
                {
                  name: "Target",
                  value: `${codeBlock(
                    "js",
                    "Changed name to ->" +
                      message.content.replace("r!rename", "")
                  )}`,
                }
              );
            message.channel.send({
              embeds: [renameResult],
            });
          } else {
            const renameResult = new EmbedBuilder()
              .setColor("Red")
              .setTitle(`\`Failed\``)
              .addFields({
                name: "`Result`",
                value: `${codeBlock("js", "Status -> " + res.status)}`,
              });
            message.channel.send({
              embeds: [renameResult],
            });
          }
        })
        .catch((err) => {
          const renameResult = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`\`Failed\``)
            .addFields({
              name: "`Fetch Error`",
              value: `${codeBlock("js", err)}`,
            });
          message.channel.send({
            embeds: [renameResult],
          });
          console.log(err);
        });
    }
  }
});
// Log in to Discord with your client's token
client.login(process.env.TOCKEN)
