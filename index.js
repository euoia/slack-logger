const conf = require("./.env.js");
const Tail = require("tail-file");
const { IncomingWebhook } = require("@slack/webhook");
const debounce = require("debounce");

const slack = new IncomingWebhook(conf.slackWebhookUrl);

const buffers = {};

const getFileConfigValue = (file, key) => {
  if (file[key] === undefined) {
    return conf.defaults[key] || false;
  }

  return file[key];
};

function sendBufferToSlack() {
  const message = buffers[this.filepath].join("\n");

  slack.send({
    text: "```" + message + "```"
  });

  buffers[this.filepath] = [];
  console.log(message);
}

for (const file of conf.filesToWatch) {
  console.log(`Started watching for changes in ${file.filepath}.`);

  buffers[file.filepath] = [];
  file.sendBufferToSlack = sendBufferToSlack.bind(file);

  new Tail(file.filepath, line => {
    if (buffers[file.filepath].length === 0) {
      // Only add metadata to the start of the buffer.
      if (getFileConfigValue(file, "logPath")) {
        line = `<${file.filepath}> ${line}`;
      }

      const metaData = [];
      if (file.prefix) {
        metaData.push(file.prefix);
      }

      if (getFileConfigValue(file, "logTimestamp")) {
        metaData.push(new Date().toLocaleString());
      }

      if (metaData.length) {
        line = `[${metaData.join(" ")}] ${line}`;
      }
    }

    buffers[file.filepath].push(line);
    debounce(file.sendBufferToSlack, 1000)();
  });
}
