// Common utility functions
const Site = {
    // Show loading on button
    showLoading: function (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span> Processing...';
        button.disabled = true;
        return originalHTML;
    },

    // Hide loading on button
    hideLoading: function (button, originalHTML) {
        button.innerHTML = originalHTML;
        button.disabled = false;
    },

    // Show message
    showMessage: function (type, text, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="bi ${type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-circle'}"></i>
            ${text}
        `;

        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
        } else {
            document.body.insertBefore(messageDiv, document.body.firstChild);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    },

    // Validate email
    validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate mobile
    validateMobile: function (mobile) {
        return /^[0-9]{10}$/.test(mobile);
    },

    // Validate Aadhar
    validateAadhar: function (aadhar) {
        const cleanAadhar = aadhar.replace(/\D/g, '');
        return /^[0-9]{12}$/.test(cleanAadhar);
    },

    // Format Aadhar number
    formatAadhar: function (input) {
        let value = input.value.replace(/\D/g, '');

        if (value.length > 8) {
            value = value.substring(0, 12);
            value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        } else if (value.length > 4) {
            value = value.replace(/(\d{4})(\d{1,4})/, '$1 $2');
        }

        input.value = value.trim();
        return value.replace(/\s/g, '');
    },

    // Check password strength
    checkPasswordStrength: function (password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return strength;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Auto dismiss alerts
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    });
});

// Make Site object globally available
window.Site = Site;