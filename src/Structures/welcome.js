const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder } = require("discord.js");

async function welcomeCreate(member, guildName, count, channel) {
  registerFont(`${__dirname}/fonts/AlfaSlabOne-Regular.ttf`, {
    family: "Alfa",
  });
  registerFont(`${__dirname}/fonts/LobsterTwo-BoldItalic.ttf`, {
    family: "Lobster",
  });
  const welcomeCanvas = {};
  welcomeCanvas.create = createCanvas(1024, 500);
  welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
  welcomeCanvas.context.font = '68px "Alfa"';
  welcomeCanvas.context.fillStyle = "#f7e3e1";

  const url = "https://i.imgur.com/hyaxPhs.png";
  await loadImage(url).then(async (img) => {
    welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
    welcomeCanvas.context.fillText("Welcome!", 475, 150);
    welcomeCanvas.context.beginPath();
    welcomeCanvas.context.arc(275, 200, 128, 0, Math.PI * 2, true);
    welcomeCanvas.context.stroke();
    welcomeCanvas.context.fill();
  });

  let canvas = welcomeCanvas;
  canvas.context.font = `52px "Lobster"`;
  canvas.context.textAlign = "center";
  canvas.context.fillText(member.user.username, 650, 220);
  canvas.context.font = '38px "Lobster"';
  canvas.context.fillText(`Member #${count}`, 650, 275);
  canvas.context.beginPath();
  canvas.context.arc(275, 200, 128, 0, Math.PI * 2, true);
  canvas.context.closePath();
  canvas.context.clip();
  const url2 = `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=1024`;
  await loadImage(url2).then((img2) => {
    canvas.context.drawImage(img2, 150, 75, 252, 252);
  });

  let Attachment = new AttachmentBuilder(
    canvas.create.toBuffer(),
    `welcome-${member.id}.png`
  );

  const contents = [
    `:wave: Welcome to ${guildName}, ${member}`,
    `${member} has joined to smoke some weed and play games but has ran out of weed.`,
    `We hope you find what you're looking for and that you enjoy your stay, ${member}.`,
    `${member} is here to kick ass and chew gum. And ${member} has run out of gum.`,
    `${member} has just joined. Save your bananas.`,
    `Welcome ${member}. Please leave your negativity at the door.`,
    `It's a pot! It's a stone! Nevermind it's just ${member}.`,
    `${member} has joined the server. Can I get a heal?`,
    `${member} has arrived. The party is over.`,
    `${member} has arrived. The party has started.`,
    `Welcome ${member}! We were waiting for you (͡ ° ͜ʖ ͡ °)`,
    `${member} never gonna let you down, ${member} never gonna give up their weed.`,
    `Hi ${member}! Welcome to our community! Please make yourself at home!`,
    `Hi ${member}! Hint: run command \`/pack\` if you need a jump start!`,
  ];
  let option = Math.floor(Math.random() * contents.length);
  const content = contents[option];
  try {
    channel.send({
      content,
      files: [Attachment],
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { welcomeCreate };
