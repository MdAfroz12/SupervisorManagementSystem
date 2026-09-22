// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard loaded');

    // Check if user is logged in via session
    const sessionEmail = document.getElementById('sessionEmail');
    if (sessionEmail && !sessionEmail.textContent.trim()) {
        // If no user data, redirect to login
        alert('Please login first');
        window.location.href = '/Account/Login';
        return;
    }

    // Initialize first step
    showStep('A');

    // Handle personal details form submission
    const personalForm = document.getElementById('personalDetailsForm');
    if (personalForm) {
        personalForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form including image
            if (validatePersonalForm()) {
                // Show loading
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';
                submitBtn.disabled = true;

                // Collect form data
                const formData = new FormData();

                // Add image if uploaded
                const photoInput = document.getElementById('photoUpload');
                if (photoInput.files.length > 0) {
                    formData.append('photo', photoInput.files[0]);
                }

                // Add form data
                const formDataObj = {
                    nameDetails: {
                        surname: document.getElementById('surname').value,
                        middleName: document.getElementById('middleName').value,
                        firstName: document.getElementById('firstName').value
                    },
                    familyDetails: {
                        fatherHusbandName: document.getElementById('fatherHusbandName').value
                    },
                    personalInfo: {
                        dateOfBirth: document.getElementById('dateOfBirth').value,
                        maritalStatus: document.getElementById('maritalStatus').value,
                        religion: document.getElementById('religion').value,
                        nationality: document.getElementById('nationality').value,
                        caste: document.getElementById('caste').value,
                        backwardClass: document.querySelector('input[name="backwardClass"]:checked')?.value,
                        category: document.getElementById('category').value,
                        motherTongue: document.getElementById('motherTongue').value,
                        languagesKnown: document.getElementById('languagesKnown').value
                    },
                    address: {
                        permanentAddress: document.getElementById('permanentAddress').value,
                        correspondenceAddress: document.getElementById('correspondenceAddress').value
                    }
                };

                formData.append('formData', JSON.stringify(formDataObj));

                console.log('Form Data to be submitted:', formDataObj);

                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    showMessage('success', 'Personal details saved successfully!');

                    // Move to next step (B)
                    setTimeout(() => {
                        showStep('B');
                    }, 1500);

                }, 2000);
            }
        });
    }

    // Handle backward class radio buttons
    const backwardClassRadios = document.querySelectorAll('input[name="backwardClass"]');
    backwardClassRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            const categoryField = document.getElementById('categoryField');
            if (this.value === 'Yes') {
                categoryField.style.display = 'block';
                document.getElementById('category').required = true;
            } else {
                categoryField.style.display = 'none';
                document.getElementById('category').required = false;
                document.getElementById('category').value = '';
            }
        });
    });

    // Set max date for date of birth (18+ years)
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    document.getElementById('dateOfBirth').max = maxDate.toISOString().split('T')[0];
});

// Function to show step
function showStep(stepLetter) {
    console.log('Showing step:', stepLetter);

    // Remove active class from all steps and lines
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    document.querySelectorAll('.line').forEach(line => {
        line.classList.remove('active');
    });

    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Get step index (A=0, B=1, etc.)
    const stepIndex = stepLetter.charCodeAt(0) - 65;
    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.line');

    // Activate current step and previous lines
    if (steps[stepIndex]) {
        steps[stepIndex].classList.add('active');
    }

    // Activate lines up to current step
    for (let i = 0; i < stepIndex; i++) {
        if (lines[i]) {
            lines[i].classList.add('active');
        }
    }

    // Show selected step content
    const stepContent = document.getElementById(`step${stepLetter}`);
    if (stepContent) {
        stepContent.classList.add('active');
    }

    // If showing step A, validate form
    if (stepLetter === 'A') {
        setTimeout(() => {
            validatePersonalForm();
        }, 100);
    }

    // If showing step B, initialize education form
    if (stepLetter === 'B') {
        setTimeout(() => {
            initEducationForm();
        }, 100);
    }
}

// Function to validate personal form
function validatePersonalForm() {
    const form = document.getElementById('personalDetailsForm');
    if (!form) return true;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Reset error classes
    requiredFields.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        }
    });

    // Validate image upload
    const photoInput = document.getElementById('photoUpload');
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedTypes.includes(file.type)) {
            showMessage('error', 'Please upload only JPG, JPEG or PNG images.');
            isValid = false;
        }

        if (file.size > maxSize) {
            showMessage('error', 'Image size should be less than 2MB.');
            isValid = false;
        }
    }

    // Validate date of birth
    const dobField = document.getElementById('dateOfBirth');
    if (dobField.value) {
        const dob = new Date(dobField.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();

        if (age < 18) {
            showMessage('error', 'You must be at least 18 years old.');
            dobField.classList.add('error');
            isValid = false;
        }
    }

    if (!isValid) {
        showMessage('error', 'Please fill all required fields correctly.');
    }

    return isValid;
}

// Function to show messages
function showMessage(type, text) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-alert');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert message-${type}`;

    let icon = '';
    switch (type) {
        case 'error': icon = 'bi-exclamation-triangle'; break;
        case 'success': icon = 'bi-check-circle'; break;
        case 'info': icon = 'bi-info-circle'; break;
        case 'warning': icon = 'bi-exclamation-circle'; break;
    }

    messageDiv.innerHTML = `
        <i class="bi ${icon}"></i>
        <span>${text}</span>
        <button class="message-close" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;

    // Add to page
    const stepContentArea = document.querySelector('.step-content-area');
    if (stepContentArea) {
        stepContentArea.insertBefore(messageDiv, stepContentArea.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/Account/Logout';
    }
}

// Function to preview uploaded image
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Check if image already exists
            let img = preview.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                preview.appendChild(img);
            }
            img.src = e.target.result;

            // Add has-image class
            preview.classList.add('has-image');

            // Remove placeholder icon and text
            const icon = preview.querySelector('i');
            const text = preview.querySelector('p');
            if (icon) icon.style.display = 'none';
            if (text) text.style.display = 'none';
        };

        reader.readAsDataURL(input.files[0]);

        // Validate image size and type
        const file = input.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedTypes.includes(file.type)) {
            showMessage('error', 'Please upload only JPG, JPEG or PNG images.');
            removeImage();
            return;
        }

        if (file.size > maxSize) {
            showMessage('error', 'Image size should be less than 2MB.');
            removeImage();
            return;
        }

        showMessage('success', 'Image uploaded successfully!');
    }
}

// Function to remove uploaded image
function removeImage() {
    const preview = document.getElementById('imagePreview');
    const input = document.getElementById('photoUpload');

    // Remove image
    const img = preview.querySelector('img');
    if (img) {
        img.remove();
    }

    // Show placeholder icon and text
    const icon = preview.querySelector('i');
    const text = preview.querySelector('p');
    if (icon) icon.style.display = 'block';
    if (text) text.style.display = 'block';

    // Remove has-image class
    preview.classList.remove('has-image');

    // Reset file input
    input.value = '';

    showMessage('info', 'Image removed.');
}

// Function to clear form
function clearForm() {
    const form = document.getElementById('personalDetailsForm');
    if (form) {
        form.reset();

        // Also remove uploaded image
        removeImage();

        // Reset backward class category
        document.getElementById('categoryField').style.display = 'none';
        document.getElementById('category').required = false;

        showMessage('info', 'Form cleared. You can start fresh.');
    }
}

// Step B - Education Details Functions
function initEducationForm() {
    console.log('Initializing Step B - Education Form');

    // Add event listeners to all existing exam rows
    document.querySelectorAll('.exam-row').forEach(row => {
        setupExamRowEvents(row);
    });

    // Calculate percentages for existing rows
    document.querySelectorAll('.exam-row').forEach(row => {
        calculatePercentage(row);
    });

    // Handle education form submission
    const educationForm = document.getElementById('educationDetailsForm');
    if (educationForm) {
        educationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateEducationForm()) {
                // Show loading
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';
                submitBtn.disabled = true;

                // Collect education data
                const educationData = collectEducationData();

                console.log('Education Data:', educationData);

                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    showMessage('success', 'Education details saved successfully!');

                    // Move to next step (C)
                    setTimeout(() => {
                        showStep('C');
                    }, 1500);

                }, 2000);
            }
        });
    }
}

// Setup events for an exam row
function setupExamRowEvents(row) {
    // Board/University change (for Others option)
    const boardSelect = row.querySelector('.board-university');
    if (boardSelect) {
        boardSelect.addEventListener('change', function () {
            const otherContainer = row.querySelector('.other-board-container');
            if (this.value === 'Other') {
                otherContainer.style.display = 'block';
                otherContainer.querySelector('.other-board').required = true;
            } else {
                otherContainer.style.display = 'none';
                otherContainer.querySelector('.other-board').required = false;
                otherContainer.querySelector('.other-board').value = '';
            }
        });
    }

    // Exam name change for UG (for Other option)
    const examNameSelect = row.querySelector('.exam-name');
    if (examNameSelect) {
        examNameSelect.addEventListener('change', function () {
            const otherContainer = row.querySelector('.other-exam-container');
            if (this.value === 'Other') {
                otherContainer.style.display = 'block';
                otherContainer.querySelector('.other-exam').required = true;
            } else {
                otherContainer.style.display = 'none';
                otherContainer.querySelector('.other-exam').required = false;
                otherContainer.querySelector('.other-exam').value = '';
            }
        });
    }

    // Marks type change
    const marksTypeSelect = row.querySelector('.marks-type');
    if (marksTypeSelect) {
        marksTypeSelect.addEventListener('change', function () {
            const obtainedInput = row.querySelector('.obtained-marks');
            const totalInput = row.querySelector('.total-marks');

            if (this.value === 'CGPA') {
                totalInput.value = '10.00';
                totalInput.readOnly = true;
                totalInput.style.backgroundColor = 'var(--gray-light)';
            } else {
                totalInput.readOnly = false;
                totalInput.style.backgroundColor = '';
                if (totalInput.value === '10.00') {
                    totalInput.value = '';
                }
            }

            calculatePercentage(row);
        });
    }

    // Obtained marks change
    const obtainedInput = row.querySelector('.obtained-marks');
    if (obtainedInput) {
        obtainedInput.addEventListener('input', function () {
            calculatePercentage(row);
        });
    }

    // Total marks change
    const totalInput = row.querySelector('.total-marks');
    if (totalInput) {
        totalInput.addEventListener('input', function () {
            calculatePercentage(row);
        });
    }

    // Passing year validation
    const yearInput = row.querySelector('.passing-year');
    if (yearInput) {
        yearInput.addEventListener('input', function () {
            const year = parseInt(this.value);
            const currentYear = new Date().getFullYear();
            if (year && (year < 1950 || year > currentYear)) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    }
}

// Calculate percentage for a row
function calculatePercentage(row) {
    const marksType = row.querySelector('.marks-type').value;
    const obtainedInput = row.querySelector('.obtained-marks');
    const totalInput = row.querySelector('.total-marks');
    const percentageInput = row.querySelector('.percentage');

    const obtained = parseFloat(obtainedInput.value);
    const total = parseFloat(totalInput.value);

    // Remove error classes
    obtainedInput.classList.remove('error');
    totalInput.classList.remove('error');

    if (marksType && obtained && total && total > 0) {
        let result = '';

        if (marksType === 'Percentage') {
            const percentage = (obtained / total) * 100;
            result = percentage.toFixed(2) + '%';
        } else if (marksType === 'CGPA') {
            // For CGPA, just show the CGPA value
            result = obtained.toFixed(2) + ' CGPA';

            // Validate CGPA (should be between 0 and 10)
            if (obtained > 10) {
                obtainedInput.classList.add('error');
                showMessage('error', 'CGPA cannot be more than 10');
                result = '';
            }
        }

        percentageInput.value = result;
    } else {
        percentageInput.value = '';
    }
}

// Add new exam row
function addExamRow() {
    const examRows = document.getElementById('examRows');
    const rowCount = document.querySelectorAll('.exam-row').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'exam-row';
    newRow.setAttribute('data-exam', 'additional-' + newRowId);

    newRow.innerHTML = `
        <td>
            <select class="form-control exam-name" required>
                <option value="">Select Qualification</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="Ph.D">Ph.D</option>
                <option value="Other">Other</option>
            </select>
            <div class="other-exam-container" style="display: none; margin-top: 5px;">
                <input type="text" class="form-control other-exam" placeholder="Specify other qualification">
            </div>
        </td>
        <td>
            <input type="text" class="form-control board-university" placeholder="Board/University name" required>
        </td>
        <td>
            <input type="number" class="form-control passing-year" min="1950" max="${new Date().getFullYear()}" placeholder="YYYY" required>
        </td>
        <td>
            <input type="text" class="form-control institute-name" placeholder="Institute name" required>
        </td>
        <td>
            <input type="text" class="form-control division" placeholder="e.g., First" required>
        </td>
        <td>
            <select class="form-control marks-type" required>
                <option value="">Select Type</option>
                <option value="Percentage">Percentage</option>
                <option value="CGPA">CGPA</option>
            </select>
        </td>
        <td>
            <input type="number" class="form-control obtained-marks" step="0.01" min="0" placeholder="Obtained" required>
        </td>
        <td>
            <input type="number" class="form-control total-marks" step="0.01" min="0" placeholder="Total" required>
        </td>
        <td>
            <input type="text" class="form-control percentage" readonly placeholder="Auto calculated">
            <button type="button" class="btn-remove" onclick="removeExamRow(this)" title="Remove this row">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    // Insert before the "Add More" row
    const addMoreRow = document.getElementById('addMoreRow');
    examRows.insertBefore(newRow, addMoreRow);

    // Setup events for the new row
    setupExamRowEvents(newRow);

    showMessage('success', 'New qualification row added successfully!');
}

// Remove exam row
function removeExamRow(button) {
    const row = button.closest('.exam-row');
    if (row) {
        const examType = row.getAttribute('data-exam');
        // Check if it's not one of the default rows (10th, 12th, UG)
        if (examType && examType.startsWith('additional-')) {
            row.remove();
            showMessage('info', 'Qualification row removed.');
        } else {
            showMessage('warning', 'Default qualification rows (10th, 12th, UG) cannot be removed.');
        }
    }
}

// Validate education form
function validateEducationForm() {
    const rows = document.querySelectorAll('.exam-row');
    let isValid = true;

    // Remove existing error classes
    document.querySelectorAll('.exam-row input.error, .exam-row select.error').forEach(el => {
        el.classList.remove('error');
    });

    rows.forEach((row, index) => {
        const requiredInputs = row.querySelectorAll('[required]');
        const boardSelect = row.querySelector('.board-university');
        const boardValue = boardSelect ? boardSelect.value : '';
        const examNameSelect = row.querySelector('.exam-name');
        const examName = examNameSelect ? examNameSelect.value : '';
        const marksType = row.querySelector('.marks-type').value;
        const obtained = row.querySelector('.obtained-marks').value;
        const total = row.querySelector('.total-marks').value;

        // Check required fields
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            }
        });

        // Validate board selection (for Others)
        if (boardValue === 'Other') {
            const otherBoard = row.querySelector('.other-board');
            if (otherBoard && !otherBoard.value.trim()) {
                otherBoard.classList.add('error');
                showMessage('error', `Row ${index + 1}: Please specify the board name for 'Others' option`);
                isValid = false;
            }
        }

        // Validate exam name (for UG Others)
        if (examName === 'Other') {
            const otherExam = row.querySelector('.other-exam');
            if (otherExam && !otherExam.value.trim()) {
                otherExam.classList.add('error');
                showMessage('error', `Row ${index + 1}: Please specify the qualification name for 'Other' option`);
                isValid = false;
            }
        }

        // Validate year
        const yearInput = row.querySelector('.passing-year');
        if (yearInput.value) {
            const year = parseInt(yearInput.value);
            const currentYear = new Date().getFullYear();
            if (year < 1950 || year > currentYear) {
                yearInput.classList.add('error');
                showMessage('error', `Row ${index + 1}: Please enter a valid year (1950-${currentYear})`);
                isValid = false;
            }
        }

        // Validate marks
        if (marksType === 'Percentage' && obtained && total) {
            const obtainedNum = parseFloat(obtained);
            const totalNum = parseFloat(total);

            if (totalNum <= 0) {
                row.querySelector('.total-marks').classList.add('error');
                showMessage('error', `Row ${index + 1}: Total marks must be greater than 0`);
                isValid = false;
            } else if (obtainedNum > totalNum) {
                row.querySelector('.obtained-marks').classList.add('error');
                showMessage('error', `Row ${index + 1}: Obtained marks cannot be greater than total marks`);
                isValid = false;
            }
        }

        // Validate CGPA
        if (marksType === 'CGPA' && obtained) {
            const obtainedNum = parseFloat(obtained);
            if (obtainedNum > 10) {
                row.querySelector('.obtained-marks').classList.add('error');
                showMessage('error', `Row ${index + 1}: CGPA cannot be more than 10`);
                isValid = false;
            }
        }
    });

    if (!isValid) {
        showMessage('error', 'Please fill all required fields correctly.');
    }

    return isValid;
}

