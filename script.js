// Advanced Form Validation and Registration System
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('Form not found');
            return;
        }

        this.setupFields();
        this.bindEvents();
        this.setupPasswordStrength();
    }

    setupFields() {
        // Define validation rules for each field
        this.fields = {
            firstname: {
                element: document.getElementById('firstname'),
                rules: {
                    required: true,
                    minLength: 2,
                    pattern: /^[a-zA-Z\s]+$/
                },
                messages: {
                    required: 'First name is required',
                    minLength: 'First name must be at least 2 characters',
                    pattern: 'First name can only contain letters and spaces'
                }
            },
            lastname: {
                element: document.getElementById('lastname'),
                rules: {
                    required: true,
                    minLength: 2,
                    pattern: /^[a-zA-Z\s]+$/
                },
                messages: {
                    required: 'Last name is required',
                    minLength: 'Last name must be at least 2 characters',
                    pattern: 'Last name can only contain letters and spaces'
                }
            },
            username: {
                element: document.getElementById('username'),
                rules: {
                    required: true,
                    minLength: 3,
                    maxLength: 20,
                    pattern: /^[a-zA-Z0-9_]+$/
                },
                messages: {
                    required: 'Username is required',
                    minLength: 'Username must be at least 3 characters',
                    maxLength: 'Username cannot exceed 20 characters',
                    pattern: 'Username can only contain letters, numbers, and underscores'
                }
            },
            email: {
                element: document.getElementById('email'),
                rules: {
                    required: true,
                    email: true
                },
                messages: {
                    required: 'Email is required',
                    email: 'Please enter a valid email address'
                }
            },
            phone: {
                element: document.getElementById('phone'),
                rules: {
                    required: true,
                    pattern: /^[\+]?[1-9][\d]{0,15}$/
                },
                messages: {
                    required: 'Phone number is required',
                    pattern: 'Please enter a valid phone number'
                }
            },
            password: {
                element: document.getElementById('password'),
                rules: {
                    required: true,
                    minLength: 8,
                    strongPassword: true
                },
                messages: {
                    required: 'Password is required',
                    minLength: 'Password must be at least 8 characters',
                    strongPassword: 'Password must contain uppercase, lowercase, number, and special character'
                }
            },
            confirmPassword: {
                element: document.getElementById('confirmPassword'),
                rules: {
                    required: true,
                    matchPassword: true
                },
                messages: {
                    required: 'Please confirm your password',
                    matchPassword: 'Passwords do not match'
                }
            },
            birthdate: {
                element: document.getElementById('birthdate'),
                rules: {
                    required: true,
                    validAge: true
                },
                messages: {
                    required: 'Date of birth is required',
                    validAge: 'You must be at least 13 years old'
                }
            },
            terms: {
                element: document.getElementById('terms'),
                rules: {
                    required: true
                },
                messages: {
                    required: 'You must agree to the terms and conditions'
                }
            }
        };
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation for each field
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field.element) {
                // Validate on blur (when user leaves the field)
                field.element.addEventListener('blur', () => {
                    this.validateField(fieldName);
                });

                // Clear errors on focus
                field.element.addEventListener('focus', () => {
                    this.clearFieldError(fieldName);
                });

                // Real-time validation for password confirmation
                if (fieldName === 'confirmPassword') {
                    field.element.addEventListener('input', () => {
                        this.validateField(fieldName);
                    });
                }
            }
        });

        // Password strength indicator
        const passwordField = this.fields.password.element;
        if (passwordField) {
            passwordField.addEventListener('input', () => {
                this.updatePasswordStrength();
                this.validateField('confirmPassword'); // Re-validate confirm password
            });
        }
    }

    setupPasswordStrength() {
        this.strengthBar = document.querySelector('.strength-bar');
        this.strengthText = document.querySelector('.strength-text');
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        if (!field || !field.element) return true;

        const value = field.element.type === 'checkbox' ? field.element.checked : field.element.value.trim();
        const rules = field.rules;
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required) {
            if (field.element.type === 'checkbox' && !value) {
                isValid = false;
                errorMessage = field.messages.required;
            } else if (field.element.type !== 'checkbox' && !value) {
                isValid = false;
                errorMessage = field.messages.required;
            }
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            this.setFieldStatus(fieldName, true);
            return true;
        }

        // Length validations
        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = field.messages.minLength;
        }

        if (isValid && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = field.messages.maxLength;
        }

        // Pattern validation
        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = field.messages.pattern;
        }

        // Email validation
        if (isValid && rules.email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                isValid = false;
                errorMessage = field.messages.email;
            }
        }

        // Strong password validation
        if (isValid && rules.strongPassword) {
            const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
            if (!strongPasswordPattern.test(value)) {
                isValid = false;
                errorMessage = field.messages.strongPassword;
            }
        }

        // Password match validation
        if (isValid && rules.matchPassword) {
            const passwordValue = this.fields.password.element.value;
            if (value !== passwordValue) {
                isValid = false;
                errorMessage = field.messages.matchPassword;
            }
        }

        // Age validation
        if (isValid && rules.validAge) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 13) {
                isValid = false;
                errorMessage = field.messages.validAge;
            }
        }

        this.setFieldStatus(fieldName, isValid, errorMessage);
        return isValid;
    }

    setFieldStatus(fieldName, isValid, errorMessage = '') {
        const field = this.fields[fieldName];
        if (!field || !field.element) return;

        const inputGroup = field.element.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');

        // Update field visual state
        field.element.classList.remove('valid', 'invalid');
        if (field.element.value.trim() || field.element.type === 'checkbox') {
            field.element.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Update error message
        if (errorElement) {
            if (!isValid && errorMessage) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                inputGroup.classList.add('shake');
                setTimeout(() => inputGroup.classList.remove('shake'), 500);
            } else {
                errorElement.classList.remove('show');
                setTimeout(() => {
                    if (!errorElement.classList.contains('show')) {
                        errorElement.textContent = '';
                    }
                }, 300);
            }
        }
    }

    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        if (!field || !field.element) return;

        const inputGroup = field.element.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    updatePasswordStrength() {
        const password = this.fields.password.element.value;
        let strength = 0;
        let strengthText = 'Very Weak';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        // Remove all strength classes
        this.strengthBar.classList.remove('weak', 'fair', 'good', 'strong');

        switch (strength) {
            case 0:
            case 1:
                this.strengthBar.classList.add('weak');
                strengthText = 'Weak';
                break;
            case 2:
                this.strengthBar.classList.add('fair');
                strengthText = 'Fair';
                break;
            case 3:
            case 4:
                this.strengthBar.classList.add('good');
                strengthText = 'Good';
                break;
            case 5:
                this.strengthBar.classList.add('strong');
                strengthText = 'Strong';
                break;
        }

        this.strengthText.textContent = `Password strength: ${strengthText}`;
    }

    validateForm() {
        let isFormValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            const fieldValid = this.validateField(fieldName);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        const isValid = this.validateForm();

        if (!isValid) {
            this.showFeedback('Please correct the errors above', 'error');
            return;
        }

        this.isSubmitting = true;
        this.toggleSubmitButton(true);

        try {
            // Simulate API call
            await this.submitForm();
            this.showFeedback('Registration successful! Welcome aboard!', 'success');
            this.resetForm();
        } catch (error) {
            this.showFeedback('Registration failed. Please try again.', 'error');
            console.error('Registration error:', error);
        } finally {
            this.isSubmitting = false;
            this.toggleSubmitButton(false);
        }
    }

    async submitForm() {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Server error'));
                }
            }, 2000);
        });
    }

    toggleSubmitButton(loading) {
        const submitBtn = this.form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.classList.add('show');
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.classList.remove('show');
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('form-feedback');
        feedback.textContent = message;
        feedback.className = `form-feedback ${type} show`;

        setTimeout(() => {
            feedback.classList.remove('show');
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        
        // Clear all field states
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field.element) {
                field.element.classList.remove('valid', 'invalid');
                this.clearFieldError(fieldName);
            }
        });

        // Reset password strength
        this.strengthBar.classList.remove('weak', 'fair', 'good', 'strong');
        this.strengthText.textContent = 'Password strength';
    }
}

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format phone number as user types
    formatPhoneNumber(value) {
        const phoneNumber = value.replace(/\D/g, '');
        if (phoneNumber.length < 4) return phoneNumber;
        if (phoneNumber.length < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
};

// Initialize the form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const validator = new FormValidator('registration-form');

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const formatted = utils.formatPhoneNumber(e.target.value);
            e.target.value = formatted;
        });
    }

    // Add fade-in animation to form
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.classList.add('fadeIn');
    }

    console.log('Advanced Form Validation System initialized');
});
