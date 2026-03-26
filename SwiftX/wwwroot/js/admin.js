(function () {

        // ── Sidebar Toggle (mobile) ──
        var sidebar = document.querySelector('.admin-sidebar');
        var overlay = document.querySelector('.admin-sidebar-overlay');
        var toggleBtn = document.querySelector('.admin-sidebar-toggle');

        function openSidebar() {
                if (sidebar) sidebar.classList.add('open');
                if (overlay) overlay.classList.add('open');
        }
        function closeSidebar() {
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
        }

        if (toggleBtn) {
                toggleBtn.addEventListener('click', function () {
                        if (sidebar && sidebar.classList.contains('open')) {
                                closeSidebar();
                        } else {
                                openSidebar();
                        }
                });
        }
        if (overlay) {
                overlay.addEventListener('click', closeSidebar);
        }

        // ── Filter Tabs ──
        document.querySelectorAll('.admin-filter-bar').forEach(function (bar) {
                var btns = bar.querySelectorAll('.admin-filter-btn');
                btns.forEach(function (btn) {
                        btn.addEventListener('click', function () {
                                btns.forEach(function (b) { b.classList.remove('active'); });
                                btn.classList.add('active');

                                var filter = btn.getAttribute('data-filter');
                                var tableCard = btn.closest('.admin-table-card');
                                if (!tableCard) return;

                                var rows = tableCard.querySelectorAll('tbody tr[data-status]');
                                rows.forEach(function (row) {
                                        if (filter === 'all' || row.getAttribute('data-status') === filter) {
                                                row.style.display = '';
                                        } else {
                                                row.style.display = 'none';
                                        }
                                });
                        });
                });
        });

        // ── Search ──
        document.querySelectorAll('.admin-search input').forEach(function (input) {
                input.addEventListener('input', function () {
                        var query = this.value.toLowerCase();
                        var tableCard = this.closest('.admin-table-card');
                        if (!tableCard) return;

                        var rows = tableCard.querySelectorAll('tbody tr');
                        rows.forEach(function (row) {
                                var text = row.textContent.toLowerCase();
                                row.style.display = text.includes(query) ? '' : 'none';
                        });
                });
        });

})();
