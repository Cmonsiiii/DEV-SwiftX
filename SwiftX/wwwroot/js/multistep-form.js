/**
 * MultistepForm – Reusable multi-step form controller.
 *
 * Usage:
 *   const form = new MultistepForm({
 *       totalSteps: 3,
 *       onSubmit: function () { ... }
 *   });
 *
 * HTML contract (data-attribute based):
 *   - Cards:           [data-card="1"], [data-card="2"], ...
 *   - Card headers:    .form-card__header  (inside each card)
 *   - Card bodies:     .form-card__body    (inside each card)
 *   - Card circles:    [data-card-circle="1"], ...
 *   - Step circles:    [data-step-circle="1"], ...
 *   - Step labels:     [data-step-label="1"], ...
 *   - Connectors:      .step-connector[data-connector="1"], ...
 *   - Next buttons:    #btn-step1, #btn-step2, ... (last one is submit)
 *
 * CSS classes used: .collapsed, .active, .completed, .filled
 */

function MultistepForm(options) {
    var totalSteps = options.totalSteps || 3;
    var onSubmit = options.onSubmit || function () { };
    var collapsedHeight = options.collapsedHeight || '60px';

    var cards = document.querySelectorAll('.form-card');
    var circles = document.querySelectorAll('[data-step-circle]');
    var labels = document.querySelectorAll('[data-step-label]');
    var connectors = document.querySelectorAll('.step-connector');

    var currentStep = 1;
    var completedSteps = new Set();

    // ── Initialize card heights ──
    cards.forEach(function (card) {
        var s = parseInt(card.dataset.card);
        if (s === 1) {
            card.style.maxHeight = card.scrollHeight + 200 + 'px';
        } else {
            card.style.maxHeight = collapsedHeight;
        }
    });

    // ── Step Indicator Update ──
    function updateStepIndicator(step) {
        circles.forEach(function (c) {
            var s = parseInt(c.dataset.stepCircle);
            c.classList.remove('active', 'completed');
            if (s === step) c.classList.add('active');
            else if (completedSteps.has(s)) c.classList.add('completed');
        });
        labels.forEach(function (l) {
            var s = parseInt(l.dataset.stepLabel);
            l.classList.remove('active', 'completed');
            if (s === step) l.classList.add('active');
            else if (completedSteps.has(s)) l.classList.add('completed');
        });
        connectors.forEach(function (c) {
            var s = parseInt(c.dataset.connector);
            if (completedSteps.has(s)) c.classList.add('filled');
            else c.classList.remove('filled');
        });

        document.querySelectorAll('[data-card-circle]').forEach(function (c) {
            var s = parseInt(c.dataset.cardCircle);
            c.classList.remove('active', 'completed');
            if (s === step) c.classList.add('active');
            else if (completedSteps.has(s)) c.classList.add('completed');
        });
    }

    // ── Navigate to Step ──
    function goToStep(step) {
        currentStep = step;
        cards.forEach(function (card) {
            var s = parseInt(card.dataset.card);
            if (s === step) {
                card.classList.remove('collapsed');
                card.style.maxHeight = card.scrollHeight + 'px';
                setTimeout(function () {
                    if (!card.classList.contains('collapsed')) {
                        card.style.maxHeight = card.scrollHeight + 200 + 'px';
                    }
                }, 550);
            } else {
                card.classList.add('collapsed');
                card.style.maxHeight = collapsedHeight;
            }
        });
        updateStepIndicator(step);

        var activeCard = document.querySelector('[data-card="' + step + '"]');
        if (activeCard) {
            setTimeout(function () {
                activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // ── Can Navigate Check ──
    function canGoToStep(s) {
        for (var i = 1; i < s; i++) {
            if (!completedSteps.has(i)) return false;
        }
        return true;
    }

    // ── Next / Submit Buttons ──
    for (var i = 1; i <= totalSteps; i++) {
        (function (step) {
            var btn = document.getElementById('btn-step' + step);
            if (!btn) return;
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (this.disabled) return;
                completedSteps.add(step);
                if (step < totalSteps) {
                    goToStep(step + 1);
                } else {
                    updateStepIndicator(step);
                    onSubmit();
                }
            });
        })(i);
    }

    // ── Click Collapsed Card to Navigate ──
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (!this.classList.contains('collapsed')) return;
            var s = parseInt(this.dataset.card);
            if (canGoToStep(s)) goToStep(s);
        });
    });

    // ── Clickable Step Indicator Circles & Labels ──
    circles.forEach(function (c) {
        c.style.cursor = 'pointer';
        c.addEventListener('click', function () {
            var s = parseInt(this.dataset.stepCircle);
            if (canGoToStep(s)) goToStep(s);
        });
    });

    labels.forEach(function (l) {
        l.style.cursor = 'pointer';
        l.addEventListener('click', function () {
            var s = parseInt(this.dataset.stepLabel);
            if (canGoToStep(s)) goToStep(s);
        });
    });

    // ── Public API ──
    return {
        goToStep: goToStep,
        canGoToStep: canGoToStep,
        getCurrentStep: function () { return currentStep; },
        getCompletedSteps: function () { return completedSteps; },
        completeStep: function (s) { completedSteps.add(s); },
        updateIndicator: function () { updateStepIndicator(currentStep); }
    };
}
