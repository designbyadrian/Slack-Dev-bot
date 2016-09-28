'use strict'

const request = require('request')
const requestUri = 'https://developer.mozilla.org/en-US/search.json?q='

const reactions = {
  'react' : []
  'angular' : []
  'js' : []
  'sass' : []
  'bem' : []
  'less' : []
  'ember' : []
  'backbone' : []
  'mustache' : []
  'handlebars' : []
  'google' : []
  'twitter' : []
  'airbnb' : []
  'bootstrap' : []
  'foundation' : []
};

module.exports = (slapp) => {

  const reactionKeys = Object.keys(reactions);

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

            let attachments = [{
              'fallback': `MDN: ${body.documents[0].title} - ${body.documents[0].url}`,
              'title': body.documents[0].title,
              'title_link': body.documents[0].url,
              'text': body.documents[0].excerpt
            }];

            msg.say({
              attachments
            });

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
      msg.say("I hear you!");
    }

  }) // message
}