// Collect education data
function collectEducationData() {
    const educationData = [];

    document.querySelectorAll('.exam-row').forEach(row => {
        const examNameStatic = row.querySelector('.exam-name-static');
        const examNameSelect = row.querySelector('.exam-name');

        let examName = '';
        if (examNameStatic) {
            examName = examNameStatic.textContent;
        } else if (examNameSelect) {
            const examValue = examNameSelect.value;
            examName = examValue === 'Other'
                ? row.querySelector('.other-exam').value
                : examNameSelect.options[examNameSelect.selectedIndex].text;
        }

        const boardSelect = row.querySelector('.board-university');
        const boardValue = boardSelect.value;
        const boardName = boardValue === 'Other'
            ? row.querySelector('.other-board').value
            : boardSelect.options[boardSelect.selectedIndex].text;

        educationData.push({
            exam: examName,
            boardUniversity: boardName,
            passingYear: row.querySelector('.passing-year').value,
            institute: row.querySelector('.institute-name').value,
            division: row.querySelector('.division').value,
            marksType: row.querySelector('.marks-type').value,
            obtainedMarks: row.querySelector('.obtained-marks').value,
            totalMarks: row.querySelector('.total-marks').value,
            percentage: row.querySelector('.percentage').value
        });
    });

    return educationData;
}

// Clear education form
function clearEducationForm() {
    const form = document.getElementById('educationDetailsForm');
    if (form) {
        form.reset();

        // Reset all percentages
        document.querySelectorAll('.percentage').forEach(input => {
            input.value = '';
        });

        // Reset CGPA total marks to editable
        document.querySelectorAll('.total-marks').forEach(input => {
            input.readOnly = false;
            input.style.backgroundColor = '';
        });

        // Hide all other inputs
        document.querySelectorAll('.other-board-container, .other-exam-container').forEach(container => {
            container.style.display = 'none';
            container.querySelector('input').required = false;
            container.querySelector('input').value = '';
        });

        // Remove additional rows (keep only first 3)
        const rows = document.querySelectorAll('.exam-row');
        rows.forEach((row, index) => {
            if (index >= 3) {
                row.remove();
            }
        });

        showMessage('info', 'Education form cleared.');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // 1. UG/PG के लिए Other डिग्री टेक्स्ट बॉक्स
    const examDropdowns = document.querySelectorAll('.exam-name');

    examDropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', function () {
            const otherContainer = this.parentElement.querySelector('.other-exam-container');
            if (this.value === 'Other') {
                otherContainer.style.display = 'block';
                const otherInput = otherContainer.querySelector('.other-exam');
                otherInput.required = true;
            } else {
                otherContainer.style.display = 'none';
                const otherInput = otherContainer.querySelector('.other-exam');
                otherInput.required = false;
                otherInput.value = '';
            }
        });

        // पहले से Other सेलेक्ट है तो
        if (dropdown.value === 'Other') {
            const otherContainer = dropdown.parentElement.querySelector('.other-exam-container');
            otherContainer.style.display = 'block';
        }
    });

    // 2. University के लिए Others टेक्स्ट बॉक्स
    const universityDropdowns = document.querySelectorAll('.board-university');

    universityDropdowns.forEach(function (dropdown) {
        // Others टेक्स्ट बॉक्स बनाएं
        const tdElement = dropdown.closest('td');
        const othersContainer = document.createElement('div');
        othersContainer.className = 'other-university-container';
        othersContainer.style.display = 'none';
        othersContainer.style.marginTop = '5px';

        const othersInput = document.createElement('input');
        othersInput.type = 'text';
        othersInput.className = 'form-control other-university';
        othersInput.placeholder = 'Specify university name';
        othersInput.required = false;

        othersContainer.appendChild(othersInput);
        tdElement.appendChild(othersContainer);

        // बदलाव इवेंट
        dropdown.addEventListener('change', function () {
            if (this.value === 'Others') {
                othersContainer.style.display = 'block';
                othersInput.required = true;
                othersInput.focus();
            } else {
                othersContainer.style.display = 'none';
                othersInput.required = false;
                othersInput.value = '';
            }
        });

        // पहले से Others सेलेक्ट है तो
        if (dropdown.value === 'Others') {
            othersContainer.style.display = 'block';
            othersInput.required = true;
        }
    });

    // 3. फॉर्म सबमिट से पहले डेटा प्रोसेस करना
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            let isValid = true;

            // UG/PG Other डिग्री वैलिडेशन
            examDropdowns.forEach(function (dropdown) {
                if (dropdown.value === 'Other') {
                    const otherInput = dropdown.parentElement.querySelector('.other-exam');
                    if (!otherInput.value.trim()) {
                        isValid = false;
                        alert('Please specify other degree name');
                        otherInput.focus();
                    }
                }
            });

            // University Others वैलिडेशन
            universityDropdowns.forEach(function (dropdown) {
                if (dropdown.value === 'Others') {
                    const otherInput = dropdown.closest('td').querySelector('.other-university');
                    if (!otherInput.value.trim()) {
                        isValid = false;
                        alert('Please specify university name');
                        otherInput.focus();
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
// Highest Qualification Change Handler
document.addEventListener('DOMContentLoaded', function () {
    const highestQualification = document.getElementById('highestQualification');
    const otherQualificationContainer = document.getElementById('otherQualificationContainer');

    if (highestQualification) {
        highestQualification.addEventListener('change', function () {
            if (this.value === 'Other') {
                otherQualificationContainer.style.display = 'block';
            } else {
                otherQualificationContainer.style.display = 'none';
            }
        });
    }

    // Add validation for new fields in existing validateEducationForm function
    const originalValidate = validateEducationForm;
    validateEducationForm = function () {
        if (!originalValidate()) return false;

        // Validate Highest Qualification
        if (!highestQualification.value) {
            showMessage('error', 'Please select highest qualification');
            highestQualification.focus();
            return false;
        }

        // Validate Other Qualification if selected
        if (highestQualification.value === 'Other') {
            const otherQualification = document.getElementById('otherQualification');
            if (!otherQualification.value.trim()) {
                showMessage('error', 'Please specify other qualification');
                otherQualification.focus();
                return false;
            }
        }

        return true;
    };

    // Add new fields to collectEducationData function
    const originalCollect = collectEducationData;
    collectEducationData = function () {
        const data = originalCollect();

        // Add new fields
        data.highestQualification = highestQualification.value;
        data.phdThesisTopic = document.getElementById('phdThesisTopic').value;

        if (highestQualification.value === 'Other') {
            data.otherQualification = document.getElementById('otherQualification').value;
        }

        return data;
    };

    // Update clearEducationForm to clear new fields
    const originalClear = clearEducationForm;
    clearEducationForm = function () {
        originalClear();

        // Clear new fields
        highestQualification.selectedIndex = 0;
        document.getElementById('phdThesisTopic').value = '';
        document.getElementById('otherQualification').value = '';
        otherQualificationContainer.style.display = 'none';
    };
});

// Step C - Experience Calculation Functions

// COMPLETE EXPERIENCE CALCULATOR - UG & PG BOTH WORKING

// 1. MAIN FUNCTION जो हर बार date change होने पर चलेगा
function calculateExperience(inputElement) {
    console.log("Calculation started for:", inputElement);

    // Find the row
    const row = inputElement.closest('.employment-row');
    if (!row) {
        console.error("Row not found!");
        return;
    }

    console.log("Row found, starting calculations...");

    // ================= UG EXPERIENCE CALCULATION =================
    const ugFromInput = row.querySelector('.ug-from');
    const ugToInput = row.querySelector('.ug-to');
    const ugTotalElement = row.querySelector('.ug-total');

    const ugFrom = ugFromInput.value;
    const ugTo = ugToInput.value;

    console.log("UG Dates - From:", ugFrom, "To:", ugTo);

    if (ugFrom && ugTo) {
        // Calculate UG experience
        const ugExp = calculateDateDiff(ugFrom, ugTo);
        console.log("UG Experience calculated:", ugExp);

        // Show in row's Total column
        ugTotalElement.value = ugExp;
        ugTotalElement.style.color = '#28a745';
        ugTotalElement.style.fontWeight = 'bold';
    } else {
        // Reset if dates not selected
        ugTotalElement.value = '0 Years 0 Months 0 Days';
        ugTotalElement.style.color = '#495057';
        ugTotalElement.style.fontWeight = 'normal';
    }

    // ================= PG EXPERIENCE CALCULATION =================
    const pgFromInput = row.querySelector('.pg-from');
    const pgToInput = row.querySelector('.pg-to');
    const pgTotalElement = row.querySelector('.pg-total');

    const pgFrom = pgFromInput.value;
    const pgTo = pgToInput.value;

    console.log("PG Dates - From:", pgFrom, "To:", pgTo);

    if (pgFrom && pgTo) {
        // Calculate PG experience (SAME LOGIC AS UG)
        const pgExp = calculateDateDiff(pgFrom, pgTo);
        console.log("PG Experience calculated:", pgExp);

        // Show in row's Total column
        pgTotalElement.value = pgExp;
        pgTotalElement.style.color = '#28a745';
        pgTotalElement.style.fontWeight = 'bold';
    } else {
        // Reset if dates not selected
        pgTotalElement.value = '0 Years 0 Months 0 Days';
        pgTotalElement.style.color = '#495057';
        pgTotalElement.style.fontWeight = 'normal';
    }

    // ================= UPDATE TOTALS =================
    updateTotalSummaries();
}

// 2. DATE DIFFERENCE CALCULATOR (UG और PG दोनों के लिए same function)
function calculateDateDiff(startDate, endDate) {
    console.log("Calculating difference between", startDate, "and", endDate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start) || isNaN(end)) {
        return "Invalid Dates";
    }

    // Check if end date is before start date
    if (end < start) {
        return "Invalid Dates";
    }

    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    console.log("Raw calculation:", years, "years,", months, "months,", days, "days");

    // Adjust negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += lastMonth.getDate();
        console.log("Adjusted days:", days);
    }

    // Adjust negative months
    if (months < 0) {
        years--;
        months += 12;
        console.log("Adjusted months:", months);
    }

    const result = `${years} Years ${months} Months ${days} Days`;
    console.log("Final result:", result);
    return result;
}

// 3. UPDATE ALL TOTALS (UG Total, PG Total, Overall Total)
function updateTotalSummaries() {
    console.log("=== UPDATING ALL TOTALS ===");

    let totalUGYears = 0;
    let totalUGMonths = 0;
    let totalUGDays = 0;

    let totalPGYears = 0;
    let totalPGMonths = 0;
    let totalPGDays = 0;

    // Get all rows
    const rows = document.querySelectorAll('.employment-row');
    console.log("Total rows found:", rows.length);

    rows.forEach((row, index) => {
        console.log(`\n--- Processing Row ${index + 1} ---`);

        // ============ UG EXPERIENCE FROM THIS ROW ============
        const ugExpText = row.querySelector('.ug-total').value;
        console.log("UG Experience in row:", ugExpText);

        if (ugExpText && ugExpText !== '0 Years 0 Months 0 Days' && ugExpText !== 'Invalid Dates') {
            // Parse the UG experience text
            const ugParts = parseExperience(ugExpText);
            if (ugParts) {
                totalUGYears += ugParts.years;
                totalUGMonths += ugParts.months;
                totalUGDays += ugParts.days;
                console.log(`Added UG: ${ugParts.years} years, ${ugParts.months} months, ${ugParts.days} days`);
            }
        }

        // ============ PG EXPERIENCE FROM THIS ROW ============
        const pgExpText = row.querySelector('.pg-total').value;
        console.log("PG Experience in row:", pgExpText);

        if (pgExpText && pgExpText !== '0 Years 0 Months 0 Days' && pgExpText !== 'Invalid Dates') {
            // Parse the PG experience text (SAME PARSING AS UG)
            const pgParts = parseExperience(pgExpText);
            if (pgParts) {
                totalPGYears += pgParts.years;
                totalPGMonths += pgParts.months;
                totalPGDays += pgParts.days;
                console.log(`Added PG: ${pgParts.years} years, ${pgParts.months} months, ${pgParts.days} days`);
            }
        }
    });

    console.log("\n=== RAW TOTALS ===");
    console.log("UG Total:", totalUGYears, "years,", totalUGMonths, "months,", totalUGDays, "days");
    console.log("PG Total:", totalPGYears, "years,", totalPGMonths, "months,", totalPGDays, "days");

    // ============ NORMALIZE UG TOTAL ============
    // Convert days to months (30 days = 1 month)
    while (totalUGDays >= 30) {
        totalUGMonths++;
        totalUGDays -= 30;
    }

    // Convert months to years (12 months = 1 year)
    while (totalUGMonths >= 12) {
        totalUGYears++;
        totalUGMonths -= 12;
    }

    // ============ NORMALIZE PG TOTAL ============
    // Convert days to months (30 days = 1 month)
    while (totalPGDays >= 30) {
        totalPGMonths++;
        totalPGDays -= 30;
    }

    // Convert months to years (12 months = 1 year)
    while (totalPGMonths >= 12) {
        totalPGYears++;
        totalPGMonths -= 12;
    }

    // ============ CALCULATE OVERALL TOTAL (UG + PG) ============
    let overallYears = totalUGYears + totalPGYears;
    let overallMonths = totalUGMonths + totalPGMonths;
    let overallDays = totalUGDays + totalPGDays;

    // Normalize overall total
    while (overallDays >= 30) {
        overallMonths++;
        overallDays -= 30;
    }

    while (overallMonths >= 12) {
        overallYears++;
        overallMonths -= 12;
    }

    console.log("\n=== FINAL TOTALS ===");
    console.log("UG Final:", `${totalUGYears} Years ${totalUGMonths} Months ${totalUGDays} Days`);
    console.log("PG Final:", `${totalPGYears} Years ${totalPGMonths} Months ${totalPGDays} Days`);
    console.log("Overall Final:", `${overallYears} Years ${overallMonths} Months ${overallDays} Days`);

    // ============ UPDATE DISPLAY ============
    // Update UG Total Display
    const ugTotalElement = document.getElementById('totalUGExperience');
    if (ugTotalElement) {
        ugTotalElement.textContent = `${totalUGYears} Years ${totalUGMonths} Months ${totalUGDays} Days`;
        ugTotalElement.style.color = (totalUGYears > 0 || totalUGMonths > 0 || totalUGDays > 0) ? '#28a745' : '#495057';
        console.log("UG Total updated on page");
    }

    // Update PG Total Display
    const pgTotalElement = document.getElementById('totalPGExperience');
    if (pgTotalElement) {
        pgTotalElement.textContent = `${totalPGYears} Years ${totalPGMonths} Months ${totalPGDays} Days`;
        pgTotalElement.style.color = (totalPGYears > 0 || totalPGMonths > 0 || totalPGDays > 0) ? '#28a745' : '#495057';
        console.log("PG Total updated on page");
    }

    // Update Overall Total Display
    const overallElement = document.getElementById('totalExperience');
    if (overallElement) {
        overallElement.textContent = `${overallYears} Years ${overallMonths} Months ${overallDays} Days`;
        overallElement.style.color = (overallYears > 0 || overallMonths > 0 || overallDays > 0) ? '#28a745' : '#495057';
        console.log("Overall Total updated on page");
    }
}

// 4. PARSE EXPERIENCE TEXT (UG और PG दोनों के लिए same function)
function parseExperience(expText) {
    console.log("Parsing experience text:", expText);

    if (!expText || expText.includes('Invalid')) {
        return null;
    }

    try {
        // Example: "2 Years 3 Months 15 Days"
        const parts = expText.split(' ');

        if (parts.length >= 6) {
            const years = parseInt(parts[0]) || 0;
            const months = parseInt(parts[2]) || 0;
            const days = parseInt(parts[4]) || 0;

            console.log("Parsed:", years, "years,", months, "months,", days, "days");
            return { years, months, days };
        }
    } catch (error) {
        console.error("Error parsing experience text:", error);
    }

    return null;
}

// 5. ADD NEW ROW (UG और PG columns के साथ)
function addEmploymentRow() {
    console.log("Adding new employment row...");

    const employmentRows = document.getElementById('employmentRows');
    const rowCount = document.querySelectorAll('.employment-row').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'employment-row';
    newRow.setAttribute('data-row-id', newRowId);

    newRow.innerHTML = `
        <td>
            <input type="text" class="form-control institution-name" placeholder="Institution name">
        </td>
        <td>
            <input type="text" class="form-control post-held" placeholder="e.g., Assistant Professor">
        </td>
        <td>
            <input type="text" class="form-control qualification" placeholder="Qualification">
        </td>
        
        <!-- UG Experience Columns -->
        <td>
            <input type="date" class="form-control ug-from date-picker" onchange="calculateExperience(this)">
        </td>
        <td>
            <input type="date" class="form-control ug-to date-picker" onchange="calculateExperience(this)">
        </td>
        <td>
            <input type="text" class="form-control ug-total experience-display" readonly value="0 Years 0 Months 0 Days">
        </td>
        
        <!-- PG Experience Columns (SAME STRUCTURE AS UG) -->
        <td>
            <input type="date" class="form-control pg-from date-picker" onchange="calculateExperience(this)">
        </td>
        <td>
            <input type="date" class="form-control pg-to date-picker" onchange="calculateExperience(this)">
        </td>
        <td>
            <input type="text" class="form-control pg-total experience-display" readonly value="0 Years 0 Months 0 Days">
        </td>
        
        <td class="action-cell">
            <button type="button" class="btn-action btn-remove" onclick="removeEmploymentRow(this)" title="Remove this record">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    employmentRows.appendChild(newRow);
    console.log("New row added with ID:", newRowId);

    // Alert user
    alert("New employment record added! Please fill the dates for UG and/or PG experience.");
}

// 6. REMOVE ROW
function removeEmploymentRow(button) {
    const row = button.closest('.employment-row');
    const rowCount = document.querySelectorAll('.employment-row').length;

    if (rowCount <= 1) {
        alert("At least one employment record is required!");
        return;
    }

    if (confirm("Are you sure you want to remove this employment record?")) {
        row.remove();
        updateTotalSummaries();
        alert("Employment record removed!");
    }
}

// 7. CLEAR ALL
function clearEmploymentForm() {
    if (confirm("Are you sure you want to clear all employment details?")) {
        // Clear all inputs
        document.querySelectorAll('.employment-row input').forEach(input => {
            if (input.type === 'text' || input.type === 'date') {
                input.value = '';
            }
        });

        // Reset experience displays
        document.querySelectorAll('.experience-display').forEach(display => {
            display.value = '0 Years 0 Months 0 Days';
            display.style.color = '#495057';
            display.style.fontWeight = 'normal';
        });

        // Update totals
        updateTotalSummaries();

        alert("All employment details cleared!");
    }
}

// 8. INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', function () {
    console.log("=== PAGE LOADED - INITIALIZING EXPERIENCE CALCULATOR ===");

    // Initialize totals
    updateTotalSummaries();

    // Add event listeners to all date inputs
    document.querySelectorAll('.date-picker').forEach(input => {
        input.addEventListener('change', function () {
            calculateExperience(this);
        });
    });

    // Form submission handler
    const employmentForm = document.getElementById('employmentDetailsForm');
    if (employmentForm) {
        employmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect data
            const formData = {
                ugTotal: document.getElementById('totalUGExperience').textContent,
                pgTotal: document.getElementById('totalPGExperience').textContent,
                overallTotal: document.getElementById('totalExperience').textContent
            };

            // Save to localStorage
            localStorage.setItem('phdEmploymentData', JSON.stringify(formData));

            alert("Employment details saved successfully!");
            console.log("Data saved:", formData);
        });
    }

    console.log("Experience Calculator initialized successfully!");
});

// 9. TEST FUNCTION 
function testExperienceSystem() {
    console.log("=== TESTING EXPERIENCE SYSTEM ===");

    // Test date difference calculation
    console.log("Test 1: Simple date difference");
    console.log("Result:", calculateDateDiff('2020-01-01', '2023-01-01'));

    // Test parsing
    console.log("\nTest 2: Parsing experience text");
    console.log("Result:", parseExperience('2 Years 3 Months 15 Days'));

    // Update totals
    console.log("\nTest 3: Updating totals");
    updateTotalSummaries();
} 

// Step D - Research Experience JavaScript

// Initialize Step D when shown
function initStepD() {
    console.log('Initializing Step D - Research Experience');

    // Setup PG Approval Radio Buttons
    setupPGApprovalToggle();

     // Setup University Dropdown
    setupUniversityDropdown();

    // Setup Research Table
    initResearchTable();

    // Setup File Upload Zones
    setupFileUploadZones();

    // Setup Form Submission
    setupResearchFormSubmission();
}

// PG Approval Toggle
function setupPGApprovalToggle() {
    const pgYes = document.getElementById('pgYes');
    const pgNo = document.getElementById('pgNo');
    const approvalDetails = document.getElementById('pgApprovalDetails');

    if (pgYes && pgNo && approvalDetails) {
        // Initial state
        if (pgNo.checked) {
            approvalDetails.style.display = 'none';
            togglePGFields(false);
        }

        // Add event listeners
        pgYes.addEventListener('change', function () {
            if (this.checked) {
                approvalDetails.style.display = 'block';
                togglePGFields(true);
            }
        });

        pgNo.addEventListener('change', function () {
            if (this.checked) {
                approvalDetails.style.display = 'none';
                togglePGFields(false);
            }
        });
    }
}

function togglePGFields(required) {
    const fields = [
        document.getElementById('letterNo'),
        document.getElementById('approvalDate'),
        document.getElementById('universityName'),
        document.getElementById('approvalDocument')
    ];

    fields.forEach(field => {
        if (field) {
            field.required = required;
        }
    });
}

// University Dropdown
function setupUniversityDropdown() {
    const universityDropdown = document.getElementById('universityName');
    const otherContainer = document.getElementById('otherUniversityContainer');

    if (universityDropdown && otherContainer) {
        universityDropdown.addEventListener('change', function () {
            if (this.value === 'Other') {
                otherContainer.style.display = 'block';
                document.getElementById('otherUniversity').required = true;
            } else {
                otherContainer.style.display = 'none';
                document.getElementById('otherUniversity').required = false;
                document.getElementById('otherUniversity').value = '';
            }
        });

        // Check initial state
        if (universityDropdown.value === 'Other') {
            otherContainer.style.display = 'block';
        }
    }
}

// Research Table Functions
function initResearchTable() {
    // Add event listeners to existing rows
    document.querySelectorAll('.research-row').forEach(row => {
        setupResearchRowEvents(row);
    });

    // Calculate initial durations
    document.querySelectorAll('.research-row').forEach(row => {
        calculateResearchDuration(row.querySelector('.research-from'));
    });
}

function setupResearchRowEvents(row) {
    // Date change events
    const fromInput = row.querySelector('.research-from');
    const toInput = row.querySelector('.research-to');

    if (fromInput) {
        fromInput.addEventListener('change', function () {
            calculateResearchDuration(this);
        });
    }

    if (toInput) {
        toInput.addEventListener('change', function () {
            calculateResearchDuration(this);
        });
    }

    // Nature of Research change for Other option
    const natureSelect = row.querySelector('.research-nature');
    if (natureSelect) {
        natureSelect.addEventListener('change', function () {
            if (this.value === 'Other') {
                // Create or show other input
                let otherContainer = row.querySelector('.other-nature-container');
                if (!otherContainer) {
                    otherContainer = document.createElement('div');
                    otherContainer.className = 'other-nature-container';
                    otherContainer.style.marginTop = '5px';

                    const otherInput = document.createElement('input');
                    otherInput.type = 'text';
                    otherInput.className = 'form-control other-research-nature';
                    otherInput.placeholder = 'Specify nature of research';
                    otherInput.required = true;

                    otherContainer.appendChild(otherInput);
                    this.parentNode.appendChild(otherContainer);
                }
                otherContainer.style.display = 'block';
            } else {
                const otherContainer = row.querySelector('.other-nature-container');
                if (otherContainer) {
                    otherContainer.style.display = 'none';
                    otherContainer.querySelector('input').value = '';
                }
            }
        });
    }
}

function calculateResearchDuration(inputElement) {
    const row = inputElement.closest('.research-row');
    const fromInput = row.querySelector('.research-from');
    const toInput = row.querySelector('.research-to');
    const durationInput = row.querySelector('.research-duration');

    const fromDate = fromInput.value;
    const toDate = toInput.value;

    if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Check if dates are valid
        if (to < from) {
            durationInput.value = 'Invalid Dates';
            durationInput.style.color = '#dc3545';
            updateTotalResearchExperience();
            return;
        }

        // Calculate duration
        let years = to.getFullYear() - from.getFullYear();
        let months = to.getMonth() - from.getMonth();
        let days = to.getDate() - from.getDate();

        // Adjust negative days
        if (days < 0) {
            months--;
            const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // Adjust negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        const duration = `${years} Years ${months} Months ${days} Days`;
        durationInput.value = duration;
        durationInput.style.color = '#28a745';

        // Update total research experience
        updateTotalResearchExperience();
    } else {
        durationInput.value = '';
        durationInput.style.color = '#495057';
        updateTotalResearchExperience();
    }
}

function updateTotalResearchExperience() {
    let totalYears = 0;
    let totalMonths = 0;
    let totalDays = 0;

    // Calculate total from all rows
    document.querySelectorAll('.research-row').forEach(row => {
        const duration = row.querySelector('.research-duration').value;

        if (duration && duration !== 'Invalid Dates') {
            // Parse duration string "X Years Y Months Z Days"
            const matches = duration.match(/(\d+)\s*Years\s*(\d+)\s*Months\s*(\d+)\s*Days/);
            if (matches && matches.length === 4) {
                totalYears += parseInt(matches[1]);
                totalMonths += parseInt(matches[2]);
                totalDays += parseInt(matches[3]);
            }
        }
    });

    // Normalize days and months
    totalMonths += Math.floor(totalDays / 30);
    totalDays = totalDays % 30;

    totalYears += Math.floor(totalMonths / 12);
    totalMonths = totalMonths % 12;

    // Update display
    const totalDisplay = document.getElementById('totalResearchExperience');
    if (totalDisplay) {
        totalDisplay.textContent = `${totalYears} Years ${totalMonths} Months ${totalDays} Days`;
    }
}

function addResearchRow() {
    const researchRows = document.getElementById('researchRows');
    const rowCount = document.querySelectorAll('.research-row').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'research-row';
    newRow.setAttribute('data-row', newRowId);

    newRow.innerHTML = `
        <td>
            <input type="text" class="form-control research-organization" placeholder="e.g., IIT Bombay, CSIR" required>
        </td>
        <td>
            <input type="text" class="form-control research-position" placeholder="e.g., Research Scientist" required>
        </td>
        <td>
            <input type="date" class="form-control research-from date-picker">
        </td>
        <td>
            <input type="date" class="form-control research-to date-picker">
        </td>
        <td>
            <input type="text" class="form-control research-duration" readonly placeholder="Auto calculated">
        </td>
        <td>
            <select class="form-control research-nature" required>
                <option value="">Select Nature</option>
                <option value="Fundamental">Fundamental Research</option>
                <option value="Applied">Applied Research</option>
                <option value="Experimental">Experimental Research</option>
                <option value="Theoretical">Theoretical Research</option>
                <option value="Field">Field Research</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-remove" onclick="removeResearchRow(this)" title="Remove this record">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    researchRows.insertBefore(newRow, researchRows.lastElementChild);

    // Setup events for new row
    setupResearchRowEvents(newRow);

    // Show success message
    showMessage('success', 'Research record added successfully!');
}

function removeResearchRow(button) {
    const row = button.closest('.research-row');
    const rowCount = document.querySelectorAll('.research-row').length;

    // Don't remove if only one row remains
    if (rowCount <= 1) {
        showMessage('warning', 'At least one research record is required');
        return;
    }

    if (row) {
        row.remove();

        // Update total experience after removal
        updateTotalResearchExperience();

        // Show info message
        showMessage('info', 'Research record removed successfully');
    }
}

// File Upload Functions
function setupFileUploadZones() {
    // Setup drag and drop for research upload zone
    const researchUploadZone = document.getElementById('researchUploadZone');
    const researchFileInput = document.getElementById('researchDocuments');

    if (researchUploadZone && researchFileInput) {
        // Drag over event
        researchUploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        // Drag leave event
        researchUploadZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        // Drop event
        researchUploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                researchFileInput.files = e.dataTransfer.files;
                handleResearchUpload({ target: researchFileInput });
            }
        });

        // Click event
        researchUploadZone.addEventListener('click', function () {
            researchFileInput.click();
        });
    }
}

function handleApprovalUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!validateFile(file, ['pdf', 'jpg', 'jpeg', 'png'], 5)) {
        return;
    }

    // Show preview
    const preview = document.getElementById('approvalPreview');
    const fileName = document.getElementById('approvalFileName');
    const fileSize = document.getElementById('approvalFileSize');

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    // Change icon based on file type
    const fileIcon = preview.querySelector('i');
    if (file.type === 'application/pdf') {
        fileIcon.className = 'bi bi-file-earmark-pdf';
        fileIcon.style.color = '#dc3545';
    } else {
        fileIcon.className = 'bi bi-file-earmark-image';
        fileIcon.style.color = '#28a745';
    }

    preview.style.display = 'block';

    showMessage('success', 'Approval document uploaded successfully!');
}

function handleResearchUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesListContainer = document.getElementById('filesListContainer');
    let validFilesCount = 0;

    // Clear empty state if exists
    const emptyState = filesListContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!validateFile(file, ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'], 10)) {
            continue;
        }

        validFilesCount++;

        // Create file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = file.name;
        fileItem.dataset.fileSize = file.size;
        fileItem.dataset.fileType = file.type;

        // Get file icon
        let fileIcon = 'bi-file-earmark';
        let iconColor = '#6c757d';

        if (file.type === 'application/pdf') {
            fileIcon = 'bi-file-earmark-pdf';
            iconColor = '#dc3545';
        } else if (file.type.includes('image')) {
            fileIcon = 'bi-file-earmark-image';
            iconColor = '#28a745';
        } else if (file.type.includes('document') || file.type.includes('msword')) {
            fileIcon = 'bi-file-earmark-word';
            iconColor = '#2b579a';
        }

        fileItem.innerHTML = `
            <i class="bi ${fileIcon}" style="color: ${iconColor};"></i>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <button type="button" class="btn-view-file" onclick="viewFile('${file.name}')" title="View file">
                    <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn-delete-file" onclick="deleteResearchFile(this)" title="Delete file">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        filesListContainer.appendChild(fileItem);
    }

    if (validFilesCount > 0) {
        showMessage('success', `${validFilesCount} document(s) uploaded successfully!`);
    }

    // Reset file input to allow uploading same file again
    event.target.value = '';
}

function validateFile(file, allowedExtensions, maxSizeMB) {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // Check file size
    if (file.size > maxSize) {
        showMessage('error', `File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`);
        return false;
    }

    // Check file extension
    if (!allowedExtensions.includes(fileExtension)) {
        showMessage('error', `File "${file.name}" has unsupported format. Allowed: ${allowedExtensions.join(', ')}`);
        return false;
    }

    return true;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeApprovalFile() {
    const preview = document.getElementById('approvalPreview');
    const fileInput = document.getElementById('approvalDocument');

    preview.style.display = 'none';
    fileInput.value = '';

    showMessage('info', 'Approval document removed');
}

function deleteResearchFile(button) {
    const fileItem = button.closest('.file-item');
    const fileName = fileItem.dataset.fileName;

    fileItem.remove();

    // Check if files list is empty
    const filesListContainer = document.getElementById('filesListContainer');
    if (filesListContainer.children.length === 0) {
        filesListContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-folder-x"></i>
                <p>No documents uploaded yet</p>
            </div>
        `;
    }

    showMessage('info', `Document "${fileName}" deleted`);
}

function viewFile(fileName) {
    showMessage('info', `Viewing file: ${fileName} (Preview functionality would open the file)`);
    // In a real application, this would open a file preview modal
}

// Update Summary (for publication and patent counts)
function updateSummary() {
    // This function is triggered when publication/patent count inputs change
    // You can add any summary calculations here
    const papersPublished = parseInt(document.getElementById('papersPublished').value) || 0;
    const patentsFiled = parseInt(document.getElementById('patentsFiled').value) || 0;
    const patentsGranted = parseInt(document.getElementById('patentsGranted').value) || 0;

    // Validate patents granted <= patents filed
    if (patentsGranted > patentsFiled) {
        showMessage('warning', 'Patents granted cannot exceed patents filed');
        document.getElementById('patentsGranted').value = patentsFiled;
    }
}

// Form Submission
function setupResearchFormSubmission() {
    const researchForm = document.getElementById('researchExperienceForm');

    if (researchForm) {
        researchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateResearchForm()) {
                // Show loading
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';
                submitBtn.disabled = true;

                // Collect form data
                const formData = collectResearchFormData();
                console.log('Research Experience Data:', formData);

                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    showMessage('success', 'Research experience details saved successfully!');

                    // Move to next step (E)
                    setTimeout(() => {
                        showStep('E');
                    }, 1500);

                }, 2000);
            }
        });
    }
}

function validateResearchForm() {
    let isValid = true;

    // Check PG Approval details if Yes is selected
    const pgYes = document.getElementById('pgYes');
    if (pgYes && pgYes.checked) {
        const requiredFields = [
            document.getElementById('letterNo'),
            document.getElementById('approvalDate'),
            document.getElementById('universityName'),
            document.getElementById('approvalDocument')
        ];

        for (const field of requiredFields) {
            if (field && !field.value.trim()) {
                showMessage('error', 'Please fill all PG approval details');
                field.focus();
                isValid = false;
                break;
            }
        }

        // Check other university if selected
        const universityName = document.getElementById('universityName');
        if (universityName && universityName.value === 'Other') {
            const otherUniversity = document.getElementById('otherUniversity');
            if (otherUniversity && !otherUniversity.value.trim()) {
                showMessage('error', 'Please specify university name');
                otherUniversity.focus();
                isValid = false;
            }
        }
    }

    // Check research experience table
    const researchRows = document.querySelectorAll('.research-row');
    researchRows.forEach((row, index) => {
        const requiredInputs = row.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                showMessage('error', `Please fill all fields in research record ${index + 1}`);
                input.focus();
                isValid = false;
            }
        });

        // Check for invalid dates
        const duration = row.querySelector('.research-duration').value;
        if (duration === 'Invalid Dates') {
            showMessage('error', `Please check dates in research record ${index + 1}`);
            isValid = false;
        }

        // Check other nature of research
        const natureSelect = row.querySelector('.research-nature');
        if (natureSelect && natureSelect.value === 'Other') {
            const otherInput = row.querySelector('.other-research-nature');
            if (otherInput && !otherInput.value.trim()) {
                showMessage('error', `Please specify nature of research in record ${index + 1}`);
                otherInput.focus();
                isValid = false;
            }
        }
    });

    return isValid;
}

