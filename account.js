/* ============================================================
   Cuenta de usuario Masajemalaga
   ------------------------------------------------------------
   Registro con email+contraseña o Google, panel con historial de
   solicitudes de reserva hechas desde la web y un contador de
   fidelidad. Usa Firebase Authentication + Realtime Database,
   el MISMO proyecto que ya usa el calendario de reservas.
   ------------------------------------------------------------- */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAY2-B1St2i21vGdikzNP3yRI5lTEl7z6E",
  authDomain: "spatorremolinosreservas.firebaseapp.com",
  databaseURL: "https://spatorremolinosreservas-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spatorremolinosreservas",
  storageBucket: "spatorremolinosreservas.firebasestorage.app",
  messagingSenderId: "248632467073",
  appId: "1:248632467073:web:b6f87990bd2a3c41b17780",
  measurementId: "G-5H2YK9EL1T"
};

/* Cuántas solicitudes de reserva hacen falta para el próximo aviso
   de fidelidad, y qué mensaje mostrar. Un solo sitio para cambiarlo. */
const LOYALTY_GOAL = 5;
const LOYALTY_MSG = 'Escríbenos por WhatsApp al llegar a tu 5ª solicitud: te aplicamos un detalle en esa sesión.';

/* Tipos de bono que el panel de administrador puede añadir con un clic
   (mismos nombres y sesiones que en la web y el chatbot). El admin
   también puede crear uno con un número de sesiones distinto si hace
   falta algo fuera de esta lista. */
const PACKAGE_TYPES = {
  bono3: { label: 'Bono 3 sesiones', sessions: 3 },
  bono5: { label: 'Bono 5 sesiones', sessions: 5 },
  bono10: { label: 'Bono 10 sesiones', sessions: 10 }
};

