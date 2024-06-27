// Wrap everything in a DOMContentLoaded event listener to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // DOM Elements
        const passwordDisplay = document.getElementById('password');
        const lengthSlider = document.getElementById('length');
        const lengthValue = document.getElementById('lengthValue');
        const typePassword = document.getElementById('typePassword');
        const typePassphrase = document.getElementById('typePassphrase');
        const includeUppercase = document.getElementById('uppercase');
        const includeLowercase = document.getElementById('lowercase');
        const includeNumbers = document.getElementById('numbers');
        const includeSymbols = document.getElementById('symbols');
        const generateBtn = document.getElementById('generate');
        const copyBtn = document.getElementById('copy');
        const strengthMeter = document.getElementById('strengthMeter');
        const strengthText = document.getElementById('strengthText');
        const crackTimeText = document.getElementById('crackTime');

        // Character sets
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'watermelon'];

        // Event Listeners
        lengthSlider.addEventListener('input', updatePasswordOnChange);
        typePassword.addEventListener('change', updatePasswordOnChange);
        typePassphrase.addEventListener('change', updatePasswordOnChange);
        includeUppercase.addEventListener('change', updatePasswordOnChange);
        includeLowercase.addEventListener('change', updatePasswordOnChange);
        includeNumbers.addEventListener('change', updatePasswordOnChange);
        includeSymbols.addEventListener('change', updatePasswordOnChange);
        generateBtn.addEventListener('click', generatePassword);
        copyBtn.addEventListener('click', copyToClipboard);

        // Functions
        function updateLengthValue() {
            lengthValue.textContent = lengthSlider.value;
        }

        function updatePasswordOnChange() {
            updateLengthValue();
            generatePassword();
        }

        function generatePassword() {
            let charset = '';
            let password = '';

            if (typePassword.checked) {
                if (includeUppercase.checked) charset += uppercaseChars;
                if (includeLowercase.checked) charset += lowercaseChars;
                if (includeNumbers.checked) charset += numberChars;
                if (includeSymbols.checked) charset += symbolChars;

                if (charset === '') {
                    alert('Please select at least one character type.');
                    return;
                }

                for (let i = 0; i < lengthSlider.value; i++) {
                    password += charset.charAt(Math.floor(Math.random() * charset.length));
                }
            } else {
                // Generate passphrase
                while (password.length < lengthSlider.value) {
                    let word = words[Math.floor(Math.random() * words.length)];
                    if (password.length + word.length + 1 <= lengthSlider.value) {
                        password += (password ? ' ' : '') + word;
                    } else if (password.length === 0) {
                        // If the first word is too long, use it anyway
                        password = word.slice(0, lengthSlider.value);
                        break;
                    } else {
                        // If we can't fit another word, stop here
                        break;
                    }
                }
            }

            passwordDisplay.value = password;
            updatePasswordStrength(password);
        }

        function updatePasswordStrength(password) {
            const strength = calculatePasswordStrength(password);
            const crackTime = estimateCrackTime(strength);

            strengthMeter.style.width = `${strength}%`;
            strengthText.textContent = getStrengthText(strength);
            crackTimeText.textContent = crackTime;
        }

        function calculatePasswordStrength(password) {
            let strength = 0;
            if (password.match(/[a-z]+/)) strength += 25;
            if (password.match(/[A-Z]+/)) strength += 25;
            if (password.match(/[0-9]+/)) strength += 25;
            if (password.match(/[$@#&!]+/)) strength += 25;
            return Math.min(100, strength + (password.length - 8) * 2);
        }

        function getStrengthText(strength) {
            if (strength < 25) return 'Very Weak';
            if (strength < 50) return 'Weak';
            if (strength < 75) return 'Moderate';
            if (strength < 90) return 'Strong';
            return 'Very Strong';
        }

        function estimateCrackTime(strength) {
            const times = [
                'Instantly',
                'A few seconds',
                'A few minutes',
                'A few hours',
                'A few days',
                'A few months',
                'A few years',
                'Centuries'
            ];
            return times[Math.floor(strength / 100 * (times.length - 1))];
        }

        function copyToClipboard() {
            passwordDisplay.select();
            document.execCommand('copy');
            alert('Password copied to clipboard!');
        }

        // Initial call to set up the page and generate first password
        updateLengthValue();
        generatePassword();

        console.log('Password generator initialized successfully');
    } catch (error) {
        console.error('An error occurred in the password generator:', error);
    }
});