/* ==========================================================================
   Skilloraa — scripts de l'interface
   Aucune dépendance. Tout est progressif : sans JS, la page reste lisible.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- Thème */
  // Le thème est déjà appliqué par le script inline dans <head> (anti-flash).
  // Ici on ne gère que le basculement manuel.
  var themeBtn = document.querySelector('.theme-toggle');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement;
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var current = root.getAttribute('data-theme') || (systemDark ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', next);
      themeBtn.setAttribute('aria-label',
        next === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre');

      try {
        localStorage.setItem('skilloraa-theme', next);
      } catch (e) {
        /* navigation privée, stockage bloqué : on ignore */
      }
    });
  }

  /* ----------------------------------------------------- Menu mobile */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // Refermer au clic sur un lien
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    // Refermer avec Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    // Repasser en mode bureau proprement
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  /* --------------------------------------------- En-tête au défilement */
  var header = document.querySelector('.site-header');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------- Apparition au défilement */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal, .reveal-group');

  if (reduced || !('IntersectionObserver' in window)) {
    // Pas d'animation : on affiche tout immédiatement.
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // Indexer les enfants pour l'effet de cascade
    document.querySelectorAll('.reveal-group').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--i', i);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------- Année du copyright */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* -------------------------------------------------- Formulaire contact */
  var form = document.getElementById('contact-form');

  if (form) {
    var status = document.getElementById('form-status');
    var submit = form.querySelector('[type="submit"]');
    var action = form.getAttribute('action') || '';

    // Tant que l'endpoint Formspree n'est pas configuré, on bascule sur un
    // mailto pré-rempli plutôt que d'envoyer les données dans le vide.
    var configured = action.indexOf('VOTRE_ID_FORMSPREE') === -1 && action.indexOf('formspree.io') !== -1;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(form);

      if (!configured) {
        var body = [
          'Nom : ' + (data.get('nom') || ''),
          'Email : ' + (data.get('email') || ''),
          'Discipline : ' + (data.get('discipline') || ''),
          'Niveau : ' + (data.get('niveau') || ''),
          '',
          String(data.get('message') || '')
        ].join('\n');

        window.location.href = 'mailto:contact@skilloraa.shop'
          + '?subject=' + encodeURIComponent('Demande de séance découverte — ' + (data.get('nom') || ''))
          + '&body=' + encodeURIComponent(body);

        setStatus('Votre logiciel de messagerie va s’ouvrir avec le message pré-rempli.', 'ok');
        return;
      }

      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Envoi en cours…';
      setStatus('', '');

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          setStatus('Merci ! Votre message est parti. Réponse sous 24 h ouvrées.', 'ok');
        })
        .catch(function () {
          setStatus(
            'L’envoi a échoué. Écrivez-nous directement à contact@skilloraa.shop.',
            'err'
          );
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = original;
        });
    });

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = kind === 'err' ? '#c9421c' : kind === 'ok' ? '#2f7a4f' : '';
    }
  }
})();
