var five = require('johnny-five'),
    board = new five.Board();

var pubnub = require('pubnub').init({
    publish_key: 'pub-c-0b43969b-341d-41f5-a85e-0bd9d30404b8',
    subscribe_key: 'sub-c-cb24903e-c9f4-11e5-b684-02ee2ddab7fe'
});

var channel = 'led';


board.on('ready', function() {
    var led = new five.Led(13);


    pubnub.subscribe({
            channel: channel,
            message: function(m) {
                if (m.blink === true) {
                    led.on();

                } else {
                    led.stop();
                    led.off();
            

            }
        },
        error: function(err) { console.log(err); }
    })



})
