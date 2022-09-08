import musicData from './data';
const tiles = document.querySelector('.tiles'),
    tilesContent = tiles.querySelector('.tiles__content'),
    audio = tiles.querySelector('#tiles__song'),
    tilesMusic = tiles.querySelector('.tiles__music'),
    tilesResult = tiles.querySelector('.tiles__result'),
    tilesResultScores = tiles.querySelector('.tiles__result p span'),
    tilesResultWin = tiles.querySelector('.tiles__result h4'),
    anotherBtn = tiles.querySelector('.another'),
    restartBtn = tiles.querySelector('.restart');
    let id;
    let scores = 0;
    let curMode;
    const prevRand = [0,1,2,3];
    const prevRandCopy = prevRand.slice();
    console.dir(audio);
const rand = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
musicData.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('tiles__item');
    div.innerHTML = `
        <h4>${item.artist} - ${item.song}</h4>
        <span>Difficult: ${item.difficult}</span>
        <button class="song__btn" data-id="${item.id}" data-mode="${item.difficult}">Start</button>
    `;
    tilesMusic.append(div);
});
tilesMusic.addEventListener('click', (e) => {
    if(e.target.closest('.song__btn')) {
        const dataId = e.target.getAttribute('data-id');
        const dataMode = e.target.getAttribute('data-mode');
        const index = musicData.findIndex(c => c.id == dataId);
        audio.src = musicData[index].audio;
        curMode = dataMode;
        repeat();
    }
});
restartBtn.addEventListener('click', repeat);
anotherBtn.addEventListener('click', () => {
    tilesContent.classList.remove('active');
    tilesResult.classList.remove('active');
    tilesMusic.classList.remove('active');
    tilesResultWin.classList.remove('active');
});
audio.addEventListener('ended', function(){
    tilesResultWin.classList.add('active');
    end();
})
const modes = {
  low: {
        mode: 'low',
        duration: 3500,
        temp: 1000
   },
   normal: {
        mode: 'normal',
        duration: 3000,
        temp: 1000
   },
   hard: {
        mode: 'hard',
        duration: 2300,
        temp: 400
   },
   expert: {
        mode: 'expert',
        duration: 1600,
        temp: 400
   },
};

function randMargin() {
    if(prevRand.length == 0){
        prevRand.push(...prevRandCopy);
    }
    let margin = prevRand[rand(0, prevRand.length - 1)];
    let idx = prevRand.indexOf(margin);
    prevRand.splice(idx, 1);
    return margin;
}
let speedUP = 0;
function createTabs() {
    const tab = document.createElement('div');
    tab.classList.add('tiles__tab');
    scores += 3;
    tilesResultScores.textContent = scores;
    let speed = modes[curMode].duration - speedUP;
    speedUP+=3;
    tab.animate([
        {transform: `translateY(0px)`},
        {transform: `translateY(150vh)`},
    ], {
        duration: speed,
        easing: 'linear',
        fill: 'forwards'
    })
    tab.style.marginLeft = `${randMargin() * 25}%`;
    tilesContent.prepend(tab);
    tab.addEventListener('mousedown', function(e){
        e.target.classList.add('active');
    }, { once: true });
    tab.addEventListener('touchstart', function(e){
        e.target.classList.add('active');
    }, { once: true });
    id = setTimeout(createTabs, 300 - speedUP/modes[curMode].temp);
    const obs = new IntersectionObserver((entries) => {
        if (Math.abs(entries[0].boundingClientRect.top) > entries[0].rootBounds.height) {
            entries[0].target.remove();
            if(!entries[0].target.classList.contains('active')){
                end();
            }
        }
    });
    obs.observe(tab);
}

function repeat(){
    tilesResult.classList.remove('active');
    tilesMusic.classList.add('active');
    tilesContent.classList.add('active');
    tilesResultWin.classList.remove('active');
    createTabs();
    audio.play();
}
function end(){
    clearTimeout(id);
    scores = 0;
    speedUP = 0;
    audio.pause();
    audio.currentTime = 0;
   setTimeout(() => {
    tilesContent.innerHTML = '';
    tilesContent.classList.remove('active');
    tilesResult.classList.add('active');
   }, 1000);
}