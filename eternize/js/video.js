

document.addEventListener("DOMContentLoaded", function()
 { initialiseMediaPlayer(); }, false);

function initialiseMediaPlayer() {
   mediaPlayer = document.getElementById('media-video');
   mediaPlayer.controls = false;
   mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
}

var mediaPlayer;



var vid = document.getElementById("media-video"); 
var playbtn= document.getElementById("play");
var pausebtn=document.getElementById("pause");
function playVid() { 
    if (vid.paused){
    vid.play(); 
      playbtn.hide()
}
    else{
      vid.pause();
       playbtn.hide();
    }
} 


function stopVid(){
	vid.pause();
   vid.currentTime = 0;

}

function updateProgressBar() {
   var progressBar = document.getElementById('progress-bar');
   var percentage = Math.floor((100 / mediaPlayer.duration) *
   mediaPlayer.currentTime);
   progressBar.value = percentage;
   progressBar.innerHTML = percentage + '% played';
}
