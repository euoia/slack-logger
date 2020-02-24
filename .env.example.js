module.exports = {
  slackWebhookUrl: "https://hooks.slack.com/services/XXX1123/XXX1123/XXX1123",
  defaults: {
    logTimestamp: false,
    logPath: false
  },
  filesToWatch: [
    {
      filepath: "error.log",
      logTimestamp: true,
      prefix: "BOT"
    },
    {
      filepath: "access.log",
      logPath: true,
      prefix: "APACHE"
    }
  ]
};

