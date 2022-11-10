const {
  SlashCommandBuilder,
  EmbedBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Returns help menu.")
    .setDMPermission(false),
  /**
   *
   * @param {import("../../Structures/bot.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    // const appCmd = client.application.commands.cache.map((cmd) => {
    //   console.log(`/${cmd.name}:${cmd.id}`);
    // });
    const { commands, config, utils } = client;
    try {
      const emoji = config.help;
      let directories;
      if (!config.owners.includes(interaction.user.id)) {
        directories = [
          ...new Set(
            commands
              .filter(
                (cmd) => cmd.category !== "owner" && cmd.category !== "context"
              )
              .map((cmd) => cmd.category)
          ),
        ];
      } else {
        directories = [
          ...new Set(
            commands
              .filter((cmd) => cmd.category !== "context")
              .map((cmd) => cmd.category)
          ),
        ];
      }

      const categories = directories.map((dir) => {
        const getcmds = commands
          .filter((cmd) => cmd.category === dir)
          .map((cmd) => {
            return {
              name: cmd.data.name,
              description: cmd.data.description,
              inline: true,
            };
          });
        return {
          directory: utils.capitalise(dir),
          commands: getcmds,
        };
      });

      const embed = new EmbedBuilder({
        description: "Please choose a category from the dropdown menu.",
      });
      const components = (state) => [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: "help-menu",
              disabled: state,
              placeholder: "Please select a category",
              options: categories.map((cmd) => {
                return {
                  label: `${cmd.directory}` || ".",
                  value: `${cmd.directory.toLowerCase()}` || ".",
                  description: `Commands from ${cmd.directory} category` || ".",
                  emoji: `${emoji[cmd.directory.toLowerCase()]}` || "❤️",
                };
              }),
            },
          ],
        },
      ];

      await interaction.reply({
        embeds: [embed],
        components: components(false),
        fetchReply: true,
        ephemeral: true,
      });
      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        timeout: 5000,
      });

      collector.on("collect", (interaction) => {
        const [directory] = interaction.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const embed2 = new EmbedBuilder().addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: `${cmd.description}`,
              inline: true,
            };
          })
        );

        for (const dir of [directory]) {
          embed2.setDescription(
            `${emoji[dir]} ${utils.capitalise(dir)} Commands:`
          );
        }
        interaction.update({ embeds: [embed2] });
      });

      collector.on("end", () => {
        interaction.update({ components: components(true) });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
