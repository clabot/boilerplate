# clabot-boilerplate

This is a clabot boilerplate designed to be deployed on [Heroku](http://www.heroku.com/).

## Requirements

You should have the following installed and set up.

* [git](http://git-scm.com/download)
* [heroku cli](https://devcenter.heroku.com/articles/heroku-command)
* [node.js](http://nodejs.org/download/)
* [grunt](http://gruntjs.com)

## Creating the Git Repository

Before we start you need to either fork this repository or create a [new one based on this boilerplate](https://github.com/clabot/boilerplate/archive/master.zip).

Once you have that set up create a new heroku app in the newly created folder. (In case you aren't familiar with heroku workflows yet, read [this tutorial](https://devcenter.heroku.com/articles/nodejs))

```bash
heroku create
```


## Configuration

All you have to do now is change the options object in [clabot.js](https://github.com/clabot/boilerplate/blob/master/src/clabot.js#L2-L12).

All of the options are described in the [documentation](http://clabot.github.com/#documentation), but I'll explain the most important ones.

**token**

This should be a valid GitHub oAuth token. You probably want to create a seperate github account for your bot, so this is what a command to get such a token would look like:

```bash
curl -u 'clabotusername' -d '{"scopes":["repo"],"note":"clabot"}' https://api.github.com/authorizations
```
[Creating an OAuth token for command-line use](https://help.github.com/articles/creating-an-oauth-token-for-command-line-use)

Rather than just pasting the raw token into the js file we'll set up a heroku environment variable.

```bash
heroku config:set GITHUB_TOKEN=thetoken
```

**secrets**

The secrets you provide when subscribing to GitHub's events. Organized in a user/repo way so you can vary secrets on a per repo basis.

In order to receive events from GitHub you have to subscribe.
clabot will never push code to the repositories, but push access is required to be able to receive events from the GitHub API.

*Note:* There is no need for the GitHub account associated with the token to be the same you subscribe to these events with.

```bash
curl -u "clabotusername" -i https://api.github.com/hub -F "hub.mode=subscribe" -F "hub.topic=https://github.com/:user/:repo/events/pull_request" -F "hub.callback=http://your-clabot.herokuapp.com/notify" -F "hub.secret=supersecretrandomstring"

curl -u "clabotusername" -i https://api.github.com/hub -F "hub.mode=subscribe" -F "hub.topic=https://github.com/:user/:repo/events/issue_comment" -F "hub.callback=http://your-clabot.herokuapp.com/notify" -F "hub.secret=supersecretrandomstring"
```

Again we'll save those secrets as environment variables

```bash
heroku config:set HUB_SECRET=supersecretrandomstring
```

*Note:* You have to do both of the commands for every repository that should be observed. One command for pull requests and one for comments on those.

[http://developer.github.com/v3/repos/hooks/#pubsubhubbub](http://developer.github.com/v3/repos/hooks/#pubsubhubbub)

**getContractors**

This is the most important part of clabot, because that's where you plug your data into it.

The getContractors method will be called with a callback as the first argument. Do whatever you need to get an array of signed GitHub usernames and call the callback with it.

This could look like this:

```js
getContractors = function(callback) {
  fetchContractorsFromDatabase(function(err, res){
    if (err) {
      callback([])
    } else {
      calback(res.contractors)
    }
  });
};
```

Have a look at our [sample-clabot](http://github.com/clabot/sample) to see how we have done it.

All the other options should be obvious, especially with the [documentation](http://clabot.github.com/#documentation) at hand.

## Deploy it to heroku

Once you have clabot configured you test that everything is fine locally.

```bash
npm install
foreman start
```

If this doesn't show errors push you code to heroku

```bash
git push heroku master
```

## Success

Congratulations, after heroku has finished building the app clabot will answer your pull requests.
