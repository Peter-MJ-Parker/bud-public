require("dotenv/config");
const { Client, Collection, Partials } = require("discord.js");
const {
  Channel,
  GuildMember,
  GuildScheduledEvent,
  Message,
  Reaction,
  ThreadMember,
  User,
} = Partials;
const { readdirSync } = require("fs");
const chalk = require("chalk");
const { BotToken } = process.env;
const Util = require("./Utils");
const { Player } = require("discord-player");
const { musicEvents } = require("./music");
const { Lyrics } = require("@discord-player/extractor");

class BOT extends Client {
  constructor() {
    super({
      intents: 3276799,
      partials: [
        Channel,
        GuildMember,
        GuildScheduledEvent,
        Message,
        Reaction,
        ThreadMember,
        User,
      ],
    });

    this.player = new Player(this, {
      smoothVolume: true,
    });
    this.requiredVoicePermissions = ["ViewChannel", "Connect", "Speak"];
    this.requiredTextPermissions = [
      "ViewChannel",
      "SendMessages",
      "ReadMessageHistory",
      "AddReactions",
      "EmbedLinks",
      "ManageMessages",
    ];

    this.config = require("./config.json");
    this.utils = new Util(this);
    this.setMaxListeners(0);
    this.events = new Collection();

    this.commands = new Collection();
    this.components = {
      buttons: new Collection(),
      modals: new Collection(),
      selectMenus: new Collection(),
    };

    this.cooldowns = {
      buttons: new Collection(),
      commands: new Collection(),
      modals: new Collection(),
      selectMenus: new Collection(),
    };

    this.commandArray = [];
    this.token = BotToken;
    this.colors = {
      green: 0x22b14c,
    };
    this.rds = readdirSync;
    global.chalk = chalk;
  }

  async start(token) {
    const functionFolders = this.rds(`./src/functions`);
    for (const folder of functionFolders) {
      const functionFiles = this.rds(`./src/functions/${folder}`).filter(
        (file) => file.endsWith(".js")
      );
      for (const file of functionFiles)
        require(`../functions/${folder}/${file}`)(this);
    }
    this.handleEvents();
    this.login(token).then(async () => {
      await this.utils.logger();
      this.handleCommands();
      this.handleComponents();
      this.login(token);
      await this.utils.wait(1000);
      musicEvents(this.player);
      this.lyrics = Lyrics.init(process.env.GENIUS);
      console.log(chalk.cyan(`[LYRICS] - Genius has loaded`));
    });
  }
}

module.exports = BOT;