function collectResearchFormData() {
    const formData = {
        pgApproval: {},
        researchExperience: [],
        researchSummary: {},
        uploadedDocuments: []
    };

    // PG Approval Data
    const pgApproved = document.querySelector('input[name="pgApproved"]:checked');
    formData.pgApproval.approved = pgApproved ? pgApproved.value : 'No';

    if (formData.pgApproval.approved === 'Yes') {
        formData.pgApproval.letterNo = document.getElementById('letterNo').value;
        formData.pgApproval.approvalDate = document.getElementById('approvalDate').value;

        const universityName = document.getElementById('universityName').value;
        formData.pgApproval.university = universityName === 'Other'
            ? document.getElementById('otherUniversity').value
            : universityName;

        const approvalFile = document.getElementById('approvalDocument').files[0];
        if (approvalFile) {
            formData.pgApproval.document = {
                name: approvalFile.name,
                size: approvalFile.size,
                type: approvalFile.type
            };
        }
    }

    // Research Experience Data
    document.querySelectorAll('.research-row').forEach((row, index) => {
        const experience = {
            organization: row.querySelector('.research-organization').value,
            position: row.querySelector('.research-position').value,
            fromDate: row.querySelector('.research-from').value,
            toDate: row.querySelector('.research-to').value,
            duration: row.querySelector('.research-duration').value,
            nature: row.querySelector('.research-nature').value
        };

        // Add other nature if specified
        if (experience.nature === 'Other') {
            const otherInput = row.querySelector('.other-research-nature');
            if (otherInput) {
                experience.otherNature = otherInput.value;
            }
        }

        formData.researchExperience.push(experience);
    });

    // Research Summary
    formData.researchSummary = {
        totalResearchExperience: document.getElementById('totalResearchExperience').textContent,
        papersPublished: parseInt(document.getElementById('papersPublished').value) || 0,
        patentsFiled: parseInt(document.getElementById('patentsFiled').value) || 0,
        patentsGranted: parseInt(document.getElementById('patentsGranted').value) || 0
    };

    // Uploaded Documents Info
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        formData.uploadedDocuments.push({
            name: item.dataset.fileName,
            size: item.dataset.fileSize,
            type: item.dataset.fileType
        });
    });

    return formData;
}

function clearResearchForm() {
    // Clear PG Approval section
    const pgNo = document.getElementById('pgNo');
    if (pgNo) {
        pgNo.checked = true;
        document.getElementById('pgApprovalDetails').style.display = 'none';
        togglePGFields(false);
    }

    document.getElementById('letterNo').value = '';
    document.getElementById('approvalDate').value = '';
    document.getElementById('universityName').selectedIndex = 0;
    document.getElementById('otherUniversity').value = '';
    document.getElementById('otherUniversityContainer').style.display = 'none';
    removeApprovalFile();

    // Clear research table (keep first row)
    const researchRows = document.querySelectorAll('.research-row');
    researchRows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        } else {
            // Clear first row
            row.querySelector('.research-organization').value = '';
            row.querySelector('.research-position').value = '';
            row.querySelector('.research-from').value = '';
            row.querySelector('.research-to').value = '';
            row.querySelector('.research-duration').value = '';
            row.querySelector('.research-nature').selectedIndex = 0;

            const otherContainer = row.querySelector('.other-nature-container');
            if (otherContainer) {
                otherContainer.style.display = 'none';
                otherContainer.querySelector('input').value = '';
            }
        }
    });

    // Clear summary fields
    document.getElementById('papersPublished').value = '0';
    document.getElementById('patentsFiled').value = '0';
    document.getElementById('patentsGranted').value = '0';
    updateTotalResearchExperience();

    // Clear uploaded documents
    const filesListContainer = document.getElementById('filesListContainer');
    filesListContainer.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-folder-x"></i>
            <p>No documents uploaded yet</p>
        </div>
    `;

    showMessage('info', 'Research form cleared successfully!');
}

// Show Step D when needed
function showStepD() {
    showStep('D');
    initStepD();
}

// Call this when showing step D
document.addEventListener('DOMContentLoaded', function () {
    // When step D is shown, initialize it
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const stepD = document.getElementById('stepD');
                if (stepD && stepD.classList.contains('active')) {
                    initStepD();
                }
            }
        });
    });

    const stepD = document.getElementById('stepD');
    if (stepD) {
        observer.observe(stepD, { attributes: true });
    }
});
// Step E - Publication Details JavaScript

// Global variables
let publications = {
    books: [],
    researchPapers: [],
    chapters: [],
    others: []
};

// Initialize Step E
function initStepE() {
    console.log('Initializing Step E - Publication Details');

    // Initialize tabs
    initTabs();

    // Initialize tables
    initPublicationTables();

    // Initialize file uploads
    initFileUploads();

    // Setup form submission
    setupPublicationForm();

    // Load any saved data
    loadSavedPublications();

    // Update summary
    updatePublicationSummary();
}

// Tab functionality
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Set first tab as active if none is active
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab && tabBtns.length > 0) {
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
}

function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(`${tabName}Tab`);

    if (tabBtn && tabContent) {
        tabBtn.classList.add('active');
        tabContent.classList.add('active');
    }
}

// Publication Tables
function initPublicationTables() {
    // Add event listeners to existing rows
    document.querySelectorAll('.publication-table tbody tr:not(.empty-row)').forEach(row => {
        setupPublicationRowEvents(row);
    });
}

function setupPublicationRowEvents(row) {
    // Add change event listeners to inputs
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            updatePublicationCounts();
            savePublicationsToStorage();
        });
    });
}

// Book Functions
function addBookRow() {
    const booksRows = document.getElementById('booksRows');
    const emptyRow = booksRows.querySelector('.empty-row');

    // Remove empty row if exists
    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = booksRows.querySelectorAll('tr:not(.empty-row)').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'publication-row';
    newRow.dataset.type = 'book';
    newRow.dataset.id = `book-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control book-title" placeholder="Enter book title" required>
        </td>
        <td>
            <input type="text" class="form-control book-authors" placeholder="Author names" required>
        </td>
        <td>
            <input type="text" class="form-control book-publisher" placeholder="Publisher name" required>
        </td>
        <td>
            <input type="number" class="form-control book-year" min="1900" max="${new Date().getFullYear()}" 
                   placeholder="YYYY" required>
        </td>
        <td>
            <input type="text" class="form-control book-isbn" placeholder="ISBN number">
        </td>
        <td>
            <select class="form-control book-edition">
                <option value="">Select Edition</option>
                <option value="1st">1st Edition</option>
                <option value="2nd">2nd Edition</option>
                <option value="3rd">3rd Edition</option>
                <option value="4th">4th Edition</option>
                <option value="5th">5th Edition</option>
                <option value="Revised">Revised Edition</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editPublicationRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deletePublicationRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    booksRows.appendChild(newRow);
    setupPublicationRowEvents(newRow);
    updatePublicationCounts();

    showMessage('success', 'Book added successfully!');
}

// Research Paper Functions
function addResearchPaperRow() {
    const papersRows = document.getElementById('papersRows');
    const emptyRow = papersRows.querySelector('.empty-row');

    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = papersRows.querySelectorAll('tr:not(.empty-row)').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'publication-row';
    newRow.dataset.type = 'researchPaper';
    newRow.dataset.id = `paper-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control paper-title" placeholder="Paper title" required>
        </td>
        <td>
            <input type="text" class="form-control paper-authors" placeholder="Author names" required>
        </td>
        <td>
            <input type="text" class="form-control paper-journal" placeholder="Journal/Conference name" required>
        </td>
        <td>
            <input type="text" class="form-control paper-publisher" placeholder="Publisher">
        </td>
        <td>
            <input type="number" class="form-control paper-year" min="1900" max="${new Date().getFullYear()}" 
                   placeholder="YYYY" required>
        </td>
        <td>
            <input type="text" class="form-control paper-volume" placeholder="Vol. Issue">
        </td>
        <td>
            <input type="text" class="form-control paper-doi" placeholder="DOI/ISBN">
        </td>
        <td>
            <select class="form-control paper-indexing">
                <option value="">Select Indexing</option>
                <option value="SCI">SCI</option>
                <option value="SCIE">SCIE</option>
                <option value="SCOPUS">SCOPUS</option>
                <option value="UGC">UGC Care</option>
                <option value="Web of Science">Web of Science</option>
                <option value="PubMed">PubMed</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editPublicationRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deletePublicationRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    papersRows.appendChild(newRow);
    setupPublicationRowEvents(newRow);
    updatePublicationCounts();

    showMessage('success', 'Research paper added successfully!');
}

// Chapter Functions
function addChapterRow() {
    const chaptersRows = document.getElementById('chaptersRows');
    const emptyRow = chaptersRows.querySelector('.empty-row');

    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = chaptersRows.querySelectorAll('tr:not(.empty-row)').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'publication-row';
    newRow.dataset.type = 'chapter';
    newRow.dataset.id = `chapter-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control chapter-title" placeholder="Chapter title" required>
        </td>
        <td>
            <input type="text" class="form-control chapter-book" placeholder="Book title" required>
        </td>
        <td>
            <input type="text" class="form-control chapter-authors" placeholder="Author names" required>
        </td>
        <td>
            <input type="text" class="form-control chapter-publisher" placeholder="Publisher" required>
        </td>
        <td>
            <input type="number" class="form-control chapter-year" min="1900" max="${new Date().getFullYear()}" 
                   placeholder="YYYY" required>
        </td>
        <td>
            <input type="text" class="form-control chapter-pages" placeholder="e.g., 45-68">
        </td>
        <td>
            <input type="text" class="form-control chapter-isbn" placeholder="Book ISBN">
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editPublicationRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deletePublicationRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    chaptersRows.appendChild(newRow);
    setupPublicationRowEvents(newRow);
    updatePublicationCounts();

    showMessage('success', 'Book chapter added successfully!');
}

// Other Publications Functions
function addOtherPublicationRow() {
    const othersRows = document.getElementById('othersRows');
    const emptyRow = othersRows.querySelector('.empty-row');

    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = othersRows.querySelectorAll('tr:not(.empty-row)').length;
    const newRowId = rowCount + 1;

    // Get selected publication type
    const selectedType = document.querySelector('input[name="otherType"]:checked').value;
    let typeLabel = '';

    switch (selectedType) {
        case 'patent': typeLabel = 'Patent'; break;
        case 'copyright': typeLabel = 'Copyright'; break;
        case 'technicalReport': typeLabel = 'Technical Report'; break;
        case 'conferenceProceeding': typeLabel = 'Conference Proceeding'; break;
        default: typeLabel = 'Other';
    }

    const newRow = document.createElement('tr');
    newRow.className = 'publication-row';
    newRow.dataset.type = 'other';
    newRow.dataset.subtype = selectedType;
    newRow.dataset.id = `other-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <div class="publication-type-label">${typeLabel}</div>
            <input type="hidden" class="publication-type" value="${selectedType}">
        </td>
        <td>
            <input type="text" class="form-control other-title" placeholder="Title" required>
        </td>
        <td>
            <input type="text" class="form-control other-authors" placeholder="Author/Inventor names">
        </td>
        <td>
            <input type="text" class="form-control other-organization" placeholder="Organization/Publisher">
        </td>
        <td>
            <input type="number" class="form-control other-year" min="1900" max="${new Date().getFullYear()}" 
                   placeholder="YYYY" required>
        </td>
        <td>
            <input type="text" class="form-control other-reference" placeholder="Reference/Patent No.">
        </td>
        <td>
            <select class="form-control other-status">
                <option value="">Select Status</option>
                <option value="Published">Published</option>
                <option value="Accepted">Accepted</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Granted">Granted</option>
                <option value="Pending">Pending</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editPublicationRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deletePublicationRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    othersRows.appendChild(newRow);
    setupPublicationRowEvents(newRow);
    updatePublicationCounts();

    showMessage('success', `${typeLabel} added successfully!`);
}

// Edit and Delete Functions
function editPublicationRow(button) {
    const row = button.closest('.publication-row');
    const inputs = row.querySelectorAll('input:not([type="hidden"]), select');

    // Toggle edit mode
    const isEditing = row.classList.contains('editing');

    if (!isEditing) {
        // Enter edit mode
        row.classList.add('editing');
        inputs.forEach(input => {
            input.disabled = false;
            input.style.backgroundColor = '#fff9c4';
        });

        button.innerHTML = '<i class="bi bi-check"></i>';
        button.title = 'Save';
        button.classList.remove('btn-edit');
        button.classList.add('btn-save');

        showMessage('info', 'Editing mode enabled. Make your changes and click Save.');
    } else {
        // Save changes
        row.classList.remove('editing');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.backgroundColor = '';
        });

        button.innerHTML = '<i class="bi bi-pencil"></i>';
        button.title = 'Edit';
        button.classList.remove('btn-save');
        button.classList.add('btn-edit');

        // Save to storage
        savePublicationsToStorage();
        updatePublicationCounts();

        showMessage('success', 'Changes saved successfully!');
    }
}

function deletePublicationRow(button) {
    const row = button.closest('.publication-row');
    const tableBody = row.parentNode;
    const publicationType = row.dataset.type;

    if (confirm('Are you sure you want to delete this publication?')) {
        row.remove();

        // Update serial numbers
        updateSerialNumbers(tableBody);

        // Show empty state if no rows left
        if (tableBody.querySelectorAll('tr:not(.empty-row)').length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';

            let emptyMessage = '';
            switch (publicationType) {
                case 'book':
                    emptyMessage = 'No books added yet. Click "Add Book" to get started.';
                    break;
                case 'researchPaper':
                    emptyMessage = 'No research papers added yet. Click "Add Research Paper" to get started.';
                    break;
                case 'chapter':
                    emptyMessage = 'No book chapters added yet. Click "Add Chapter" to get started.';
                    break;
                case 'other':
                    emptyMessage = 'No other publications added yet. Click "Add Publication" to get started.';
                    break;
            }

            emptyRow.innerHTML = `
                <td colspan="${tableBody.parentNode.querySelectorAll('th').length}" class="text-center">
                    <div class="empty-state">
                        <i class="bi bi-${getIconForType(publicationType)}"></i>
                        <p>${emptyMessage}</p>
                    </div>
                </td>
            `;

            tableBody.appendChild(emptyRow);
        }

        // Save to storage
        savePublicationsToStorage();
        updatePublicationCounts();

        showMessage('info', 'Publication deleted successfully!');
    }
}

function getIconForType(type) {
    switch (type) {
        case 'book': return 'book';
        case 'researchPaper': return 'file-earmark-text';
        case 'chapter': return 'file-earmark';
        case 'other': return 'files';
        default: return 'file-earmark';
    }
}

function updateSerialNumbers(tableBody) {
    const rows = tableBody.querySelectorAll('tr:not(.empty-row)');
    rows.forEach((row, index) => {
        const serialCell = row.querySelector('.serial-no');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

// File Upload Functions
function initFileUploads() {
    // Setup book upload zone
    const bookUploadZone = document.getElementById('bookUploadZone');
    const bookFileInput = document.getElementById('bookDocuments');

    if (bookUploadZone && bookFileInput) {
        // Drag and drop functionality
        bookUploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        bookUploadZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        bookUploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                bookFileInput.files = e.dataTransfer.files;
                handleBookUpload({ target: bookFileInput });
            }
        });

        // Click to upload
        bookUploadZone.addEventListener('click', function () {
            bookFileInput.click();
        });
    }
}

function handleBookUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesList = document.getElementById('booksFilesList');
    let uploadedCount = 0;

    // Clear empty state if exists
    const emptyState = filesList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!validateFile(file, ['pdf', 'jpg', 'jpeg', 'png'], 10)) {
            continue;
        }

        uploadedCount++;

        // Create file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = file.name;

        // Determine file icon
        let fileIcon = 'bi-file-earmark';
        let iconColor = '#1e3c72';

        if (file.type === 'application/pdf') {
            fileIcon = 'bi-file-earmark-pdf';
            iconColor = '#dc3545';
        } else if (file.type.includes('image')) {
            fileIcon = 'bi-file-earmark-image';
            iconColor = '#28a745';
        }

        fileItem.innerHTML = `
            <i class="bi ${fileIcon}" style="color: ${iconColor};"></i>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <button type="button" class="btn-view-file" onclick="viewUploadedFile('${file.name}')" title="View">
                    <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn-delete-file" onclick="deleteUploadedFile(this)" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        filesList.appendChild(fileItem);
    }

    if (uploadedCount > 0) {
        showMessage('success', `${uploadedCount} book document(s) uploaded successfully!`);
    }

    // Reset file input
    event.target.value = '';
}

function handleBulkUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!validateFile(file, ['xlsx', 'xls', 'csv'], 5)) {
        return;
    }

    // Show loading
    const uploadBox = document.getElementById('bulkUploadBox');
    const originalContent = uploadBox.innerHTML;

    uploadBox.innerHTML = `
        <div class="upload-content">
            <i class="bi bi-hourglass-split"></i>
            <h5>Processing File...</h5>
            <p>Please wait while we import your publications</p>
        </div>
    `;

    // Simulate file processing
    setTimeout(() => {
        // In real application, this would parse the Excel/CSV file
        // and populate the tables with the data

        // For demo purposes, we'll just show success message
        uploadBox.innerHTML = `
            <div class="upload-content">
                <i class="bi bi-check-circle" style="color: #28a745;"></i>
                <h5>File Imported Successfully!</h5>
                <p>10 publications imported from ${file.name}</p>
                <p class="file-size">${formatFileSize(file.size)}</p>
            </div>
        `;

        showMessage('success', 'Bulk upload completed! Publications imported successfully.');

        // Reset after 3 seconds
        setTimeout(() => {
            uploadBox.innerHTML = originalContent;
            event.target.value = '';
        }, 3000);

    }, 2000);
}

