const conf = require("./.env.js");
const Tail = require("tail-file");
const { IncomingWebhook } = require("@slack/webhook");

const slack = new IncomingWebhook(conf.slackWebhookUrl);

for (const file of conf.filesToWatch) {
  console.log(`Started watching for changes in ${file.name}.`);
  new Tail(file.name, line => {
    line = `<${file.name}> ${line}`;

    const metaData = [];
    if (file.prefix) {
      metaData.push(file.prefix);
    }

    if (file.addTimestamp) {
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
