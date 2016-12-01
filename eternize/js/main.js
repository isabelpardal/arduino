// Use the same keys that you are going to use for Arduino code with Johnny-Five

var pubnub = PUBNUB.init({
    publish_key: 'pub-c-0b43969b-341d-41f5-a85e-0bd9d30404b8',
    subscribe_key: 'sub-c-cb24903e-c9f4-11e5-b684-02ee2ddab7fe'
});

// Use the same channel name
var channel = 'led';



var button = document.querySelector('button.on');

var s = document.querySelector('.aaa');


var blinkState = true;


button.addEventListener('click', function(e) {
  pubnub.publish({
    channel: channel, 
    message: {blink: blinkState},
    callback: function(m) {
      console.log(m);
      blinkState = !blinkState;
      button.textContent = (blinkState) ? 'Blink LED' : 'Stop LED'; 
    }
  });
  
});

s.addEventListener('click', function(e) {
alert(" sss");


})
