export function feedbackMessage(username, password, confirmPassword){
    let feedback = '';

    if (username === '') {
        feedback = "Please provide a username";
    } else if (username === null || typeof username !== 'string') {
        feedback = "Please provide a valid username";
    } else if (username.includes(' ')) {
        feedback = "Please don't use spaces in the username";
    } else if (password === '') {
        feedback = "Please provide a password";
    } else if(password.length < 6){
        feedback = "Passwords must be 6 characters or more . Please check"
    } else if (password === null || typeof password !== 'string') {
        feedback = "Please provide a valid password";
    } else if (confirmPassword === '') {
        feedback = "Please provide a password (confirmation one)";
    } else if(confirmPassword.length < 6){
        feedback = "All passwords must be 6 characters or more . Please check"
    } else if (confirmPassword === null || typeof confirmPassword !== 'string') {
        feedback = "Please provide a valid password (confirmation one)";
    } else if (confirmPassword !== null &&password !== confirmPassword){
        feedback = "Passwords doesn't match. Please check"
    }

    return feedback;
}