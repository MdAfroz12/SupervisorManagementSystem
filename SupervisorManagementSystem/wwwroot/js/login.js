// login.js - COMPLETE FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function () {
    console.log('Login page loaded');

    // Elements
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('Password');
    const togglePassword = document.getElementById('togglePassword');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const loginButton = document.getElementById('loginButton');
    const dashboardPage = document.getElementById('dashboardPage');
    const mainContainer = document.querySelector('.main-container');

    // Demo credentials
    //const demoEmail = "supervisor@nagpuruniversity.edu";
    //const demoPassword = "Demo@123";

    // 1. TOGGLE PASSWORD VISIBILITY
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const eyeIcon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('bi-eye');
                eyeIcon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('bi-eye-slash');
                eyeIcon.classList.add('bi-eye');
            }
        });
    }

    // 2. FORGOT PASSWORD
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('Email');
            const email = emailInput.value.trim();

            if (email && email.includes('@')) {
                showMessage('success', `Password reset link sent to ${email}`);
            } else {
                showMessage('error', 'Please enter your email address first');
                emailInput.focus();
            }
        });
    }

    // 3. AUTO-CLEAR INPUTS ON FOCUS
    const emailInput = document.getElementById('Email');
    if (emailInput) {
        emailInput.addEventListener('focus', function () {
            if (this.value === demoEmail) {
                this.value = '';
            }
        });

        emailInput.addEventListener('blur', function () {
            if (!this.value) {
                this.value = demoEmail;
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('focus', function () {
            if (this.value === demoPassword) {
                this.value = '';
            }
        });

        passwordInput.addEventListener('blur', function () {
            if (!this.value) {
                this.value = demoPassword;
            }
        });
    }

    // 4. FORM SUBMISSION
    if (loginForm && loginButton) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('Email');
            const passwordInput = document.getElementById('Password');

            // Reset validation
            emailInput.classList.remove('error');
            passwordInput.classList.remove('error');

            // Simple validation
            let isValid = true;
            let errorMessage = '';

            // Email validation
            if (!emailInput.value || !emailInput.value.includes('@')) {
                emailInput.classList.add('error');
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }

            // Password validation
            if (!passwordInput.value || passwordInput.value.length < 6) {
                passwordInput.classList.add('error');
                errorMessage = errorMessage || 'Password must be at least 6 characters';
                isValid = false;
            }

            if (!isValid) {
                showMessage('error', errorMessage);
                return;
            }

            // Show loading
            const btnText = loginButton.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Signing In...';
            loginButton.classList.add('btn-loading');
            loginButton.disabled = true;

            // Simulate API call (2 seconds)
            setTimeout(() => {
                // Reset button
                btnText.textContent = originalText;
                loginButton.classList.remove('btn-loading');
                loginButton.disabled = false;

                // Show success message
                showMessage('success', 'Login successful!');

                // IMPORTANT: Submit the actual form to ASP.NET controller
                // This will trigger your AccountController Login action
                loginForm.submit();

            }, 2000);
        });
    }

    // 5. DEMO CREDENTIALS ON DOUBLE-CLICK
    document.addEventListener('dblclick', function (e) {
        if (e.target.type === 'email' || e.target.type === 'password') {
            const emailInput = document.getElementById('Email');
            const passwordInput = document.getElementById('Password');

            if (emailInput) {
                emailInput.value = demoEmail;
                emailInput.classList.add('demo-filled');
            }

            if (passwordInput) {
                passwordInput.value = demoPassword;
                passwordInput.classList.add('demo-filled');
            }

            showMessage('info', 'Demo credentials filled! Click Sign In to test.');

            // Remove demo class after 15 seconds
            setTimeout(() => {
                if (emailInput) emailInput.classList.remove('demo-filled');
                if (passwordInput) passwordInput.classList.remove('demo-filled');
            }, 50000);
        }
    });

    // 6. CHECK IF USER IS ALREADY LOGGED IN (from localStorage)
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Auto-redirect to Home/Index if already logged in
        window.location.href = '/Home/Index';
    }

    // 7. ENTER KEY SUBMISSION
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if ((activeElement.type === 'email' || activeElement.type === 'password') && loginForm) {
                loginForm.requestSubmit();
            }
        }
    });

    // 8. HELPER FUNCTION TO SHOW MESSAGES
    function showMessage(type, text) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message-box');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-box message-${type}`;

        let icon = '';
        switch (type) {
            case 'error': icon = 'bi-exclamation-triangle'; break;
            case 'success': icon = 'bi-check-circle'; break;
            case 'info': icon = 'bi-info-circle'; break;
        }

        messageDiv.innerHTML = `
            <i class="bi ${icon}"></i>
            <span>${text}</span>
            <button class="message-close"><i class="bi bi-x"></i></button>
        `;

        // Add to page
        const loginBody = document.querySelector('.login-body');
        if (loginBody) {
            const firstChild = loginBody.firstChild;
            loginBody.insertBefore(messageDiv, firstChild);

            // Add close button functionality
            const closeBtn = messageDiv.querySelector('.message-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    messageDiv.remove();
                });
            }

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    messageDiv.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }

        // Add CSS for message box
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                .message-box {
                    padding: 15px 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideDown 0.3s ease;
                    border-left: 4px solid;
                }
                .message-error {
                    background: #ffebee;
                    color: #c62828;
                    border-left-color: #c62828;
                }
                .message-success {
                    background: #e8f5e9;
                    color: #2e7d32;
                    border-left-color: #2e7d32;
                }
                .message-info {
                    background: #e3f2fd;
                    color: #1565c0;
                    border-left-color: #1565c0;
                }
                .message-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: inherit;
                    opacity: 0.7;
                }
                .message-close:hover {
                    opacity: 1;
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// LOGOUT FUNCTION
function logout() {
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');

    // Hide dashboard, show login (if using same page)
    const dashboardPage = document.getElementById('dashboardPage');
    const mainContainer = document.querySelector('.main-container');

    if (dashboardPage && mainContainer) {
        dashboardPage.style.display = 'none';
        mainContainer.style.display = 'flex';
    }

    // Show logout message
    alert('You have been logged out successfully.');
}