var app = require('clabot').createApp({
  getContractors: function(callback){ callback(['list','of','contributors'])},
  token: process.env.GITHUB_TOKEN,
  templateData: {
    link: '$http://your-cla-webform.com',
    maintainer: '$githubusername'
  },
  secrets: {
    '$repoowner': {
      '$sandbox': process.env.HUB_SECRET
    }
  }
});

port = process.env.PORT || 1337;

app.listen(port);
console.log("Listening on " + port);
