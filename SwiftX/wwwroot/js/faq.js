(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var buttons = document.querySelectorAll('[data-faq-button]');
        if (!buttons.length) return;

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var item = button.closest('.__faq-item');
                var drawer = item.querySelector('.__faq-drawer');
                var icon = button.querySelector('[data-faq-icon]');
                var expanded = button.getAttribute('aria-expanded') === 'true';

                buttons.forEach(function (otherButton) {
                    if (otherButton === button) return;
                    var otherItem = otherButton.closest('.__faq-item');
                    var otherDrawer = otherItem.querySelector('.__faq-drawer');
                    var otherIcon = otherButton.querySelector('[data-faq-icon]');
                    otherDrawer.classList.remove('is-open');
                    otherButton.setAttribute('aria-expanded', 'false');
                    if (otherIcon) otherIcon.classList.remove('is-open');
                });

                if (expanded) {
                    drawer.classList.remove('is-open');
                    button.setAttribute('aria-expanded', 'false');
                    if (icon) icon.classList.remove('is-open');
                } else {
                    drawer.classList.add('is-open');
                    button.setAttribute('aria-expanded', 'true');
                    if (icon) icon.classList.add('is-open');
                }
            });
        });
    });
})();