// File utility functions (from Step D)
function validateFile(file, allowedExtensions, maxSizeMB) {
    const maxSize = maxSizeMB * 1024 * 1024;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (file.size > maxSize) {
        showMessage('error', `File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`);
        return false;
    }

    if (!allowedExtensions.includes(fileExtension)) {
        showMessage('error', `File "${file.name}" has unsupported format. Allowed: ${allowedExtensions.join(', ')}`);
        return false;
    }

    return true;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function viewUploadedFile(fileName) {
    showMessage('info', `Preview would open for: ${fileName}`);
    // In real app, open file preview modal
}

function deleteUploadedFile(button) {
    const fileItem = button.closest('.file-item');
    const fileName = fileItem.dataset.fileName;

    fileItem.remove();

    // Check if files list is empty
    const filesList = fileItem.parentNode;
    if (filesList.children.length === 0) {
        filesList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-folder-x"></i>
                <p>No book documents uploaded yet</p>
            </div>
        `;
    }

    showMessage('info', `Document "${fileName}" deleted`);
}

// Publication Summary Functions
function updatePublicationCounts() {
    // Count books
    const booksCount = document.querySelectorAll('#booksRows tr:not(.empty-row)').length;
    document.getElementById('booksCount').textContent = booksCount;
    document.getElementById('summaryBooks').textContent = booksCount;

    // Count research papers
    const papersCount = document.querySelectorAll('#papersRows tr:not(.empty-row)').length;
    document.getElementById('papersCount').textContent = papersCount;
    document.getElementById('summaryPapers').textContent = papersCount;

    // Count chapters
    const chaptersCount = document.querySelectorAll('#chaptersRows tr:not(.empty-row)').length;
    document.getElementById('chaptersCount').textContent = chaptersCount;
    document.getElementById('summaryChapters').textContent = chaptersCount;

    // Count other publications
    const othersCount = document.querySelectorAll('#othersRows tr:not(.empty-row)').length;
    document.getElementById('othersCount').textContent = othersCount;
    document.getElementById('summaryOthers').textContent = othersCount;

    // Update total
    const total = booksCount + papersCount + chaptersCount + othersCount;
    document.getElementById('totalPublications').textContent = total;
}

function updatePublicationSummary() {
    updatePublicationCounts();
}

// Data Storage Functions
function savePublicationsToStorage() {
    const publicationsData = {
        books: collectPublications('book'),
        researchPapers: collectPublications('researchPaper'),
        chapters: collectPublications('chapter'),
        others: collectPublications('other')
    };

    // Save to localStorage
    localStorage.setItem('publicationsData', JSON.stringify(publicationsData));
}

function collectPublications(type) {
    const publications = [];
    const rows = document.querySelectorAll(`.publication-row[data-type="${type}"]`);

    rows.forEach(row => {
        const publication = {
            id: row.dataset.id,
            type: type
        };

        // Collect data based on type
        if (type === 'book') {
            publication.title = row.querySelector('.book-title').value;
            publication.authors = row.querySelector('.book-authors').value;
            publication.publisher = row.querySelector('.book-publisher').value;
            publication.year = row.querySelector('.book-year').value;
            publication.isbn = row.querySelector('.book-isbn').value;
            publication.edition = row.querySelector('.book-edition').value;
        } else if (type === 'researchPaper') {
            publication.title = row.querySelector('.paper-title').value;
            publication.authors = row.querySelector('.paper-authors').value;
            publication.journal = row.querySelector('.paper-journal').value;
            publication.publisher = row.querySelector('.paper-publisher').value;
            publication.year = row.querySelector('.paper-year').value;
            publication.volume = row.querySelector('.paper-volume').value;
            publication.doi = row.querySelector('.paper-doi').value;
            publication.indexing = row.querySelector('.paper-indexing').value;
        } else if (type === 'chapter') {
            publication.title = row.querySelector('.chapter-title').value;
            publication.book = row.querySelector('.chapter-book').value;
            publication.authors = row.querySelector('.chapter-authors').value;
            publication.publisher = row.querySelector('.chapter-publisher').value;
            publication.year = row.querySelector('.chapter-year').value;
            publication.pages = row.querySelector('.chapter-pages').value;
            publication.isbn = row.querySelector('.chapter-isbn').value;
        } else if (type === 'other') {
            publication.subtype = row.dataset.subtype;
            publication.title = row.querySelector('.other-title').value;
            publication.authors = row.querySelector('.other-authors').value;
            publication.organization = row.querySelector('.other-organization').value;
            publication.year = row.querySelector('.other-year').value;
            publication.reference = row.querySelector('.other-reference').value;
            publication.status = row.querySelector('.other-status').value;
        }

        publications.push(publication);
    });

    return publications;
}

function loadSavedPublications() {
    const savedData = localStorage.getItem('publicationsData');
    if (!savedData) return;

    try {
        const publicationsData = JSON.parse(savedData);

        // Clear existing rows
        document.querySelectorAll('.publication-row').forEach(row => row.remove());

        // Load books
        if (publicationsData.books && publicationsData.books.length > 0) {
            const booksRows = document.getElementById('booksRows');
            const emptyRow = booksRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            publicationsData.books.forEach((book, index) => {
                addBookFromData(book, index + 1);
            });
        }

        // Load research papers
        if (publicationsData.researchPapers && publicationsData.researchPapers.length > 0) {
            const papersRows = document.getElementById('papersRows');
            const emptyRow = papersRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            publicationsData.researchPapers.forEach((paper, index) => {
                addResearchPaperFromData(paper, index + 1);
            });
        }

        // Load chapters
        if (publicationsData.chapters && publicationsData.chapters.length > 0) {
            const chaptersRows = document.getElementById('chaptersRows');
            const emptyRow = chaptersRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            publicationsData.chapters.forEach((chapter, index) => {
                addChapterFromData(chapter, index + 1);
            });
        }

        // Load other publications
        if (publicationsData.others && publicationsData.others.length > 0) {
            const othersRows = document.getElementById('othersRows');
            const emptyRow = othersRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            publicationsData.others.forEach((other, index) => {
                addOtherFromData(other, index + 1);
            });
        }

        updatePublicationCounts();
        showMessage('success', 'Previously saved publications loaded successfully!');

    } catch (error) {
        console.error('Error loading publications:', error);
        showMessage('error', 'Error loading saved publications');
    }
}

// Helper functions to add publications from data
function addBookFromData(book, serialNo) {
    const booksRows = document.getElementById('booksRows');

    const newRow = document.createElement('tr');
    newRow.className = 'publication-row';
    newRow.dataset.type = 'book';
    newRow.dataset.id = book.id || `book-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${serialNo}</td>
        <td>
            <input type="text" class="form-control book-title" value="${book.title || ''}" required>
        </td>
        <td>
            <input type="text" class="form-control book-authors" value="${book.authors || ''}" required>
        </td>
        <td>
            <input type="text" class="form-control book-publisher" value="${book.publisher || ''}" required>
        </td>
        <td>
            <input type="number" class="form-control book-year" value="${book.year || ''}" 
                   min="1900" max="${new Date().getFullYear()}" required>
        </td>
        <td>
            <input type="text" class="form-control book-isbn" value="${book.isbn || ''}">
        </td>
        <td>
            <select class="form-control book-edition">
                <option value="">Select Edition</option>
                <option value="1st" ${book.edition === '1st' ? 'selected' : ''}>1st Edition</option>
                <option value="2nd" ${book.edition === '2nd' ? 'selected' : ''}>2nd Edition</option>
                <option value="3rd" ${book.edition === '3rd' ? 'selected' : ''}>3rd Edition</option>
                <option value="4th" ${book.edition === '4th' ? 'selected' : ''}>4th Edition</option>
                <option value="5th" ${book.edition === '5th' ? 'selected' : ''}>5th Edition</option>
                <option value="Revised" ${book.edition === 'Revised' ? 'selected' : ''}>Revised Edition</option>
                <option value="Other" ${book.edition === 'Other' ? 'selected' : ''}>Other</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editPublicationRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deletePublicationRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    booksRows.appendChild(newRow);
    setupPublicationRowEvents(newRow);
}

// Similar functions for other publication types (researchPaper, chapter, other)
// These would follow the same pattern as addBookFromData

// Form Submission
function setupPublicationForm() {
    const publicationForm = document.getElementById('publicationDetailsForm');

    if (publicationForm) {
        publicationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validatePublicationForm()) {
                // Show loading
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';
                submitBtn.disabled = true;

                // Collect form data
                const formData = collectPublicationFormData();
                console.log('Publication Data:', formData);

                // Save to localStorage
                savePublicationsToStorage();

                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    showMessage('success', 'Publication details saved successfully!');

                    // Move to next step (F)
                    setTimeout(() => {
                        showStep('F');
                    }, 1500);

                }, 2000);
            }
        });
    }
}

function validatePublicationForm() {
    let isValid = true;

    // Check if at least one publication is added
    const totalPublications = parseInt(document.getElementById('totalPublications').textContent);

    if (totalPublications === 0) {
        showMessage('warning', 'Please add at least one publication before proceeding.');
        return false;
    }

    // Validate all publication rows
    const publicationRows = document.querySelectorAll('.publication-row');

    for (const row of publicationRows) {
        const requiredInputs = row.querySelectorAll('[required]');

        for (const input of requiredInputs) {
            if (!input.value.trim()) {
                showMessage('error', 'Please fill all required fields in the publication tables.');
                input.focus();
                isValid = false;
                break;
            }
        }

        if (!isValid) break;

        // Validate year fields
        const yearInput = row.querySelector('input[type="number"]');
        if (yearInput && yearInput.value) {
            const year = parseInt(yearInput.value);
            const currentYear = new Date().getFullYear();

            if (year < 1900 || year > currentYear) {
                showMessage('error', `Please enter a valid year (1900-${currentYear}) for all publications.`);
                yearInput.focus();
                isValid = false;
                break;
            }
        }
    }

    return isValid;
}

function collectPublicationFormData() {
    return {
        books: collectPublications('book'),
        researchPapers: collectPublications('researchPaper'),
        chapters: collectPublications('chapter'),
        others: collectPublications('other'),
        summary: {
            totalBooks: document.getElementById('summaryBooks').textContent,
            totalPapers: document.getElementById('summaryPapers').textContent,
            totalChapters: document.getElementById('summaryChapters').textContent,
            totalOthers: document.getElementById('summaryOthers').textContent,
            totalPublications: document.getElementById('totalPublications').textContent
        }
    };
}

// Clear Form
function clearPublicationForm() {
    if (!confirm('Are you sure you want to clear all publication details? This action cannot be undone.')) {
        return;
    }

    // Clear all publication rows
    document.querySelectorAll('.publication-row').forEach(row => row.remove());

    // Restore empty states
    const tables = ['books', 'papers', 'chapters', 'others'];

    tables.forEach(tableName => {
        const tableId = tableName === 'papers' ? 'papersRows' :
            tableName === 'chapters' ? 'chaptersRows' :
                tableName === 'others' ? 'othersRows' : 'booksRows';

        const tableBody = document.getElementById(tableId);

        let message = '';
        let icon = '';

        switch (tableName) {
            case 'books':
                message = 'No books added yet. Click "Add Book" to get started.';
                icon = 'book';
                break;
            case 'papers':
                message = 'No research papers added yet. Click "Add Research Paper" to get started.';
                icon = 'file-earmark-text';
                break;
            case 'chapters':
                message = 'No book chapters added yet. Click "Add Chapter" to get started.';
                icon = 'file-earmark';
                break;
            case 'others':
                message = 'No other publications added yet. Click "Add Publication" to get started.';
                icon = 'files';
                break;
        }

        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="${tableBody.parentNode.querySelectorAll('th').length}" class="text-center">
                    <div class="empty-state">
                        <i class="bi bi-${icon}"></i>
                        <p>${message}</p>
                    </div>
                </td>
            </tr>
        `;
    });

    // Clear uploaded files
    const filesLists = ['booksFilesList'];
    filesLists.forEach(listId => {
        const list = document.getElementById(listId);
        if (list) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-folder-x"></i>
                    <p>No documents uploaded yet</p>
                </div>
            `;
        }
    });

    // Clear bulk upload
    const bulkUpload = document.getElementById('bulkUpload');
    if (bulkUpload) bulkUpload.value = '';

    // Update summary
    updatePublicationCounts();

    // Clear localStorage
    localStorage.removeItem('publicationsData');

    showMessage('success', 'All publication details cleared successfully!');
}

// Template Download
function downloadTemplate() {
    showMessage('info', 'Template download would start. This is a demo feature.');
    // In real app, this would trigger download of a template Excel/CSV file
}

// Show Step E when needed
function showStepE() {
    showStep('E');
    initStepE();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // When step E is shown, initialize it
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const stepE = document.getElementById('stepE');
                if (stepE && stepE.classList.contains('active')) {
                    initStepE();
                }
            }
        });
    });

    const stepE = document.getElementById('stepE');
    if (stepE) {
        observer.observe(stepE, { attributes: true });
    }
});
// Step F - Professional Experience JavaScript

// Global variables
let experienceData = {
    experiences: [],
    awards: [],
    memberships: [],
    projects: [],
    otherInfo: '',
    documents: []
};

// Initialize Step F
function initStepF() {
    console.log('Initializing Step F - Professional Experience');

    // Initialize experience table
    initExperienceTable();

    // Initialize additional info tabs
    initAdditionalInfoTabs();

    // Initialize character counter
    initCharCounter();

    // Initialize file uploads
    initFileUploads();

    // Setup form submission
    setupProfessionalForm();

    // Load saved data
    loadSavedProfessionalData();

    // Update initial calculations
    updateExperienceSummary();
}

// Experience Table Functions
function initExperienceTable() {
    // Add event listeners to existing rows
    document.querySelectorAll('.experience-row').forEach(row => {
        setupExperienceRowEvents(row);
    });

    // Calculate initial durations
    document.querySelectorAll('.experience-row').forEach(row => {
        calculateExperienceDuration(row.querySelector('.from-date'));
    });
}

function setupExperienceRowEvents(row) {
    // Date change events
    const fromInput = row.querySelector('.from-date');
    const toInput = row.querySelector('.to-date');

    if (fromInput) {
        fromInput.addEventListener('change', function () {
            calculateExperienceDuration(this);
        });
    }

    if (toInput) {
        toInput.addEventListener('change', function () {
            calculateExperienceDuration(this);
        });
    }

    // Admin experience change
    const adminInput = row.querySelector('.admin-experience');
    if (adminInput) {
        adminInput.addEventListener('change', function () {
            updateTotalAdminExperience();
        });
    }
}

function calculateExperienceDuration(inputElement) {
    const row = inputElement.closest('.experience-row');
    const fromInput = row.querySelector('.from-date');
    const toInput = row.querySelector('.to-date');
    const durationInput = row.querySelector('.duration-display');

    const fromDate = fromInput.value;
    const toDate = toInput.value;

    if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Check if dates are valid
        if (to < from) {
            durationInput.value = 'Invalid Dates';
            durationInput.style.color = '#dc3545';
            updateExperienceSummary();
            return;
        }

        // Calculate duration
        const duration = calculateDateDifference(from, to);
        durationInput.value = duration;
        durationInput.style.color = '#28a745';

        // Update summary
        updateExperienceSummary();
    } else {
        durationInput.value = '';
        durationInput.style.color = '#495057';
        updateExperienceSummary();
    }
}

function calculateDateDifference(from, to) {
    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();

    // Adjust negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Adjust negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years} Years ${months} Months ${days} Days`;
}

