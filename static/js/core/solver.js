export function renderCubeGrid(solverGrid) {
    let grid = ``;

    // === Row 1: Up face aligned over Front ===
    grid += `<div class="row gx-0 offset-3">`;
    grid += `
        <div class="col-auto">
            <div id="face-1" class="face">
    `;
    for (let k = 0; k < 9; k++) {
        const isCenter = (k === 4);
        let centerClass = isCenter ? ' center-sticker' : '';
        let disabledAttr = isCenter ? 'disabled' : '';
        grid += `
            <button type="button"
                    class="sticker rounded-3 border border-black border-opacity-50 white${centerClass}"
                    ${disabledAttr}>
            </button>
        `;
    }
    grid += `
            </div>
        </div>
    `;
    grid += `</div>`;

    // === Row 2: Left, Front, Right, Back ===
    grid += `<div class="row gx-0 justify-content-center">`;

    const faceRow2 = [
        { id: '2', color: 'orange' },
        { id: '3', color: 'green' },
        { id: '4', color: 'red' },
        { id: '5', color: 'blue' }
    ];

    for (const face of faceRow2) {
        grid += `
            <div class="col-auto">
                <div id="face-${face.id}" class="face">
        `;
        for (let k = 0; k < 9; k++) {
            const isCenter = (k === 4);
            let centerClass = isCenter ? ' center-sticker' : '';
            let disabledAttr = isCenter ? 'disabled' : '';
            grid += `
                <button type="button"
                        class="sticker rounded-3 border border-black border-opacity-50 ${face.color}${centerClass}"
                        ${disabledAttr}>
                </button>
            `;
        }
        grid += `
                </div>
            </div>
        `;
    }

    grid += `</div>`;

    // === Row 3: Down face aligned under Front ===
    grid += `<div class="row gx-0 offset-3">`;
    grid += `
        <div class="col-auto">
            <div id="face-6" class="face">
    `;
    for (let k = 0; k < 9; k++) {
        const isCenter = (k === 4);
        let centerClass = isCenter ? ' center-sticker' : '';
        let disabledAttr = isCenter ? 'disabled' : '';
        grid += `
            <button type="button"
                    class="sticker rounded-3 border border-black border-opacity-50 yellow${centerClass}"
                    ${disabledAttr}>
            </button>
        `;
    }
    grid += `
            </div>
        </div>
    `;
    grid += `</div>`;

    // === Buttons row ===
    grid += `
        <div class="row mt-4 d-flex justify-content-evenly align-items-center">
            <div class="col-auto">
                <button id="reset-btn" class="btn" type="reset"><span class="bi bi-arrow-repeat me-2"></span>Reset</button>
            </div>
            <div class="col-auto">
                <button id="solve-btn" class="btn" type="button"><span class="bi bi-lightbulb me-2"></span>Solve</button>
            </div>
        </div>
    `;

    solverGrid.innerHTML = grid;
}

export function attachStickerEvents(stickers){
    Array.from(stickers).forEach(sticker => {
        if(!sticker.classList.contains('center-sticker')){
            sticker.addEventListener('click', () => {
                colorChanger(sticker);
            });
        }
    });
}

function colorChanger(sticker){
    let colors = ['white','blue','red','green','orange','yellow'];
    let colorIndex = colors.findIndex(color => sticker.classList.contains(color));

    sticker.classList.remove(colors[colorIndex]);
    sticker.classList.add(colors[(colorIndex + 1) % colors.length]);
}

export function getCubeState(){
    const faceOrder = ['face-1', 'face-4', 'face-3', 'face-6', 'face-2', 'face-5'];
    const colors = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];
    let scramble = []

    faceOrder.forEach(faceId => {
        const face = document.getElementById(faceId);
        const stickers = face.getElementsByClassName('sticker');

        Array.from(stickers).forEach(sticker => {
            sticker.classList.forEach(cls => {
                if (colors.includes(cls)) {
                    scramble.push(cls);
                }
            });
        });
    });

    const colorToFace = {
        white: 'U',
        red: 'R',
        blue: 'B',
        orange: 'L',
        green: 'F',
        yellow: 'D'
    };

    scramble = scramble.map(color => colorToFace[color]).join('');

    return scramble;
}

export function getSolution(scramble, solutionEl){
    const data = {
        scramble: scramble
    };

    fetch("/solver", {
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
        hideError();
        if (response.solution) {
            console.log("Solution:", data.solution);
            solutionEl.textContent = response.solution;
        } else {
            showError(response.error);
        }
    })
    .catch(error => {
        console.error('Submission failed:', error);
        showError("Invalid scramble or server error.");
    });
}

function showError(message) {
    const errorBox = document.getElementById('solution-error');
    const errorText = document.getElementById('error');

    errorText.textContent = message;
    errorBox.classList.remove('d-none'); 
}

export function hideError() {
    document.getElementById('solution-error').classList.add('d-none');
}