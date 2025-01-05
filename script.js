
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push((element.href.split("/songs/")[1]));
    }
  }
  return songs;
}
function secondsToMinutesSeconds(seconds){
  const minutes = Math.floor(seconds/60);
  const remainingSeconds = Math.floor(seconds%60);

  const formattedMinutes = String(minutes).padStart(2,'0');
  const formattedSeconds = String(remainingSeconds).padStart(2,'0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
let currentSong = new Audio();
const playMusic = (song,pause=false)=>{
    currentSong.src = `/songs/`+ song;
    console.log(currentSong.src);
    if(!pause){
    currentSong.play();
    }
    document.querySelector(".songInfo").innerHTML=decodeURIComponent(song);
    document.querySelector(".songTime").innerHTML="00:00/00:00";
    
}

async function play() {
  let play = document.getElementById("play");
  let songs = await getSongs();
  playMusic(songs[0],true);
  let songUl = document
    .querySelector(".songCart")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li>
                <img src="musicIcon.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                </div>
                <div class="playNow">
                  <span>Play</span>
                <img src="musicPlay.png" alt="">
              </div>
              </li>`;
  }
   Array.from(document.querySelector(".songCart").getElementsByTagName("li")).forEach(element=>{
        element.addEventListener("click",()=>{
           console.log(element.querySelector(".info").getElementsByTagName("div")[0].innerHTML);
            playMusic(element.querySelector(".info").getElementsByTagName("div")[0].innerHTML);
            play.src = "pausebtn.png";
        }) 
   });   
  
   play.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "pausebtn.png";
    }
    else{
      currentSong.pause();
      play.src = "playbtn.png";
    }
   })
   currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songTime").innerHTML = secondsToMinutesSeconds(currentSong.currentTime) +"/"+ secondsToMinutesSeconds(currentSong.duration);
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 +"%";
   })

   document.querySelector(".seekbar").addEventListener("click",(event)=>{
      // console.log((event.offsetX/event.target.getBoundingClientRect().width)*100);
      document.querySelector(".circle").style.left= ((event.offsetX/event.target.getBoundingClientRect().width)*100)+"%";
     currentSong.currentTime = ((event.offsetX/event.target.getBoundingClientRect().width)*currentSong.duration);

   })
}
play();
