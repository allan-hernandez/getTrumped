var Twitter = require('twitter');

var params = {'user_id': '25073877', 'count': '20'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    var tweetText = [];

    for (i = 0; i < tweets.length; i++) {
      tweetText.push(tweets[i].text);
    }
    console.log(tweetText[0]);

    toAlexaSpeech(tweetText);

  }
  else {
    console.log(error);
  }
});

function toAlexaSpeech(messages) {
  // breaks are  <break time="3s"/>
  var finalSpeech = [];  
  for (i = 0; i < messages; i++) {
    finalSpeech.push(punctuationOutOutOut(messages[i]));
    finalSpeech.push(' <break time="3s"');
  }
}

function punctuationOUtOutOut(tweet) {
  // take out \n https:// RT @username:
}