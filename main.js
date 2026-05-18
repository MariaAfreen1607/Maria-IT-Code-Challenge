/* ===== ULM Alumni Directory — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- SCROLL-TO-TOP BUTTON ---------- */
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- SCROLL REVEAL ANIMATION ---------- */
  const revealEls = document.querySelectorAll('.letter-group, .profession-group');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  /* ---------- LOGIN FORM VALIDATION ---------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    const showError = (input, errorEl, msg) => {
      input.classList.add('error');
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    };

    const clearError = (input, errorEl) => {
      input.classList.remove('error');
      errorEl.classList.remove('visible');
    };

    // Real-time clearing
    usernameInput.addEventListener('input', () => clearError(usernameInput, usernameError));
    passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Username validation
      const user = usernameInput.value.trim();
      if (!user) {
        showError(usernameInput, usernameError, 'Username is required.');
        valid = false;
      } else if (user.length < 3) {
        showError(usernameInput, usernameError, 'Must be at least 3 characters.');
        valid = false;
      }

      // Password validation
      const pass = passwordInput.value;
      if (!pass) {
        showError(passwordInput, passwordError, 'Password is required.');
        valid = false;
      } else if (pass.length < 6) {
        showError(passwordInput, passwordError, 'Must be at least 6 characters.');
        valid = false;
      }

      if (valid) {
        // Simulate successful login
        const btn = loginForm.querySelector('.btn-primary');
        btn.textContent = 'Logging in…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Login';
          btn.disabled = false;
          alert('This is a demo — login is not connected to a server.');
        }, 1200);
      }
    });
  }

  /* ---------- LIVE SEARCH / FILTER ---------- */
  const searchInput = document.getElementById('alumniSearch');
  if (searchInput) {
    const searchCount = document.getElementById('searchCount');
    const noResults = document.getElementById('noResults');
    const letterGroups = document.querySelectorAll('.letter-group');
    const professionGroups = document.querySelectorAll('.profession-group');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let totalVisible = 0;

      // Filter whichever view is active
      const groups = document.querySelectorAll('.letter-group:not([style*="display: none"]), .profession-group:not(.tab-hidden)');
      const allGroups = [...letterGroups, ...professionGroups];

      allGroups.forEach(group => {
        // Skip if this group is hidden by tab toggle
        if (group.classList.contains('tab-hidden')) return;

        const cards = group.querySelectorAll('.alumni-card');
        let groupVisible = 0;

        cards.forEach(card => {
          const name = card.getAttribute('data-name') || '';
          const profession = card.getAttribute('data-profession') || '';
          const match = name.includes(query) || profession.includes(query);
          card.style.display = match ? '' : 'none';
          if (match) groupVisible++;
        });

        totalVisible += groupVisible;

        // Hide the entire group heading if no cards match
        const heading = group.querySelector('.letter-heading, .profession-heading');
        if (heading) {
          group.style.display = groupVisible === 0 ? 'none' : '';
        }
      });

      // Update count & no-results message
      if (searchCount) {
        searchCount.style.opacity = query ? '1' : '0';
        searchCount.textContent = `${totalVisible} result${totalVisible !== 1 ? 's' : ''} found`;
      }
      if (noResults) {
        noResults.style.display = (query && totalVisible === 0) ? 'block' : 'none';
      }
    });
  }

  /* ---------- TAB TOGGLE (Names vs Professions) ---------- */
  const tabButtons = document.querySelectorAll('.tab-toggle button');
  if (tabButtons.length) {
    const letterGroups = document.querySelectorAll('.letter-group');
    const professionGroups = document.querySelectorAll('.profession-group');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.getAttribute('data-view');

        if (view === 'names') {
          letterGroups.forEach(g => { g.style.display = ''; g.classList.remove('tab-hidden'); });
          professionGroups.forEach(g => { g.style.display = 'none'; g.classList.add('tab-hidden'); });
        } else {
          letterGroups.forEach(g => { g.style.display = 'none'; g.classList.add('tab-hidden'); });
          professionGroups.forEach(g => { g.style.display = ''; g.classList.remove('tab-hidden'); });
        }

        // Re-trigger search filter
        const searchInput = document.getElementById('alumniSearch');
        if (searchInput && searchInput.value) {
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    });

    // Default: hide professions
    professionGroups.forEach(g => { g.style.display = 'none'; g.classList.add('tab-hidden'); });
  }

});
