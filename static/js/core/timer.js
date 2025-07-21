let myInterval;
let time = 0;

export function setUpTimer(timerP, timer, rest){
    timerP.textContent = '00:00'
    timerP.style.color = 'green';
    timer.classList.add("justify-content-center");
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

export function stopTimer(timer, rest){
    clearInterval(myInterval);
    timer.classList.remove("justify-content-center");
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

export function submitToServer(scramble, timeEl, solves, best, scrambleType) {
    const data = {
        scramble: scramble.textContent,
        scrambleType: scrambleType,
        time: timeEl.textContent,
        timeMs: time
    };

    fetch("/timer", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
        }
        return res.json();
    })
    .then(response => {
        console.log(response.message);
        fetchStats(solves, best, scrambleType);
    })
    .catch(error => {
        console.error('Submission failed:', error);
    })
    .finally(() => {
        time = 0;
    });
}

export function fetchStats(solves, best, scrambleType){
    fetch(`/timer/stats?type=${encodeURIComponent(scrambleType)}`)
        .then(res => res.json())
        .then(data => {
            solves.textContent = data.solvesNum;
            best.textContent = formatTime(data.bestTime);
        });
}
