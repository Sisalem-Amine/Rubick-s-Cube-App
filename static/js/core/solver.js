export function renderCubeGrid(solverGrid) {
    let grid = ``;
    let colors = [['white'],['blue','red','green','orange'],['yellow']]

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
                            class="${colors[i][j]} sticker rounded-3 border border-black border-opacity-50${centerClass}"
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

    solverGrid.innerHTML = grid;
}
