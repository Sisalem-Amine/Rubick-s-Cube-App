import { feedbackMessage } from '../core/formValidation.js';
import { updateUI } from '../core/scramble.js';
import { setUpTimer } from '../core/timer.js';
import { runTimer } from '../core/timer.js';
import { stopTimer } from '../core/timer.js';
import { submitToServer } from '../core/timer.js';
import { fetchStats } from '../core/timer.js';
import { fetchSortSettings } from '../core/history.js';
import { renderCubeGrid } from '../core/solver.js';
import { attachStickerEvents } from '../core/solver.js';
import { getCubeState } from '../core/solver.js';
import { getSolution } from '../core/solver.js';
import { hideError } from '../core/solver.js';

const form = document.getElementById('form-to-submit');
const nav = document.getElementById('navbar');
const scrambler = document.getElementById('scrambler');
const scramble = document.getElementById('scramble');
const timerFeedback = document.getElementById('feedback');
const timer = document.getElementById('timer');
const stats = document.getElementById('stats');
const bestTime = document.getElementById('best-time');
const solvesNum = document.getElementById('solves-num');
const time = document.getElementById('time');
const history = document.getElementById('history');
const sortForm = document.getElementById('sort-form');
const select = document.getElementById('select-by');
const sortRadios = document.getElementsByName('sort-by');
const sortRadiosOrder = document.getElementsByName('sort-order');
const tBody = document.getElementById('tbody');
const solver = document.getElementById('solver');
const solverGrid = document.getElementById('cube-grid');
const solution = document.getElementById('solution');
const error = document.getElementById('solution-error');

let scrambleType = 'none';
let myTimeOut;
let isSpaceDown = false;
let isTimeRunning = false;

if (form) {
    form.addEventListener('submit', (e) => {
        let feedback = document.getElementById('form-feedback');
        const serverFeedback = document.getElementById('server-feedback');

        e.preventDefault();
        serverFeedback.classList.add('d-none');
        form.classList.remove('was-validated');
        feedback.style.display = 'none';
    
        const inputs = form.querySelectorAll('input');

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if (!input.checkValidity()) {
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value;
                const confirmPasswordInput = document.getElementById('confirm-password');
                const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : null;

                form.classList.add('was-validated');
                feedback.textContent = feedbackMessage(username, password, confirmPassword);
                feedback.style.display = 'block';
                input.focus();
                return;
            }
        }
        form.submit();
    });
}

if (scrambler) {
    document.getElementById('type').addEventListener('change', function () {
        scrambleType = this.value;
        updateUI(scrambleType, scramble);
        fetchStats(solvesNum, bestTime, scrambleType);

        if (scrambleType !== 'none') {
            timerFeedback.classList.add('d-none');
        }
    });

    document.getElementById('change-btn').addEventListener('click', () => {
        updateUI(scrambleType, scramble);
    });
}

if (timer) {
    document.addEventListener('keydown', (e) => {
        e.preventDefault();
        if (e.code === 'Space') {
            if (!isSpaceDown && !isTimeRunning) {
                isSpaceDown = true;
                if (scrambleType === 'none') {
                    timerFeedback.classList.remove('d-none');
                    return;
                } else {
                    timerFeedback.classList.add('d-none');
                }

                myTimeOut = setTimeout(() => {
                    setUpTimer(time, timer, [nav, scrambler, stats]);
                    isTimeRunning = true;
                }, 800);
            }
            else if (isTimeRunning && !isSpaceDown) {
                stopTimer(timer, [nav, scrambler, stats]);
                isSpaceDown = false;
                isTimeRunning = false;
                submitToServer(scramble, time, solvesNum, bestTime, scrambleType);
                updateUI(scrambleType, scramble);
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        e.preventDefault();
        if (e.code === 'Space') {
            if (isTimeRunning) {
                runTimer(time);
            }
            else {
                clearTimeout(myTimeOut);
            }
            isSpaceDown = false;
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        fetchStats(solvesNum, bestTime, scrambleType);
    });
}

if(history){
    ['change', 'reset'].forEach(event =>
        sortForm.addEventListener(event, () => {
            setTimeout(() => {
                const sort = Array.from(sortRadios).find(r => r.checked)?.id || "sort-by-timestamp";
                const sortValue = sort === "sort-by-time_ms" ? "time_ms" : "timestamp";

                const order = Array.from(sortRadiosOrder).find(r => r.checked)?.id || "sort-order-asc";
                const orderValue = order === "sort-order-desc" ? "DESC" : "ASC";

                fetchSortSettings(tBody, select, sortValue, orderValue);
            }, 0);
        })
    );
}

if (solver) {
    document.addEventListener('DOMContentLoaded', () => {
        function initializeGrid() {
            renderCubeGrid(solverGrid);

            const stickers = document.getElementsByClassName('sticker');
            attachStickerEvents(stickers);

            const resetBtn = document.getElementById('reset-btn');
            resetBtn.addEventListener('click', () => {
                initializeGrid();
                hideError();
                solution.textContent = '-';
            });

            const solveBtn = document.getElementById('solve-btn');
            
            solveBtn.addEventListener('click', () => {
                const scramble = getCubeState();
                getSolution(scramble, solution);
            });
        }
        initializeGrid();
    });
}