function addExperienceRow() {
    const experienceRows = document.getElementById('experienceRows');
    const rowCount = document.querySelectorAll('.experience-row').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'experience-row';
    newRow.dataset.id = `exp-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control institution-name" placeholder="Institution name" required>
        </td>
        <td>
            <input type="text" class="form-control post-held" placeholder="Post held" required>
        </td>
        <td>
            <input type="date" class="form-control from-date date-picker">
        </td>
        <td>
            <input type="date" class="form-control to-date date-picker">
        </td>
        <td>
            <input type="text" class="form-control duration-display" readonly placeholder="Auto calculated">
        </td>
        <td>
            <input type="number" class="form-control admin-experience" min="0" step="0.1" 
                   placeholder="Years" onchange="updateTotalAdminExperience()">
        </td>
        <td>
            <select class="form-control nature-of-work">
                <option value="">Select Nature</option>
                <option value="Teaching">Teaching</option>
                <option value="Research">Research</option>
                <option value="Administration">Administration</option>
                <option value="Technical">Technical</option>
                <option value="Consultancy">Consultancy</option>
                <option value="Industry">Industry</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control remarks" placeholder="Any remarks">
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-delete" onclick="deleteExperienceRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    experienceRows.appendChild(newRow);
    setupExperienceRowEvents(newRow);
    updateSerialNumbers();

    showMessage('success', 'Professional experience added successfully!');
}

function deleteExperienceRow(button) {
    const row = button.closest('.experience-row');
    const rowCount = document.querySelectorAll('.experience-row').length;

    // Don't remove if only one row remains
    if (rowCount <= 1) {
        showMessage('warning', 'At least one professional experience is required');
        return;
    }

    if (row) {
        if (confirm('Are you sure you want to delete this experience?')) {
            row.remove();
            updateSerialNumbers();
            updateExperienceSummary();
            updateTotalAdminExperience();

            showMessage('info', 'Experience deleted successfully');
        }
    }
}

function updateSerialNumbers() {
    const rows = document.querySelectorAll('.experience-row');
    rows.forEach((row, index) => {
        const serialCell = row.querySelector('.serial-no');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

// Experience Summary Functions
function updateExperienceSummary() {
    let totalYears = 0;
    let totalMonths = 0;
    let totalDays = 0;

    // Calculate total experience from all rows
    document.querySelectorAll('.experience-row').forEach(row => {
        const duration = row.querySelector('.duration-display').value;

        if (duration && duration !== 'Invalid Dates') {
            // Parse duration string "X Years Y Months Z Days"
            const matches = duration.match(/(\d+)\s*Years\s*(\d+)\s*Months\s*(\d+)\s*Days/);
            if (matches && matches.length === 4) {
                totalYears += parseInt(matches[1]);
                totalMonths += parseInt(matches[2]);
                totalDays += parseInt(matches[3]);
            }
        }
    });

    // Normalize days and months
    totalMonths += Math.floor(totalDays / 30);
    totalDays = totalDays % 30;

    totalYears += Math.floor(totalMonths / 12);
    totalMonths = totalMonths % 12;

    // Update total professional experience display
    const totalExpDisplay = document.getElementById('totalProfessionalExperience');
    if (totalExpDisplay) {
        totalExpDisplay.textContent = `${totalYears} Years ${totalMonths} Months ${totalDays} Days`;
    }

    // Update total institutions count
    const totalInstitutions = document.querySelectorAll('.experience-row').length;
    document.getElementById('totalInstitutions').textContent = totalInstitutions;
}

function updateTotalAdminExperience() {
    let totalAdminYears = 0;

    // Calculate total administrative experience
    document.querySelectorAll('.experience-row').forEach(row => {
        const adminInput = row.querySelector('.admin-experience');
        if (adminInput && adminInput.value) {
            totalAdminYears += parseFloat(adminInput.value) || 0;
        }
    });

    // Update display
    const totalAdminDisplay = document.getElementById('totalAdminExperience');
    if (totalAdminDisplay) {
        totalAdminDisplay.textContent = `${totalAdminYears.toFixed(1)} Years`;
    }
}

// Additional Information Functions
function initAdditionalInfoTabs() {
    // Set first tab as active
    const firstTab = document.querySelector('.info-type-btn');
    const firstContent = document.getElementById('awardsContent');

    if (firstTab && firstContent) {
        firstTab.classList.add('active');
        firstContent.classList.add('active');
    }
}

function switchInfoType(type) {
    // Remove active class from all tabs
    document.querySelectorAll('.info-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.info-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    const tabBtn = document.querySelector(`.info-type-btn[data-type="${type}"]`);
    const tabContent = document.getElementById(`${type}Content`);

    if (tabBtn && tabContent) {
        tabBtn.classList.add('active');
        tabContent.classList.add('active');
    }
}

// Awards Functions
function addAward() {
    const awardsRows = document.getElementById('awardsRows');
    const emptyRow = awardsRows.querySelector('.empty-row');

    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = awardsRows.querySelectorAll('tr').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'award-row';
    newRow.dataset.id = `award-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control award-name" placeholder="Award name" required>
        </td>
        <td>
            <input type="text" class="form-control awarding-org" placeholder="Organization" required>
        </td>
        <td>
            <input type="number" class="form-control award-year" min="1900" max="${new Date().getFullYear()}" 
                   placeholder="YYYY" required>
        </td>
        <td>
            <select class="form-control award-level">
                <option value="">Select Level</option>
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="State">State</option>
                <option value="University">University</option>
                <option value="Department">Department</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td>
            <textarea class="form-control award-desc" placeholder="Description" rows="2"></textarea>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editInfoRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deleteInfoRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    awardsRows.appendChild(newRow);
    setupInfoRowEvents(newRow);
    updateAwardSerialNumbers();

    showMessage('success', 'Award added successfully!');
}

// Memberships Functions
function addMembership() {
    const membershipsRows = document.getElementById('membershipsRows');
    const emptyRow = membershipsRows.querySelector('.empty-row');

    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = membershipsRows.querySelectorAll('tr').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'membership-row';
    newRow.dataset.id = `membership-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control org-name" placeholder="Organization name" required>
        </td>
        <td>
            <select class="form-control membership-type">
                <option value="">Select Type</option>
                <option value="Life Member">Life Member</option>
                <option value="Annual Member">Annual Member</option>
                <option value="Fellow">Fellow</option>
                <option value="Associate">Associate</option>
                <option value="Student">Student Member</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control membership-id" placeholder="Membership ID">
        </td>
        <td>
            <input type="text" class="form-control validity" placeholder="e.g., 2023-2025">
        </td>
        <td>
            <select class="form-control membership-status">
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Renewal Pending">Renewal Pending</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editInfoRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deleteInfoRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    membershipsRows.appendChild(newRow);
    setupInfoRowEvents(newRow);
    updateMembershipSerialNumbers();

    showMessage('success', 'Membership added successfully!');
}

// Projects Functions
function addProject() {
    const projectsRows = document.getElementById('projectsRows');
    const emptyRow = projectsRows.querySelector('.empty-row');

    if (emptyRow) {
        emptyRow.remove();
    }

    const rowCount = projectsRows.querySelectorAll('tr').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'project-row';
    newRow.dataset.id = `project-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control project-title" placeholder="Project title" required>
        </td>
        <td>
            <input type="text" class="form-control funding-agency" placeholder="Funding agency" required>
        </td>
        <td>
            <select class="form-control project-role">
                <option value="">Select Role</option>
                <option value="Principal Investigator">Principal Investigator</option>
                <option value="Co-Investigator">Co-Investigator</option>
                <option value="Team Member">Team Member</option>
                <option value="Consultant">Consultant</option>
                <option value="Advisor">Advisor</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control project-duration" placeholder="e.g., 2 years">
        </td>
        <td>
            <input type="text" class="form-control project-amount" placeholder="Amount">
        </td>
        <td>
            <select class="form-control project-status">
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-edit" onclick="editInfoRow(this)" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn-action btn-delete" onclick="deleteInfoRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    projectsRows.appendChild(newRow);
    setupInfoRowEvents(newRow);
    updateProjectSerialNumbers();

    showMessage('success', 'Project added successfully!');
}

// Common Info Row Functions
function setupInfoRowEvents(row) {
    // Add change event listeners
    const inputs = row.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            saveProfessionalDataToStorage();
        });
    });
}

function editInfoRow(button) {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input:not([type="hidden"]), select, textarea');

    // Toggle edit mode
    const isEditing = row.classList.contains('editing');

    if (!isEditing) {
        // Enter edit mode
        row.classList.add('editing');
        inputs.forEach(input => {
            input.disabled = false;
            input.style.backgroundColor = '#fff9c4';
        });

        button.innerHTML = '<i class="bi bi-check"></i>';
        button.title = 'Save';
        button.classList.remove('btn-edit');
        button.classList.add('btn-save');
    } else {
        // Save changes
        row.classList.remove('editing');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.backgroundColor = '';
        });

        button.innerHTML = '<i class="bi bi-pencil"></i>';
        button.title = 'Edit';
        button.classList.remove('btn-save');
        button.classList.add('btn-edit');

        // Save to storage
        saveProfessionalDataToStorage();
    }
}

function deleteInfoRow(button) {
    const row = button.closest('tr');
    const tableBody = row.parentNode;
    const rowType = row.className.split('-')[0]; // award, membership, or project

    if (confirm('Are you sure you want to delete this entry?')) {
        row.remove();

        // Update serial numbers
        if (rowType === 'award') {
            updateAwardSerialNumbers();
        } else if (rowType === 'membership') {
            updateMembershipSerialNumbers();
        } else if (rowType === 'project') {
            updateProjectSerialNumbers();
        }

        // Show empty state if no rows left
        if (tableBody.querySelectorAll('tr').length === 0) {
            let emptyMessage = '';
            let icon = '';

            if (rowType === 'award') {
                emptyMessage = 'No awards added yet';
                icon = 'award';
            } else if (rowType === 'membership') {
                emptyMessage = 'No memberships added yet';
                icon = 'people';
            } else if (rowType === 'project') {
                emptyMessage = 'No projects added yet';
                icon = 'diagram-3';
            }

            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `
                <td colspan="${tableBody.parentNode.querySelectorAll('th').length}" class="text-center">
                    <div class="empty-state">
                        <i class="bi bi-${icon}"></i>
                        <p>${emptyMessage}</p>
                    </div>
                </td>
            `;

            tableBody.appendChild(emptyRow);
        }

        // Save to storage
        saveProfessionalDataToStorage();

        showMessage('info', 'Entry deleted successfully!');
    }
}

function updateAwardSerialNumbers() {
    const rows = document.querySelectorAll('.award-row');
    rows.forEach((row, index) => {
        const serialCell = row.querySelector('.serial-no');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

function updateMembershipSerialNumbers() {
    const rows = document.querySelectorAll('.membership-row');
    rows.forEach((row, index) => {
        const serialCell = row.querySelector('.serial-no');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

function updateProjectSerialNumbers() {
    const rows = document.querySelectorAll('.project-row');
    rows.forEach((row, index) => {
        const serialCell = row.querySelector('.serial-no');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

// Character Counter
function initCharCounter() {
    const otherInfoTextarea = document.getElementById('otherInfo');
    const charCountDisplay = document.getElementById('charCount');

    if (otherInfoTextarea && charCountDisplay) {
        // Update on input
        otherInfoTextarea.addEventListener('input', function () {
            const charCount = this.value.length;
            charCountDisplay.textContent = charCount;

            // Change color if approaching limit
            if (charCount > 1800) {
                charCountDisplay.style.color = '#dc3545';
            } else if (charCount > 1500) {
                charCountDisplay.style.color = '#ffc107';
            } else {
                charCountDisplay.style.color = '#28a745';
            }

            // Enforce max length
            if (charCount > 2000) {
                this.value = this.value.substring(0, 2000);
                charCountDisplay.textContent = 2000;
                showMessage('warning', 'Maximum 2000 characters allowed');
            }

            saveProfessionalDataToStorage();
        });

        // Initial count
        charCountDisplay.textContent = otherInfoTextarea.value.length;
    }
}

// File Upload Functions
function initFileUploads() {
    // Setup experience upload zone
    const experienceUploadZone = document.getElementById('experienceUploadZone');
    const experienceFileInput = document.getElementById('experienceDocuments');

    if (experienceUploadZone && experienceFileInput) {
        // Drag and drop
        experienceUploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        experienceUploadZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        experienceUploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                experienceFileInput.files = e.dataTransfer.files;
                handleExperienceUpload({ target: experienceFileInput });
            }
        });

        // Click to upload
        experienceUploadZone.addEventListener('click', function () {
            experienceFileInput.click();
        });
    }

    // Setup other upload zone
    const otherUploadZone = document.getElementById('otherUploadZone');
    const otherFileInput = document.getElementById('otherDocuments');

    if (otherUploadZone && otherFileInput) {
        otherUploadZone.addEventListener('click', function () {
            otherFileInput.click();
        });
    }
}

function handleExperienceUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesList = document.getElementById('experienceFilesList');
    let uploadedCount = 0;

    // Clear empty state if exists
    const emptyState = filesList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!validateFile(file, ['pdf', 'jpg', 'jpeg', 'png'], 10)) {
            continue;
        }

        uploadedCount++;

        // Create file item
        const fileItem = createFileItem(file, 'experience');
        filesList.appendChild(fileItem);
    }

    if (uploadedCount > 0) {
        showMessage('success', `${uploadedCount} certificate(s) uploaded successfully!`);
    }

    // Reset file input
    event.target.value = '';
}

function handleOtherUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesContainer = document.getElementById('otherFilesContainer');
    let uploadedCount = 0;

    // Clear empty state if exists
    const emptyState = filesContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!validateFile(file, ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'], 10)) {
            continue;
        }

        uploadedCount++;

        // Create file item
        const fileItem = createFileItem(file, 'other');
        filesContainer.appendChild(fileItem);
    }

    if (uploadedCount > 0) {
        showMessage('success', `${uploadedCount} document(s) uploaded successfully!`);
    }

    // Reset file input
    event.target.value = '';
}

function createFileItem(file, type) {
    // Determine file icon
    let fileIcon = 'bi-file-earmark';
    let iconColor = '#1e3c72';

    if (file.type === 'application/pdf') {
        fileIcon = 'bi-file-earmark-pdf';
        iconColor = '#dc3545';
    } else if (file.type.includes('image')) {
        fileIcon = 'bi-file-earmark-image';
        iconColor = '#28a745';
    } else if (file.type.includes('document') || file.type.includes('msword')) {
        fileIcon = 'bi-file-earmark-word';
        iconColor = '#2b579a';
    }

    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.dataset.fileName = file.name;
    fileItem.dataset.fileType = type;

    fileItem.innerHTML = `
        <i class="bi ${fileIcon}" style="color: ${iconColor};"></i>
        <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <div class="file-actions">
            <button type="button" class="btn-view-file" onclick="viewFile('${file.name}', '${type}')" title="View">
                <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn-delete-file" onclick="deleteFile(this, '${type}')" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

    return fileItem;
}

function viewFile(fileName, type) {
    showMessage('info', `Preview would open for: ${fileName} (${type} file)`);
}

function deleteFile(button, type) {
    const fileItem = button.closest('.file-item');
    const fileName = fileItem.dataset.fileName;

    fileItem.remove();

    // Check if files list is empty
    const filesContainer = button.closest('.files-list');
    if (filesContainer.children.length === 0) {
        let emptyMessage = type === 'experience'
            ? 'No certificates uploaded yet'
            : 'No additional documents';

        filesContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-file-earmark"></i>
                <p>${emptyMessage}</p>
            </div>
        `;
    }

    showMessage('info', `File "${fileName}" deleted`);
}

