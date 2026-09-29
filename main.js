document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('enrollmentForm');
    const courseSelect = document.getElementById('course');
    const majorGroup = document.getElementById('majorGroup');
    const successBanner = document.getElementById('success-banner');
    const tableBody = document.getElementById('tableBody');
    const emptyRow = document.getElementById('emptyRow');

    // Load existing records from LocalStorage on page load
    loadRecords();

    // Toggle BSIT Major dropdown conditionally
    courseSelect.addEventListener('change', () => {
        if (courseSelect.value === 'BSIT') {
            majorGroup.classList.remove('hidden');
        } else {
            majorGroup.classList.add('hidden');
            document.getElementById('major').value = '';
            clearError('major');
        }
    });

    // Real-time error clearing on input
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearError(input.id);
        });
        input.addEventListener('change', () => {
            clearError(input.id);
        });
    });

    // Form submission validation handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Field references & values
        const studentId = document.getElementById('studentId');
        const prefix = document.getElementById('prefix');
        const firstName = document.getElementById('firstName');
        const middleName = document.getElementById('middleName');
        const lastName = document.getElementById('lastName');
        const suffix = document.getElementById('suffix');
        const email = document.getElementById('email');
        const course = document.getElementById('course');
        const major = document.getElementById('major');
        const yearLevel = document.getElementById('yearLevel');

        // Clear previous notifications
        successBanner.classList.add('hidden');

        // 1. Student ID Validation (Required, min 5 characters)
        if (!studentId.value.trim()) {
            showError('studentId', 'Student ID is required.');
            isValid = false;
        } else if (studentId.value.trim().length < 5) {
            showError('studentId', 'Student ID must be at least 5 characters.');
            isValid = false;
        }

        // 2. Prefix Validation (Optional, min 2 characters if provided)
        if (prefix.value.trim() !== '' && prefix.value.trim().length < 2) {
            showError('prefix', 'Prefix must be at least 2 characters.');
            isValid = false;
        }

        // 3. First Name Validation (Required, min 3 characters)
        if (!firstName.value.trim()) {
            showError('firstName', 'First name is required.');
            isValid = false;
        } else if (firstName.value.trim().length < 3) {
            showError('firstName', 'First name must be at least 3 characters.');
            isValid = false;
        }

        // 4. Middle Name Validation (Optional, min 2 characters if provided)
        if (middleName.value.trim() !== '' && middleName.value.trim().length < 2) {
            showError('middleName', 'Middle name must be at least 2 characters.');
            isValid = false;
        }

        // 5. Last Name Validation (Required, min 2 characters)
        if (!lastName.value.trim()) {
            showError('lastName', 'Last name is required.');
            isValid = false;
        } else if (lastName.value.trim().length < 2) {
            showError('lastName', 'Last name must be at least 2 characters.');
            isValid = false;
        }

        // 6. Suffix Validation (Optional, min 2 characters if provided)
        if (suffix.value.trim() !== '' && suffix.value.trim().length < 2) {
            showError('suffix', 'Suffix must be at least 2 characters.');
            isValid = false;
        }

        // 7. Email Validation (Required, valid email pattern)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('email', 'Email address is required.');
            isValid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            showError('email', 'Please enter a valid email address.');
            isValid = false;
        }

        // 8. Course Validation (Required)
        if (!course.value) {
            showError('course', 'Please select a course.');
            isValid = false;
        }

        // 9. Major Validation (Required if BSIT)
        if (course.value === 'BSIT' && !major.value) {
            showError('major', 'Please select a BSIT major.');
            isValid = false;
        }

        // 10. Year Level Validation (Required)
        if (!yearLevel.value) {
            showError('yearLevel', 'Please select a year level.');
            isValid = false;
        }

        // If validation passes
        if (isValid) {
            const studentData = {
                studentId: studentId.value.trim(),
                fullName: formatFullName(prefix.value.trim(), firstName.value.trim(), middleName.value.trim(), lastName.value.trim(), suffix.value.trim()),
                email: email.value.trim(),
                courseInfo: course.value === 'BSIT' ? `BSIT - ${major.value}` : course.value,
                yearLevel: yearLevel.value
            };

            saveRecord(studentData);
            
            // Show success notification banner
            successBanner.classList.remove('hidden');

            // Reset form
            form.reset();
            majorGroup.classList.add('hidden');

            // Scroll slightly to view success & table
            successBanner.scrollIntoView({ behavior: 'smooth' });
        }
    });

    function showError(fieldId, message) {
        const inputField = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        if (inputField) inputField.classList.add('error-input');
        if (errorElement) errorElement.textContent = message;
    }

    function clearError(fieldId) {
        const inputField = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        if (inputField) inputField.classList.remove('error-input');
        if (errorElement) errorElement.textContent = '';
    }

    function formatFullName(prefix, first, middle, last, suffix) {
        let parts = [];
        if (prefix) parts.push(prefix);
        parts.push(first);
        if (middle) parts.push(middle.charAt(0) + '.');
        parts.push(last);
        if (suffix) parts.push(suffix);
        return parts.join(' ');
    }

    function saveRecord(data) {
        let records = JSON.parse(localStorage.getItem('studentEnrollments')) || [];
        records.push(data);
        localStorage.setItem('studentEnrollments', JSON.stringify(records));
        loadRecords();
    }

    function loadRecords() {
        let records = JSON.parse(localStorage.getItem('studentEnrollments')) || [];
        tableBody.innerHTML = '';

        if (records.length === 0) {
            tableBody.innerHTML = `<tr id="emptyRow"><td colspan="5" style="text-align: center; color: #718096;">No records submitted yet.</td></tr>`;
            return;
        }

        records.forEach(rec => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHtml(rec.studentId)}</td>
                <td>${escapeHtml(rec.fullName)}</td>
                <td>${escapeHtml(rec.email)}</td>
                <td>${escapeHtml(rec.courseInfo)}</td>
                <td>${escapeHtml(rec.yearLevel)}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
});