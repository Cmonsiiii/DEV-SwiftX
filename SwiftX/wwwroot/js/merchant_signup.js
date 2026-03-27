// merchant_signup.js — v1.0.0
// Single-page merchant form. Validates on submit + live feedback.
// Console.log dumps all field values on submit for debugging.

(function () {
    'use strict';

    var MAX_MB = 10;
    var MAX_BYTES = MAX_MB * 1024 * 1024;

    // ── DOM refs ──────────────────────────────────────────────────────────────

    var el = {
        form: document.getElementById('merchantSignupForm'),

        // Section 1
        businessname: document.getElementById('inp-businessname'),
        ownerfirst: document.getElementById('inp-ownerfirst'),
        ownerlast: document.getElementById('inp-ownerlast'),
        bizaddress: document.getElementById('inp-bizaddress'),
        bizcontact: document.getElementById('inp-bizcontact'),
        bizemail: document.getElementById('inp-bizemail'),

        // Section 2
        bir: document.getElementById('inp-bir'),
        dti: document.getElementById('inp-dti'),      // optional
        barangay: document.getElementById('inp-barangay'),
        gcash: document.getElementById('inp-gcash'),

        // Section 3
        username: document.getElementById('inp-username'),
        email: document.getElementById('inp-email'),
        password: document.getElementById('inp-password'),
        confirm: document.getElementById('inp-confirm'),
    };

    // ── Error helpers ─────────────────────────────────────────────────────────

    function showErr(id, msg) {
        var span = document.getElementById('err-' + id);
        if (!span) return;
        span.textContent = msg;
        span.classList.add('visible');
    }

    function clearErr(id) {
        var span = document.getElementById('err-' + id);
        if (!span) return;
        span.textContent = '';
        span.classList.remove('visible');
    }

    function setBorder(input, isError) {
        if (!input) return;
        input.style.borderColor = isError ? '#ef4444' : '';
    }

    // ── File UI helper ────────────────────────────────────────────────────────

    function setFileUI(inputEl, hasFile, fileName) {
        var wrapper = inputEl && inputEl.closest ? inputEl.closest('.su-file-upload') : null;
        if (!wrapper) return;
        var labelDiv = wrapper.querySelector('.su-file-label');
        if (!labelDiv) return;
        var span = labelDiv.querySelector('span');
        if (!span) return;
        if (!span.dataset.orig) span.dataset.orig = span.textContent.trim();
        if (hasFile) {
            wrapper.classList.add('has-file');
            var name = fileName || '';
            span.textContent = name.length > 24 ? name.slice(0, 21) + '…' : name;
        } else {
            wrapper.classList.remove('has-file');
            span.textContent = span.dataset.orig;
        }
    }

    // ── Individual validators ─────────────────────────────────────────────────

    function chkRequired(input, errId, label) {
        if (!input || !input.value.trim()) {
            showErr(errId, label + ' is required.');
            setBorder(input, true);
            return false;
        }
        clearErr(errId);
        setBorder(input, false);
        return true;
    }

    function chkPhone(input, errId, label) {
        if (!input || !input.value.trim()) {
            showErr(errId, label + ' is required.');
            setBorder(input, true);
            return false;
        }
        var clean = input.value.replace(/\s+/g, '');
        if (!/^09\d{9}$/.test(clean)) {
            showErr(errId, 'Enter a valid PH mobile number (09XXXXXXXXX).');
            setBorder(input, true);
            return false;
        }
        clearErr(errId);
        setBorder(input, false);
        return true;
    }

    function chkEmail(input, errId) {
        if (!input || !input.value.trim()) {
            showErr(errId, 'Email address is required.');
            setBorder(input, true);
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            showErr(errId, 'Enter a valid email address.');
            setBorder(input, true);
            return false;
        }
        clearErr(errId);
        setBorder(input, false);
        return true;
    }

    function chkFile(input, errId, label) {
        if (!input || !input.files || input.files.length === 0) {
            showErr(errId, label + ' is required.');
            return false;
        }
        if (input.files[0].size > MAX_BYTES) {
            showErr(errId, 'File too large — max ' + MAX_MB + ' MB.');
            setFileUI(input, false, '');
            input.value = '';
            return false;
        }
        clearErr(errId);
        return true;
    }

    function chkPassword() {
        if (!el.password || !el.password.value) {
            showErr('password', 'Password is required.');
            setBorder(el.password, true);
            return false;
        }
        if (el.password.value.length < 8) {
            showErr('password', 'Password must be at least 8 characters.');
            setBorder(el.password, true);
            return false;
        }
        clearErr('password');
        setBorder(el.password, false);
        return true;
    }

    function chkConfirm() {
        if (!el.confirm || !el.confirm.value) {
            showErr('confirm', 'Please confirm your password.');
            setBorder(el.confirm, true);
            return false;
        }
        if (el.confirm.value !== el.password.value) {
            showErr('confirm', 'Passwords do not match.');
            setBorder(el.confirm, true);
            return false;
        }
        clearErr('confirm');
        setBorder(el.confirm, false);
        return true;
    }

    // ── Section completeness (for indicator) ──────────────────────────────────

    function fileOk(inp) {
        return inp && inp.files && inp.files.length > 0 && inp.files[0].size <= MAX_BYTES;
    }

    function sec1Complete() {
        return (
            el.businessname.value.trim() &&
            el.ownerfirst.value.trim() &&
            el.ownerlast.value.trim() &&
            el.bizaddress.value.trim() &&
            /^09\d{9}$/.test(el.bizcontact.value.replace(/\s+/g, '')) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.bizemail.value.trim())
        );
    }

    function sec2Complete() {
        return (
            fileOk(el.bir) &&
            fileOk(el.barangay) &&
            /^09\d{9}$/.test((el.gcash.value || '').replace(/\s+/g, ''))
        );
        // dti is optional — intentionally excluded from completion check
    }

    function sec3Complete() {
        return (
            el.username.value.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.email.value.trim()) &&
            el.password.value.length >= 8 &&
            el.confirm.value === el.password.value
        );
    }

    // ── Step indicator ────────────────────────────────────────────────────────

    function refreshIndicator() {
        var s1 = !!sec1Complete();
        var s2 = !!sec2Complete();
        var s3 = !!sec3Complete();

        applyCircle('[data-step-circle="1"]', s1);
        applyCircle('[data-step-circle="2"]', s2);
        applyCircle('[data-step-circle="3"]', s3);
        applyCircle('#card-circle-1', s1);
        applyCircle('#card-circle-2', s2);
        applyCircle('#card-circle-3', s3);

        applyLabel('[data-step-label="1"]', s1);
        applyLabel('[data-step-label="2"]', s2);
        applyLabel('[data-step-label="3"]', s3);

        applyConnector('[data-connector="1"]', s1);
        applyConnector('[data-connector="2"]', s2);
    }

    function applyCircle(sel, done) {
        var node = document.querySelector(sel);
        if (!node) return;
        node.classList.toggle('completed', done);
        node.classList.remove('active');   // no "active" state in single-page mode
    }

    function applyLabel(sel, done) {
        var node = document.querySelector(sel);
        if (!node) return;
        node.classList.toggle('completed', done);
        node.classList.remove('active');
    }

    function applyConnector(sel, filled) {
        var node = document.querySelector(sel);
        if (!node) return;
        node.classList.toggle('filled', filled);
    }

    // ── Full validate (on submit) ─────────────────────────────────────────────

    function validateAll() {
        var ok = true;

        // Section 1
        if (!chkRequired(el.businessname, 'businessname', 'Business name')) ok = false;
        if (!chkRequired(el.ownerfirst, 'ownerfirst', 'Owner first name')) ok = false;
        if (!chkRequired(el.ownerlast, 'ownerlast', 'Owner last name')) ok = false;
        if (!chkRequired(el.bizaddress, 'bizaddress', 'Business address')) ok = false;
        if (!chkPhone(el.bizcontact, 'bizcontact', 'Business contact')) ok = false;
        if (!chkEmail(el.bizemail, 'bizemail')) ok = false;

        // Section 2
        if (!chkFile(el.bir, 'bir', 'BIR Form 2303')) ok = false;
        if (!chkFile(el.barangay, 'barangay', 'Barangay Business Clearance')) ok = false;
        if (!chkPhone(el.gcash, 'gcash', 'GCash number')) ok = false;
        // dti is optional — skip validation

        // Section 3
        if (!chkRequired(el.username, 'username', 'Username')) ok = false;
        if (!chkEmail(el.email, 'email')) ok = false;
        if (!chkPassword()) ok = false;
        if (!chkConfirm()) ok = false;

        return ok;
    }

    // ── Console debug dump ────────────────────────────────────────────────────

    function fileInfo(inp) {
        if (!inp || !inp.files || inp.files.length === 0) return '(no file selected)';
        var f = inp.files[0];
        return f.name + '  [' + (f.size / 1024).toFixed(1) + ' KB, type=' + f.type + ']';
    }

    function debugDump() {
        console.group('%c[SwiftX] Merchant Signup — Form Values on Submit', 'color:#f5a623;font-weight:bold;');

        console.group('── Section 1: Basic Info');
        console.log('Business Name    :', el.businessname ? el.businessname.value : '(missing)');
        console.log('Owner First Name :', el.ownerfirst ? el.ownerfirst.value : '(missing)');
        console.log('Owner Last Name  :', el.ownerlast ? el.ownerlast.value : '(missing)');
        console.log('Business Address :', el.bizaddress ? el.bizaddress.value : '(missing)');
        console.log('Business Contact :', el.bizcontact ? el.bizcontact.value : '(missing)');
        console.log('Business Email   :', el.bizemail ? el.bizemail.value : '(missing)');
        console.groupEnd();

        console.group('── Section 2: Documents & Payment');
        console.log('BIR Form 2303    :', fileInfo(el.bir));
        console.log('DTI Certificate  :', fileInfo(el.dti), '(optional)');
        console.log('Brgy Clearance   :', fileInfo(el.barangay));
        console.log('GCash Number     :', el.gcash ? el.gcash.value : '(missing)');
        console.groupEnd();

        console.group('── Section 3: Account Setup');
        console.log('Username         :', el.username ? el.username.value : '(missing)');
        console.log('Email            :', el.email ? el.email.value : '(missing)');
        console.log('Password         :', el.password ? '[' + el.password.value.length + ' chars]' : '(missing)');
        console.log('Confirm PW       :', el.confirm ? '[' + el.confirm.value.length + ' chars, match=' + (el.confirm.value === el.password.value) + ']' : '(missing)');
        console.groupEnd();

        console.groupEnd();
    }

    // ── Live listeners — Section 1 ────────────────────────────────────────────

    [el.businessname, el.ownerfirst, el.ownerlast, el.bizaddress, el.username].forEach(function (inp) {
        if (!inp) return;
        inp.addEventListener('input', function () { setBorder(inp, false); refreshIndicator(); });
    });

    [el.bizcontact, el.gcash].forEach(function (inp) {
        if (!inp) return;
        inp.addEventListener('input', function () { setBorder(inp, false); refreshIndicator(); });
    });

    [el.bizemail, el.email].forEach(function (inp) {
        if (!inp) return;
        inp.addEventListener('input', function () { setBorder(inp, false); refreshIndicator(); });
    });

    [el.password, el.confirm].forEach(function (inp) {
        if (!inp) return;
        inp.addEventListener('input', function () { setBorder(inp, false); refreshIndicator(); });
    });

    // ── Live listeners — Section 2 file inputs ────────────────────────────────

    var requiredFiles = [
        { inp: el.bir, errId: 'bir' },
        { inp: el.barangay, errId: 'barangay' },
    ];

    var optionalFiles = [
        { inp: el.dti }
    ];

    requiredFiles.concat(optionalFiles).forEach(function (item) {
        if (!item.inp) return;
        item.inp.addEventListener('change', function () {
            var hasFile = this.files && this.files.length > 0;
            var file = hasFile ? this.files[0] : null;

            if (hasFile && file.size > MAX_BYTES) {
                if (item.errId) showErr(item.errId, 'File too large — max ' + MAX_MB + ' MB.');
                setFileUI(this, false, '');
                this.value = '';
                refreshIndicator();
                return;
            }

            if (item.errId) clearErr(item.errId);
            setFileUI(this, hasFile, hasFile ? file.name : '');
            refreshIndicator();
        });
    });

    // ── Password toggle ───────────────────────────────────────────────────────

    document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var wrapper = this.closest('.password-wrapper');
            if (!wrapper) return;
            var input = wrapper.querySelector('input');
            var eyeOpen = this.querySelector('.eye-open');
            var eyeClosed = this.querySelector('.eye-closed');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                if (eyeOpen) eyeOpen.classList.add('hidden');
                if (eyeClosed) eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                if (eyeOpen) eyeOpen.classList.remove('hidden');
                if (eyeClosed) eyeClosed.classList.add('hidden');
            }
        });
    });

    // ── Form submit ───────────────────────────────────────────────────────────

    el.form.addEventListener('submit', function (e) {
        debugDump();

        var valid = validateAll();
        refreshIndicator();

        if (!valid) {
            e.preventDefault();
            var firstErr = el.form.querySelector('.field-error.visible');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.warn('[SwiftX] Merchant form blocked — validation failed.');
        } else {
            console.log('%c[SwiftX] All validations passed — submitting merchant form.', 'color:green;font-weight:bold;');
        }
    });

    // ── Init ──────────────────────────────────────────────────────────────────
    refreshIndicator();

})();