// File utility functions (from previous steps)
function validateFile(file, allowedExtensions, maxSizeMB) {
    const maxSize = maxSizeMB * 1024 * 1024;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (file.size > maxSize) {
        showMessage('error', `File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`);
        return false;
    }

    if (!allowedExtensions.includes(fileExtension)) {
        showMessage('error', `File "${file.name}" has unsupported format. Allowed: ${allowedExtensions.join(', ')}`);
        return false;
    }

    return true;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Data Storage Functions
function saveProfessionalDataToStorage() {
    const professionalData = {
        experiences: collectExperiences(),
        awards: collectAwards(),
        memberships: collectMemberships(),
        projects: collectProjects(),
        otherInfo: document.getElementById('otherInfo').value
    };

    // Save to localStorage
    localStorage.setItem('professionalData', JSON.stringify(professionalData));
}

function collectExperiences() {
    const experiences = [];

    document.querySelectorAll('.experience-row').forEach(row => {
        const experience = {
            id: row.dataset.id || `exp-${Date.now()}`,
            institution: row.querySelector('.institution-name').value,
            post: row.querySelector('.post-held').value,
            fromDate: row.querySelector('.from-date').value,
            toDate: row.querySelector('.to-date').value,
            duration: row.querySelector('.duration-display').value,
            adminExperience: row.querySelector('.admin-experience').value,
            natureOfWork: row.querySelector('.nature-of-work').value,
            remarks: row.querySelector('.remarks').value
        };

        experiences.push(experience);
    });

    return experiences;
}

function collectAwards() {
    const awards = [];

    document.querySelectorAll('.award-row').forEach(row => {
        const award = {
            id: row.dataset.id || `award-${Date.now()}`,
            name: row.querySelector('.award-name').value,
            organization: row.querySelector('.awarding-org').value,
            year: row.querySelector('.award-year').value,
            level: row.querySelector('.award-level').value,
            description: row.querySelector('.award-desc').value
        };

        awards.push(award);
    });

    return awards;
}

function collectMemberships() {
    const memberships = [];

    document.querySelectorAll('.membership-row').forEach(row => {
        const membership = {
            id: row.dataset.id || `membership-${Date.now()}`,
            organization: row.querySelector('.org-name').value,
            type: row.querySelector('.membership-type').value,
            membershipId: row.querySelector('.membership-id').value,
            validity: row.querySelector('.validity').value,
            status: row.querySelector('.membership-status').value
        };

        memberships.push(membership);
    });

    return memberships;
}

function collectProjects() {
    const projects = [];

    document.querySelectorAll('.project-row').forEach(row => {
        const project = {
            id: row.dataset.id || `project-${Date.now()}`,
            title: row.querySelector('.project-title').value,
            fundingAgency: row.querySelector('.funding-agency').value,
            role: row.querySelector('.project-role').value,
            duration: row.querySelector('.project-duration').value,
            amount: row.querySelector('.project-amount').value,
            status: row.querySelector('.project-status').value
        };

        projects.push(project);
    });

    return projects;
}

function loadSavedProfessionalData() {
    const savedData = localStorage.getItem('professionalData');
    if (!savedData) return;

    try {
        const professionalData = JSON.parse(savedData);

        // Load experiences
        if (professionalData.experiences && professionalData.experiences.length > 0) {
            // Clear existing rows (except first)
            const existingRows = document.querySelectorAll('.experience-row');
            for (let i = 1; i < existingRows.length; i++) {
                existingRows[i].remove();
            }

            // Load first experience data
            if (existingRows.length > 0) {
                const firstRow = existingRows[0];
                const firstExp = professionalData.experiences[0];

                if (firstExp) {
                    firstRow.querySelector('.institution-name').value = firstExp.institution || '';
                    firstRow.querySelector('.post-held').value = firstExp.post || '';
                    firstRow.querySelector('.from-date').value = firstExp.fromDate || '';
                    firstRow.querySelector('.to-date').value = firstExp.toDate || '';
                    firstRow.querySelector('.admin-experience').value = firstExp.adminExperience || '';
                    firstRow.querySelector('.nature-of-work').value = firstExp.natureOfWork || '';
                    firstRow.querySelector('.remarks').value = firstExp.remarks || '';

                    // Calculate duration
                    calculateExperienceDuration(firstRow.querySelector('.from-date'));
                }
            }

            // Load additional experiences
            for (let i = 1; i < professionalData.experiences.length; i++) {
                addExperienceFromData(professionalData.experiences[i]);
            }
        }

        // Load awards
        if (professionalData.awards && professionalData.awards.length > 0) {
            const awardsRows = document.getElementById('awardsRows');
            const emptyRow = awardsRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            professionalData.awards.forEach((award, index) => {
                addAwardFromData(award, index + 1);
            });
        }

        // Load memberships
        if (professionalData.memberships && professionalData.memberships.length > 0) {
            const membershipsRows = document.getElementById('membershipsRows');
            const emptyRow = membershipsRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            professionalData.memberships.forEach((membership, index) => {
                addMembershipFromData(membership, index + 1);
            });
        }

        // Load projects
        if (professionalData.projects && professionalData.projects.length > 0) {
            const projectsRows = document.getElementById('projectsRows');
            const emptyRow = projectsRows.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            professionalData.projects.forEach((project, index) => {
                addProjectFromData(project, index + 1);
            });
        }

        // Load other info
        if (professionalData.otherInfo) {
            document.getElementById('otherInfo').value = professionalData.otherInfo;

            // Update character count
            const charCount = professionalData.otherInfo.length;
            document.getElementById('charCount').textContent = charCount;
        }

        // Update calculations
        updateExperienceSummary();
        updateTotalAdminExperience();

        showMessage('success', 'Previously saved professional data loaded successfully!');

    } catch (error) {
        console.error('Error loading professional data:', error);
        showMessage('error', 'Error loading saved professional data');
    }
}

// Helper functions to add data from saved state
function addExperienceFromData(experience) {
    const experienceRows = document.getElementById('experienceRows');
    const rowCount = document.querySelectorAll('.experience-row').length;
    const newRowId = rowCount + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'experience-row';
    newRow.dataset.id = experience.id || `exp-${Date.now()}`;

    newRow.innerHTML = `
        <td class="serial-no">${newRowId}</td>
        <td>
            <input type="text" class="form-control institution-name" value="${experience.institution || ''}" required>
        </td>
        <td>
            <input type="text" class="form-control post-held" value="${experience.post || ''}" required>
        </td>
        <td>
            <input type="date" class="form-control from-date date-picker" value="${experience.fromDate || ''}">
        </td>
        <td>
            <input type="date" class="form-control to-date date-picker" value="${experience.toDate || ''}">
        </td>
        <td>
            <input type="text" class="form-control duration-display" readonly value="${experience.duration || ''}">
        </td>
        <td>
            <input type="number" class="form-control admin-experience" min="0" step="0.1" 
                   value="${experience.adminExperience || ''}">
        </td>
        <td>
            <select class="form-control nature-of-work">
                <option value="">Select Nature</option>
                <option value="Teaching" ${experience.natureOfWork === 'Teaching' ? 'selected' : ''}>Teaching</option>
                <option value="Research" ${experience.natureOfWork === 'Research' ? 'selected' : ''}>Research</option>
                <option value="Administration" ${experience.natureOfWork === 'Administration' ? 'selected' : ''}>Administration</option>
                <option value="Technical" ${experience.natureOfWork === 'Technical' ? 'selected' : ''}>Technical</option>
                <option value="Consultancy" ${experience.natureOfWork === 'Consultancy' ? 'selected' : ''}>Consultancy</option>
                <option value="Industry" ${experience.natureOfWork === 'Industry' ? 'selected' : ''}>Industry</option>
                <option value="Other" ${experience.natureOfWork === 'Other' ? 'selected' : ''}>Other</option>
            </select>
        </td>
        <td>
            <input type="text" class="form-control remarks" value="${experience.remarks || ''}">
        </td>
        <td class="action-cell">
            <button type="button" class="btn-action btn-delete" onclick="deleteExperienceRow(this)" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    experienceRows.appendChild(newRow);
    setupExperienceRowEvents(newRow);
    updateSerialNumbers();
}

// Similar functions for awards, memberships, projects (would follow same pattern)

// Form Submission
function setupProfessionalForm() {
    const professionalForm = document.getElementById('professionalExperienceForm');

    if (professionalForm) {
        professionalForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateProfessionalForm()) {
                // Show loading
                const submitBtn = this.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving...';
                submitBtn.disabled = true;

                // Collect form data
                const formData = collectProfessionalFormData();
                console.log('Professional Experience Data:', formData);

                // Save to localStorage
                saveProfessionalDataToStorage();

                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    showMessage('success', 'Professional experience saved successfully!');

                    // Move to next step (G)
                    setTimeout(() => {
                        showStep('G');
                    }, 1500);

                }, 2000);
            }
        });
    }
}

function validateProfessionalForm() {
    let isValid = true;

    // Validate experience rows
    const experienceRows = document.querySelectorAll('.experience-row');

    for (const row of experienceRows) {
        const requiredInputs = row.querySelectorAll('[required]');

        for (const input of requiredInputs) {
            if (!input.value.trim()) {
                showMessage('error', 'Please fill all required fields in professional experience.');
                input.focus();
                isValid = false;
                break;
            }
        }

        if (!isValid) break;

        // Validate dates
        const fromInput = row.querySelector('.from-date');
        const toInput = row.querySelector('.to-date');

        if (fromInput.value && toInput.value) {
            const fromDate = new Date(fromInput.value);
            const toDate = new Date(toInput.value);

            if (toDate < fromDate) {
                showMessage('error', 'To date cannot be earlier than From date.');
                toInput.focus();
                isValid = false;
                break;
            }
        }

        // Validate admin experience
        const adminInput = row.querySelector('.admin-experience');
        if (adminInput.value) {
            const adminExp = parseFloat(adminInput.value);
            if (adminExp < 0) {
                showMessage('error', 'Administrative experience cannot be negative.');
                adminInput.focus();
                isValid = false;
                break;
            }
        }
    }

    // Validate other info character count
    const otherInfo = document.getElementById('otherInfo').value;
    if (otherInfo.length > 2000) {
        showMessage('error', 'Additional information cannot exceed 2000 characters.');
        document.getElementById('otherInfo').focus();
        isValid = false;
    }

    return isValid;
}

function collectProfessionalFormData() {
    return {
        experiences: collectExperiences(),
        awards: collectAwards(),
        memberships: collectMemberships(),
        projects: collectProjects(),
        otherInfo: document.getElementById('otherInfo').value,
        summary: {
            totalProfessionalExperience: document.getElementById('totalProfessionalExperience').textContent,
            totalAdminExperience: document.getElementById('totalAdminExperience').textContent,
            totalInstitutions: document.getElementById('totalInstitutions').textContent,
            totalAwards: document.querySelectorAll('.award-row').length,
            totalMemberships: document.querySelectorAll('.membership-row').length,
            totalProjects: document.querySelectorAll('.project-row').length
        }
    };
}

// Clear Form
function clearProfessionalForm() {
    if (!confirm('Are you sure you want to clear all professional experience details? This action cannot be undone.')) {
        return;
    }

    // Clear experience rows (keep first)
    const experienceRows = document.querySelectorAll('.experience-row');
    for (let i = 1; i < experienceRows.length; i++) {
        experienceRows[i].remove();
    }

    // Clear first row
    const firstRow = document.querySelector('.experience-row');
    if (firstRow) {
        firstRow.querySelector('.institution-name').value = '';
        firstRow.querySelector('.post-held').value = '';
        firstRow.querySelector('.from-date').value = '';
        firstRow.querySelector('.to-date').value = '';
        firstRow.querySelector('.duration-display').value = '';
        firstRow.querySelector('.admin-experience').value = '';
        firstRow.querySelector('.nature-of-work').selectedIndex = 0;
        firstRow.querySelector('.remarks').value = '';
    }

    // Clear awards
    document.getElementById('awardsRows').innerHTML = `
        <tr class="empty-row">
            <td colspan="7" class="text-center">
                <div class="empty-state">
                    <i class="bi bi-award"></i>
                    <p>No awards added yet</p>
                </div>
            </td>
        </tr>
    `;

    // Clear memberships
    document.getElementById('membershipsRows').innerHTML = `
        <tr class="empty-row">
            <td colspan="7" class="text-center">
                <div class="empty-state">
                    <i class="bi bi-people"></i>
                    <p>No memberships added yet</p>
                </div>
            </td>
        </tr>
    `;

    // Clear projects
    document.getElementById('projectsRows').innerHTML = `
        <tr class="empty-row">
            <td colspan="8" class="text-center">
                <div class="empty-state">
                    <i class="bi bi-diagram-3"></i>
                    <p>No projects added yet</p>
                </div>
            </td>
        </tr>
    `;

    // Clear other info
    document.getElementById('otherInfo').value = '';
    document.getElementById('charCount').textContent = '0';

    // Clear uploaded files
    const filesLists = ['experienceFilesList', 'otherFilesContainer'];
    filesLists.forEach(listId => {
        const list = document.getElementById(listId);
        if (list) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-file-earmark"></i>
                    <p>No documents uploaded yet</p>
                </div>
            `;
        }
    });

    // Update calculations
    updateExperienceSummary();
    updateTotalAdminExperience();
    updateSerialNumbers();

    // Clear localStorage
    localStorage.removeItem('professionalData');

    showMessage('success', 'All professional experience details cleared successfully!');
}

// Show Step F when needed
function showStepF() {
    showStep('F');
    initStepF();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // When step F is shown, initialize it
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const stepF = document.getElementById('stepF');
                if (stepF && stepF.classList.contains('active')) {
                    initStepF();
                }
            }
        });
    });

    const stepF = document.getElementById('stepF');
    if (stepF) {
        observer.observe(stepF, { attributes: true });
    }
}); 
// Step G - Documents Upload & Final Submit JavaScript

let uploadedDocuments = {};

// Initialize Step G
function initStepG() {
    console.log('Initializing Step G - Documents Upload & Final Submit');

    // Load saved documents
    loadSavedDocuments();

    // Initialize file uploads
    initDocumentUploads();

    // Setup form submission
    setupFinalSubmitForm();

    // Update progress
    updateUploadProgress();

    // Load application summary
    loadApplicationSummary();

    // Set current date for declaration
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('declarationDate').value = today;
    document.getElementById('declarationDate').max = today;

    // Update submit button state
    updateSubmitButtonState();
}

// Initialize document uploads
function initDocumentUploads() {
    // Setup bulk upload zone
    const bulkUploadZone = document.getElementById('bulkUploadZone');
    const bulkUploadInput = document.getElementById('bulkUploadInput');

    if (bulkUploadZone && bulkUploadInput) {
        // Drag and drop functionality
        bulkUploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        bulkUploadZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        bulkUploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                bulkUploadInput.files = e.dataTransfer.files;
                handleBulkUpload({ target: bulkUploadInput });
            }
        });

        // Click to upload
        bulkUploadZone.addEventListener('click', function () {
            bulkUploadInput.click();
        });
    }
}

// Upload single document
function uploadDocument(docType) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!validateDocumentFile(file)) {
            return;
        }

        // Upload document
        handleDocumentUpload(docType, file);
    };

    input.click();
}

// Handle document upload
function handleDocumentUpload(docType, file) {
    // Show loading
    const docItem = document.querySelector(`.checklist-item[data-doc="${docType}"]`);
    const statusBadge = docItem.querySelector('.status-badge');
    const uploadBtn = docItem.querySelector('.btn-upload-doc');

    statusBadge.textContent = 'Uploading...';
    statusBadge.className = 'status-badge pending';
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Uploading...';

    // Simulate upload process (2 seconds)
    setTimeout(() => {
        // Save document info
        uploadedDocuments[docType] = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date().toISOString()
        };

        // Update UI
        statusBadge.textContent = 'Uploaded';
        statusBadge.className = 'status-badge uploaded';
        uploadBtn.innerHTML = '<i class="bi bi-check-circle"></i> Change';
        uploadBtn.disabled = false;

        // Update description with filename
        const docDesc = docItem.querySelector('.doc-desc');
        if (docDesc) {
            docDesc.innerHTML = `<span>${file.name} (${formatFileSize(file.size)})</span>`;
        }

        // Save to localStorage
        saveDocumentsToStorage();

        // Update progress
        updateUploadProgress();

        // Update summary
        updateDocumentsSummary();

        // Update submit button state
        updateSubmitButtonState();

        // Show success message
        showMessage('success', `Document uploaded successfully: ${file.name}`);
    }, 2000);
}

// Handle bulk upload
function handleBulkUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let uploadedCount = 0;
    const totalFiles = files.length;

    showMessage('info', `Processing ${totalFiles} file(s)...`);

    // Process each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!validateDocumentFile(file)) {
            continue;
        }

        // Try to determine document type from filename
        const docType = determineDocTypeFromFilename(file.name);

        if (docType) {
            // Upload document
            uploadedDocuments[docType] = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: new Date().toISOString()
            };

            uploadedCount++;

            // Update UI for this document type
            updateDocumentUI(docType, file.name, file.size);
        }
    }

    // Save to storage
    saveDocumentsToStorage();

    // Update progress
    updateUploadProgress();

    // Update summary
    updateDocumentsSummary();

    // Update submit button state
    updateSubmitButtonState();

    // Show result
    if (uploadedCount > 0) {
        showMessage('success', `${uploadedCount} file(s) uploaded successfully!`);
    }

    if (uploadedCount < totalFiles) {
        showMessage('warning', `${totalFiles - uploadedCount} file(s) could not be processed`);
    }

    // Reset file input
    event.target.value = '';
}

// Determine document type from filename
function determineDocTypeFromFilename(filename) {
    const lowerName = filename.toLowerCase();

    if (lowerName.includes('photo') || lowerName.includes('passport') || lowerName.includes('picture') || lowerName.includes('photograph')) {
        return 'photograph';
    } else if (lowerName.includes('signature') || lowerName.includes('sign')) {
        return 'signature';
    } else if (lowerName.includes('aadhar') || lowerName.includes('uid') || lowerName.includes('aadhaar') || lowerName.includes('identity')) {
        return 'aadhar';
    } else if (lowerName.includes('10th') || lowerName.includes('ssc') || lowerName.includes('10')) {
        return 'marksheet10';
    } else if (lowerName.includes('12th') || lowerName.includes('hsc') || lowerName.includes('12') || lowerName.includes('intermediate')) {
        return 'marksheet12';
    } else if (lowerName.includes('ug') || lowerName.includes('bachelor') || lowerName.includes('graduation') || lowerName.includes('degree')) {
        return 'ugDegree';
    } else if (lowerName.includes('pg') || lowerName.includes('master') || lowerName.includes('postgraduate')) {
        return 'pgDegree';
    } else if (lowerName.includes('phd') || lowerName.includes('doctorate')) {
        return 'phdCertificate';
    } else if (lowerName.includes('experience') || lowerName.includes('work') || lowerName.includes('employ')) {
        return 'experience';
    } else if (lowerName.includes('caste') || lowerName.includes('category')) {
        return 'caste';
    } else {
        return 'other';
    }
}

// Update document UI
function updateDocumentUI(docType, fileName, fileSize) {
    const docItem = document.querySelector(`.checklist-item[data-doc="${docType}"]`);
    if (!docItem) return;

    const statusBadge = docItem.querySelector('.status-badge');
    const uploadBtn = docItem.querySelector('.btn-upload-doc');

    statusBadge.textContent = 'Uploaded';
    statusBadge.className = 'status-badge uploaded';
    uploadBtn.innerHTML = '<i class="bi bi-check-circle"></i> Change';

    // Update description with filename
    const docDesc = docItem.querySelector('.doc-desc');
    if (docDesc) {
        docDesc.innerHTML = `<span>${fileName} (${formatFileSize(fileSize)})</span>`;
    }
}

// Validate document file
function validateDocumentFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    // Check file size
    if (file.size > maxSize) {
        showMessage('error', `File "${file.name}" exceeds maximum size of 5MB`);
        return false;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        showMessage('error', `File "${file.name}" has unsupported format. Allowed: PDF, JPG, JPEG, PNG`);
        return false;
    }

    return true;
}

// Update upload progress
function updateUploadProgress() {
    const totalItems = 11; // Total document types
    const uploadedItems = Object.keys(uploadedDocuments).length;
    const requiredItems = 6; // Mandatory documents

    // Calculate uploaded required documents
    const uploadedRequired = Object.keys(uploadedDocuments).filter(doc => {
        const item = document.querySelector(`.checklist-item[data-doc="${doc}"]`);
        return item && item.classList.contains('required');
    }).length;

    // Update counts
    document.getElementById('totalDocsCount').textContent = totalItems;
    document.getElementById('uploadedDocsCount').textContent = uploadedItems;
    document.getElementById('pendingDocsCount').textContent = totalItems - uploadedItems;
    document.getElementById('mandatoryDocsCount').textContent = requiredItems;

    // Update progress bar
    const percentage = Math.round((uploadedItems / totalItems) * 100);
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    document.getElementById('progressFill').style.width = `${percentage}%`;

    // Update progress bar color based on completion
    const progressFill = document.getElementById('progressFill');
    if (percentage < 50) {
        progressFill.style.background = 'linear-gradient(90deg, #dc3545, #e74c3c)';
    } else if (percentage < 100) {
        progressFill.style.background = 'linear-gradient(90deg, #ffc107, #f39c12)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #28a745, #2ecc71)';
    }
}

