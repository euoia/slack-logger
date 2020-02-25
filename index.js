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

const getFileMetaData = file => {
  const metaData = [];
  // Only add metadata to the start of the buffer.
  if (getFileConfigValue(file, "logPath")) {
    metaData.push(file.filepath);
  }

  if (file.prefix) {
    metaData.push(file.prefix);
  }

  if (getFileConfigValue(file, "logTimestamp")) {
    metaData.push(new Date().toLocaleString());
  }

  return metaData.join(" ");
};

function sendBufferToSlack() {
  console.log(`sendBufferToSlack`);
  const message = buffers[this.filepath].join("\n");

  const text = getFileMetaData(this) + "\n" + "```" + message + "```";
  slack.send({
    text
  });

  buffers[this.filepath] = [];
  console.log(message);
}

for (const file of conf.filesToWatch) {
  console.log(`Started watching for changes in ${file.filepath}.`);

  buffers[file.filepath] = [];
  file.sendBufferToSlack = debounce(sendBufferToSlack.bind(file), 1000);

  new Tail(file.filepath, line => {
    buffers[file.filepath].push(line);
    file.sendBufferToSlack();
  });
}
