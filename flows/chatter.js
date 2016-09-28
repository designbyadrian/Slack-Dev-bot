'use strict'

const request = require('request')
const striptags = require('striptags')
const requestUri = 'https://developer.mozilla.org/en-US/search.json?q='

const reactions = {
  'react' : [
    "Reach is only the view layer, damn it!",
    "You cannot build a fully functional dynamic application with React alone.",
    "Bundling Javascript and HTML into JSX makes components easily understandable",
    "React works great for teams, strongly enforcing UI and workflow patterns",
    "React UI code is readable and maintainable",
    "Componentized UI is the future of web development!",
    "Have you heard of Redux?",
    "Heard a React.js joke today. Someone said it was better than Angular."
  ],
  'redux': [
    "What the Flux?! Let's Redux!"
  ],
  'flux': [
    "There is no such thing as Flux",
    "Flux is more of a pattern than a framework"
  ],
  // 'angular' : [],
  // 'js' : [],
  // 'jsx': [
  //
  // ],
  // 'sass' : [],
  // 'bem' : [],
  // 'less' : [],
  // 'ember' : [],
  // 'backbone' : [],
  // 'mustache' : [],
  'node': [
    "Why was the JavaScript developer sad? Because he didn’t Node how to Express himself."
  ],
  // 'handlebars' : [],
  // 'google' : [],
  // 'twitter' : [],
  // 'airbnb' : [],
  // 'bootstrap' : [],
  // 'foundation' : [],
  'webpack': [
    "Webpack is a build tool that puts all of your assets in a dependency graph",
    "Webpack does dead asset elimination",
    "Webpack offers stable production deploys"
  ],
  'other': [
    "When a developer complains about having to learn something new, I assume they don't understand the underlying premise of their job."
  ]
};

module.exports = (slapp) => {

  const reactionRegExp = new RegExp(Object.keys(reactions).join("|"),"gi")

  slapp.command('/dev', (msg) => {

    if(msg.body.text == "?") {
      msg.respond(`Just type a phrase after *"/dev"* to search MDN`);
      return false;
    } else if(msg.body.text.length<2) {
      msg.respond(`Please type a string longer than two characters`);
      return false;
    }

    let thinkingPhrase = `Looking up ${msg.body.text}...`;

    let thinkingTimeout = setTimeout(()=>{
      msg.say(thinkingPhrase);
    },500);

    request({
      url: requestUri+encodeURIComponent(msg.body.text),
      json: true
    },(error,response,body)=>{
      clearTimeout(thinkingTimeout);

      if(!error && response.statusCode === 200) {

        try {

          if(body.documents.length>0) {

            let text = '',
                attachments = [{
                  'fallback': `MDN: ${body.documents[0].title} - ${body.documents[0].url}`,
                  'title': body.documents[0].title,
                  'title_link': body.documents[0].url,
                  'text': striptags(body.documents[0].excerpt)
                }];

            body.documents.shift();

            let fields = body.documents.map(doc=>{
              return `<${doc.url}|${doc.title}>`;
            });

            if(fields.length>0) {

              attachments[0].callback_id = 'read_more_callback'+(+ new Date());
              attachments[0].actions = [{
                'text': 'Show related articles',
                'name': 'more',
                'type': 'button'
              }];

              slapp.action(attachments[0].callback_id, 'more', (msg, value) => {
                msg.say({
                  'text': '',
                  'attachments': [{
                    'title': 'Articles related to '+body.documents[0].title,
                    'text': fields.join("\n")
                  }]
                })
              })

            }

            msg.say({text,attachments});

          } else {
            msg.say(`I couldn't find a document matching "${msg.body.text}" :(`);
          }

        } catch(e) {
          console.warn(e.message);
        }

      }

    })

  }) // command

  slapp.message('.*', (msg) => {

    if(Math.random()<2) {

      let matchedWords = msg.body.event.text.match(reactionRegExp);

      if(matchedWords.length>0) {
        let randomWordIndex = Math.floor(Math.random()*matchedWords.length),
            theWord = matchedWords[randomWordIndex],
            randomResponseIndex = Math.floor(Math.random()*reactions[theWord].length),
            theResponse = reactions[theWord][randomResponseIndex];

        msg.say(theResponse);
      }

    }

  }) // message
}
