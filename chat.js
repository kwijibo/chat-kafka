#!/usr/bin/env node
//get the username to use in the chats
var username = process.argv[2]
  , hostname = process.argv[3]
if(!username || !hostname){
  //quit if no username
  console.warn("You must provide a username and hostname:> node chat.js {yourname} {hostname}")
  process.exit()
}

var kafka = require('kafka-node')
  ,  Producer = kafka.Producer
  ,  Consumer = kafka.Consumer
  ,  client = new kafka.Client(hostname+':2181')
  ,  producer = new Producer(client)
  ,  consumer = new Consumer(client, [{topic:'chatlog', partition:0}], {fromOffset:1})
  ,  Task = require('data.task')
  ,  cli = require('cli')
  ,  colors = require('colors/safe')
  ,  R = require('ramda')
  

// create the topic for chatlogs
var createTopics =  taskify.bind(undefined,producer, 'createTopics', ['chatlog'])

//producer is ready to do stuff
var producerReady = event(producer, 'ready')

//bind function for sending chat messages
var sendChat = sendMessage.bind(undefined, producer, 'chatlog', username)
//bind function to receive user input
var sendUserInput = cli.withInput.bind(cli,sendChat)

var colourMeDifferent = R.pipe(
  R.ifElse(
    R.equals(username) 
    , colors.green 
    , colors.blue
  )
  , colors.bold
)

var colourName = R.pipe(
    R.split(':'),
    R.adjust(colourMeDifferent, 0),
    R.join(':')
)

var displayMessage = R.pipe(R.prop('value'), colourName, console.log)

consumer.on('message', displayMessage)
consumer.on('error', console.error)
producer.on('error', console.error)
producerReady.then(createTopics)
             .then(sendUserInput)
             .catch(console.error)

//-----------             
function makeMessage(topic, body){ 
  return [{
   topic: topic,
   messages: body,// multi messages should be a array, single message can be just a string or a KeyedMessage instance
   partition: 0, //default 0
   attributes: 2, // default: 0
  }]
}

function sendMessage(producer, topic, username, msg){
  return msg.length? taskify(producer, 'send', makeMessage(topic, username+ ':' +msg))
                    : null
}

function event(emitter,eventName){
  return taskify(emitter, 'on', eventName)
}

function taskify(obj,method,arg){
  return new Promise(function(resolve,reject){
    var callback = function(err,data){ err? reject(err) : resolve(data) }
    if(arg) obj[method](arg, callback)
    else obj[method](callback) 
  })
}

