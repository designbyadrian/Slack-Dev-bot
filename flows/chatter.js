'use strict'

const request = require('request')
const defineUrl = "http://api.urbandictionary.com/v0/define?term=";
const randomUrl = "http://api.urbandictionary.com/v0/random";

module.exports = (slapp) => {

  let searching = false

  slapp.command('/urban', (msg) => {

    var random = false;

    if(searching) {
      msg.say("Shut up! I'm busy!");
      return false;
    } else {
      searching = true;

      if(msg.body.text.toLowerCase().indexOf('random')>=0) {
        random = true;
        msg.say(`I'm thinking about something...`)
      } else {
        msg.say(`I'm thinking about ${msg.body.text}...`)
      }
    }

    request({
        url: random?randomUrl:(defineUrl+msg.body.text),
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

    if(Math.random()<0.1&&!searching) {

      searching = true;

      request({
        url: randomUrl,
        json: true
      }, (error,response,body)=>{

        searching = false;

        if(!error && response.statusCode === 200) {

          try {
            var index = Math.floor(Math.random()*body.list.length);

            msg.say(body.list[index].example)
          } catch(e) {
            console.log(e.message);
          }
        }
      })

    }
    
  })

}