(function () {
  'use strict';

  var LANG = (document.documentElement.getAttribute('lang') || 'es').toLowerCase().slice(0, 2);

  var T = {
    es: {
      navLabel: 'Mi cuenta', back: 'Volver a mi cuenta', loginTitle: 'Accede a tu cuenta',
      loginSub: 'Guarda tus datos y consulta tus solicitudes de reserva.',
      signupTitle: 'Crea tu cuenta', signupSub: 'Tarda menos de un minuto.',
      name: 'Nombre', email: 'Email', phone: 'Teléfono (opcional)', pass: 'Contraseña',
      loginBtn: 'Entrar', signupBtn: 'Crear cuenta', google: 'Continuar con Google',
      noAccount: '¿No tienes cuenta?', hasAccount: '¿Ya tienes cuenta?',
      toSignup: 'Regístrate', toLogin: 'Entra aquí',
      logout: 'Cerrar sesión', history: 'Tus solicitudes', empty: 'Todavía no has hecho ninguna solicitud de reserva desde aquí.',
      loyaltyLabel: 'solicitudes registradas',
      packagesTitle: 'Tus bonos', sessionsLeft: 'de {total} sesiones disponibles',
      noPackages: 'Todavía no tienes ningún bono activo.',
      noSessionsLeft: '¿Sin sesiones? Escríbenos y te preparamos tu próximo bono.',
      promoEndsIn: 'Termina en', promoHours: 'h', promoBtn: 'Reservar con este descuento',
      generalOffer: 'Oferta para todos los clientes',
      adminPanel: 'Panel administrador', adminSearch: 'Buscar por email o teléfono',
      adminSearchBtn: 'Buscar', adminNotFound: 'No hay ningún cliente registrado con ese dato.',
      adminUseSession: 'Marcar 1 sesión usada', adminAddPackage: 'Añadir bono', adminDeletePkg: 'Eliminar bono',
      adminNewPromo: 'Crear promoción', adminPromoTitle: 'Título', adminPromoDiscount: 'Descuento (%)',
      adminPromoHours: 'Válida durante (horas)', adminPromoFor: 'Para', adminPromoForClient: 'Solo este cliente',
      adminPromoForAll: 'Todos los clientes', adminCreate: 'Crear', adminDelete: 'Eliminar',
      adminGlobalTitle: 'Promoción para todos', adminCustomSessions: 'Nº de sesiones',
      adminCustomLabel: 'Nombre del bono (opcional)', adminAdd: 'Añadir',
      errGeneric: 'Algo no ha ido bien. Prueba de nuevo.',
      errEmailInUse: 'Ya existe una cuenta con ese email. Prueba a entrar.',
      errWeak: 'La contraseña debe tener al menos 6 caracteres.',
      errInvalid: 'Revisa el email y la contraseña.',
      errProviderOff: 'Este método de acceso no está activado todavía. Prueba con el otro, o inténtalo más tarde.',
      errDomain: 'Esta web no está autorizada todavía para este acceso. Prueba con email y contraseña mientras tanto.',
      errRules: 'No se ha podido guardar tu cuenta. Inténtalo de nuevo en unos minutos.',
      errConfig: 'La cuenta de usuario aún no está activada del todo en esta web. Reserva por WhatsApp o el calendario mientras tanto.',
      footerCtaOut: 'Regístrate para conseguir descuentos y promociones',
      inlineGuestTitle: 'Crea tu cuenta y ahorra',
      inlineGuestSub: 'Consulta tus bonos, tus sesiones restantes y accede a promociones exclusivas.',
      inlineGuestBtn: 'Registrarme',
      inlineOpenPanel: 'Abrir mi panel completo'
    },
    en: {
      navLabel: 'My account', back: 'Back to my account', loginTitle: 'Log in', loginSub: 'Save your details and check your booking requests.',
      signupTitle: 'Create your account', signupSub: 'Takes less than a minute.',
      name: 'Name', email: 'Email', phone: 'Phone (optional)', pass: 'Password',
      loginBtn: 'Log in', signupBtn: 'Create account', google: 'Continue with Google',
      noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
      toSignup: 'Sign up', toLogin: 'Log in here',
      logout: 'Log out', history: 'Your requests', empty: "You haven't made any booking request from here yet.",
      loyaltyLabel: 'requests logged',
      packagesTitle: 'Your packages', sessionsLeft: 'of {total} sessions left',
      noPackages: 'You don\u2019t have any active package yet.',
      noSessionsLeft: 'Out of sessions? Message us and we\u2019ll set up your next package.',
      promoEndsIn: 'Ends in', promoHours: 'h', promoBtn: 'Book with this discount',
      generalOffer: 'Offer for all customers',
      adminPanel: 'Admin panel', adminSearch: 'Search by email or phone',
      adminSearchBtn: 'Search', adminNotFound: 'No customer found with that.',
      adminUseSession: 'Mark 1 session used', adminAddPackage: 'Add package', adminDeletePkg: 'Delete package',
      adminNewPromo: 'Create promotion', adminPromoTitle: 'Title', adminPromoDiscount: 'Discount (%)',
      adminPromoHours: 'Valid for (hours)', adminPromoFor: 'For', adminPromoForClient: 'This customer only',
      adminPromoForAll: 'All customers', adminCreate: 'Create', adminDelete: 'Delete',
      adminGlobalTitle: 'Promotion for everyone', adminCustomSessions: 'Number of sessions',
      adminCustomLabel: 'Package name (optional)', adminAdd: 'Add',
      errGeneric: 'Something went wrong. Try again.',
      errEmailInUse: 'An account with that email already exists. Try logging in.',
      errWeak: 'Password must be at least 6 characters.',
      errInvalid: 'Check your email and password.',
      errProviderOff: 'That sign-in method isn\u2019t switched on yet. Try the other one, or try again later.',
      errDomain: 'This site isn\u2019t authorised for this sign-in yet. Try email and password for now.',
      errRules: 'We couldn\u2019t save your account. Please try again in a few minutes.',
      errConfig: 'Accounts aren\u2019t fully switched on yet. Book via WhatsApp or the calendar for now.',
      footerCtaOut: 'Sign up to get discounts and promotions',
      inlineGuestTitle: 'Create your account and save',
      inlineGuestSub: 'Check your packages, sessions left and get exclusive offers.',
      inlineGuestBtn: 'Sign up',
      inlineOpenPanel: 'Open my full account'
    }
    // Nota: el resto de idiomas caen al español si no están aquí;
    // se pueden ampliar igual que en chatbot.js cuando se active de verdad.
  };
  var S = T[LANG] || T.es;

  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_GOOGLE = '<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.6-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.5 36 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>';

  var fbApp = null, fbAuth = null, fbDb = null, sdkPromise = null;
  var configReady = FIREBASE_CONFIG.apiKey.indexOf('PENDIENTE') === -1;

  function loadSDK() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = Promise.all([
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js')
    ]).then(function (mods) {
      var appMod = mods[0], authMod = mods[1], dbMod = mods[2];
      fbApp = appMod.initializeApp(FIREBASE_CONFIG);
      fbAuth = authMod.getAuth(fbApp);
      fbDb = dbMod.getDatabase(fbApp);
      return { appMod: appMod, authMod: authMod, dbMod: dbMod };
    });
    return sdkPromise;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var WA_NUMBER = '34621015923';
  function waLinkFor(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  /* Claves para poder buscar a un cliente por email o teléfono desde el
     panel de administrador. Firebase no permite ".", "#", "$", "[", "]"
     ni "/" dentro de una clave, así que el email se guarda con los
     puntos sustituidos por comas; el teléfono se guarda solo con
     dígitos y el "+" inicial si lo tiene. */
  function emailKey(email) {
    return String(email || '').trim().toLowerCase().replace(/[.#$\[\]/]/g, ',');
  }
  function phoneKey(phone) {
    return String(phone || '').replace(/[^0-9+]/g, '');
  }

  /* ---------- Construcción del DOM ---------- */
  var navBtn, overlay, modal;
  var mode = 'login';      // 'login' | 'signup' | 'account'
  var currentUser = null;

  function buildNavButton() {
    navBtn = document.createElement('button');
    navBtn.type = 'button';
    navBtn.className = 'acc-nav-btn';
    navBtn.setAttribute('aria-label', S.navLabel);
    navBtn.innerHTML = ICON_USER;
    navBtn.addEventListener('click', open);

    // Va SIEMPRE junto a las banderas de idioma (la fila que queda
    // debajo de "Reserva tu quiromasaje"), no al lado del botón — así no lo
    // descentra y queda del mismo tamaño que las banderas.
    var navLangRow = document.querySelector('.video-hero-nav .nav-lang-row') ||
                      document.querySelector('.nav .nav-lang-row');
    if (navLangRow) {
      navLangRow.insertBefore(navBtn, navLangRow.firstChild);
    } else {
      document.body.appendChild(navBtn);
      navBtn.style.position = 'fixed';
      navBtn.style.top = '18px';
      navBtn.style.right = '18px';
      navBtn.style.zIndex = '45';
    }
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'acc-overlay';
    overlay.innerHTML = '<div class="acc-modal"><button type="button" class="acc-close" aria-label="Cerrar">' + ICON_CLOSE + '</button><div class="acc-modal-body"></div></div>';
    document.body.appendChild(overlay);
    modal = overlay.querySelector('.acc-modal-body');
    overlay.querySelector('.acc-close').addEventListener('click', close);

    /* Cerrar solo con clic fuera / Escape cuando NO hay riesgo de perder
       lo que se está escribiendo: es decir, solo con sesión ya iniciada
       (viendo la cuenta), nunca mientras se rellena el login o el
       registro. Sin esto, el propio aviso de contraseñas del navegador
       (o el menú de "seleccionar todo" del móvil) hacía que Escape o un
       toque fuera del cuadro cerraran el formulario entero sin querer.
       Mientras se está en el formulario, solo la X lo cierra. */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay && currentUser) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open') && currentUser) close();
    });
  }

  /* Bloqueo del fondo mientras el panel está abierto.
     En móvil no basta con overflow:hidden — iOS y Android siguen
     desplazando la página por debajo. Fijamos el body en su sitio y
     luego devolvemos el scroll exactamente donde estaba. */
  var savedScrollY = 0;

  function lockBackground() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = (-savedScrollY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockBackground() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }

  function open() {
    overlay.classList.add('is-open');
    lockBackground();
    render();
    // El panel arranca siempre arriba del todo, para que no aparezca
    // ya desplazado y con el título fuera de vista.
    overlay.scrollTop = 0;
  }
  function close() {
    overlay.classList.remove('is-open');
    unlockBackground();
  }

  /* ---------- Vistas ---------- */
  function render() {
    if (currentUser) {
      if (mode === 'admin') renderAdmin();
      else renderAccount();
    }
    else if (mode === 'signup') renderForm(true);
    else renderForm(false);
  }


  // Información básica de protección de datos (RGPD art. 13) en el formulario de cuenta.
  var PRIV = {
    es: 'Responsable: Octavio Augusto Pacheco Gamero (augusto). Finalidad: gestionar tu cuenta, tus bonos y tus promociones. Derechos: acceso, rectificación, supresión y otros, escribiendo a octavioaugusto2005@gmail.com. Más información en la <a href="/legal.html#s2">política de privacidad</a>.',
    en: 'Controller: Octavio Augusto Pacheco Gamero (augusto). Purpose: managing your account, packs and promotions. Rights: access, rectification, erasure and others, by writing to octavioaugusto2005@gmail.com. More information in the <a href="/en/legal.html#s2">privacy policy</a>.',
    fr: 'Responsable : Octavio Augusto Pacheco Gamero (augusto). Finalité : gérer votre compte, vos forfaits et vos promotions. Droits : accès, rectification, effacement et autres, en écrivant à octavioaugusto2005@gmail.com. Plus d’informations dans la <a href="/fr/legal.html#s2">politique de confidentialité</a>.',
    it: 'Titolare: Octavio Augusto Pacheco Gamero (augusto). Finalità: gestire il tuo account, i tuoi pacchetti e le promozioni. Diritti: accesso, rettifica, cancellazione e altri, scrivendo a octavioaugusto2005@gmail.com. Maggiori informazioni nell’<a href="/it/legal.html#s2">informativa sulla privacy</a>.',
    nl: 'Verantwoordelijke: Octavio Augusto Pacheco Gamero (augusto). Doel: je account, pakketten en promoties beheren. Rechten: inzage, rectificatie, verwijdering en meer, via octavioaugusto2005@gmail.com. Meer informatie in het <a href="/nl/legal.html#s2">privacybeleid</a>.',
    pl: 'Administrator: Octavio Augusto Pacheco Gamero (augusto). Cel: obsługa konta, pakietów i promocji. Prawa: dostęp, sprostowanie, usunięcie i inne, pisząc na octavioaugusto2005@gmail.com. Więcej informacji w <a href="/pl/legal.html#s2">polityce prywatności</a>.',
    pt: 'Responsável: Octavio Augusto Pacheco Gamero (augusto). Finalidade: gerir a sua conta, pacotes e promoções. Direitos: acesso, retificação, apagamento e outros, escrevendo para octavioaugusto2005@gmail.com. Mais informações na <a href="/pt/legal.html#s2">política de privacidade</a>.'
  };
  function renderForm(isSignup) {
    modal.innerHTML =
      '<h3>' + escapeHtml(isSignup ? S.signupTitle : S.loginTitle) + '</h3>' +
      '<p class="acc-sub">' + escapeHtml(isSignup ? S.signupSub : S.loginSub) + '</p>' +
      '<div class="acc-error" id="accError"></div>' +
      '<form id="accForm">' +
        (isSignup ? '<div class="acc-field"><label>' + escapeHtml(S.name) + '</label><input type="text" id="accName" autocomplete="name" required></div>' : '') +
        '<div class="acc-field"><label>' + escapeHtml(S.email) + '</label><input type="email" id="accEmail" autocomplete="email" required></div>' +
        (isSignup ? '<div class="acc-field"><label>' + escapeHtml(S.phone) + '</label><input type="tel" id="accPhone" autocomplete="tel"></div>' : '') +
        '<div class="acc-field"><label>' + escapeHtml(S.pass) + '</label><input type="password" id="accPass" autocomplete="' + (isSignup ? 'new-password' : 'current-password') + '" minlength="6" required></div>' +
        '<button type="submit" class="acc-btn-primary" id="accSubmit">' + escapeHtml(isSignup ? S.signupBtn : S.loginBtn) + '</button>' +
      '</form>' +
      '<div class="acc-divider">' + escapeHtml(LANG === 'en' ? 'or' : 'o') + '</div>' +
      '<button type="button" class="acc-btn-google" id="accGoogle">' + ICON_GOOGLE + '<span>' + escapeHtml(S.google) + '</span></button>' +
      '<p class="acc-legal" style="font-size:12px;line-height:1.5;opacity:.75;margin:12px 0 0">' + (PRIV[LANG] || PRIV.es) + '</p>' +
      '<p class="acc-switch">' + escapeHtml(isSignup ? S.hasAccount : S.noAccount) +
        ' <button type="button" id="accSwitch">' + escapeHtml(isSignup ? S.toLogin : S.toSignup) + '</button></p>';

    modal.querySelector('#accForm').addEventListener('submit', function (e) {
      e.preventDefault();
      isSignup ? doSignup() : doLogin();
    });
    modal.querySelector('#accGoogle').addEventListener('click', doGoogle);
    modal.querySelector('#accSwitch').addEventListener('click', function () {
      mode = isSignup ? 'login' : 'signup';
      render();
    });
  }

  function showError(msg) {
    var box = modal.querySelector('#accError');
    if (!box) return;
    box.textContent = msg;
    box.classList.add('is-visible');
  }

  function friendlyError(code) {
    if (!configReady) return S.errConfig;
    switch (code) {
      case 'auth/email-already-in-use': return S.errEmailInUse;
      case 'auth/weak-password': return S.errWeak;
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found': return S.errInvalid;
      case 'auth/operation-not-allowed': return S.errProviderOff;
      case 'auth/unauthorized-domain': return S.errDomain;
      case 'PERMISSION_DENIED':
      case 'permission-denied': return S.errRules;
      default: return S.errGeneric;
    }
  }

  /* Nunca dejamos el error solo en el mensaje bonito para el cliente:
     siempre queda también el código real en la consola del navegador
     (F12 → Consola), para poder diagnosticar sin adivinar. */
  function logRaw(where, err) {
    console.error('[Masajemalaga cuenta] ' + where + ':', (err && (err.code || err.message)) || err);
  }

  function setBusy(busy) {
    var btn = modal.querySelector('#accSubmit');
    if (btn) btn.disabled = busy;
  }

  function doSignup() {
    if (!configReady) return showError(S.errConfig);
    setBusy(true);
    var name = modal.querySelector('#accName').value.trim();
    var email = modal.querySelector('#accEmail').value.trim();
    var phone = modal.querySelector('#accPhone').value.trim();
    var pass = modal.querySelector('#accPass').value;

    loadSDK().then(function (m) {
      return m.authMod.createUserWithEmailAndPassword(fbAuth, email, pass).then(function (cred) {
        return m.authMod.updateProfile(cred.user, { displayName: name }).then(function () {
          return saveProfile(m, cred.user.uid, { name: name, email: email, phone: phone });
        }).then(function () {
          // El aviso de sesión iniciada llega ANTES de que se guarde el
          // nombre, así que la primera pintada mostraba "Mi cuenta" en
          // vez del nombre real. Repintamos ya con el perfil completo.
          currentUser = cred.user;
          renderInline();
          if (overlay.classList.contains('is-open')) render();
        });
      });
    }).catch(function (err) {
      logRaw('registro', err);
      setBusy(false);
      showError(friendlyError(err && err.code));
    });
  }

  function doLogin() {
    if (!configReady) return showError(S.errConfig);
    setBusy(true);
    var email = modal.querySelector('#accEmail').value.trim();
    var pass = modal.querySelector('#accPass').value;
    loadSDK().then(function (m) {
      return m.authMod.signInWithEmailAndPassword(fbAuth, email, pass);
    }).catch(function (err) {
      logRaw('acceso', err);
      setBusy(false);
      showError(friendlyError(err && err.code));
    });
  }

  function doGoogle() {
    if (!configReady) return showError(S.errConfig);
    loadSDK().then(function (m) {
      var provider = new m.authMod.GoogleAuthProvider();
      return m.authMod.signInWithPopup(fbAuth, provider).then(function (cred) {
        return saveProfile(m, cred.user.uid, {
          name: cred.user.displayName || '', email: cred.user.email || '', phone: ''
        }, /* onlyIfMissing */ true);
      });
    }).catch(function (err) {
      logRaw('Google', err);
      showError(friendlyError(err && err.code));
    });
  }

  function saveProfile(m, uid, data, onlyIfMissing) {
    var profileRef = m.dbMod.ref(fbDb, 'customers/' + uid + '/profile');

    function write(email, phone) {
      return m.dbMod.set(profileRef, {
        name: data.name, email: data.email, phone: data.phone || '',
        createdAt: new Date().toISOString()
      }).then(function () { return writeIndex(m, uid, email, phone); });
    }
    if (!onlyIfMissing) return write(data.email, data.phone);

    return m.dbMod.get(profileRef).then(function (snap) {
      if (snap.exists()) {
        // El perfil ya existía (cliente que vuelve a entrar con Google);
        // igualmente refrescamos el índice de búsqueda por si acaso.
        var v = snap.val();
        return writeIndex(m, uid, v.email, v.phone);
      }
      return write(data.email, data.phone);
    });
  }

  /* El índice es lo que permite al panel de administrador encontrar a
     un cliente por su email o teléfono (los datos guardan al cliente
     bajo un identificador opaco, no bajo su email). Cada cliente solo
     puede apuntar su propia entrada a sí mismo — lo protegen las
     reglas de seguridad, no solo este código. */
  function writeIndex(m, uid, email, phone) {
    var writes = [];
    if (email) writes.push(m.dbMod.set(m.dbMod.ref(fbDb, 'customer-index/by-email/' + emailKey(email)), uid));
    if (phone) writes.push(m.dbMod.set(m.dbMod.ref(fbDb, 'customer-index/by-phone/' + phoneKey(phone)), uid));
    return Promise.all(writes);
  }

  /* ---------- Bonos y promociones (cliente y administrador) ---------- */
  function isPromoActive(v) {
    if (!v || v.active === false) return false;
    if (v.expiresAt && new Date(v.expiresAt).getTime() <= Date.now()) return false;
    return true;
  }

  function activePromosFrom(snap, isGlobal) {
    var out = [];
    snap.forEach(function (child) {
      var v = child.val();
      if (isPromoActive(v)) {
        var item = { id: child.key, isGlobal: !!isGlobal };
        for (var k in v) item[k] = v[k];
        out.push(item);
      }
    });
    return out;
  }

  function useSession(uid, pkgId) {
    return loadSDK().then(function (m) {
      var ref = m.dbMod.ref(fbDb, 'customers/' + uid + '/packages/' + pkgId + '/remaining');
      return m.dbMod.runTransaction(ref, function (current) {
        if (current === null || current === undefined) return current;
        return Math.max(0, current - 1);
      });
    });
  }

  function addPackage(m, uid, typeKey, customSessions, customLabel) {
    var info = typeKey ? PACKAGE_TYPES[typeKey] : null;
    var total = info ? info.sessions : Math.max(1, parseInt(customSessions, 10) || 1);
    var label = info ? info.label : (customLabel || ('Bono ' + total + ' sesiones'));
    var listRef = m.dbMod.ref(fbDb, 'customers/' + uid + '/packages');
    return m.dbMod.push(listRef, {
      label: label, total: total, remaining: total,
      purchasedAt: new Date().toISOString()
    });
  }

  function createPromo(m, scope, uid, data) {
    var path = scope === 'global' ? 'global-promos' : ('customers/' + uid + '/promos');
    var expiresAt = data.hours ? new Date(Date.now() + data.hours * 3600000).toISOString() : null;
    return m.dbMod.push(m.dbMod.ref(fbDb, path), {
      title: data.title,
      discountPct: data.discountPct || null,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt,
      active: true
    });
  }

  function deletePromo(m, scope, uid, promoId) {
    var path = scope === 'global' ? ('global-promos/' + promoId) : ('customers/' + uid + '/promos/' + promoId);
    return m.dbMod.remove(m.dbMod.ref(fbDb, path));
  }

  function deletePackage(m, uid, pkgId) {
    return m.dbMod.remove(m.dbMod.ref(fbDb, 'customers/' + uid + '/packages/' + pkgId));
  }

  function packagesHtml(items) {
    if (!items.length) {
      return '<div class="acc-history-empty">' + escapeHtml(S.noPackages) + '</div>';
    }
    return items.map(function (p) {
      var pct = Number(p.total) ? Math.max(0, Math.min(100, Math.round(100 * (Number(p.remaining) || 0) / Number(p.total)))) : 0;
      var left = S.sessionsLeft.replace('{total}', Number(p.total) || 0);
      return '<div class="acc-package">' +
        '<div class="acc-package-top">' +
          '<span class="acc-package-name">' + escapeHtml(p.label || '') + '</span>' +
          '<span class="acc-package-count">' + (Number(p.remaining) || 0) + ' ' + escapeHtml(left) + '</span>' +
        '</div>' +
        '<div class="acc-loyalty-bar"><div class="acc-loyalty-bar-fill" style="width:' + pct + '%"></div></div>' +
      '</div>';
    }).join('');
  }

  function promoCardHtml(p) {
    var hoursLeft = p.expiresAt
      ? Math.max(0, Math.round((new Date(p.expiresAt).getTime() - Date.now()) / 3600000))
      : null;
    var waMsg = 'Hola, quiero reservar con la promoción "' + p.title + '"' +
      (p.discountPct ? ' (' + p.discountPct + '% de descuento)' : '');
    return '<div class="acc-promo">' +
      (p.isGlobal ? '<div class="acc-promo-tag">' + escapeHtml(S.generalOffer) + '</div>' : '') +
      '<div class="acc-promo-title">' + escapeHtml(p.title || '') +
        (p.discountPct ? ' · -' + Number(p.discountPct) + '%' : '') + '</div>' +
      (hoursLeft !== null ? '<div class="acc-promo-time">' + escapeHtml(S.promoEndsIn) + ' ' + hoursLeft + escapeHtml(S.promoHours) + '</div>' : '') +
      '<a class="acc-btn-primary acc-promo-btn" href="' + waLinkFor(waMsg) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(S.promoBtn) + '</a>' +
    '</div>';
  }

  function loadPackagesAndPromos() {
    if (!currentUser) return;
    var uid = currentUser.uid;
    loadSDK().then(function (m) {
      return Promise.all([
        m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/packages')),
        m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/promos')),
        m.dbMod.get(m.dbMod.ref(fbDb, 'global-promos'))
      ]).then(function (snaps) {
        var pkgItems = [];
        snaps[0].forEach(function (c) { pkgItems.push(c.val()); });

        var pkgBox = modal.querySelector('#accPackages');
        if (pkgBox) pkgBox.innerHTML = packagesHtml(pkgItems);

        var totalRemaining = pkgItems.reduce(function (a, p) { return a + (p.remaining || 0); }, 0);
        var promos = activePromosFrom(snaps[1], false).concat(activePromosFrom(snaps[2], true));
        var promoBox = modal.querySelector('#accPromos');
        if (promoBox) {
          if (promos.length) {
            promoBox.innerHTML = promos.map(promoCardHtml).join('');
          } else if (!pkgItems.length || totalRemaining === 0) {
            promoBox.innerHTML = '<div class="acc-history-empty">' + escapeHtml(S.noSessionsLeft) + '</div>';
          } else {
            promoBox.innerHTML = '';
          }
        }
      });
    }).catch(function (err) {
      logRaw('cargar bonos', err);
      // Si falla, que se note — mejor un aviso claro que unos puntos
      // suspensivos que no van a cambiar nunca.
      var pkgBox = modal.querySelector('#accPackages');
      if (pkgBox) pkgBox.innerHTML = '<div class="acc-history-empty">' + escapeHtml(S.errGeneric) + '</div>';
    });
  }

  /* ---------- Panel de administrador ---------- */
  var isAdmin = false;

  function checkAdmin() {
    if (!currentUser) { isAdmin = false; return Promise.resolve(false); }
    return loadSDK().then(function (m) {
      return m.dbMod.get(m.dbMod.ref(fbDb, 'admins/' + currentUser.uid)).then(function (snap) {
        // Aceptamos tanto el booleano true como el texto "true", por si en
        // el editor de Firebase se guardó como cadena de texto en vez de
        // booleano — un fallo fácil de cometer y difícil de ver a simple
        // vista en la consola de Firebase.
        var v = snap.val();
        isAdmin = snap.exists() && (v === true || v === 'true');
        console.info('[Masajemalaga cuenta] comprobación de administrador — uid: ' + currentUser.uid + ' · valor en admins/: ' + JSON.stringify(v) + ' · ¿admin? ' + isAdmin);
        return isAdmin;
      });
    }).catch(function (err) { logRaw('comprobar administrador', err); isAdmin = false; return false; });
  }

  function adminPromoFormHtml(idPrefix) {
    return '<div class="acc-promo-form">' +
      '<input type="text" id="' + idPrefix + 'Title" placeholder="' + escapeHtml(S.adminPromoTitle) + '">' +
      '<div class="acc-promo-form-row">' +
        '<input type="number" id="' + idPrefix + 'Discount" placeholder="' + escapeHtml(S.adminPromoDiscount) + '" min="1" max="90">' +
        '<input type="number" id="' + idPrefix + 'Hours" placeholder="' + escapeHtml(S.adminPromoHours) + '" min="1">' +
      '</div>' +
      '<button type="button" class="acc-btn-primary acc-mini" id="' + idPrefix + 'CreateBtn">' + escapeHtml(S.adminCreate) + '</button>' +
    '</div>';
  }

  function readPromoForm(idPrefix) {
    var title = modal.querySelector('#' + idPrefix + 'Title').value.trim();
    var discount = parseInt(modal.querySelector('#' + idPrefix + 'Discount').value, 10);
    var hours = parseInt(modal.querySelector('#' + idPrefix + 'Hours').value, 10);
    return {
      title: title,
      discountPct: isNaN(discount) ? null : discount,
      hours: isNaN(hours) ? null : hours
    };
  }

  function renderAdmin() {
    modal.innerHTML =
      '<h3>' + escapeHtml(S.adminPanel) + '</h3>' +
      '<div class="acc-field">' +
        '<label>' + escapeHtml(S.adminSearch) + '</label>' +
        '<div class="acc-admin-search-row">' +
          '<input type="text" id="admSearchInput" placeholder="ejemplo@email.com / 600 11 22 33">' +
          '<button type="button" class="acc-btn-primary acc-mini" id="admSearchBtn">' + escapeHtml(S.adminSearchBtn) + '</button>' +
        '</div>' +
      '</div>' +
      '<div id="admResult"></div>' +
      '<hr class="acc-sep">' +
      '<p class="acc-history-title">' + escapeHtml(S.adminGlobalTitle) + '</p>' +
      '<div id="admGlobalPromos"></div>' +
      adminPromoFormHtml('admG') +
      '<button type="button" class="acc-btn-secondary" id="admBack">' + escapeHtml(S.back) + '</button>';

    modal.querySelector('#admSearchBtn').addEventListener('click', adminSearchCustomer);
    modal.querySelector('#admSearchInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') adminSearchCustomer();
    });
    modal.querySelector('#admBack').addEventListener('click', function () {
      mode = 'account';
      render();
    });

    loadSDK().then(function (m) {
      refreshGlobalPromos(m);
      modal.querySelector('#admGCreateBtn').addEventListener('click', function () {
        var data = readPromoForm('admG');
        if (!data.title) return;
        createPromo(m, 'global', null, data).then(function () { refreshGlobalPromos(m); });
      });
    });
  }

  function refreshGlobalPromos(m) {
    var box = modal.querySelector('#admGlobalPromos');
    if (!box) return;
    m.dbMod.get(m.dbMod.ref(fbDb, 'global-promos')).then(function (snap) {
      var items = activePromosFrom(snap, true);
      box.innerHTML = items.length ? items.map(adminPromoItemHtml).join('')
        : '<div class="acc-history-empty">—</div>';
      Array.prototype.forEach.call(box.querySelectorAll('[data-delpromo]'), function (btn) {
        btn.addEventListener('click', function () {
          deletePromo(m, 'global', null, btn.getAttribute('data-delpromo')).then(function () { refreshGlobalPromos(m); });
        });
      });
    });
  }

  function adminPromoItemHtml(p) {
    return '<div class="acc-promo acc-promo-admin">' +
      '<div class="acc-promo-title">' + escapeHtml(p.title || '') +
        (p.discountPct ? ' · -' + Number(p.discountPct) + '%' : '') + '</div>' +
      (p.expiresAt ? '<div class="acc-promo-time">' + escapeHtml(new Date(p.expiresAt).toLocaleString(LANG)) + '</div>' : '') +
      '<button type="button" class="acc-btn-secondary acc-mini" data-delpromo="' + escapeHtml(p.id) + '">' + escapeHtml(S.adminDelete) + '</button>' +
    '</div>';
  }

  function adminSearchCustomer() {
    var raw = modal.querySelector('#admSearchInput').value.trim();
    var resultBox = modal.querySelector('#admResult');
    if (!raw || !resultBox) return;
    resultBox.innerHTML = '<div class="acc-history-empty">…</div>';

    var isEmail = raw.indexOf('@') !== -1;
    var path = 'customer-index/' + (isEmail ? 'by-email/' + emailKey(raw) : 'by-phone/' + phoneKey(raw));

    loadSDK().then(function (m) {
      return m.dbMod.get(m.dbMod.ref(fbDb, path)).then(function (snap) {
        if (!snap.exists()) {
          resultBox.innerHTML = '<div class="acc-history-empty">' + escapeHtml(S.adminNotFound) + '</div>';
          return;
        }
        return renderAdminCustomer(m, snap.val());
      });
    }).catch(function (err) {
      logRaw('búsqueda admin', err);
      resultBox.innerHTML = '<div class="acc-history-empty">' + escapeHtml(S.errGeneric) + '</div>';
    });
  }

  function renderAdminCustomer(m, uid) {
    var resultBox = modal.querySelector('#admResult');
    return Promise.all([
      m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/profile')),
      m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/packages')),
      m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/promos'))
    ]).then(function (snaps) {
      var profile = snaps[0].val() || {};
      var packages = [];
      snaps[1].forEach(function (c) { packages.push({ id: c.key, val: c.val() }); });
      var promos = activePromosFrom(snaps[2], false);

      var typeOptions = Object.keys(PACKAGE_TYPES).map(function (k) {
        return '<option value="' + k + '">' + escapeHtml(PACKAGE_TYPES[k].label) + '</option>';
      }).join('') + '<option value="custom">' + escapeHtml(S.adminCustomLabel) + '</option>';

      resultBox.innerHTML =
        '<div class="acc-admin-customer">' +
          '<div class="acc-profile-name">' + escapeHtml(profile.name || '—') + '</div>' +
          '<div class="acc-profile-email">' + escapeHtml(profile.email || '') +
            (profile.phone ? ' · ' + escapeHtml(profile.phone) : '') + '</div>' +
        '</div>' +
        '<div id="admPackages">' +
          (packages.length ? packages.map(function (p) {
            return '<div class="acc-package">' +
              '<div class="acc-package-top">' +
                '<span class="acc-package-name">' + escapeHtml(p.val.label || '') + '</span>' +
                '<span class="acc-package-count">' + (Number(p.val.remaining) || 0) + '/' + (Number(p.val.total) || 0) + '</span>' +
              '</div>' +
              '<div class="acc-package-actions">' +
                '<button type="button" class="acc-btn-secondary acc-mini" data-pkg="' + escapeHtml(p.id) + '">' + escapeHtml(S.adminUseSession) + '</button>' +
                '<button type="button" class="acc-btn-secondary acc-mini acc-mini-danger" data-delpkg="' + escapeHtml(p.id) + '">' + escapeHtml(S.adminDeletePkg) + '</button>' +
              '</div>' +
            '</div>';
          }).join('') : '<div class="acc-history-empty">' + escapeHtml(S.noPackages) + '</div>') +
        '</div>' +
        '<div class="acc-admin-addpkg">' +
          '<select id="admPkgType">' + typeOptions + '</select>' +
          '<input type="number" id="admPkgCustomSessions" placeholder="' + escapeHtml(S.adminCustomSessions) + '" min="1" style="display:none">' +
          '<button type="button" class="acc-btn-primary acc-mini" id="admAddPkgBtn">' + escapeHtml(S.adminAddPackage) + '</button>' +
        '</div>' +
        '<p class="acc-history-title">' + escapeHtml(S.adminNewPromo) + '</p>' +
        '<div id="admClientPromos">' +
          (promos.length ? promos.map(adminPromoItemHtml).join('') : '<div class="acc-history-empty">—</div>') +
        '</div>' +
        adminPromoFormHtml('admC');

      modal.querySelector('#admPkgType').addEventListener('change', function (e) {
        modal.querySelector('#admPkgCustomSessions').style.display = e.target.value === 'custom' ? '' : 'none';
      });
      modal.querySelector('#admAddPkgBtn').addEventListener('click', function () {
        var typeVal = modal.querySelector('#admPkgType').value;
        var custom = modal.querySelector('#admPkgCustomSessions').value;
        addPackage(m, uid, typeVal === 'custom' ? null : typeVal, custom, null)
          .then(function () { renderAdminCustomer(m, uid); });
      });
      modal.querySelector('#admCCreateBtn').addEventListener('click', function () {
        var data = readPromoForm('admC');
        if (!data.title) return;
        createPromo(m, 'client', uid, data).then(function () { renderAdminCustomer(m, uid); });
      });
      Array.prototype.forEach.call(resultBox.querySelectorAll('[data-pkg]'), function (btn) {
        btn.addEventListener('click', function () {
          useSession(uid, btn.getAttribute('data-pkg')).then(function () { renderAdminCustomer(m, uid); });
        });
      });
      Array.prototype.forEach.call(resultBox.querySelectorAll('[data-delpkg]'), function (btn) {
        btn.addEventListener('click', function () {
          deletePackage(m, uid, btn.getAttribute('data-delpkg')).then(function () { renderAdminCustomer(m, uid); });
        });
      });
      Array.prototype.forEach.call(resultBox.querySelectorAll('[data-delpromo]'), function (btn) {
        btn.addEventListener('click', function () {
          deletePromo(m, 'client', uid, btn.getAttribute('data-delpromo')).then(function () { renderAdminCustomer(m, uid); });
        });
      });
    });
  }

  /* ---------- Panel de cuenta ---------- */
  function renderAccount() {
    var initials = (currentUser.displayName || currentUser.email || '?').trim().charAt(0).toUpperCase();
    var adminBtn = isAdmin
      ? '<button type="button" class="acc-btn-secondary" id="accGoAdmin">' + escapeHtml(S.adminPanel) + '</button>'
      : '';
    modal.innerHTML =
      '<div class="acc-profile-head">' +
        '<div class="acc-avatar">' +
          (currentUser.photoURL ? '<img src="' + escapeHtml(currentUser.photoURL) + '" alt="">' : escapeHtml(initials)) +
        '</div>' +
        '<div>' +
          '<div class="acc-profile-name">' + escapeHtml(currentUser.displayName || S.navLabel) + '</div>' +
          '<div class="acc-profile-email">' + escapeHtml(currentUser.email || '') + '</div>' +
          // Identificador de cuenta visible: sirve para poder comparar y
          // copiar el UID sin tener que abrir la consola del navegador
          // (necesario para concederse permisos de administrador).
          '<div class="acc-profile-uid" title="Identificador de tu cuenta">ID: ' + escapeHtml(currentUser.uid) + '</div>' +
        '</div>' +
      '</div>' +
      '<p class="acc-history-title">' + escapeHtml(S.packagesTitle) + '</p>' +
      '<div id="accPackages"><div class="acc-history-empty">…</div></div>' +
      '<div id="accPromos"></div>' +
      '<div class="acc-loyalty" id="accLoyalty">' +
        '<div class="acc-loyalty-count">…</div>' +
        '<div class="acc-loyalty-label">' + escapeHtml(S.loyaltyLabel) + '</div>' +
        '<div class="acc-loyalty-bar"><div class="acc-loyalty-bar-fill" style="width:0%"></div></div>' +
        '<div class="acc-loyalty-note">' + escapeHtml(LOYALTY_MSG) + '</div>' +
      '</div>' +
      '<p class="acc-history-title">' + escapeHtml(S.history) + '</p>' +
      '<div class="acc-history-list" id="accHistory"><div class="acc-history-empty">' + escapeHtml(S.empty) + '</div></div>' +
      adminBtn +
      '<button type="button" class="acc-btn-secondary" id="accLogout">' + escapeHtml(S.logout) + '</button>';

    if (isAdmin) {
      modal.querySelector('#accGoAdmin').addEventListener('click', function () {
        mode = 'admin';
        render();
      });
    }
    modal.querySelector('#accLogout').addEventListener('click', function () {
      mode = 'login';
      loadSDK().then(function (m) { m.authMod.signOut(fbAuth); });
    });

    loadRequests();
    loadPackagesAndPromos();
  }

  function loadRequests() {
    if (!currentUser) return;
    loadSDK().then(function (m) {
      var reqRef = m.dbMod.ref(fbDb, 'customers/' + currentUser.uid + '/requests');
      return m.dbMod.get(reqRef).then(function (snap) {
        var items = [];
        snap.forEach(function (child) { items.push(child.val()); });
        items.sort(function (a, b) { return (b.createdAt || '').localeCompare(a.createdAt || ''); });

        var count = items.length;
        var loyaltyBox = modal.querySelector('#accLoyalty');
        if (loyaltyBox) {
          loyaltyBox.querySelector('.acc-loyalty-count').textContent = count;
          var pct = Math.min(100, Math.round((count / LOYALTY_GOAL) * 100));
          loyaltyBox.querySelector('.acc-loyalty-bar-fill').style.width = pct + '%';
        }

        var list = modal.querySelector('#accHistory');
        if (!list) return;
        if (!items.length) {
          list.innerHTML = '<div class="acc-history-empty">' + escapeHtml(S.empty) + '</div>';
          return;
        }
        list.innerHTML = items.slice(0, 12).map(function (it) {
          var when = it.createdAt ? new Date(it.createdAt).toLocaleDateString(LANG) : '';
          return '<div class="acc-history-item"><span class="who">' + escapeHtml(it.massage || '') +
                 (it.duration ? ' · ' + escapeHtml(it.duration) : '') +
                 '</span><span class="when">' + escapeHtml(when) + '</span></div>';
        }).join('');
      });
    }).catch(function (err) {
      logRaw('cargar solicitudes', err);
      var loyaltyBox = modal.querySelector('#accLoyalty');
      if (loyaltyBox) loyaltyBox.querySelector('.acc-loyalty-count').textContent = '—';
      var list = modal.querySelector('#accHistory');
      if (list) list.innerHTML = '<div class="acc-history-empty">' + escapeHtml(S.errGeneric) + '</div>';
    });
  }

  /* ---------- API pública para el chatbot ---------- */
  window.MMAccount = {
    getUser: function () { return currentUser; },
    isLoggedIn: function () { return !!currentUser; },
    logRequest: function (massage, duration) {
      if (!currentUser || !configReady) return;
      loadSDK().then(function (m) {
        var listRef = m.dbMod.ref(fbDb, 'customers/' + currentUser.uid + '/requests');
        return m.dbMod.push(listRef, {
          massage: massage || '', duration: duration || '',
          createdAt: new Date().toISOString()
        });
      });
    },
    /* Abre el panel: si no hay sesión, va directo al registro (para las
       llamadas a la acción de "regístrate y consigue promociones");
       si ya está identificado, muestra su cuenta. Lo usan el botón del
       head, el chatbot y el enlace del pie. */
    openRegisterOrAccount: function () {
      if (!currentUser) mode = 'signup';
      else mode = 'account';
      open();
    }
  };

  var footerCta;

  function wireFooterCta() {
    footerCta = document.getElementById('accFooterCta');
    if (!footerCta) return;
    footerCta.addEventListener('click', function (e) {
      e.preventDefault();
      window.MMAccount.openRegisterOrAccount();
    });
    updateFooterCta();
  }

  /* Cualquier otro botón o enlace de la web que quiera abrir el
     registro/la cuenta solo tiene que llevar este atributo — así lo
     usan, por ejemplo, el botón del head y la opción del chatbot. */
  function wireGenericCtas(scope) {
    var root = scope || document;
    Array.prototype.forEach.call(root.querySelectorAll('[data-mm-account-cta]'), function (el) {
      if (el.getAttribute('data-mm-wired') === '1') return;   // no duplicar
      el.setAttribute('data-mm-wired', '1');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.MMAccount.openRegisterOrAccount();
      });
    });
  }

  function updateFooterCta() {
    if (!footerCta) return;
    // Con sesión iniciada este enlace sobra: justo encima ya está el
    // panel de usuario incrustado con sus bonos y su acceso.
    footerCta.style.display = currentUser ? 'none' : '';
    if (!currentUser) footerCta.textContent = S.footerCtaOut;
  }

  /* ---------- Panel incrustado en el pie de página ----------
     Muestra un resumen de la cuenta sin tener que abrir el modal: si no
     hay sesión, una invitación a registrarse; si la hay, sus bonos y
     promociones activas. Usa IDs propios para no chocar con los del
     modal, que pueden estar en pantalla a la vez. */
  var inlineBox;

  function renderInline() {
    inlineBox = inlineBox || document.getElementById('accInline');
    if (!inlineBox) return;

    if (!currentUser) {
      inlineBox.innerHTML =
        '<div class="acc-inline-card acc-inline-guest">' +
          '<div class="acc-inline-title">' + escapeHtml(S.inlineGuestTitle) + '</div>' +
          '<div class="acc-inline-sub">' + escapeHtml(S.inlineGuestSub) + '</div>' +
          '<button type="button" class="acc-inline-btn" data-mm-account-cta>' + escapeHtml(S.inlineGuestBtn) + '</button>' +
        '</div>';
      wireGenericCtas(inlineBox);
      return;
    }

    var initials = (currentUser.displayName || currentUser.email || '?').trim().charAt(0).toUpperCase();
    inlineBox.innerHTML =
      '<div class="acc-inline-card">' +
        '<div class="acc-inline-head">' +
          '<div class="acc-avatar">' +
            (currentUser.photoURL ? '<img src="' + escapeHtml(currentUser.photoURL) + '" alt="">' : escapeHtml(initials)) +
          '</div>' +
          '<div>' +
            '<div class="acc-inline-name">' + escapeHtml(currentUser.displayName || S.navLabel) + '</div>' +
            '<div class="acc-inline-mail">' + escapeHtml(currentUser.email || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="acc-inline-title">' + escapeHtml(S.packagesTitle) + '</div>' +
        '<div id="accInlinePackages"><div class="acc-inline-sub">…</div></div>' +
        '<div id="accInlinePromos"></div>' +
        '<button type="button" class="acc-inline-btn" data-mm-account-cta>' + escapeHtml(S.inlineOpenPanel) + '</button>' +
      '</div>';
    wireGenericCtas(inlineBox);
    loadInlineData();
  }

  function loadInlineData() {
    if (!currentUser || !configReady) return;
    var uid = currentUser.uid;
    loadSDK().then(function (m) {
      return Promise.all([
        m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/packages')),
        m.dbMod.get(m.dbMod.ref(fbDb, 'customers/' + uid + '/promos')),
        m.dbMod.get(m.dbMod.ref(fbDb, 'global-promos'))
      ]).then(function (snaps) {
        var pkgs = [];
        snaps[0].forEach(function (c) { pkgs.push(c.val()); });
        var pkgBox = document.getElementById('accInlinePackages');
        if (pkgBox) pkgBox.innerHTML = packagesHtml(pkgs);

        var promos = activePromosFrom(snaps[1], false).concat(activePromosFrom(snaps[2], true));
        var promoBox = document.getElementById('accInlinePromos');
        if (promoBox) promoBox.innerHTML = promos.length ? promos.map(promoCardHtml).join('') : '';
      });
    }).catch(function (err) {
      logRaw('panel del pie', err);
      var pkgBox = document.getElementById('accInlinePackages');
      if (pkgBox) pkgBox.innerHTML = '<div class="acc-inline-sub">' + escapeHtml(S.errGeneric) + '</div>';
    });
  }

  function onAuthChange(user) {
    currentUser = user;
    navBtn.classList.toggle('is-logged', !!user);
    if (!user) { isAdmin = false; mode = 'login'; }
    updateFooterCta();
    renderInline();
    checkAdmin().then(function () {
      if (overlay.classList.contains('is-open')) render();
    });
  }

  function init() {
    buildNavButton();
    buildOverlay();
    wireFooterCta();
    wireGenericCtas();
    renderInline();
    if (!configReady) {
      // Sin configuración real todavía: el botón funciona (se puede
      // abrir), pero cualquier acción real avisa con errConfig en vez
      // de fallar en silencio o romper la página.
      console.info('[Masajemalaga] Cuenta de usuario: falta configurar FIREBASE_CONFIG en account.js.');
      return;
    }
    loadSDK().then(function (m) {
      m.authMod.onAuthStateChanged(fbAuth, onAuthChange);
    }).catch(function (err) {
      console.error('[Masajemalaga] No se pudo cargar Firebase Authentication:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
