'use strict'

//const handleHowAreYou = 'chatter:handleHowAreYou'

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

  slapp.event('message.group', (msg) => {
    console.log("EVENT GROUP MESSAGE");
    /*msg
      .say(`Message event echo, "${msg.body.text}"`)*/
  })

  slapp.event('message.mpim', (msg) => {
    console.log("EVENT MPIM MESSAGE");
    /*msg
      .say(`Message event echo, "${msg.body.text}"`)*/
  })

  slapp.event('message.channels', (msg) => {
    console.log("EVENT CHANNEL MESSAGE");
    /*msg
      .say(`Message event echo, "${msg.body.text}"`)*/
  })

  slapp.event('message.im', (msg) => {
    console.log("EVENT MESSAGE.IM");
    /*msg
      .say(`Message event echo, "${msg.body.text}"`)*/
  })

  slapp.message('.*', (msg) => {
    console.log("MESSAGE");
    /*msg
      .say(`Message event echo, "${msg.body.text}"`)*/
  })

  slapp.message('hello', (msg) => {
    console.log("HELLO MESSAGE");
    /*msg
      .say(`Message event echo, "${msg.body.text}"`)*/
  })

  slapp.message('.*', ['mention', 'direct_mention', 'direct_message'], (msg) => {
    // respond only 40% of the time
    //if (Math.random() < 0.4) {
      msg.say([':wave:', ':pray:', ':raised_hands:'])
    //}
  })

/*
  slapp.route(handleHowAreYou, (msg) => {
    var resp = msg.body.event && msg.body.event.text

    if (new RegExp('good', 'i').test(resp)) {
      msg
        .say(['Great! Ready?', ':smile: Are you sure?'])
        .route(handleHowAreYou, 60)
    } else {
      msg.say('Me too')
    }
  })

  slapp.message('^(thanks|thank you)', ['mention', 'direct_message'], (msg) => {
    msg.say(['You are welcome', 'Of course'])
  })

  slapp.message('good night|bye', ['mention', 'direct_message'], (msg) => {
    msg.say(['Cheers :beers:', 'Bye', 'Goodbye', 'Adios'])
  })

  slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
    // respond only 40% of the time
    if (Math.random() < 0.4) {
      msg.say([':wave:', ':pray:', ':raised_hands:'])
    }
  })*/
}
