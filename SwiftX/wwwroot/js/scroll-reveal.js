(function () {
        var targets = document.querySelectorAll('.__reveal, .__reveal--left');
        if (!targets.length) return;

        var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                                entry.target.classList.add('is-visible');
                                observer.unobserve(entry.target);
                        }
                });
        }, { threshold: 0.15 });

        targets.forEach(function (el) {
                observer.observe(el);
        });
})();
