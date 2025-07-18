let myInterval;
let time = 0;

export function setUpTimer(timerP, rest){
    timerP.textContent = '00:00'
    timerP.style.color = 'green';
    for(let i = 0; i < rest.length; i++)
    {
        rest[i].style.display = 'none';
    }
}

export function runTimer(timerP){
    timerP.style.color = '#ffffff';
    myInterval = setInterval(() => {
        time += 10;
        timerP.textContent = formatTime(time);
    }, 10);
}

export function stopTimer(rest){
    clearInterval(myInterval);
    time = 0;
    for(let i = 0; i < rest.length; i++)
    {
        rest[i].style.display = '';
    }
}

function formatTime(realTime){
    let cs = 0;
    let s = 0;
    let min = 0;

    cs = Math.floor((realTime % 1000) / 10);
    s = Math.floor((realTime / 1000) % 60);
    min = Math.floor(realTime / 60000);
    
    if(min == 0)
        return `${s.toString().padStart(2,'0')}:${cs.toString().padStart(2,'0')}`;
    else
        return `${min.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}:${cs.toString().padStart(2,'0')}`;
}