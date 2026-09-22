// Form validation में terms check add करें
function validateForm(form) {
    let isValid = true;

    // Terms checkbox check
    const termsCheckbox = form.querySelector('input[name="AgreeTerms"]');
    const termsError = document.getElementById('termsError');

    if (termsCheckbox && !termsCheckbox.checked) {
        if (termsError) {
            termsError.style.display = 'block';
        }
        isValid = false;
    } else if (termsError) {
        termsError.style.display = 'none';
    }

    // Rest of validation...
    return isValid;
}