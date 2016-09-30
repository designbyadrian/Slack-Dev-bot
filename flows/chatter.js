'use strict'

const request = require('request')
const striptags = require('striptags')
const requestUri = 'https://developer.mozilla.org/en-US/search.json?q='

const reactions = {
  'angular' : [
    "Angular 2 rules!",
    "Angular 2's design embraces the web component's standard",
    "Angular injects JS into HTML"
  ],
  'bem' : [
    "Heil Hitler!",
    "Nazi SASS",
    "BEM is evil",
    "It's BEMaddening",
    "I'm BEMused",
    "BEM - because you can't write clean code without Adolf Hitler telling you what to do"
  ],
  'bootstrap' : [
    "May I suggest http://bootstrapfoundationfive.github.io?",
    "May I suggest http://html9responsiveboilerstrapjs.com?",
  ],
  'css': [
    "`#nsa { opacity: 1; }`",
    "`.monarch { position: inherit; }`",
    "`#chucknorris * { z-index: 9999; }`",
    "`.hangover {repeat: never;}`",
    "`.UKIP {border: 100px solid white;}`",
    "`.vodka { position: absolute; }`"
  ],
  'ember' : [
    "Why was Ember.js turning red? Because it was EMBERrassed for not remEMBERing its route home"
  ],
  'flux': [
    "There is no such thing as Flux",
    "Flux is more of a pattern than a framework"
  ],
  'foundation': [
    "May I suggest http://bootstrapfoundationfive.github.io?",
    "May I suggest http://html9responsiveboilerstrapjs.com?",
  ],
  'js' : [
    "How do you comfort a JavaScript bug? You console it",
    'When a JavaScript date has gone bad, "Don’t call me, I\'ll callback you. I promise!"'
  ],
  'material': [
    "May I suggest http://bootstrapfoundationfive.github.io?",
    "May I suggest http://html9responsiveboilerstrapjs.com?",
  ],
  'node': [
    "Why was the JavaScript developer sad? Because he didn’t Node how to Express himself."
  ],
  'react' : [
    "Reach is only the view layer, damn it!",
    "You cannot build a fully functional dynamic application with React alone.",
    "Bundling Javascript and HTML into JSX makes components easily understandable",
    "React works great for teams, strongly enforcing UI and workflow patterns",
    "React UI code is readable and maintainable",
    "Componentized UI is the future of web development!",
    "Have you heard of Redux?",
    "Heard a React.js joke today. Someone said it was better than Angular.",
    "@Nico loves React",
    "Use Angular instead"
  ],
  'redux': [
    "What the Flux?! Let's Redux!"
  ],

  // 'jsx': [
  //
  // ],


  // 'less' : [],

  // 'backbone' : [],
  // 'mustache' : [],

  // 'handlebars' : [],
  // 'google' : [],
  // 'twitter' : [],
  // 'airbnb' : [],

  'responsive': [
    "My dick is responsive",
    "I've got a response for you, fuck face",
    "To install HTML9 Responsive Boilerstrap JS just attackclone the grit repo pushmerge, then rubygem the lymphnode js shawarma module — and presto!",
    "Why did the web developer leave the restaurant? Because of the table layout",
    "You are the CSS to my HTML ❤️",
    "Sometimes I just need a <br/>"
  ],
  'sass' : [
    "Forget SASS. Insert DICSS right into your CSS."
  ],
  'seo': [
    "An SEO expert walks into a bar,bars,beer garden,hangout,lounge,night club,mini bar,bar stool,tavern,pub,beer,wine,whiskey",
    "The best place to hide a body is page 2 of Google search results.",
    "How many SEO experts does it take to change a light bulb,lightbulb,light,bulb,lamp,lighting,switch?",
    "Why do SEOs love the farmer's market? Lots of organic content.",
  ],
  'webpack': [
    "Webpack is a build tool that puts all of your assets in a dependency graph",
    "Webpack does dead asset elimination",
    "Webpack offers stable production deploys"
  ],
  'other': [
    "When a developer complains about having to learn something new, I assume they don't understand the underlying premise of their job."
  ]
};

/* References (copies)*/
reactions.grids = reactions.responsive;
reactions.grid = reactions.responsive;
reactions.javascript = reactions.js;
reactions.nodejs = reactions.node;
reactions.rwd = reactions.responsive;
reactions['search engine'] = reactions.seo;

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

    if(Math.random()<0.1) {

      let matchedWords = msg.body.event.text.toLowerCase().match(reactionRegExp);

      if(matchedWords.length>0) {
        let randomWordIndex = Math.floor(Math.random()*matchedWords.length);
        let theWord = matchedWords[randomWordIndex];
        let randomResponseIndex = Math.floor(Math.random()*reactions[theWord].length);
        let theResponse = reactions[theWord][randomResponseIndex];

        msg.say(theResponse);
      }

    }

  }) // message
}
