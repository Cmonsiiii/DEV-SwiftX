(function () {

        // ── Elements ──
        var form        = document.getElementById('admin-login-form');
        var btnLogin    = document.getElementById('btn-login');
        var usernameEl  = document.getElementById('login-username');
        var passwordEl  = document.getElementById('login-password');
        var errorBanner = document.getElementById('login-error-banner');
        var btnText     = document.querySelector('.btn-login-text');
        var btnLoader   = document.querySelector('.btn-login-loader');

        // ── Validation ──
        function validate() {
                var valid = usernameEl.value.trim() !== '' && passwordEl.value.trim() !== '';
                btnLogin.disabled = !valid;
        }

        usernameEl.addEventListener('input', function () {
                validate();
                hideError();
        });
        passwordEl.addEventListener('input', function () {
                validate();
                hideError();
        });

        // ── Error Banner ──
        function showError(msg) {
                errorBanner.querySelector('span').textContent = msg;
                errorBanner.classList.remove('hidden');
        }

        function hideError() {
                errorBanner.classList.add('hidden');
        }

        // ── Form Submit ──
        form.addEventListener('submit', function (e) {
                e.preventDefault();

                var username = usernameEl.value.trim();
                var password = passwordEl.value.trim();

                if (!username || !password) return;

                // Show loading state
                btnLogin.disabled = true;
                btnText.classList.add('hidden');
                btnLoader.classList.remove('hidden');
                hideError();

                // Simulate authentication (replace with real API call)
                setTimeout(function () {
                        // Reset loading state
                        btnText.classList.remove('hidden');
                        btnLoader.classList.add('hidden');
                        btnLogin.disabled = false;



                        // Placeholder: always show error for now
                        // Replace this block with actual auth logic
                        // showError('Invalid username or password.');
                }, 1500);
        });

        // ── Password Show / Hide ──
        document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                        var wrapper   = this.closest('.password-wrapper');
                        var input     = wrapper.querySelector('input');
                        var eyeOpen   = this.querySelector('.eye-open');
                        var eyeClosed = this.querySelector('.eye-closed');
                        if (input.type === 'password') {
                                input.type = 'text';
                                eyeOpen.classList.add('hidden');
                                eyeClosed.classList.remove('hidden');
                        } else {
                                input.type = 'password';
                                eyeOpen.classList.remove('hidden');
                                eyeClosed.classList.add('hidden');
                        }
                });
        });

})();
