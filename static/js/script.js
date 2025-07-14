import { feedbackMessage } from "./formValidation.js";

const form = document.getElementById('form-to-submit');

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
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;
            const confirmPasswordInput = document.getElementById("confirm-password");
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