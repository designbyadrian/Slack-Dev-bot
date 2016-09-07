'use strict'

const request = require('reques')
const defineUrl = "http://api.urbandictionary.com/v0/define?term=";
const randomUrl = "http://api.urbandictionary.com/v0/random";

module.exports = (slapp) => {

  let searching = false

/*  slapp.message('*', (msg, text) => {
    msg.say("You said: "+text);
  });*/

  slapp.command('/urban', (msg) => {
    console.log("COMMAND");
    msg
      .say(`Echo, "${msg.body.text}"`)
  })

  slapp.message('.*', (msg) => {
    console.log("MESSAGE");

    request({
      url: url,
      json: true
    }, (error,response,body)=>{
      if(!error && response.statusCode === 200) {
        console.log(body)
        try {
          console.log(body.list[0].example)
        } catch(e) {
          console.log(e.message);
        }
      }
    })

    
  })

}
