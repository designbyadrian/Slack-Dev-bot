'use strict'

const request = require('request')
const defineUrl = "http://api.urbandictionary.com/v0/define?term=";
const randomUrl = "http://api.urbandictionary.com/v0/random";
const wordRegExp = /\w{5,}/gi;

const thoughts = [
  "Hey guys! Listen to this...",
  "I've got one!",
  "I spy with my little brown eye...",
  "My turn!",
  ":wink:",
  ":point_right: :ok_hand:",
  "Scraping the bottom of the barrel...",
  "Packing fudge...",
  "Choking the chicken...",
  "Polishing my helmet..."
];

module.exports = (slapp) => {

  let searching = false

  slapp.command('/urban', (msg) => {

    if(msg.body.text == "?") {
      msg.respond(`Just type a phrase after *"/urban"*, idiot!`);
      return false;
    } else if(msg.body.text.length<2) {
      msg.respond(`Use both hands and type properly, faggot!`);
      return false;
    }

    var random = false;

    if(searching) {
      msg.respond("Shut up! I'm busy!");
      return false;
    } else {
      searching = true;

      if(msg.body.text.toLowerCase().indexOf('random')>=0) {
        random = true;

        msg.say(thoughts[Math.floor(Math.random()*thoughts.length)]);
      } else {
        msg.say(`Do you guys know what ${msg.body.text} is?...`)
      }
    }

    request({
        url: random?randomUrl:(defineUrl+encodeURIComponent(msg.body.text)),
        json: true
      }, (error,response,body)=>{

        searching = false;

        if(!error && response.statusCode === 200) {

          try {

            if(body.list.length<1) {
              msg.say(`I don't know what the fuck "${msg.body.text}" is!`);
            } else {
              var index = Math.floor(Math.random()*body.list.length);
              msg.say(`*${body.list[index].word}*: ${body.list[index].definition}`);
            }

          } catch(e) {
            console.log(e.message);
          }
        }
      })

  })

  slapp.message('.*', (msg) => {

console.log(".*",msg.body.event,msg.body.event.text.match(wordRegExp));

    let words = msg.body.event.text.match(wordRegExp),
        index;

    if(!words) {
      return false;
    }

    index = Math.floor(Math.random()*words.length);

    if(Math.random()<0.12&&!searching&&words.length>0) {

      searching = true;

      request({
        url: defineUrl+encodeURIComponent(words[index].toLowerCase()),
        json: true
      }, (error,response,body)=>{

        searching = false;

        if(!error && response.statusCode === 200 && body.list.length>0) {

          try {
            
            let quoteMiner = /(?:"[^"]*"|^[^"]*$)/gi,
                exampleIndex = Math.floor(Math.random()*body.list.length),
                quotes = body.list[exampleIndex].example.match(quoteMiner),
                quoteIndex = Math.floor(Math.random()*quotes.length);

            if(quotes.length>0) {
              msg.say(quotes[quoteIndex].replace(/"/g, ""));
            } else {
              msg.say(body.list[exampleIndex].example);
            }

          } catch(e) {
            console.log(e.message);
          }
        }
      })

    }
    
  })

}
