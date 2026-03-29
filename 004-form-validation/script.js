const form = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const termsInput = document.getElementById('terms');
const success = document.getElementById('success');

const errors = {
  name: document.getElementById('nameError'),
  email: document.getElementById('emailError'),
  password: document.getElementById('passwordError'),
  confirm: document.getElementById('confirmError'),
  terms: document.getElementById('termsError')
};

function setError(input, errorEl, message) {
  if (input) {
    input.classList.remove('valid');
    input.classList.add('invalid');
  }
  errorEl.textContent = message;
}

function setValid(input, errorEl) {
  if (input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
  }
  errorEl.textContent = '';
}

function validateName() {
  const value = nameInput.value.trim();
  if (value.length < 3) {
    setError(nameInput, errors.name, 'Name must be at least 3 characters.');
    return false;
  }
  setValid(nameInput, errors.name);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    setError(emailInput, errors.email, 'Enter a valid email address.');
    return false;
  }
  setValid(emailInput, errors.email);
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  const hasMinLength = value.length >= 8;
  const hasNumber = /\d/.test(value);

  if (!hasMinLength || !hasNumber) {
    setError(passwordInput, errors.password, 'Password must be 8+ characters and include a number.');
    return false;
  }

  setValid(passwordInput, errors.password);
  return true;
}

function validateConfirmPassword() {
  if (confirmInput.value !== passwordInput.value || !confirmInput.value) {
    setError(confirmInput, errors.confirm, 'Passwords do not match.');
    return false;
  }

  setValid(confirmInput, errors.confirm);
  return true;
}

function validateTerms() {
  if (!termsInput.checked) {
    errors.terms.textContent = 'You must accept the terms.';
    return false;
  }

  errors.terms.textContent = '';
  return true;
}

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', () => {
  validatePassword();
  if (confirmInput.value) {
    validateConfirmPassword();
  }
});
confirmInput.addEventListener('input', validateConfirmPassword);
termsInput.addEventListener('change', validateTerms);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  success.textContent = '';

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();
  const isTermsValid = validateTerms();

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isTermsValid) {
    success.textContent = 'Form submitted successfully!';
    form.reset();

    [nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
      input.classList.remove('valid', 'invalid');
    });
  }
});