// Load saved documents
function loadSavedDocuments() {
    const savedData = localStorage.getItem('uploadedDocuments');
    if (!savedData) return;

    try {
        uploadedDocuments = JSON.parse(savedData);

        // Update UI for each document
        Object.keys(uploadedDocuments).forEach(docType => {
            const docInfo = uploadedDocuments[docType];
            updateDocumentUI(docType, docInfo.name, docInfo.size);
        });

        updateUploadProgress();
        updateDocumentsSummary();
        showMessage('success', 'Previously uploaded documents loaded successfully!');
    } catch (error) {
        console.error('Error loading documents:', error);
        uploadedDocuments = {};
    }
}

// Save documents to storage
function saveDocumentsToStorage() {
    localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));
}

// Load application summary
function loadApplicationSummary() {
    // Load applicant name from session
    const fullName = document.getElementById('sessionFullName')?.textContent || 'Not Available';
    const email = document.getElementById('sessionEmail')?.textContent || 'Not Available';

    // Update summary fields
    document.getElementById('applicantNameSummary').textContent = fullName;
    document.getElementById('emailSummary').textContent = email;
    document.getElementById('applicationDate').textContent = new Date().toLocaleDateString('en-IN');

    // Update documents summary
    updateDocumentsSummary();
}

// Update documents summary
function updateDocumentsSummary() {
    const uploadedCount = Object.keys(uploadedDocuments).length;
    document.getElementById('documentsSummary').textContent = `${uploadedCount}/11`;
}

// Setup final submit form
function setupFinalSubmitForm() {
    const finalForm = document.getElementById('finalSubmitForm');

    if (finalForm) {
        finalForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateFinalForm()) {
                submitFinalApplication();
            }
        });
    }

    // Add validation listeners
    const agreeCheckbox = document.getElementById('agreeDeclaration');
    const signatureInput = document.getElementById('digitalSignature');
    const dateInput = document.getElementById('declarationDate');

    if (agreeCheckbox) {
        agreeCheckbox.addEventListener('change', updateSubmitButtonState);
    }

    if (signatureInput) {
        signatureInput.addEventListener('input', updateSubmitButtonState);
    }

    if (dateInput) {
        dateInput.addEventListener('change', updateSubmitButtonState);
    }
}

// Validate final form
function validateFinalForm() {
    // Check if all required documents are uploaded
    const requiredItems = document.querySelectorAll('.checklist-item.required');
    let allRequiredUploaded = true;

    requiredItems.forEach(item => {
        const docType = item.dataset.doc;
        if (!uploadedDocuments[docType]) {
            allRequiredUploaded = false;
            // Highlight missing document
            item.style.backgroundColor = '#ffebee';
            item.style.borderLeftColor = '#dc3545';
            item.style.animation = 'shake 0.5s';

            setTimeout(() => {
                item.style.animation = '';
            }, 500);
        }
    });

    if (!allRequiredUploaded) {
        showMessage('error', 'Please upload all mandatory documents (marked with *) before submitting.');
        return false;
    }

    // Check declaration agreement
    const agreeCheckbox = document.getElementById('agreeDeclaration');
    if (!agreeCheckbox.checked) {
        showMessage('error', 'Please agree to the declaration before submitting.');
        agreeCheckbox.focus();
        return false;
    }

    // Check signature
    const signature = document.getElementById('digitalSignature').value.trim();
    if (!signature) {
        showMessage('error', 'Please provide your digital signature.');
        document.getElementById('digitalSignature').focus();
        return false;
    }

    // Check declaration date
    const declarationDate = document.getElementById('declarationDate').value;
    if (!declarationDate) {
        showMessage('error', 'Please select declaration date.');
        return false;
    }

    return true;
}

// Update submit button state
function updateSubmitButtonState() {
    const submitBtn = document.getElementById('submitApplicationBtn');
    if (!submitBtn) return;

    // Check if all required documents are uploaded
    const requiredItems = document.querySelectorAll('.checklist-item.required');
    const allRequiredUploaded = Array.from(requiredItems).every(item => {
        const docType = item.dataset.doc;
        return uploadedDocuments[docType];
    });

    // Check declaration agreement
    const agreeChecked = document.getElementById('agreeDeclaration')?.checked || false;
    const signatureValid = document.getElementById('digitalSignature')?.value.trim().length > 0;
    const dateValid = document.getElementById('declarationDate')?.value;

    // Enable button only if all conditions are met
    const isEnabled = allRequiredUploaded && agreeChecked && signatureValid && dateValid;

    submitBtn.disabled = !isEnabled;

    // Update button text based on state
    if (!allRequiredUploaded) {
        submitBtn.title = 'Upload all mandatory documents first';
    } else if (!agreeChecked) {
        submitBtn.title = 'Agree to the declaration first';
    } else if (!signatureValid) {
        submitBtn.title = 'Provide digital signature';
    } else if (!dateValid) {
        submitBtn.title = 'Select declaration date';
    } else {
        submitBtn.title = 'Click to submit application';
    }
}

// Submit final application
function submitFinalApplication() {
    const submitBtn = document.getElementById('submitApplicationBtn');
    const originalText = submitBtn.innerHTML;
    const originalTitle = submitBtn.title;

    // Disable button and show loading
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
    submitBtn.disabled = true;
    submitBtn.title = 'Submitting application...';

    // Collect all application data
    const applicationData = collectAllApplicationData();

    // Add submission metadata
    applicationData.submission = {
        timestamp: new Date().toISOString(),
        signature: document.getElementById('digitalSignature').value,
        declarationDate: document.getElementById('declarationDate').value,
        submittedFrom: 'Supervisor Dashboard',
        userAgent: navigator.userAgent
    };

    console.log('Final Application Data to Submit:', applicationData);

    // Simulate API submission (3 seconds)
    setTimeout(() => {
        // Save to localStorage for demo
        localStorage.setItem('finalApplicationSubmission', JSON.stringify(applicationData));
        localStorage.setItem('applicationSubmitted', 'true');
        localStorage.setItem('submissionTimestamp', new Date().toISOString());

        // Generate application number
        const appNumber = `RTMNU/PhD/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        localStorage.setItem('applicationNumber', appNumber);

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.title = originalTitle;

        // Show success message and confirmation
        showMessage('success', 'Application submitted successfully!');

        // Show submission confirmation
        showFinalConfirmation(appNumber);

        // Log submission
        console.log('Application submitted successfully at:', new Date().toLocaleString());
        console.log('Application Number:', appNumber);

    }, 3000);
}

// Collect all application data from all steps
function collectAllApplicationData() {
    return {
        personalDetails: getPersonalDetailsFromStepA(),
        educationDetails: getEducationDetailsFromStepB(),
        employmentDetails: getEmploymentDetailsFromStepC(),
        researchExperience: getResearchExperienceFromStepD(),
        publicationDetails: getPublicationDetailsFromStepE(),
        professionalExperience: getProfessionalExperienceFromStepF(),
        uploadedDocuments: uploadedDocuments,
        submissionDetails: {
            step: 'Step G - Final Submit',
            completedAt: new Date().toISOString()
        }
    };
}

// Get personal details from Step A
function getPersonalDetailsFromStepA() {
    return {
        name: {
            surname: document.getElementById('surname')?.value,
            middleName: document.getElementById('middleName')?.value,
            firstName: document.getElementById('firstName')?.value
        },
        fatherHusbandName: document.getElementById('fatherHusbandName')?.value,
        dateOfBirth: document.getElementById('dateOfBirth')?.value,
        addresses: {
            permanent: document.getElementById('permanentAddress')?.value,
            correspondence: document.getElementById('correspondenceAddress')?.value
        },
        contact: {
            email: document.getElementById('sessionEmail')?.textContent,
            mobile: document.getElementById('sessionMobile')?.textContent,
            aadhar: document.getElementById('sessionAadhar')?.textContent
        }
    };
}

// Get education details from Step B (simplified)
function getEducationDetailsFromStepB() {
    const educationData = [];

    document.querySelectorAll('.exam-row').forEach(row => {
        const examName = row.querySelector('.exam-name-static')?.textContent ||
            row.querySelector('.exam-name')?.value;

        if (examName) {
            educationData.push({
                exam: examName,
                board: row.querySelector('.board-university')?.value,
                year: row.querySelector('.passing-year')?.value,
                percentage: row.querySelector('.percentage')?.value
            });
        }
    });

    return educationData;
}

// Get employment details from Step C (simplified)
function getEmploymentDetailsFromStepC() {
    const employmentData = [];

    document.querySelectorAll('.employment-row').forEach(row => {
        const institution = row.querySelector('.institution-name')?.value;
        if (institution) {
            employmentData.push({
                institution: institution,
                post: row.querySelector('.post-held')?.value,
                ugExperience: row.querySelector('.ug-total')?.value,
                pgExperience: row.querySelector('.pg-total')?.value
            });
        }
    });

    return employmentData;
}

// Get research experience from Step D (simplified)
function getResearchExperienceFromStepD() {
    const researchData = [];

    document.querySelectorAll('.research-row').forEach(row => {
        const organization = row.querySelector('.research-organization')?.value;
        if (organization) {
            researchData.push({
                organization: organization,
                position: row.querySelector('.research-position')?.value,
                duration: row.querySelector('.research-duration')?.value
            });
        }
    });

    return researchData;
}

// Get publication details from Step E (simplified)
function getPublicationDetailsFromStepE() {
    return {
        books: document.querySelectorAll('#booksRows tr:not(.empty-row)').length,
        papers: document.querySelectorAll('#papersRows tr:not(.empty-row)').length,
        chapters: document.querySelectorAll('#chaptersRows tr:not(.empty-row)').length,
        others: document.querySelectorAll('#othersRows tr:not(.empty-row)').length,
        total: document.getElementById('totalPublications')?.textContent || '0'
    };
}

// Get professional experience from Step F (simplified)
function getProfessionalExperienceFromStepF() {
    return {
        totalExperience: document.getElementById('totalProfessionalExperience')?.textContent,
        adminExperience: document.getElementById('totalAdminExperience')?.textContent,
        institutions: document.querySelectorAll('.experience-row').length
    };
}

// Show final confirmation
function showFinalConfirmation(appNumber) {
    const confirmationHTML = `
        <div class="confirmation-modal">
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <i class="bi bi-check-circle-fill"></i>
                    <h3>Application Submitted Successfully!</h3>
                </div>
                
                <div class="confirmation-body">
                    <div class="confirmation-details">
                        <div class="detail-item">
                            <i class="bi bi-file-earmark-text"></i>
                            <div>
                                <h4>Application Number</h4>
                                <p class="app-number">${appNumber}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="bi bi-calendar-check"></i>
                            <div>
                                <h4>Submission Date</h4>
                                <p>${new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="bi bi-clock"></i>
                            <div>
                                <h4>Processing Time</h4>
                                <p>7-10 working days</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="confirmation-instructions">
                        <h4><i class="bi bi-info-circle"></i> What's Next?</h4>
                        <ol>
                            <li>Your application will be reviewed by RTMNU authorities</li>
                            <li>You will receive an email confirmation shortly</li>
                            <li>Keep your application number for future reference</li>
                            <li>Check your email regularly for updates</li>
                        </ol>
                    </div>
                </div>
                
                <div class="confirmation-actions">
                    <button class="btn btn-primary" onclick="downloadApplicationPDF()">
                        <i class="bi bi-download"></i> Download Application Copy
                    </button>
                    <button class="btn btn-success" onclick="closeConfirmation()">
                        <i class="bi bi-house"></i> Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;

    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'finalConfirmationModal';
    modal.innerHTML = confirmationHTML;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Close confirmation
function closeConfirmation() {
    const modal = document.getElementById('finalConfirmationModal');
    if (modal) {
        modal.remove();
    }

    // Redirect to dashboard or home
    showMessage('info', 'Returning to dashboard...');
    setTimeout(() => {
        window.location.href = '/Dashboard';
    }, 1500);
}

// Download application PDF
function downloadApplicationPDF() {
    showMessage('info', 'Generating PDF...');

    // Simulate PDF generation
    setTimeout(() => {
        showMessage('success', 'PDF downloaded successfully!');
    }, 2000);
}

// Save application as draft
function saveApplicationDraft() {
    const applicationData = collectAllApplicationData();

    // Save to localStorage
    localStorage.setItem('applicationDraft', JSON.stringify(applicationData));
    localStorage.setItem('draftLastSaved', new Date().toISOString());

    showMessage('success', 'Application saved as draft successfully!');
}

// Preview application
function previewApplication() {
    showMessage('info', 'Generating application preview...');

    const applicationData = collectAllApplicationData();
    console.log('Application Preview Data:', applicationData);

    // In real app, this would open a preview window
    setTimeout(() => {
        showMessage('success', 'Preview generated. Check browser console for details.');

        // Open preview in new tab (simulated)
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
            previewWindow.document.write(`
                <html>
                <head>
                    <title>Application Preview</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #1e3c72; }
                        .section { margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
                        .info-item { margin-bottom: 10px; }
                        .label { font-weight: bold; color: #555; }
                    </style>
                </head>
                <body>
                    <h1>RTMNU PhD Supervisor Application - Preview</h1>
                    <p>This is a preview of your application data.</p>
                    <p>Total documents uploaded: ${Object.keys(uploadedDocuments).length}/11</p>
                    <p>Note: This is a preview. Actual submission requires all mandatory documents.</p>
                </body>
                </html>
            `);
        }
    }, 1500);
}

// Clear all documents
function clearAllDocuments() {
    if (!confirm('Are you sure you want to clear all uploaded documents? This action cannot be undone.')) {
        return;
    }

    // Clear all uploaded documents
    uploadedDocuments = {};

    // Reset all document items
    document.querySelectorAll('.checklist-item').forEach(item => {
        const statusBadge = item.querySelector('.status-badge');
        const uploadBtn = item.querySelector('.btn-upload-doc');
        const docDesc = item.querySelector('.doc-desc');
        const docType = item.dataset.doc;

        // Reset UI
        statusBadge.textContent = 'Pending';
        statusBadge.className = 'status-badge pending';
        uploadBtn.innerHTML = '<i class="bi bi-upload"></i> Upload';
        uploadBtn.disabled = false;

        // Reset original description
        if (docType === 'photograph') {
            docDesc.innerHTML = '<span>White background, 2MB max</span>';
        } else if (docType === 'signature') {
            docDesc.innerHTML = '<span>Scanned signature on white paper</span>';
        } else if (docType === 'aadhar') {
            docDesc.innerHTML = '<span>Front and back side in single PDF</span>';
        } else {
            const originalText = docDesc.dataset.original || 'Complete marksheet/certificate';
            docDesc.innerHTML = `<span>${originalText}</span>`;
        }

        // Reset styling
        item.style.backgroundColor = '';
        item.style.borderLeftColor = item.classList.contains('required') ? 'var(--danger-red)' : 'var(--warning-orange)';
    });

    // Clear localStorage
    localStorage.removeItem('uploadedDocuments');

    // Update progress
    updateUploadProgress();

    // Update summary
    updateDocumentsSummary();

    // Update submit button state
    updateSubmitButtonState();

    showMessage('success', 'All documents cleared successfully!');
}

// Utility function: Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize Step G when shown
function showStepG() {
    showStep('G');
    // Call initStepG after a short delay to ensure DOM is ready
    setTimeout(initStepG, 100);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // When step G is shown, initialize it
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const stepG = document.getElementById('stepG');
                if (stepG && stepG.classList.contains('active')) {
                    initStepG();
                }
            }
        });
    });

    const stepG = document.getElementById('stepG');
    if (stepG) {
        observer.observe(stepG, { attributes: true });
    }
});

// Add this CSS for confirmation modal
const style = document.createElement('style');
style.textContent = `
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.confirmation-modal {
    background: white;
    border-radius: 15px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
}

.confirmation-content {
    padding: 30px;
}

.confirmation-header {
    text-align: center;
    margin-bottom: 30px;
}

.confirmation-header i {
    font-size: 4rem;
    color: #28a745;
    margin-bottom: 15px;
}

.confirmation-header h3 {
    color: var(--primary-blue);
    margin: 0;
}

.confirmation-body {
    margin-bottom: 30px;
}

.confirmation-details {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 25px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.detail-item:last-child {
    margin-bottom: 0;
}

.detail-item i {
    font-size: 1.5rem;
    color: var(--primary-blue);
}

.app-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-blue);
    background: #e8f4fd;
    padding: 5px 15px;
    border-radius: 5px;
    display: inline-block;
    margin-top: 5px;
}

.confirmation-instructions {
    background: #fff3cd;
    border-radius: 10px;
    padding: 20px;
    border-left: 4px solid #ffc107;
}

.confirmation-instructions h4 {
    color: #856404;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.confirmation-instructions ol {
    padding-left: 20px;
    margin: 0;
}

.confirmation-instructions li {
    margin-bottom: 8px;
    color: #495057;
}

.confirmation-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.confirmation-actions .btn {
    min-width: 200px;
    justify-content: center;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .confirmation-content {
        padding: 20px;
    }
    
    .confirmation-actions {
        flex-direction: column;
    }
    
    .confirmation-actions .btn {
        width: 100%;
    }
}
`;
document.head.appendChild(style);