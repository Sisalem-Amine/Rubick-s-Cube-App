export function renderCubeGrid(solverGrid) {
    let grid = ``;
    let colors = [['white'],['blue','red','green','orange'],['yellow']];

    for (let i = 0; i < 3; i++) {
        grid += `<div class="row gx-0 justify-content-center">`;

        let faces = (i === 1) ? 4 : 1;

        for (let j = 0; j < faces; j++) {
            const isOffset = (faces === 1) ? " offset-3" : "";

            grid += `
                <div class="col-auto${isOffset}">
                    <div id="face-${i + 1}-${j + 1}" class="face">
            `;

            for (let k = 0; k < 9; k++) {
                const isCenter = (k === 4);
                let centerClass = isCenter ? ' center-sticker' : '';
                let disabledAttr = isCenter ? 'disabled' : '';

                grid += `
                    <button type="button"
                            class="sticker rounded-3 border border-black border-opacity-50${centerClass} ${colors[i][j]}"
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
    }

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
