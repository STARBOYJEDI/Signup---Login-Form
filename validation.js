const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');
const password_strength_container = document.getElementById('password-strength-container');
const password_strength_bar = document.getElementById('password-strength-bar');
const password_strength_text = document.getElementById('password-strength-text');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Find the password input in the same container
        const passwordContainer = this.parentElement;
        const passwordInput = passwordContainer.querySelector('input');
        const eyeIcon = this.querySelector('.eye-icon');
        const eyeOffIcon = this.querySelector('.eye-off-icon');

        // Toggle between password and text
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';        // Show password
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            passwordInput.type = 'password';    // Hide password
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    });
});


// Password strength calculation function
function calculatePasswordStrength(password) {
    let strength = 0;

    if (!password) return strength;

    // Criteria 1: Length (up to 2 points)
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Criteria 2: Contains lowercase letters
    if (/[a-z]/.test(password)) strength += 1;

    // Criteria 3: Contains uppercase letters
    if (/[A-Z]/.test(password)) strength += 1;

    // Criteria 4: Contains numbers 
    if (/[0-9]/.test(password)) strength += 1;

    // Criteria 5: Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    return strength;
}

// Update password strength display
function updatePasswordStrength(password) {
    if (!password_strength_container) return; // Only on signup page

    const strength = calculatePasswordStrength(password);

    // Show/hide character
    if (password.length > 0) {
        password_strength_container.style.display = 'block';
    } else {
        password_strength_container.style.display = 'none';
        return;
    }

    updateRequirement('req-length', password.length >= 8);
    updateRequirement('req-uppercase', /[A-Z]/.test(password));
    updateRequirement('req-lowercase', /[a-z]/.test(password));
    updateRequirement('req-number', /[0-9]/.test(password));
    updateRequirement('req-special', /[^a-zA-Z0-9]/.test(password));

    // Remove all strength classes
    password_strength_bar.classList.remove('weak', 'medium', 'strong');
    password_strength_text.classList.remove('weak', 'medium', 'strong');

    // Add appropriate class based on strength
    if (strength <= 2) {
        password_strength_bar.classList.add('weak');
        password_strength_text.classList.add('weak');
        password_strength_text.textContent = 'Weak password';
    } else if (strength <= 4) {
        password_strength_bar.classList.add('medium');
        password_strength_text.classList.add('medium');
        password_strength_text.textContent = 'Medium password';
    } else {
        password_strength_bar.classList.add('strong');
        password_strength_text.classList.add('strong');
        password_strength_text.textContent = 'Strong password';
    }
}

function updateRequirement(elementId, isMet) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isMet) {
            element.classList.remove('unmet');
            element.classList.add('met');
        } else {
            element.classList.remove('met');
            element.classList.add('unmet');
        }
    }
}

// Add event listener to password input 
if (password_input) {
    password_input.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email)
}

form.addEventListener('submit', (e) => {
    // Prevent form submission if there are errors

    let errors = [];

    if (firstname_input) {
        // If we have a firstname input then we are in the signup
        errors = getSignupFormErrors(
            firstname_input.value, 
            email_input.value, 
            password_input.value, 
            repeat_password_input.value
        );
    } else {
        // If we don't have a firstname input then we are in the login
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
        // If there are any errors
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    }
});

function getSignupFormErrors(firstname, email, password, repeatPassword) {
    let errors = [];

    if (firstname === '' || firstname === null) {
        errors.push('Firstname is required');
        firstname_input.parentElement.classList.add('incorrect');
    }
    if (email === '' || email === null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
        email_input.parentElement.classList.add('incorrect');
    }

    if (password === '' || password === null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }
    if (password.length < 8) {
        errors.push('Password must have at least 8 characters');
        password_input.parentElement.classList.add('incorrect');
    }
    if (password.length > 20) {
        errors.push('Password must not be longer than 20 characters');
        password_input.parentElement.classList.add('incorrect');
    }
    if (password !== repeatPassword) {
        errors.push('Password does not match repeated password');
        password_input.parentElement.classList.add('incorrect');
        repeat_password_input.parentElement.classList.add('incorrect');
    }
    
    const strength = calculatePasswordStrength(password);
    if (strength <= 2) {
        errors.push('Password is too weak. Please use a stronger password.');
        password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

function getLoginFormErrors (email, password) {
    let errors = [];

    if (email === '' || email === null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }
    if (password === '' || password === null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null)

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
            error_message.innerText = ''
        }
    });
});






