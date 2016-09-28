'use strict'

const request = require('request')
const striptags = require('striptags')
const requestUri = 'https://developer.mozilla.org/en-US/search.json?q='

const reactions = {
  'react' : [],
  'angular' : [],
  'js' : [],
  'sass' : [],
  'bem' : [],
  'less' : [],
  'ember' : [],
  'backbone' : [],
  'mustache' : [],
  'handlebars' : [],
  'google' : [],
  'twitter' : [],
  'airbnb' : [],
  'bootstrap' : [],
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

            let text = '',
                attachments = [{
                  'fallback': `MDN: ${body.documents[0].title} - ${body.documents[0].url}`,
                  'title': body.documents[0].title,
                  'title_link': body.documents[0].url,
                  'text': striptags(body.documents[0].excerpt)
                }],
                msgObject = {text,attachments};

            body.documents.shift();

            console.log("num docs "+body.documents.length);

            let fields = body.documents.map(doc=>{
              return `<${doc.url}|${doc.title}>`;
            });
            console.log("num fields "+fields.length);
            if(fields.length>0) {
              msgObject.fields = [{
                'title': 'Related articles',
                'value': fields.join("\n")
              }];
            }

            console.log("fields",fields);

            msg.say(msgObject);

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
