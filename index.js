const	 express=require("express");
const	 bodyParser = require('body-parser');
const	 request = require('request');


var Recastai = require('recastai')
var recastClient = new Recastai.request(config.get('recastRequestAccessToken'))

const app = express();
app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);


app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200); 
});




app.get('/webhook', function(request, response) {
  if (request.query['hub.verify_token'] == mustapha) {
    response.send(request.query['hub.challenge'])
  }
  res.send('Error, wrong token')
});



app.post('/webhook', function (req, res) {
  var data = req.body;

 
  if (data.object == 'page') {
    
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;

      pageEntry.messaging.forEach(function(messagingEvent) {
       
         if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        }  else if (messagingEvent.read) {
          receivedMessageRead(messagingEvent);
        
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });


function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;

  console.log("Received message for user %d and page %d  with message:",
    senderID, recipientID);
  console.log(JSON.stringify(message));

  
  var messageId = message.mid;
  var appId = message.app_id;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;


if (messageText) {

      recastClient.analyseText(messageText).then(function(response) {
        var intent = response.intent().slug
        if (intent == 'greetings') {
          jobfinder(senderID)
        } else if (intent == 'goodbye') {
          sendTextMessage(senderID, "Bye, see you soon!")
        } else {
          sendTextMessage(senderID, messageText);
        }
      }).catch(function(error) {
        console.log(error)
      })
    }


 } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}






function jobfinder(senderID) {
  request({
    uri: `https://graph.facebook.com/v2.9/${senderID}`,
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'GET',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      sendTextMessage(senderID, "Hey " + body.first_name);
    } else {
      console.log(error)
    }
  });
}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});











