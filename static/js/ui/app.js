import { feedbackMessage } from '../core/formValidation.js';
import { updateUI} from '../core/scramble.js';
import { setUpTimer } from '../core/timer.js';
import { runTimer } from '../core/timer.js';
import { stopTimer } from '../core/timer.js';

const form = document.getElementById('form-to-submit');
const nav = document.getElementById('navbar');
const scrambler = document.getElementById('scrambler');
const timer = document.getElementById('timer');
const stats = document.getElementById('stats')
let time = document.getElementById('time');

let scrambleType = 'non-standard';
let myTimeOut;
let isSpaceDown = false;
let isTimeRunning = false;

if(form){
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
            if (!input.checkValidity()){
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

if(scrambler){
    document.getElementById('type').addEventListener('change', function (){
        scrambleType = this.value;
        updateUI(scrambleType, 'scramble');
    });

    document.getElementById('change-btn').addEventListener('click', () => {
        updateUI(scrambleType, 'scramble');
    });
}

if(timer){
    document.addEventListener('keydown', (e) => {
        e.preventDefault();
        if(e.code === 'Space'){
            if(!isSpaceDown && !isTimeRunning){
                isSpaceDown = true;
                myTimeOut = setTimeout(() => {
                    setUpTimer(time, [nav, scrambler, stats]);
                    isTimeRunning = true;
                }, 800);
            }
            else if(isTimeRunning && !isSpaceDown)
            {
                stopTimer([nav, scrambler, stats]);
                isSpaceDown = false;
                isTimeRunning = false;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        e.preventDefault();
        if(e.code === 'Space'){
            if(isTimeRunning){
                runTimer(time);
            }
            else{
                clearTimeout(myTimeOut);
            }
            isSpaceDown = false;
        }
    });
}