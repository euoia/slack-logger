module.exports = {
  slackWebhookUrl: "https://hooks.slack.com/services/XXX1123/XXX1123/XXX1123",
  filesToWatch: [
    {
      name: "error.log",
      addTimestamp: false,
      prefix: "BOT"
    },
    {
      name: "access.log",
      addTimestamp: false,
      prefix: "APACHE"
    }
  ]
};

