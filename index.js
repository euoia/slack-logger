const conf = require("./.env.js");
const Tail = require("tail-file");
const { IncomingWebhook } = require("@slack/webhook");

const slack = new IncomingWebhook(conf.slackWebhookUrl);

const getFileConfigValue = (file, key) => {
  if (file[key] === undefined) {
    return conf.defaults[key] || false;
  }

  return file[key];
};

for (const file of conf.filesToWatch) {
  console.log(`Started watching for changes in ${file.filepath}.`);
  new Tail(file.filepath, line => {
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

    slack.send({
      text: line
    });

    console.log(line);
  });
}
