const musics = [
  {
    name: 'iris.mp3',
    start: 10
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


const suavizationPlay = async (enter) => {
  const start = enter ? 0.0 : 1
  const to = enter ? 1.0 : 0.0
  const increase = 0.025

  for (let i = start; enter ? i < to : i > to;) {
    i = enter ? (i + increase) : (i - increase)

    audio.volume = Math.max(0.0, Math.min(i, 1.0))

    console.log(audio.volume)
    await wait(100)
  }
}


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
      top: '-350px',
      height: '405px',
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
      height: '120px'
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