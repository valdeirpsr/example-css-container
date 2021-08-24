const $ = document.querySelector.bind(document);
const waves = [];

const musics = {
  carta_1: {
    audio_url: '',
    lyric: '/lyrics/carta_1.json'
  },
  carta_4: {
    audio_url: '',
    lyric: '/lyrics/carta_4.json'
  }
}

$("#btn-menu-left").addEventListener("click", function() {
    $("aside").classList.toggle("active");
  });

async function playAudio(id) {
  const paragraph = document.querySelector(`#${id} .card-content`);
  
  if (waves[id]) {
    return wavePlay(id);
  }
  
  paragraph.textContent = "Aguarde";
  
  waves[id] = WaveSurfer.create({ container: `#${id} .wave` });
  waves[id].load(musics[id].audio_url);
  
  waves[id].on('ready', function () {
    wavePlay(id);
  });
  
  const lyric = await fetch(musics[id].lyric).then((response) => response.json());
  
  waves[id].on('audioprocess', function () {    
    lyric.forEach(function(element, index, array) {
      if (
        waves[id].getCurrentTime() >= element.startTimeMs
      ) {
        paragraph.textContent = element.text;
        delete lyric[index];
      }
    })
  });
}

function wavePlay(audio_id) {
  document.querySelector(`#${audio_id} .play`).style.display = 'none';
  document.querySelector(`#${audio_id} .pause`).style.display = 'block';
  waves[audio_id].play();
}

function pauseAudio(audio_id) {
  document.querySelector(`#${audio_id} .play`).style.display = 'block';
  document.querySelector(`#${audio_id} .pause`).style.display = 'none';
  waves[audio_id].pause();
}