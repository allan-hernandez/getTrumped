var Twitter = require('twitter');

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.da577c38-6f7b-423e-ad97-17272af2dd72";

function getTweets(r) {

    var tweetText = []; 

    // from twitter dev, removed for github commit
    var client = new Twitter({
       consumer_key : '',
        consumer_secret : '',
        access_token_key : '',
        access_token_secret : '' 
    });

    // user_id for @realDonaldTrump
    var params = {'user_id': '25073877', 'count': '10'};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
      if (!error) {
        // break tweets into array
        for (i = 0; i < tweets.length; i++) {
          tweetText.push(tweets[i].text);
        }

        var finalSpeech = [];

        for (i = 0; i < tweetText.length; i++) {
            console.log('call cleanup of tweets');
            finalSpeech.push(punctuationOutOutOut(tweetText[i]));
            finalSpeech.push(' <break time="1s" />');
        }

        finalSpeech = finalSpeech.join(' ');
        giveResponse(r,finalSpeech);
      }
      else {
        console.log(error);
      }
    });
}


function punctuationOutOutOut(tweet) {
  // take out \n https:// 
  var messageBack = '';

  console.log('cleaning');
  messageBack = tweet.replace(/(\r\n|\n|\r)/gm,"");

  var match = RegExp('https:\/\/t.co\/[a-zA-Z0-9\-\.]{10}').exec(messageBack);
  if(match) {
    var messageBack = messageBack.replace(match[0]," ");
  }

  return messageBack;
}



var AlexaSkill = require('./AlexaSkill');


var getTrumped = function () {
    AlexaSkill.call(this, APP_ID);
};

getTrumped.prototype = Object.create(AlexaSkill.prototype);
getTrumped.prototype.constructor = getTrumped;

getTrumped.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("getTrumped onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

getTrumped.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("getTrumped onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};


getTrumped.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("getTrumped onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

getTrumped.prototype.intentHandlers = {
    "TrumpMeIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask to be Trumped or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function handleNewFactRequest(response) {
    console.log('new request');
    getTweets(response);
}

function giveResponse(r,resp) {
    r.tellWithCard(resp, "Trumped", resp);    
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the getTrumped skill.
    var gT = new getTrumped();
    gT.execute(event, context);
};

