(function () {

    // ── Initialize reusable multi-step controller ──
    var stepper = new MultistepForm({
        totalSteps: 3,
        onSubmit: function () {
            alert('Application submitted successfully!');
        }
    });

    // ── Populate Date-of-Birth Selects (rider only) ──
    var dateSelect = document.getElementById('dob-date');
    var yearSelect = document.getElementById('dob-year');

    if (dateSelect && yearSelect) {
        for (var d = 1; d <= 31; d++) {
            var opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            dateSelect.appendChild(opt);
        }

        for (var y = 2008; y >= 1949; y--) {
            var opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        }
    }

    // ── Step Validations ──
    function validateStep1() {
        var inputs = document.querySelectorAll('[data-step1]');
        var valid = true;
        inputs.forEach(function (el) {
            if (el.tagName === 'SELECT') {
                if (!el.value) valid = false;
            } else {
                if (!el.value.trim()) valid = false;
            }
        });
        document.getElementById('btn-step1').disabled = !valid;
    }

    function validateStep2() {
        var inputs = document.querySelectorAll('[data-step2]');
        var valid = true;
        inputs.forEach(function (el) {
            if (el.type === 'file') {
                if (!el.files || el.files.length === 0) valid = false;
            } else {
                if (!el.value.trim()) valid = false;
            }
        });
        document.getElementById('btn-step2').disabled = !valid;
    }

    function validateStep3() {
        var inputs = document.querySelectorAll('[data-step3]');
        var valid = true;
        inputs.forEach(function (el) {
            if (!el.value.trim()) valid = false;
        });
        document.getElementById('btn-step3').disabled = !valid;
    }

    // ── Input Listeners ──
    document.querySelectorAll('[data-step1]').forEach(function (el) {
        el.addEventListener('input', validateStep1);
        el.addEventListener('change', validateStep1);
    });

    document.querySelectorAll('[data-step2]').forEach(function (el) {
        if (el.type === 'file') {
            var wrapper = el.closest('.file-upload');
            var textEl = wrapper.querySelector('.file-upload__text span');
            var defaultText = textEl.textContent;
            el.addEventListener('change', function () {
                if (this.files.length > 0) {
                    wrapper.classList.add('has-file');
                    textEl.textContent = this.files[0].name;
                } else {
                    wrapper.classList.remove('has-file');
                    textEl.textContent = defaultText;
                }
                validateStep2();
            });
        } else {
            el.addEventListener('input', validateStep2);
        }
    });

    // Optional file uploads — show file name but don't block validation
    document.querySelectorAll('[data-step2-optional]').forEach(function (el) {
        var wrapper = el.closest('.file-upload');
        var textEl = wrapper.querySelector('.file-upload__text span');
        var defaultText = textEl.textContent;
        el.addEventListener('change', function () {
            if (this.files.length > 0) {
                wrapper.classList.add('has-file');
                textEl.textContent = this.files[0].name;
            } else {
                wrapper.classList.remove('has-file');
                textEl.textContent = defaultText;
            }
        });
    });

    document.querySelectorAll('[data-step3]').forEach(function (el) {
        el.addEventListener('input', validateStep3);
    });

    // ── Password Show / Hide ──
    document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var wrapper = this.closest('.password-wrapper');
            var input = wrapper.querySelector('input');
            var eyeOpen = this.querySelector('.eye-open');
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
