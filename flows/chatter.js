'use strict'

const request = require('request')
const defineUrl = "http://api.urbandictionary.com/v0/define?term=";
const randomUrl = "http://api.urbandictionary.com/v0/random";
const wordRegExp = /\w{5,}/gi;


module.exports = (slapp) => {


  slapp.command('/dev', (msg) => {



  }) // command

  slapp.message('.*', (msg) => {

    if(Math.random()<2) {
      msg.say("I hear you!");
    }

  }) // message
}
