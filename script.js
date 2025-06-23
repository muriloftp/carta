const musics = [
  {
    name: 'iris.mp3',
    start: 9.5
  }
]
const audio = new Audio()


const onPlay = async (data) => {
  audio.src = `./sounds/${data.name}`
  audio.volume = 0.0
  await audio.play()
    .then(() => { audio.currentTime = data.start ?? 0 })
    .catch(() => { })
}

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time))


const suavizationPlay = async (enter, duration = 2000) => {
  const start = enter ? 0.0 : 0.1;
  const end = enter ? 0.1 : 0.0;
  const step = 0.005; // suavidade
  const steps = Math.ceil(Math.abs(end - start) / step);
  const interval = duration / steps;

  let volume = start;

  for (let i = 0; i <= steps; i++) {
    audio.volume = parseFloat(volume.toFixed(3)); // garante precisão
    console.log(audio.volume);

    volume += enter ? step : -step;
    await wait(interval);
  }

  audio.volume = end; // garante o valor final exato
};


$(document).ready(function () {
  const elementHeader = document.querySelector('.envelope-header');
  const container = document.querySelector('.container')
  const card = document.querySelector('.card')
  const hearts = document.querySelector('.hearts')

  let inAnimation = false
  let isOpen = false

  container.onclick = function () {
    if (inAnimation) {
      return
    }

    isOpen = !isOpen

    inAnimation = true
    isOpen && open()
    !isOpen && close()
  }

  function open() {
    const music = musics[Math.floor(Math.random() * musics.length)]

    onPlay(music)
    suavizationPlay(true)

    elementHeader.style.transform = 'rotateX(185deg)'

    setTimeout(() => {
      elementHeader.style['z-index'] = 9990
      hearts.style.scale = '2'
      hearts.style['margin-left'] = '-2rem'

      setTimeout(() => {
        card.style['z-index'] = 9993
      }, 200)
    }, 500)

    $('.card').delay(1000).animate({
      top: '-420px',
      height: '470px',
    }, 1500, () => {
      inAnimation = false
    });
  }

  async function close() {
    suavizationPlay(false)

    hearts.style.scale = '1';
    hearts.style['margin-left'] = '0';


    $('.card').animate({
      top: '20px',
      height: '140px'
    }, 1500, async () => {
      // Reset dos efeitos nos corações]
      elementHeader.style.transform = 'rotateX(0deg)';
      elementHeader.style['z-index'] = '9996'
      card.style['z-index'] = 0;
      inAnimation = false
      audio.pause()
    });
  }

});
