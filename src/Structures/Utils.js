const Guild = require("../models/guild");
const { glob } = require("glob");
const { promisify } = require("util");
const PG = promisify(glob);
const { connect, connection } = require("mongoose");
const { EmbedBuilder } = require("discord.js");
const { Connect, Prefix } = process.env;
const axios = require("axios");

module.exports = class Utils {
  constructor(client) {
    this.client = client;
  }

  async guild(guildID, guildName, prefix) {
    const guild = await Guild.findOne({
      guildID: guildID,
    });
    if (!guild) {
      const newData = new Guild({
        guildID,
        guildName,
        prefix: Prefix,
      });
      newData.save();
      return newData;
    } else {
      return guild;
    }
  }

  async getSetup(guildID, guildName) {
    const setup = await Guild.findOne({
      guildID,
      guildName,
    });
    return setup;
  }

  async wait(time) {
    const wait = require("node:timers/promises").setTimeout;
    await wait(time);
  }

  capitalise(string) {
    return string
      .split(" ")
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ");
  }

  eventCapitalise(string) {
    return string
      .split(" ")
      .map((str) => str.slice(0, 1).toLowerCase() + str.slice(1))
      .join(" ");
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  checkOwner(user) {
    return process.env.BotOwnerID !== user;
  }

  async dbConnect() {
    if (!Connect) return;
    const HOSTS_REGEX =
      /^(?<protocol>[^/]+):\/\/(?:(?<username>[^:@]*)(?::(?<password>[^@]*))?@)?(?<hosts>(?!:)[^/?@]*)(?<rest>.*)/;
    const match = Connect.match(HOSTS_REGEX);
    if (!match) {
      return console.error(
        chalk.red.bold(`[DATABASE]- Invalid connection string "${Connect}"`)
      );
    }
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      connectTimeoutMS: 10000,
      family: 4,
    };

    connection.on("connecting", () => {
      console.log(chalk.yellowBright("[DATABASE]- Mongoose is connecting..."));
    });

    connect(Connect, dbOptions);
    Promise = Promise;

    connection.on("connected", () => {
      console.log(
        chalk.greenBright("[DATABASE]- Mongoose has successfully connected!")
      );
    });

    connection.on("err", (err) => {
      console.error(
        chalk.redBright(`[DATABASE]- Mongoose connection error: \n${err.stack}`)
      );
    });

    connection.on("disconnected", () => {
      console.warn(chalk.red("[DATABASE]- Mongoose connection lost"));
    });
  }

  async loadFiles(dirName) {
    const Files = await PG(
      `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
    );
    Files.forEach((file) => delete require.cache[require.resolve(file)]);
    return Files;
  }

  async logger() {
    //Client
    console.log(chalk.greenBright(`[CLIENT] - Logged into Discord!`));

    //Events
    const events = await this.loadFiles("./src/events");
    let eventCount = 0;
    events.forEach((file) => {
      const event = require(file);
      if (!event.name || !event.execute)
        return console.error(
          chalk.italic.bold.redBright(
            `Event: ${file
              .split("/")
              .pop()} is missing the 'name' or 'execute' property. Skipping...`
          )
        );
      eventCount++;
    });
    console.log(chalk.blueBright(`[CLIENT] - Loaded ${eventCount} Event(s)!`));

    console.log(
      chalk.yellowBright(
        "[APPLICATION] - Started refreshing application (/) commands."
      )
    );

    //Slash Commands
    const slashCommands = await this.loadFiles("./src/commands");
    let slashCount = 0;
    let devCount = 0;
    slashCommands.forEach((file) => {
      const slashCommand = require(file);
      if (!slashCommand.data.name || !slashCommand.execute)
        return console.error(
          chalk.italic.bold.redBright(
            `Slash Command: ${file
              .split("/")
              .pop()} is missing a name or the 'execute' property.`
          )
        );
      if (slashCommand.developer) devCount++;
      else slashCount++;
    });
    console.log(
      chalk.blueBright(
        `[APPLICATION] - Loaded ${slashCount} Global Slash Command(s)!`
      )
    );
    console.log(
      chalk.blueBright(
        `[APPLICATION] - Loaded ${devCount} Developer Slash Command(s)!`
      )
    );

    console.log(
      chalk.greenBright(
        "[APPLICATION] - Successfully reloaded application (/) commands."
      )
    );

    //Components
    console.log(chalk.yellowBright("[HANDLER] - Loading Components..."));
    const buttons = await this.loadFiles("./src/components/buttons");
    const modals = await this.loadFiles("./src/components/modals");
    const selectMenus = await this.loadFiles("./src/components/selectMenus");

    let butCount = 0;
    let modCount = 0;
    let smCount = 0;

    buttons.forEach((file) => {
      const button = require(file);
      if (!button.data || !button.execute)
        return console.error(
          chalk.italic.bold.redBright(
            `Button: ${file
              .split("/")
              .pop()} is missing the 'data' or 'execute' property.`
          )
        );
      butCount++;
    });
    if (butCount > 0)
      console.log(
        chalk.blueBright(`[HANDLER] - Loaded ${butCount} Button(s)!`)
      );

    modals.forEach((file) => {
      const modal = require(file);
      if (!modal.data || !modal.execute)
        return console.error(
          chalk.italic.bold.redBright(
            `Modal: ${file
              .split("/")
              .pop()} is missing the 'data' or 'execute' property.`
          )
        );
      modCount++;
    });
    if (modCount > 0)
      console.log(chalk.blueBright(`[HANDLER] - Loaded ${modCount} Modal(s)!`));

    selectMenus.forEach((file) => {
      const selectMenu = require(file);
      if (!selectMenu.data || !selectMenu.execute)
        return console.error(
          chalk.italic.bold.redBright(
            `Select Menu: ${file
              .split("/")
              .pop()} is missing the 'data' or 'execute' property.`
          )
        );
      smCount++;
    });
    if (smCount > 0)
      console.log(
        chalk.blueBright(`[HANDLER] - Loaded ${smCount} Select Menu(s)!`)
      );

    console.log(chalk.greenBright("[HANDLER] - Loaded all Components!"));

    //MongoDB
    await this.dbConnect();

    //Database Models
    const dbModels = await this.loadFiles("./src/models");
    let modelCount = 0;
    dbModels.forEach(() => {
      modelCount++;
    });
    if (modelCount > 0) {
      console.log(
        chalk.blueBright(`[DATABASE]- Loaded ${modelCount} Model(s)!`)
      );
    }
  }

  errorEmbed(message, channel) {
    channel.send({
      embeds: [
        {
          description: `\\📛 **Error:** \\📛\n ${message} `,
          color: 0xfc0303,
        },
      ],
    });
  }

  successEmbed(message, channel) {
    channel.send({
      embeds: [
        {
          description: `\\✅ **Success:** \\✅\n ${message}  `,
          color: 0x13ad0e,
        },
      ],
    });
  }

  async errorEditEmbed(message, interaction) {
    await interaction.editReply({
      embeds: [
        {
          description: `\\📛 **Error:** \\📛\n ${message}`,
          color: 0xfc0303,
        },
      ],
      ephemeral: true,
    });
  }

  async successEditEmbed(message, interaction) {
    await interaction.editReply({
      embeds: [
        {
          description: `\\✅ **Success:** \\✅\n ${message}`,
          color: 0x13ad0e,
        },
      ],
    });
  }

  async errorReplyEmbed(message, interaction) {
    await interaction.reply({
      embeds: [
        {
          description: `\\📛 **Error:** \\📛\n ${message}`,
          color: 0xfc0303,
        },
      ],
      ephemeral: true,
    });
  }

  async successReplyEmbed(message, interaction, boolean) {
    await interaction.reply({
      embeds: [
        {
          description: `\\✅ **Success:** \\✅\n ${message}`,
          color: 0x13ad0e,
        },
      ],
      ephemeral: boolean,
    });
  }

  async getMeme() {
    let nonNSFW = null;

    while (nonNSFW === null) {
      const response = await axios.get("https://reddit.com/r/memes.json");
      const { data } =
        response.data.data.children[
          Math.floor(Math.random() * response.data.data.children.length)
        ];
      if (data.over_18 === false) nonNSFW = data;
    }

    return new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setURL("https://reddit.com" + nonNSFW.permalink)
      .setTitle(nonNSFW.title)
      .setDescription(
        `🤖 **Sub-Reddit**: \`r/${nonNSFW.subreddit}\`\n⬆️ **Upvotes**: \`${nonNSFW.ups}\` - ⬇️ **Downvotes**: \`${nonNSFW.downs}\``
      )
      .setFooter({ text: `Meme by ${nonNSFW.author}` })
      .setImage(nonNSFW.url);
  }
};
