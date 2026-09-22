document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const passwordInput = document.querySelector('input[name="Password"]');
    const confirmPasswordInput = document.querySelector('input[name="ConfirmPassword"]');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    const passwordMatch = document.getElementById('passwordMatch');
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('termsError');
    const toggleButtons = document.querySelectorAll('.toggle-password');
    const aadharInput = document.querySelector('input[name="AadharNumber"]');
    const mobileInput = document.querySelector('input[name="Mobile"]');

    // Toggle password visibility
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    // Aadhar formatting
    if (aadharInput) {
        aadharInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 12) value = value.substring(0, 12);

            if (value.length > 8) {
                value = value.replace(/(\d{4})(\d{4})(\d{0,4})/, '$1 $2 $3').trim();
            } else if (value.length > 4) {
                value = value.replace(/(\d{4})(\d{0,4})/, '$1 $2').trim();
            }

            e.target.value = value;
        });
    }

    // Mobile validation
    if (mobileInput) {
        mobileInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10);
        });
    }

    // Password strength
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function () {
            const password = this.value;
            const strength = calculateStrength(password);

            let color = '#666';
            let text = 'None';
            let width = '0%';
            let bgColor = '#e0e0e0';

            switch (strength) {
                case 1:
                    color = '#dc3545';
                    text = 'Weak';
                    width = '25%';
                    bgColor = '#dc3545';
                    break;
                case 2:
                    color = '#fd7e14';
                    text = 'Fair';
                    width = '50%';
                    bgColor = '#fd7e14';
                    break;
                case 3:
                    color = '#ffc107';
                    text = 'Good';
                    width = '75%';
                    bgColor = '#ffc107';
                    break;
                case 4:
                    color = '#28a745';
                    text = 'Strong';
                    width = '100%';
                    bgColor = '#28a745';
                    break;
                default:
                    color = '#666';
                    text = 'None';
                    width = '0%';
                    bgColor = '#e0e0e0';
            }

            if (strengthBar) {
                strengthBar.style.width = width;
                strengthBar.style.backgroundColor = bgColor;
            }

            if (strengthText) {
                strengthText.textContent = text;
                strengthText.style.color = color;
            }
        });
    }

    // Password match
    if (confirmPasswordInput && passwordInput && passwordMatch) {
        confirmPasswordInput.addEventListener('input', checkMatch);
        passwordInput.addEventListener('input', checkMatch);

        function checkMatch() {
            if (!passwordInput.value || !confirmPasswordInput.value) {
                passwordMatch.textContent = '';
                confirmPasswordInput.style.borderColor = '';
                passwordInput.style.borderColor = '';
                return;
            }

            if (passwordInput.value === confirmPasswordInput.value) {
                passwordMatch.innerHTML = '<span style="color: #28a745;"><i class="bi bi-check-circle-fill"></i> Passwords match</span>';
                confirmPasswordInput.style.borderColor = '#28a745';
                passwordInput.style.borderColor = '#28a745';
            } else {
                passwordMatch.innerHTML = '<span style="color: #dc3545;"><i class="bi bi-x-circle-fill"></i> Passwords do not match</span>';
                confirmPasswordInput.style.borderColor = '#dc3545';
                passwordInput.style.borderColor = '#dc3545';
            }
        }
    }

    // Terms validation
    if (termsCheckbox && termsError) {
        termsCheckbox.addEventListener('change', function () {
            if (this.checked) {
                termsError.style.display = 'none';
                this.setCustomValidity('');
            } else {
                this.setCustomValidity('You must agree to the terms');
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function (e) {
            // Validate terms
            if (termsCheckbox && !termsCheckbox.checked) {
                e.preventDefault();
                if (termsError) {
                    termsError.textContent = 'You must agree to the terms and conditions';
                    termsError.style.display = 'block';
                }
                termsCheckbox.focus();
                return false;
            }

            // Validate passwords match
            if (passwordInput && confirmPasswordInput &&
                passwordInput.value !== confirmPasswordInput.value) {
                e.preventDefault();
                alert('Passwords do not match!');
                confirmPasswordInput.focus();
                return false;
            }

            // Show loading
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Creating Account...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 5000);
            }

            return true;
        });
    }

    function calculateStrength(password) {
        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return Math.min(score, 4);
    }
});