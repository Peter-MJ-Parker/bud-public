/**
 *
 * @param {import("../../Structures/bot")} client
 */
module.exports = (client) => {
  const { commands, commandArray, rds } = client;

  client.handleCommands = async () => {
    const commandFolders = rds("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = rds(`./src/commands/${folder}`).filter((file) =>
        file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commandArray.push(command.data.toJSON());
        commands.set(command.data.name, command);
      }
    }
    client.application.commands.set(commandArray);
  };
};
