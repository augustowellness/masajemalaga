/* ============================================================
   Chatbot Masajemalaga — motor conversacional
   ------------------------------------------------------------
   - 100% en el navegador: sin servidor, sin coste, sin API.
   - No usa WhatsApp Cloud API ni depende de Meta.
   - Los precios viven en un solo sitio (PRICES) para no
     descuadrarse con el resto de la web.
   - Reserva: guía al cliente hasta el calendario real de la web
     (mismo sistema de siempre) o abre WhatsApp con el mensaje ya
     escrito. Nunca inventa horas libres.
   ============================================================ */
(function () {
  'use strict';

  var WA_NUMBER = '34621015923';
  var EMAIL = 'hola@masajemalaga.es';

  /* ---------- Precios (única fuente de verdad) ---------- */
  var PRICES = {
    min60: 90,
    salExtra: 15,
    bono3: 300,   /* bono de 4 sesiones (centro augusto) */
    bono5: 560,   /* bono de 8 sesiones */
    bono10: 780,  /* bono familiar de 12 sesiones */
    premium: 250
  };

  var MASSAGES = ['brisa', 'mar', 'arena', 'amanecer', 'anochecer'];

  /* ---------- Textos ---------- */
  var I18N = {
    es: {
      name: 'Asistente Masajemalaga',
      status: 'Responde al momento',
      nudge: '¿Tienes alguna duda? Te ayudo 👋',
      placeholder: 'Escribe tu pregunta…',
      foot: 'Asistente automático · Para algo concreto, escríbenos por WhatsApp',
      greet: '¡Hola! 👋 Soy el asistente de Masajemalaga.\n\nPuedo contarte los quiromasajes que hacemos, los precios y los bonos, y ayudarte a reservar. ¿Qué te apetece ver?',
      mMassages: 'Quiromasajes y precios', mRegister: 'Regístrate para promociones y descuentos',
      mBook: 'Quiero reservar',
      mPacks: 'Bonos y regalos',
      mDoubts: 'Otras dudas',
      back: 'Volver al inicio',
      wa: 'Hablar por WhatsApp',
      openCal: 'Cómo reservar',
      massagesIntro: 'Todos nuestros quiromasajes cuestan lo mismo, así que elige por sensación, no por precio:\n\n🌬️ <b>Brisa</b> — suave, para soltar tensión y calmarte.\n🌊 <b>Mar</b> — intermedio y reparador, el término medio.\n🏖️ <b>Arena</b> — profundo y deportivo, el más intenso.\n🌅 <b>Amanecer</b> — activación muscular antes de competir.\n🌙 <b>Anochecer</b> — extra suave, con aromaterapia.\n\n<b>60 min · {p60} €</b>\nPuedes añadir el ritual de exfoliación Sal por {sal} € más.',
      whichMassage: '¿Cuál te llama más? Si no lo tienes claro, te ayudo a elegir.',
      helpChoose: 'Ayúdame a elegir',
      chooseGoal: '¿Qué buscas sobre todo?',
      goalRelax: 'Relajarme',
      goalTension: 'Soltar tensión',
      goalSport: 'Recuperar del deporte',
      goalCompete: 'Prepararme para competir',
      recFor: 'Para eso te recomiendo',
      recRelax: '🌙 <b>Anochecer</b> o 🌬️ <b>Brisa</b>.\nSon los más suaves. Anochecer lleva aromaterapia y música relajante; Brisa es un tacto suave clásico.',
      recTension: '🌊 <b>Mar</b> o 🏖️ <b>Arena</b>.\nMar es intermedio y reparador. Si la tensión está muy marcada, Arena trabaja el tejido profundo.',
      recSport: '🏖️ <b>Arena</b>.\nEs nuestro quiromasaje deportivo de tejido profundo, pensado justo para eso.',
      recCompete: '🌅 <b>Amanecer</b>.\nEs un quiromasaje de activación muscular, pensado para antes de una competición.',
      chooseDuration: '¿De cuánto tiempo lo quieres?',
      d60: '60 minutos — {p60} €',
      bookReady: 'Perfecto: <b>{massage}</b>, {dur}.\n\nEscríbenos por WhatsApp con el día y la hora que prefieres y te confirmamos la cita, en el centro augusto o a domicilio.',
      bookNote: 'Te respondemos enseguida con los huecos libres.',
      bono10Tip: '💡 Por cierto: si vienes más de una vez, el bono de 12 sesiones te sale a {b10u}€ cada una en vez de {p60}€.',
      packsTxt: 'Si vienes más de una vez, los bonos salen bastante mejor:\n\n<b>4 sesiones — {b3} €</b> (te sale a {b3u} € cada una)\n<b>8 sesiones — {b5} €</b> ({b5u} € cada una)\n<b>12 sesiones — {b10} €</b>\n\n💡 Si eres socio (60 € al año), el bono de 4 te sale a 65 € la sesión.\n\n✨ <b>Experiencia Premium — {prem} €</b>\n3 horas completas: entrenamiento adaptado, quiromasaje e hidratación.\n\n🎁 También puedes <b>regalar un bono</b>: te generamos la tarjeta al momento con el nombre de quien tú quieras.',
      giftBtn: 'Crear un bono regalo',
      doubtsTitle: '¿Sobre qué quieres saber?',
      qBring: '¿Tengo que llevar algo?',
      qWhere: '¿Dónde estáis?',
      qHours: '¿Qué horario tenéis?',
      qFirst: 'Es mi primera vez',
      qPay: '¿Cómo se paga?',
      aBring: 'No hace falta que traigas nada 🙂\nVen con ropa cómoda y del resto nos encargamos nosotros: toallas, camilla, aceites y todo lo necesario.',
      aWhere: 'Estamos en <b>Málaga</b>. Cuando confirmes la reserva te mandamos la ubicación exacta y cómo llegar.\n\nSi prefieres preguntarnos algo concreto de la zona, escríbenos por WhatsApp.',
      aHours: 'Abrimos <b>de lunes a jueves de 9:00 a 20:00</b> y <b>los viernes de 9:30 a 13:30 y de 16:00 a 20:00</b>, en el centro augusto (Málaga centro). A domicilio, consúltanos por WhatsApp.',
      aFirst: '¡Bienvenido! 😊 No tienes que preparar nada.\n\nLlega unos minutos antes, ven con ropa cómoda y cuéntanos al llegar si tienes alguna zona molesta o alguna sobrecarga. Adaptamos la sesión a ti.\n\nSi es tu primera vez y no sabes qué elegir, te ayudo.',
      aPay: 'Puedes pagar en el centro al terminar la sesión. Si quieres pagar por adelantado o comprar un bono, escríbenos por WhatsApp y te lo gestionamos.',
      fallback: 'No estoy seguro de haberte entendido 😅\n\nPuedo ayudarte con quiromasajes y precios, bonos, reservas y dudas generales. Si es algo más concreto, lo mejor es que nos escribas por WhatsApp y te contesta una persona.',
      waMsgBook: 'Hola, quiero reservar un quiromasaje {massage} de {dur}',
      waMsgGeneral: 'Hola, tengo una consulta sobre vuestros quiromasajes',
      minutes: 'minutos',
      mVip: 'Eventos VIP y a domicilio',
      vipTxt: 'Para eventos, villas, yates o Airbnbs tenemos un servicio a domicilio: llevamos camillas, aceites y todo lo necesario allá donde estés, en Marbella, Málaga, Torremolinos, Benalmádena y toda la Costa del Sol.\n\n✨ <b>Eventos Premium — desde 450 €</b>\nUno o varios terapeutas según el grupo, perfecto para bodas, celebraciones privadas o cualquier ocasión especial.',
      vipBtn: 'Ver todos los detalles',
      waMsgVip: 'Hola, quiero información sobre el evento de quiromasaje VIP Premium'
    },
    en: {
      name: 'Masajemalaga Assistant',
      status: 'Replies instantly',
      nudge: 'Any questions? I can help 👋',
      placeholder: 'Type your question…',
      foot: 'Automated assistant · For anything specific, message us on WhatsApp',
      greet: 'Hi! 👋 I\'m the Masajemalaga assistant.\n\nI can tell you about our chiromassages, prices and packages, and help you book. What would you like to see?',
      mMassages: 'Chiromassages & prices', mRegister: 'Sign up for promotions and discounts',
      mBook: 'I want to book',
      mPacks: 'Packages & gifts',
      mDoubts: 'Other questions',
      back: 'Back to start',
      wa: 'Chat on WhatsApp',
      openCal: 'How to book',
      massagesIntro: 'All our chiromassages cost the same, so choose by feel, not by price:\n\n🌬️ <b>Brisa</b> — gentle, to release tension and calm down.\n🌊 <b>Mar</b> — medium and restorative, the middle ground.\n🏖️ <b>Arena</b> — deep tissue and sports, the most intense.\n🌅 <b>Amanecer</b> — muscle activation before competing.\n🌙 <b>Anochecer</b> — extra gentle, with aromatherapy.\n\n<b>60 min · €{p60}</b>\nYou can add the Sal exfoliation ritual for €{sal} more.',
      whichMassage: 'Which one appeals to you? If you\'re not sure, I can help you choose.',
      helpChoose: 'Help me choose',
      chooseGoal: 'What are you mainly after?',
      goalRelax: 'To relax',
      goalTension: 'Ease tension',
      goalSport: 'Recover from sport',
      goalCompete: 'Prepare to compete',
      recFor: 'For that I\'d recommend',
      recRelax: '🌙 <b>Anochecer</b> or 🌬️ <b>Brisa</b>.\nThey\'re the gentlest. Anochecer includes aromatherapy and relaxing music; Brisa is a classic soft touch.',
      recTension: '🌊 <b>Mar</b> or 🏖️ <b>Arena</b>.\nMar is medium and restorative. If the knot is really stubborn, Arena works the deep tissue.',
      recSport: '🏖️ <b>Arena</b>.\nIt\'s our deep tissue sports chiromassage, made exactly for that.',
      recCompete: '🌅 <b>Amanecer</b>.\nA muscle activation chiromassage, designed for before a competition.',
      chooseDuration: 'How long would you like it?',
      d60: '60 minutes — €{p60}',
      bookReady: 'Great: <b>{massage}</b>, {dur}.\n\nMessage us on WhatsApp with the day and time you prefer and we\'ll confirm your appointment, at the augusto centre or at your place.',
      bookNote: 'We\'ll reply straight away with the free slots.',
      bono10Tip: '💡 By the way, if you come more than once, the 12-session package works out at €{b10u} each instead of €{p60}.',
      packsTxt: 'If you\'re coming more than once, packages work out much better:\n\n<b>4 sessions — €{b3}</b> (€{b3u} each)\n<b>8 sessions — €{b5}</b> (€{b5u} each)\n<b>12 sessions — €{b10}</b>\n\n💡 If you become a member (€60 a year), the 4-session package works out at €65 per session.\n\n✨ <b>Premium Experience — €{prem}</b>\nA full 3 hours: tailored training, chiromassage and hydration.\n\n🎁 You can also <b>gift a package</b>: we generate the card instantly with any name you like.',
      giftBtn: 'Create a gift voucher',
      doubtsTitle: 'What would you like to know about?',
      qBring: 'Do I need to bring anything?',
      qWhere: 'Where are you?',
      qHours: 'What are your hours?',
      qFirst: 'It\'s my first time',
      qPay: 'How do I pay?',
      aBring: 'You don\'t need to bring a thing 🙂\nJust come in comfortable clothes and we take care of the rest: towels, table, oils and everything else.',
      aWhere: 'We\'re in <b>Málaga</b>. Once you confirm your booking we\'ll send you the exact location and directions.\n\nIf you\'d rather ask something specific about the area, message us on WhatsApp.',
      aHours: 'We\'re open <b>Monday to Thursday 9:00–20:00</b> and <b>Fridays 9:30–13:30 and 16:00–20:00</b>, at the augusto centre (Málaga city centre). For home visits, ask us on WhatsApp.',
      aFirst: 'Welcome! 😊 There\'s nothing to prepare.\n\nArrive a few minutes early, wear comfortable clothes, and tell us on arrival if any area is sore or if you have an overload. We adapt the session to you.\n\nIf it\'s your first time and you don\'t know what to pick, I can help.',
      aPay: 'You can pay at the centre when the session ends. If you\'d rather pay in advance or buy a package, message us on WhatsApp and we\'ll arrange it.',
      fallback: 'I\'m not sure I understood that 😅\n\nI can help with chiromassages and prices, packages, bookings and general questions. For anything more specific, message us on WhatsApp and a person will reply.',
      waMsgBook: 'Hi, I\'d like to book a {massage} chiromassage, {dur}',
      waMsgGeneral: 'Hi, I have a question about your chiromassages',
      minutes: 'minutes',
      mVip: 'VIP & mobile events',
      vipTxt: 'For events, villas, yachts or Airbnbs we offer a mobile chiromassage service: we bring tables, oils and everything needed wherever you are, across Marbella, Málaga, Torremolinos, Benalmádena and the whole Costa del Sol.\n\n✨ <b>Premium Events — from €450</b>\nOne or several therapists depending on the group, perfect for weddings, private celebrations or any special occasion.',
      vipBtn: 'See full details',
      waMsgVip: 'Hello, I would like information about the VIP Premium chiromassage event'
    },
    fr: {
      name: 'Assistant Masajemalaga',
      status: 'Répond tout de suite',
      nudge: 'Une question ? Je vous aide 👋',
      placeholder: 'Écrivez votre question…',
      foot: 'Assistant automatique · Pour un point précis, écrivez-nous sur WhatsApp',
      greet: 'Bonjour ! 👋 Je suis l\'assistant de Masajemalaga.\n\nJe peux vous présenter nos chiromassages, les tarifs et les forfaits, et vous aider à réserver. Que souhaitez-vous voir ?',
      mMassages: 'Chiromassages et tarifs', mRegister: "Inscrivez-vous pour des promotions et réductions",
      mBook: 'Je veux réserver',
      mPacks: 'Forfaits et cadeaux',
      mDoubts: 'Autres questions',
      back: 'Retour au début',
      wa: 'Écrire sur WhatsApp',
      openCal: 'Comment réserver',
      massagesIntro: 'Tous nos chiromassages coûtent le même prix : choisissez donc selon la sensation, pas selon le tarif :\n\n🌬️ <b>Brisa</b> — doux, pour relâcher les tensions et se calmer.\n🌊 <b>Mar</b> — intermédiaire et réparateur, le juste milieu.\n🏖️ <b>Arena</b> — profond et sportif, le plus intense.\n🌅 <b>Amanecer</b> — activation musculaire avant une compétition.\n🌙 <b>Anochecer</b> — très doux, avec aromathérapie.\n\n<b>60 min · {p60} €</b>\nVous pouvez ajouter le rituel d\'exfoliation Sal pour {sal} € de plus.',
      whichMassage: 'Lequel vous tente ? Si vous hésitez, je peux vous aider à choisir.',
      helpChoose: 'Aidez-moi à choisir',
      chooseGoal: 'Que recherchez-vous avant tout ?',
      goalRelax: 'Me détendre',
      goalTension: 'Relâcher les tensions',
      goalSport: 'Récupérer du sport',
      goalCompete: 'Préparer une compétition',
      recFor: 'Pour cela je recommande',
      recRelax: '🌙 <b>Anochecer</b> ou 🌬️ <b>Brisa</b>.\nCe sont les plus doux. Anochecer inclut aromathérapie et musique relaxante ; Brisa est un toucher doux classique.',
      recTension: '🌊 <b>Mar</b> ou 🏖️ <b>Arena</b>.\nMar est intermédiaire et réparateur. Si la tension est très marquée, Arena travaille les tissus profonds.',
      recSport: '🏖️ <b>Arena</b>.\nC\'est notre chiromassage sportif en profondeur, pensé exactement pour ça.',
      recCompete: '🌅 <b>Amanecer</b>.\nUn chiromassage d\'activation musculaire, conçu pour l\'avant-compétition.',
      chooseDuration: 'Vous le souhaitez de quelle durée ?',
      d60: '60 minutes — {p60} €',
      bookReady: 'Parfait : <b>{massage}</b>, {dur}.\n\nÉcrivez-nous sur WhatsApp avec le jour et l\'heure qui vous conviennent et nous confirmons votre rendez-vous, au centre augusto ou à domicile.',
      bookNote: 'Nous vous répondons rapidement avec les créneaux libres.',
      bono10Tip: '💡 Au fait, si vous revenez plusieurs fois, le forfait de 12 séances revient à {b10u}€ chacune au lieu de {p60}€.',
      packsTxt: 'Si vous venez plus d\'une fois, les forfaits sont bien plus avantageux :\n\n<b>4 séances — {b3} €</b> ({b3u} € la séance)\n<b>8 séances — {b5} €</b> ({b5u} € la séance)\n<b>12 séances — {b10} €</b>\n\n💡 Si vous êtes membre (60 € par an), le forfait de 4 séances revient à 65 € la séance.\n\n✨ <b>Expérience Premium — {prem} €</b>\n3 heures complètes : entraînement adapté, chiromassage et hydratation.\n\n🎁 Vous pouvez aussi <b>offrir un forfait</b> : nous générons la carte immédiatement au nom de votre choix.',
      giftBtn: 'Créer un bon cadeau',
      doubtsTitle: 'Sur quoi souhaitez-vous des informations ?',
      qBring: 'Dois-je apporter quelque chose ?',
      qWhere: 'Où êtes-vous ?',
      qHours: 'Quels sont vos horaires ?',
      qFirst: 'C\'est ma première fois',
      qPay: 'Comment payer ?',
      aBring: 'Vous n\'avez rien à apporter 🙂\nVenez en tenue confortable, nous nous occupons du reste : serviettes, table, huiles et tout le nécessaire.',
      aWhere: 'Nous sommes à <b>Málaga</b>. Dès que votre réservation est confirmée, nous vous envoyons l\'adresse exacte et l\'itinéraire.\n\nPour une question précise sur le quartier, écrivez-nous sur WhatsApp.',
      aHours: 'Nous ouvrons <b>du lundi au jeudi de 9h00 à 20h00</b> et <b>le vendredi de 9h30 à 13h30 et de 16h00 à 20h00</b>, au centre augusto (centre de Málaga). À domicile, demandez-nous sur WhatsApp.',
      aFirst: 'Bienvenue ! 😊 Rien à préparer.\n\nArrivez quelques minutes en avance, en tenue confortable, et signalez-nous à votre arrivée toute zone douloureuse ou surcharge. Nous adaptons la séance à vous.\n\nSi c\'est votre première fois et que vous hésitez, je peux vous aider.',
      aPay: 'Vous pouvez régler sur place à la fin de la séance. Pour payer à l\'avance ou acheter un forfait, écrivez-nous sur WhatsApp.',
      fallback: 'Je ne suis pas sûr d\'avoir bien compris 😅\n\nJe peux vous aider sur les chiromassages et tarifs, les forfaits, les réservations et les questions générales. Pour quelque chose de plus précis, écrivez-nous sur WhatsApp : une personne vous répondra.',
      waMsgBook: 'Bonjour, je souhaite réserver un chiromassage {massage} de {dur}',
      waMsgGeneral: 'Bonjour, j\'ai une question sur vos chiromassages',
      minutes: 'minutes',
      mVip: 'Événements VIP à domicile',
      vipTxt: 'Pour les événements, villas, yachts ou Airbnbs, nous proposons un service de chiromassage à domicile : nous apportons tables, huiles et tout le nécessaire où que vous soyez, à Marbella, Málaga, Torremolinos, Benalmádena et sur toute la Costa del Sol.\n\n✨ <b>Événements Premium — à partir de 450 €</b>\nUn ou plusieurs thérapeutes selon le groupe, parfait pour les mariages, célébrations privées ou toute occasion spéciale.',
      vipBtn: 'Voir tous les détails',
      waMsgVip: 'Bonjour, je souhaite des informations sur l\'événement de chiromassage VIP Premium'
    },
    it: {
      name: 'Assistente Masajemalaga',
      status: 'Risponde subito',
      nudge: 'Hai qualche dubbio? Ti aiuto 👋',
      placeholder: 'Scrivi la tua domanda…',
      foot: 'Assistente automatico · Per qualcosa di specifico, scrivici su WhatsApp',
      greet: 'Ciao! 👋 Sono l\'assistente di Masajemalaga.\n\nPosso parlarti dei nostri chiromassaggi, dei prezzi e dei pacchetti, e aiutarti a prenotare. Cosa ti va di vedere?',
      mMassages: 'Chiromassaggi e prezzi', mRegister: 'Iscriviti per promozioni e sconti',
      mBook: 'Voglio prenotare',
      mPacks: 'Pacchetti e regali',
      mDoubts: 'Altre domande',
      back: 'Torna all\'inizio',
      wa: 'Scrivi su WhatsApp',
      openCal: 'Come prenotare',
      massagesIntro: 'Tutti i nostri chiromassaggi costano uguale, quindi scegli in base alla sensazione, non al prezzo:\n\n🌬️ <b>Brisa</b> — delicato, per sciogliere la tensione e calmarti.\n🌊 <b>Mar</b> — intermedio e riparatore, la via di mezzo.\n🏖️ <b>Arena</b> — profondo e sportivo, il più intenso.\n🌅 <b>Amanecer</b> — attivazione muscolare prima di gareggiare.\n🌙 <b>Anochecer</b> — extra delicato, con aromaterapia.\n\n<b>60 min · {p60} €</b>\nPuoi aggiungere il rituale di esfoliazione Sal per {sal} € in più.',
      whichMassage: 'Quale ti ispira di più? Se non sei sicuro, ti aiuto a scegliere.',
      helpChoose: 'Aiutami a scegliere',
      chooseGoal: 'Cosa cerchi soprattutto?',
      goalRelax: 'Rilassarmi',
      goalTension: 'Sciogliere la tensione',
      goalSport: 'Recuperare dallo sport',
      goalCompete: 'Prepararmi a gareggiare',
      recFor: 'Per questo ti consiglio',
      recRelax: '🌙 <b>Anochecer</b> o 🌬️ <b>Brisa</b>.\nSono i più delicati. Anochecer include aromaterapia e musica rilassante; Brisa è un tocco leggero classico.',
      recTension: '🌊 <b>Mar</b> o 🏖️ <b>Arena</b>.\nMar è intermedio e riparatore. Se la tensione è molto marcata, Arena lavora il tessuto profondo.',
      recSport: '🏖️ <b>Arena</b>.\nÈ il nostro chiromassaggio sportivo profondo, pensato proprio per questo.',
      recCompete: '🌅 <b>Amanecer</b>.\nUn chiromassaggio di attivazione muscolare, pensato per il pre-gara.',
      chooseDuration: 'Di quanto tempo lo vuoi?',
      d60: '60 minuti — {p60} €',
      bookReady: 'Perfetto: <b>{massage}</b>, {dur}.\n\nScrivici su WhatsApp con il giorno e l\'ora che preferisci e ti confermiamo l\'appuntamento, al centro augusto o a domicilio.',
      bookNote: 'Ti rispondiamo subito con gli orari liberi.',
      bono10Tip: '💡 A proposito, se torni più di una volta, il pacchetto da 12 sedute ti costa {b10u}€ a seduta invece di {p60}€.',
      packsTxt: 'Se vieni più di una volta, i pacchetti convengono molto di più:\n\n<b>4 sedute — {b3} €</b> ({b3u} € ciascuna)\n<b>8 sedute — {b5} €</b> ({b5u} € ciascuna)\n<b>12 sedute — {b10} €</b>\n\n💡 Se sei socio (60 € l\'anno), il pacchetto da 4 ti costa 65 € a seduta.\n\n✨ <b>Esperienza Premium — {prem} €</b>\n3 ore complete: allenamento su misura, chiromassaggio e idratazione.\n\n🎁 Puoi anche <b>regalare un pacchetto</b>: generiamo la card sul momento con il nome che preferisci.',
      giftBtn: 'Crea un buono regalo',
      doubtsTitle: 'Su cosa vuoi sapere di più?',
      qBring: 'Devo portare qualcosa?',
      qWhere: 'Dove siete?',
      qHours: 'Che orari avete?',
      qFirst: 'È la mia prima volta',
      qPay: 'Come si paga?',
      aBring: 'Non devi portare nulla 🙂\nVieni con abiti comodi e al resto pensiamo noi: asciugamani, lettino, oli e tutto il necessario.',
      aWhere: 'Siamo a <b>Málaga</b>. Quando confermi la prenotazione ti inviamo la posizione esatta e come arrivare.\n\nSe preferisci chiederci qualcosa di specifico sulla zona, scrivici su WhatsApp.',
      aHours: 'Siamo aperti <b>dal lunedì al giovedì dalle 9:00 alle 20:00</b> e <b>il venerdì dalle 9:30 alle 13:30 e dalle 16:00 alle 20:00</b>, al centro augusto (centro di Málaga). A domicilio, chiedici su WhatsApp.',
      aFirst: 'Benvenuto! 😊 Non devi preparare nulla.\n\nArriva qualche minuto prima, con abiti comodi, e dicci all\'arrivo se hai qualche zona dolorante o un sovraccarico. Adattiamo la seduta a te.\n\nSe è la tua prima volta e non sai cosa scegliere, ti aiuto.',
      aPay: 'Puoi pagare in sede al termine della seduta. Se preferisci pagare in anticipo o acquistare un pacchetto, scrivici su WhatsApp.',
      fallback: 'Non sono sicuro di aver capito 😅\n\nPosso aiutarti con chiromassaggi e prezzi, pacchetti, prenotazioni e domande generali. Per qualcosa di più specifico, scrivici su WhatsApp e ti risponderà una persona.',
      waMsgBook: 'Ciao, vorrei prenotare un chiromassaggio {massage} di {dur}',
      waMsgGeneral: 'Ciao, ho una domanda sui vostri chiromassaggi',
      minutes: 'minuti',
      mVip: 'Eventi VIP a domicilio',
      vipTxt: 'Per eventi, ville, yacht o Airbnb offriamo un servizio di chiromassaggio a domicilio: portiamo lettini, oli e tutto il necessario ovunque tu sia, a Marbella, Málaga, Torremolinos, Benalmádena e in tutta la Costa del Sol.\n\n✨ <b>Eventi Premium — da 450 €</b>\nUno o più terapisti a seconda del gruppo, perfetto per matrimoni, celebrazioni private o qualsiasi occasione speciale.',
      vipBtn: 'Vedi tutti i dettagli',
      waMsgVip: 'Ciao, vorrei informazioni sull\'evento di chiromassaggio VIP Premium'
    },
    nl: {
      name: 'Masajemalaga-assistent',
      status: 'Reageert direct',
      nudge: 'Heb je een vraag? Ik help je 👋',
      placeholder: 'Typ je vraag…',
      foot: 'Automatische assistent · Voor iets specifieks, app ons via WhatsApp',
      greet: 'Hoi! 👋 Ik ben de assistent van Masajemalaga.\n\nIk kan je vertellen over onze chiromassages, prijzen en pakketten, en je helpen boeken. Wat wil je zien?',
      mMassages: 'Chiromassages en prijzen', mRegister: 'Registreer voor promoties en kortingen',
      mBook: 'Ik wil boeken',
      mPacks: 'Pakketten en cadeaus',
      mDoubts: 'Andere vragen',
      back: 'Terug naar begin',
      wa: 'Chat via WhatsApp',
      openCal: 'Hoe boeken',
      massagesIntro: 'Al onze chiromassages kosten hetzelfde, dus kies op gevoel, niet op prijs:\n\n🌬️ <b>Brisa</b> — zacht, om spanning los te laten en tot rust te komen.\n🌊 <b>Mar</b> — gemiddeld en herstellend, de middenweg.\n🏖️ <b>Arena</b> — diep en sportief, de intensiefste.\n🌅 <b>Amanecer</b> — spieractivatie vóór een wedstrijd.\n🌙 <b>Anochecer</b> — extra zacht, met aromatherapie.\n\n<b>60 min · € {p60}</b>\nJe kunt het Sal-scrubritueel toevoegen voor € {sal} extra.',
      whichMassage: 'Welke spreekt je aan? Weet je het niet zeker, dan help ik je kiezen.',
      helpChoose: 'Help me kiezen',
      chooseGoal: 'Waar ben je vooral naar op zoek?',
      goalRelax: 'Ontspannen',
      goalTension: 'Spanning losmaken',
      goalSport: 'Herstellen van sport',
      goalCompete: 'Voorbereiden op wedstrijd',
      recFor: 'Daarvoor raad ik aan',
      recRelax: '🌙 <b>Anochecer</b> of 🌬️ <b>Brisa</b>.\nDe zachtste van allemaal. Anochecer met aromatherapie en rustige muziek; Brisa is een klassieke zachte aanraking.',
      recTension: '🌊 <b>Mar</b> of 🏖️ <b>Arena</b>.\nMar is gemiddeld en herstellend. Zit de knoop echt vast, dan werkt Arena het diepe weefsel.',
      recSport: '🏖️ <b>Arena</b>.\nOnze diepe sportmassage, precies daarvoor gemaakt.',
      recCompete: '🌅 <b>Amanecer</b>.\nEen spieractiverende chiromassage, bedoeld voor vlak vóór een wedstrijd.',
      chooseDuration: 'Hoe lang wil je hem?',
      d60: '60 minuten — € {p60}',
      bookReady: 'Top: <b>{massage}</b>, {dur}.\n\nStuur ons via WhatsApp de dag en tijd die je wilt en we bevestigen je afspraak, in het augusto-centrum of bij jou thuis.',
      bookNote: 'We antwoorden snel met de vrije tijden.',
      bono10Tip: '💡 Trouwens, als je vaker komt, kost het pakket van 12 sessies maar €{b10u} per keer in plaats van €{p60}.',
      packsTxt: 'Kom je vaker, dan zijn de pakketten een stuk voordeliger:\n\n<b>4 sessies — € {b3}</b> (€ {b3u} per sessie)\n<b>8 sessies — € {b5}</b> (€ {b5u} per sessie)\n<b>12 sessies — € {b10}</b>\n\n💡 Als je lid bent (€60 per jaar), kost het pakket van 4 sessies €65 per sessie.\n\n✨ <b>Premium Experience — € {prem}</b>\n3 volle uren: aangepaste training, chiromassage en hydratatie.\n\n🎁 Je kunt ook <b>een pakket cadeau doen</b>: we maken de kaart direct aan met de naam die jij wilt.',
      giftBtn: 'Maak een cadeaubon',
      doubtsTitle: 'Waarover wil je meer weten?',
      qBring: 'Moet ik iets meenemen?',
      qWhere: 'Waar zitten jullie?',
      qHours: 'Wat zijn jullie openingstijden?',
      qFirst: 'Het is mijn eerste keer',
      qPay: 'Hoe betaal ik?',
      aBring: 'Je hoeft niets mee te nemen 🙂\nKom in comfortabele kleding, de rest regelen wij: handdoeken, tafel, oliën en al het andere.',
      aWhere: 'We zitten in <b>Málaga</b>. Zodra je boeking bevestigd is, sturen we de exacte locatie en routebeschrijving.\n\nWil je iets specifieks over de buurt weten, app ons dan via WhatsApp.',
      aHours: 'We zijn open <b>van maandag t/m donderdag van 9:00 tot 20:00</b> en <b>op vrijdag van 9:30 tot 13:30 en van 16:00 tot 20:00</b>, in het augusto-centrum (centrum van Málaga). Aan huis? Vraag het ons via WhatsApp.',
      aFirst: 'Welkom! 😊 Je hoeft niets voor te bereiden.\n\nKom een paar minuten eerder, draag comfortabele kleding en vertel ons bij aankomst of je ergens spanning hebt of een overbelasting. We passen de sessie op jou aan.\n\nIs het je eerste keer en weet je niet wat te kiezen, dan help ik je.',
      aPay: 'Je kunt in het centrum betalen na afloop van de sessie. Wil je vooraf betalen of een pakket kopen, app ons dan via WhatsApp.',
      fallback: 'Ik weet niet zeker of ik dat goed begreep 😅\n\nIk kan helpen met chiromassages en prijzen, pakketten, boekingen en algemene vragen. Voor iets specifiekers kun je ons beter via WhatsApp appen, dan antwoordt een persoon.',
      waMsgBook: 'Hoi, ik wil graag een {massage}-massage van {dur} boeken',
      waMsgGeneral: 'Hoi, ik heb een vraag over jullie chiromassages',
      minutes: 'minuten',
      mVip: 'VIP & mobiele evenementen',
      vipTxt: 'Voor evenementen, villa\'s, jachten of Airbnbs bieden we een massage-aan-huis service: we brengen chiromassagetafels, oliën en alles wat nodig is waar je ook bent, in Marbella, Málaga, Torremolinos, Benalmádena en de hele Costa del Sol.\n\n✨ <b>Premium evenementen — vanaf €450</b>\nÉén of meerdere therapeuten afhankelijk van de groep, perfect voor bruiloften, privéfeesten of elke speciale gelegenheid.',
      vipBtn: 'Bekijk alle details',
      waMsgVip: 'Hallo, ik wil graag informatie over het VIP Premium massage-evenement'
    },
    pl: {
      name: 'Asystent Masajemalaga',
      status: 'Odpowiada od razu',
      nudge: 'Masz pytanie? Pomogę 👋',
      placeholder: 'Wpisz swoje pytanie…',
      foot: 'Asystent automatyczny · W konkretnej sprawie napisz do nas na WhatsApp',
      greet: 'Cześć! 👋 Jestem asystentem Masajemalaga.\n\nOpowiem Ci o naszych chiromasażach, cenach i karnetach oraz pomogę zarezerwować termin. Co chcesz zobaczyć?',
      mMassages: 'Chiromasaże i ceny', mRegister: 'Zarejestruj się po promocje i zniżki',
      mBook: 'Chcę zarezerwować',
      mPacks: 'Karnety i prezenty',
      mDoubts: 'Inne pytania',
      back: 'Wróć na początek',
      wa: 'Napisz na WhatsApp',
      openCal: 'Jak zarezerwować',
      massagesIntro: 'Wszystkie nasze chiromasaże kosztują tyle samo, więc wybieraj wrażeniem, nie ceną:\n\n🌬️ <b>Brisa</b> — delikatny, rozluźnia napięcie i uspokaja.\n🌊 <b>Mar</b> — średni i regenerujący, złoty środek.\n🏖️ <b>Arena</b> — głęboki i sportowy, najbardziej intensywny.\n🌅 <b>Amanecer</b> — aktywacja mięśni przed zawodami.\n🌙 <b>Anochecer</b> — wyjątkowo delikatny, z aromaterapią.\n\n<b>60 min · {p60} €</b>\nMożesz dodać rytuał peelingu Sal za dodatkowe {sal} €.',
      whichMassage: 'Który Cię kusi? Jeśli nie wiesz, pomogę Ci wybrać.',
      helpChoose: 'Pomóż mi wybrać',
      chooseGoal: 'Czego szukasz przede wszystkim?',
      goalRelax: 'Relaksu',
      goalTension: 'Ulgi w napięciu',
      goalSport: 'Regeneracji po sporcie',
      goalCompete: 'Przygotowania do zawodów',
      recFor: 'W takim razie polecam',
      recRelax: '🌙 <b>Anochecer</b> lub 🌬️ <b>Brisa</b>.\nSą najdelikatniejsze. Anochecer to aromaterapia i relaksująca muzyka; Brisa to klasyczny lekki dotyk.',
      recTension: '🌊 <b>Mar</b> lub 🏖️ <b>Arena</b>.\nMar jest średni i regenerujący. Jeśli przykurcz jest mocny, Arena pracuje na tkankach głębokich.',
      recSport: '🏖️ <b>Arena</b>.\nNasz głęboki chiromasaż sportowy, stworzony dokładnie do tego.',
      recCompete: '🌅 <b>Amanecer</b>.\nMasaż aktywujący mięśnie, przeznaczony przed zawodami.',
      chooseDuration: 'Na ile czasu?',
      d60: '60 minut — {p60} €',
      bookReady: 'Świetnie: <b>{massage}</b>, {dur}.\n\nNapisz na WhatsApp, jaki dzień i godzina Ci pasują, a potwierdzimy wizytę – w centrum augusto lub u Ciebie.',
      bookNote: 'Szybko odpiszemy z wolnymi terminami.',
      bono10Tip: '💡 A propos, jeśli przyjdziesz więcej niż raz, pakiet 12 sesji wychodzi {b10u}€ za sesję zamiast {p60}€.',
      packsTxt: 'Jeśli przychodzisz więcej niż raz, karnety wychodzą znacznie korzystniej:\n\n<b>4 sesje — {b3} €</b> ({b3u} € za sesję)\n<b>8 sesji — {b5} €</b> ({b5u} € za sesję)\n<b>12 sesji — {b10} €</b>\n\n💡 Jako członek (60 € rocznie) masz pakiet 4 sesji po 65 € za sesję.\n\n✨ <b>Experiencia Premium — {prem} €</b>\nPełne 3 godziny: trening na miarę, chiromasaż i nawodnienie.\n\n🎁 Możesz też <b>podarować karnet</b>: od razu generujemy kartę z wybranym przez Ciebie imieniem.',
      giftBtn: 'Stwórz bon podarunkowy',
      doubtsTitle: 'O czym chcesz wiedzieć więcej?',
      qBring: 'Czy muszę coś zabrać?',
      qWhere: 'Gdzie jesteście?',
      qHours: 'Jakie macie godziny?',
      qFirst: 'To mój pierwszy raz',
      qPay: 'Jak zapłacić?',
      aBring: 'Nie musisz nic zabierać 🙂\nPrzyjdź w wygodnym ubraniu, a resztą zajmiemy się my: ręczniki, stół, olejki i wszystko, co potrzebne.',
      aWhere: 'Jesteśmy w <b>Maladze</b>. Po potwierdzeniu rezerwacji wyślemy Ci dokładną lokalizację i dojazd.\n\nJeśli chcesz zapytać o coś konkretnego w okolicy, napisz na WhatsApp.',
      aHours: 'Pracujemy <b>od poniedziałku do czwartku w godz. 9:00–20:00</b> oraz <b>w piątki 9:30–13:30 i 16:00–20:00</b>, w centrum augusto (centrum Malagi). Wizyty domowe – zapytaj na WhatsApp.',
      aFirst: 'Witamy! 😊 Nie musisz się do niczego przygotowywać.\n\nPrzyjdź kilka minut wcześniej, w wygodnym ubraniu, i powiedz nam na miejscu, czy coś Cię boli lub masz kontuzję. Dopasujemy sesję do Ciebie.\n\nJeśli to pierwszy raz i nie wiesz, co wybrać, pomogę.',
      aPay: 'Możesz zapłacić na miejscu po sesji. Jeśli wolisz zapłacić z góry lub kupić karnet, napisz do nas na WhatsApp.',
      fallback: 'Nie jestem pewien, czy dobrze zrozumiałem 😅\n\nPomogę z chiromasażami i cenami, karnetami, rezerwacjami i ogólnymi pytaniami. W bardziej konkretnej sprawie napisz na WhatsApp — odpowie Ci człowiek.',
      waMsgBook: 'Cześć, chcę zarezerwować chiromasaż {massage} na {dur}',
      waMsgGeneral: 'Cześć, mam pytanie o Wasze chiromasaże',
      minutes: 'minut',
      mVip: 'Wydarzenia VIP i z dojazdem',
      vipTxt: 'Na wydarzenia, do willi, jachtów lub apartamentów Airbnb oferujemy chiromasaż z dojazdem: przywozimy stoły, olejki i wszystko, co potrzebne, gdziekolwiek jesteś — w Marbelli, Maladze, Torremolinos, Benalmádenie i na całym wybrzeżu Costa del Sol.\n\n✨ <b>Wydarzenia Premium — od 450 €</b>\nJeden lub kilku terapeutów w zależności od grupy, idealne na wesela, prywatne uroczystości lub każdą specjalną okazję.',
      vipBtn: 'Zobacz wszystkie szczegóły',
      waMsgVip: 'Dzień dobry, chciałbym uzyskać informacje o wydarzeniu z chiromasażem VIP Premium'
    },
    pt: {
      name: 'Assistente Masajemalaga',
      status: 'Responde na hora',
      nudge: 'Tens alguma dúvida? Eu ajudo 👋',
      placeholder: 'Escreve a tua pergunta…',
      foot: 'Assistente automático · Para algo específico, escreve-nos pelo WhatsApp',
      greet: 'Olá! 👋 Sou o assistente da Masajemalaga.\n\nPosso falar-te das nossas quiromassagens, dos preços e dos pacotes, e ajudar-te a reservar. O que queres ver?',
      mMassages: 'Quiromassagens e preços', mRegister: 'Regista-te para promoções e descontos',
      mBook: 'Quero reservar',
      mPacks: 'Pacotes e presentes',
      mDoubts: 'Outras dúvidas',
      back: 'Voltar ao início',
      wa: 'Falar pelo WhatsApp',
      openCal: 'Como reservar',
      massagesIntro: 'Todas as nossas quiromassagens custam o mesmo, por isso escolhe pela sensação, não pelo preço:\n\n🌬️ <b>Brisa</b> — suave, para soltar a tensão e acalmar.\n🌊 <b>Mar</b> — intermédia e reparadora, o meio-termo.\n🏖️ <b>Arena</b> — profunda e desportiva, a mais intensa.\n🌅 <b>Amanecer</b> — ativação muscular antes de competir.\n🌙 <b>Anochecer</b> — extra suave, com aromaterapia.\n\n<b>60 min · {p60} €</b>\nPodes juntar o ritual de esfoliação Sal por mais {sal} €.',
      whichMassage: 'Qual te atrai mais? Se não tens a certeza, ajudo-te a escolher.',
      helpChoose: 'Ajuda-me a escolher',
      chooseGoal: 'O que procuras sobretudo?',
      goalRelax: 'Relaxar',
      goalTension: 'Soltar tensão',
      goalSport: 'Recuperar do desporto',
      goalCompete: 'Preparar uma competição',
      recFor: 'Para isso recomendo',
      recRelax: '🌙 <b>Anochecer</b> ou 🌬️ <b>Brisa</b>.\nSão as mais suaves. Anochecer leva aromaterapia e música relaxante; Brisa é um toque suave clássico.',
      recTension: '🌊 <b>Mar</b> ou 🏖️ <b>Arena</b>.\nMar é intermédia e reparadora. Se a tensão estiver muito marcada, Arena trabalha o tecido profundo.',
      recSport: '🏖️ <b>Arena</b>.\nÉ a nossa quiromassagem desportiva de tecido profundo, pensada mesmo para isso.',
      recCompete: '🌅 <b>Amanecer</b>.\nUma quiromassagem de ativação muscular, pensada para antes de uma competição.',
      chooseDuration: 'De quanto tempo a queres?',
      d60: '60 minutos — {p60} €',
      bookReady: 'Perfeito: <b>{massage}</b>, {dur}.\n\nEscreve-nos pelo WhatsApp com o dia e a hora que preferes e confirmamos a marcação, no centro augusto ou ao domicílio.',
      bookNote: 'Respondemos logo com as vagas livres.',
      bono10Tip: '💡 já agora, se vieres mais do que uma vez, o pacote de 12 sessões sai a {b10u}€ cada uma em vez de {p60}€.',
      packsTxt: 'Se vieres mais do que uma vez, os pacotes compensam bastante mais:\n\n<b>4 sessões — {b3} €</b> ({b3u} € cada)\n<b>8 sessões — {b5} €</b> ({b5u} € cada)\n<b>12 sessões — {b10} €</b>\n\n💡 Se fores sócio (60 € por ano), o pacote de 4 sai a 65 € por sessão.\n\n✨ <b>Experiência Premium — {prem} €</b>\n3 horas completas: treino adaptado, quiromassagem e hidratação.\n\n🎁 Também podes <b>oferecer um pacote</b>: geramos o cartão na hora com o nome que quiseres.',
      giftBtn: 'Criar um vale-presente',
      doubtsTitle: 'Sobre o que queres saber?',
      qBring: 'Preciso de levar alguma coisa?',
      qWhere: 'Onde estão?',
      qHours: 'Qual é o vosso horário?',
      qFirst: 'É a minha primeira vez',
      qPay: 'Como se paga?',
      aBring: 'Não precisas de levar nada 🙂\nVem com roupa confortável e do resto tratamos nós: toalhas, marquesa, óleos e tudo o que for preciso.',
      aWhere: 'Estamos em <b>Málaga</b>. Quando confirmares a reserva enviamos-te a localização exata e como chegar.\n\nSe preferires perguntar algo específico sobre a zona, escreve-nos pelo WhatsApp.',
      aHours: 'Abrimos <b>de segunda a quinta das 9:00 às 20:00</b> e <b>à sexta das 9:30 às 13:30 e das 16:00 às 20:00</b>, no centro augusto (centro de Málaga). Ao domicílio, pergunta-nos pelo WhatsApp.',
      aFirst: 'Bem-vindo! 😊 Não tens de preparar nada.\n\nChega uns minutos antes, com roupa confortável, e diz-nos à chegada se tens alguma zona dorida ou alguma sobrecarga. Adaptamos a sessão a ti.\n\nSe é a tua primeira vez e não sabes o que escolher, eu ajudo.',
      aPay: 'Podes pagar no centro no fim da sessão. Se preferires pagar adiantado ou comprar um pacote, escreve-nos pelo WhatsApp.',
      fallback: 'Não tenho a certeza de ter percebido 😅\n\nPosso ajudar com quiromassagens e preços, pacotes, reservas e dúvidas gerais. Para algo mais específico, escreve-nos pelo WhatsApp e responde-te uma pessoa.',
      waMsgBook: 'Olá, quero reservar uma quiromassagem {massage} de {dur}',
      waMsgGeneral: 'Olá, tenho uma questão sobre as vossas quiromassagens',
      minutes: 'minutos',
      mVip: 'Eventos VIP ao domicílio',
      vipTxt: 'Para eventos, villas, iates ou Airbnbs temos um serviço de quiromassagem ao domicílio: levamos marquesas, óleos e tudo o que for necessário onde estiveres, em Marbella, Málaga, Torremolinos, Benalmádena e em toda a Costa del Sol.\n\n✨ <b>Eventos Premium — a partir de 450 €</b>\nUm ou vários terapeutas consoante o grupo, perfeito para casamentos, celebrações privadas ou qualquer ocasião especial.',
      vipBtn: 'Ver todos os detalhes',
      waMsgVip: 'Olá, gostaria de informações sobre o evento de quiromassagem VIP Premium'
    }
  };

  /* ---------- Palabras clave para texto libre ---------- */
  var KEYWORDS = [
    { intent: 'prices',   words: ['precio', 'precios', 'cuesta', 'cuanto', 'cuánto', 'vale', 'tarifa', 'price', 'cost', 'how much', 'prix', 'tarif', 'combien', 'prezzo', 'prezzi', 'quanto', 'costo', 'prijs', 'kost', 'hoeveel', 'cena', 'ceny', 'ile', 'koszt', 'preço', 'preços', 'custa'] },
    { intent: 'book',     words: ['reserv', 'cita', 'agendar', 'book', 'appointment', 'schedule', 'rendez', 'réserv', 'reserver', 'prenot', 'appuntamento', 'boek', 'afspraak', 'rezerw', 'termin', 'marcar'] },
    { intent: 'packs',    words: ['bono', 'bonos', 'pack', 'packs', 'abono', 'regalo', 'regalar', 'package', 'gift', 'voucher', 'forfait', 'cadeau', 'pacchetto', 'regalo', 'buono', 'pakket', 'cadeau', 'karnet', 'prezent', 'pacote', 'presente', 'vale', 'premium'] },
    { intent: 'vip',      words: ['domicilio', 'a domicilio', 'evento', 'eventos', 'villa', 'yate', 'boda', 'bodas', 'despedida', 'mobile chiromassage', 'home chiromassage', 'yacht', 'wedding', 'event', 'events', 'airbnb', 'a domicile', 'à domicile', 'domicile', 'evenement', 'événement', 'mariage', 'matrimonio', 'aan huis', 'jacht', 'bruiloft', 'z dojazdem', 'dojazd', 'wydarzenie', 'willa', 'wesele', 'ao domicilio', 'domicílio', 'iate', 'casamento'] },
    { intent: 'hours',    words: ['horario', 'hora', 'abren', 'abris', 'abrís', 'cierran', 'abierto', 'hour', 'open', 'close', 'horaire', 'ouvert', 'ferme', 'orario', 'aperto', 'chiud', 'openingstijd', 'open', 'godzin', 'otwart', 'horário', 'abrem'] },
    { intent: 'where',    words: ['donde', 'dónde', 'direccion', 'dirección', 'ubicacion', 'ubicación', 'sitio', 'llegar', 'where', 'address', 'location', 'où', 'adresse', 'dove', 'indirizzo', 'waar', 'adres', 'gdzie', 'adres', 'onde', 'morada'] },
    { intent: 'bring',    words: ['llevar', 'traer', 'necesito llevar', 'ropa', 'toalla', 'bring', 'need to bring', 'towel', 'clothes', 'apporter', 'serviette', 'portare', 'asciugamano', 'meenemen', 'handdoek', 'zabrać', 'ręcznik', 'levar', 'toalha'] },
    { intent: 'first',    words: ['primera vez', 'nunca he', 'first time', 'never been', 'première fois', 'prima volta', 'eerste keer', 'pierwszy raz', 'primeira vez'] },
    { intent: 'pay',      words: ['pagar', 'pago', 'paga', 'tarjeta', 'efectivo', 'bizum', 'pay', 'payment', 'card', 'cash', 'payer', 'paye', 'carte', 'pagare', 'paga', 'pagamento', 'carta', 'betalen', 'kaart', 'płac', 'karta', 'gotówk', 'pagamento', 'cartão'] },
    { intent: 'sport',    words: ['deportivo', 'deporte', 'sport', 'gym', 'correr', 'maraton', 'maratón', 'running', 'entren', 'sportif', 'sportivo', 'palestra', 'sportief', 'sportow', 'bieg', 'desportiv'] },
    { intent: 'relax',    words: ['relaj', 'estres', 'estrés', 'estresad', 'ansiedad', 'descansar', 'relax', 'stress', 'unwind', 'détend', 'détente', 'rilass', 'ontspan', 'relaks', 'stres', 'relaxa'] },
    { intent: 'greet',    words: ['hola', 'buenas', 'buenos dias', 'hi', 'hello', 'hey', 'bonjour', 'salut', 'ciao', 'salve', 'hallo', 'hoi', 'cześć', 'dzień dobry', 'olá', 'oi'] }
  ];

  /* ---------- Utilidades ---------- */
  function detectLang() {
    var l = (document.documentElement.getAttribute('lang') || 'es').toLowerCase().slice(0, 2);
    return I18N[l] ? l : 'es';
  }

  var LANG = detectLang();
  var T = I18N[LANG];

  function fmt(str) {
    return str
      .replace(/\{p60\}/g, PRICES.min60)
      .replace(/\{sal\}/g, PRICES.salExtra)
      .replace(/\{b3\}/g, PRICES.bono3)
      .replace(/\{b5\}/g, PRICES.bono5)
      .replace(/\{b10\}/g, PRICES.bono10)
      .replace(/\{b3u\}/g, Math.round(PRICES.bono3 / 4))
      .replace(/\{b5u\}/g, Math.round(PRICES.bono5 / 8))
      .replace(/\{b10u\}/g, Math.round(PRICES.bono10 / 12))
      .replace(/\{prem\}/g, PRICES.premium);
  }

  /* Sanea: solo dejamos pasar <b> porque los textos son nuestros,
     pero cualquier cosa escrita por el usuario se escapa entera. */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function renderBotText(s) {
    return escapeHtml(s).replace(/&lt;b&gt;/g, '<strong>').replace(/&lt;\/b&gt;/g, '</strong>');
  }

  function normalize(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  /* URL de la landing de masaje a domicilio / eventos VIP, una por idioma
     (cada versión tiene su propia URL traducida). */
  var VIP_URLS = {
    es: '/eventos-vip-masajes-premium/',
    en: '/en/vip-massage-events/',
    fr: '/fr/evenements-massages-vip/',
    it: '/it/eventi-massaggi-vip/',
    nl: '/nl/vip-massage-evenementen/',
    pl: '/pl/wydarzenia-z-masazem-vip/',
    pt: '/pt/eventos-massagens-vip/'
  };

  /* ---------- Construcción del widget ---------- */
  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.5A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
  var ICON_LEAF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>';

  var launcher, nudge, panel, log, actions, input, form;
  var state = { massage: null, duration: null, opened: false };

  function build() {
    launcher = document.createElement('button');
    launcher.className = 'mmbot-launcher';
    launcher.setAttribute('aria-label', T.name);
    launcher.innerHTML = ICON_CHAT;

    nudge = document.createElement('div');
    nudge.className = 'mmbot-nudge';
    nudge.setAttribute('data-nosnippet', '');
    nudge.textContent = T.nudge;

    panel = document.createElement('div');
    panel.className = 'mmbot-panel';
    panel.setAttribute('data-nosnippet', '');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', T.name);
    panel.innerHTML =
      '<div class="mmbot-head">' +
        '<div class="mmbot-head-avatar" role="img" aria-label="Masajemalaga"></div>' +
        '<div class="mmbot-head-txt">' +
          '<div class="mmbot-head-name">' + escapeHtml(T.name) + '</div>' +
          '<div class="mmbot-head-status"><span class="mmbot-dot"></span>' + escapeHtml(T.status) + '</div>' +
        '</div>' +
        '<button class="mmbot-close" aria-label="Cerrar">' + ICON_CLOSE + '</button>' +
      '</div>' +
      '<div class="mmbot-log" role="log" aria-live="polite"></div>' +
      '<div class="mmbot-actions"></div>' +
      '<form class="mmbot-form">' +
        '<input class="mmbot-input" type="text" autocomplete="off" placeholder="' + escapeHtml(T.placeholder) + '" aria-label="' + escapeHtml(T.placeholder) + '">' +
        '<button class="mmbot-send" type="submit" aria-label="Enviar">' + ICON_SEND + '</button>' +
      '</form>' +
      '<div class="mmbot-foot">' + escapeHtml(T.foot) + '</div>';

    document.body.appendChild(launcher);
    document.body.appendChild(nudge);
    document.body.appendChild(panel);

    log = panel.querySelector('.mmbot-log');
    actions = panel.querySelector('.mmbot-actions');
    input = panel.querySelector('.mmbot-input');
    form = panel.querySelector('.mmbot-form');

    launcher.addEventListener('click', open);
    panel.querySelector('.mmbot-close').addEventListener('click', close);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      input.value = '';
      say(v);
      handleFreeText(v);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.opened) close();
    });
  }

  function open() {
    state.opened = true;
    panel.classList.add('is-open');
    launcher.classList.add('is-hidden');
    nudge.classList.remove('is-visible');
    if (!log.children.length) {
      botSay(T.greet, mainMenu);
    }
    setTimeout(function () {
      if (window.innerWidth > 640) input.focus();
    }, 300);
  }

  function close() {
    state.opened = false;
    panel.classList.remove('is-open');
    launcher.classList.remove('is-hidden');
  }

  /* ---------- Mensajes ---------- */
  function say(text) {
    var d = document.createElement('div');
    d.className = 'mmbot-msg user';
    d.textContent = text;
    log.appendChild(d);
    scroll();
  }

  function botSay(text, chipsFn, delay) {
    setChips([]);
    var typing = document.createElement('div');
    typing.className = 'mmbot-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(typing);
    scroll();

    setTimeout(function () {
      typing.remove();
      var d = document.createElement('div');
      d.className = 'mmbot-msg bot';
      d.innerHTML = renderBotText(fmt(text));
      log.appendChild(d);
      scroll();
      if (typeof chipsFn === 'function') chipsFn();
    }, delay || Math.min(220 + text.length * 4, 900));
  }

  function scroll() {
    log.scrollTop = log.scrollHeight;
  }

  function setChips(list) {
    actions.innerHTML = '';
    list.forEach(function (c) {
      var b;
      if (c.href) {
        b = document.createElement('a');
        b.href = c.href;
        if (c.blank !== false) { b.target = '_blank'; b.rel = 'noopener noreferrer'; }
      } else {
        b = document.createElement('button');
        b.type = 'button';
      }
      b.className = 'mmbot-chip' + (c.cls ? ' ' + c.cls : '');
      b.textContent = c.label;
      if (c.fn) b.addEventListener('click', c.fn);
      actions.appendChild(b);
    });
  }

  /* ---------- Menús / flujos ---------- */
  function mainMenu() {
    var chips = [
      { label: T.mMassages, fn: function () { say(T.mMassages); showMassages(); } },
      { label: T.mBook, cls: 'primary', fn: function () { say(T.mBook); startBooking(); } },
      { label: T.mPacks, fn: function () { say(T.mPacks); showPacks(); } },
      { label: T.mVip, fn: function () { say(T.mVip); showVip(); } },
      { label: T.mDoubts, fn: function () { say(T.mDoubts); showDoubts(); } }
    ];
    // Solo se ofrece si la cuenta de usuario está disponible en la página
    // (account.js cargado); si no, no aparece la opción.
    if (window.MMAccount && typeof window.MMAccount.openRegisterOrAccount === 'function') {
      chips.push({
        label: T.mRegister,
        fn: function () { say(T.mRegister); window.MMAccount.openRegisterOrAccount(); }
      });
    }
    setChips(chips);
  }

  function backChip() {
    return { label: T.back, fn: function () { botSay(T.greet, mainMenu); } };
  }

  function showMassages() {
    botSay(T.massagesIntro, function () {
      botSay(T.whichMassage, function () {
        setChips([
          { label: T.mBook, cls: 'primary', fn: function () { say(T.mBook); startBooking(); } },
          { label: T.helpChoose, fn: function () { say(T.helpChoose); askGoal(); } },
          backChip()
        ]);
      });
    });
  }

  function askGoal() {
    botSay(T.chooseGoal, function () {
      setChips([
        { label: T.goalRelax, fn: function () { say(T.goalRelax); recommend('relax', 'Anochecer'); } },
        { label: T.goalTension, fn: function () { say(T.goalTension); recommend('tension', 'Mar'); } },
        { label: T.goalSport, fn: function () { say(T.goalSport); recommend('sport', 'Arena'); } },
        { label: T.goalCompete, fn: function () { say(T.goalCompete); recommend('compete', 'Amanecer'); } }
      ]);
    });
  }

  function recommend(kind, massage) {
    var map = { relax: T.recRelax, tension: T.recTension, sport: T.recSport, compete: T.recCompete };
    state.massage = massage;
    botSay(T.recFor + ':\n\n' + map[kind], function () {
      askDuration();
    });
  }

  function startBooking() {
    if (!state.massage) {
      botSay(T.massagesIntro, function () {
        botSay(T.whichMassage, function () {
          var chips = MASSAGES.map(function (m) {
            var label = m.charAt(0).toUpperCase() + m.slice(1);
            return { label: label, fn: function () { say(label); state.massage = label; askDuration(); } };
          });
          chips.push({ label: T.helpChoose, fn: function () { say(T.helpChoose); askGoal(); } });
          setChips(chips);
        });
      });
    } else {
      askDuration();
    }
  }

  /* Solo trabajamos con sesiones de 60 minutos: ya no se pregunta la
     duración, se apunta directamente 60 minutos. */
  function askDuration() {
    state.duration = '60 ' + T.minutes;
    finishBooking();
  }

  function finishBooking() {
    // Si el cliente tiene sesión iniciada (account.js), guardamos esta
    // solicitud en su historial. Si no hay cuenta o no ha entrado, no
    // pasa nada: la reserva sigue funcionando igual por calendario o WhatsApp.
    if (window.MMAccount && window.MMAccount.isLoggedIn && window.MMAccount.isLoggedIn()) {
      window.MMAccount.logRequest(state.massage, state.duration);
    }

    var txt = T.bookReady
      .replace('{massage}', state.massage || '')
      .replace('{dur}', state.duration || '');
    // El bono de 10 sesiones solo tiene sentido comparado con la sesión de
    // 60 minutos (las sesiones del bono son de 60 min); se recuerda aquí,
    // justo cuando el cliente ya ha decidido reservar, que es el momento de
    // mayor intención de compra — sin bloquear ni condicionar la reserva
    // suelta, que sigue su curso exactamente igual.
    var esDe60 = (state.duration || '').indexOf('60') === 0;
    botSay(txt, function () {
      /* Aviso del bono de 10 desactivado: los bonos van a cambiar de precio y forma. */
      var mostrarBonoTip = false;
      var siguiente = function () {
        botSay(T.bookNote, function () {
          var waTxt = T.waMsgBook
            .replace('{massage}', state.massage || '')
            .replace('{dur}', state.duration || '');
          setChips([
            { label: T.openCal, cls: 'primary', fn: goToCalendar },
            { label: T.wa, cls: 'wa', href: waLink(waTxt) },
            backChip()
          ]);
        });
      };
      if (mostrarBonoTip) {
        botSay(fmt(T.bono10Tip), siguiente);
      } else {
        siguiente();
      }
    });
  }

  function goToCalendar() {
    var target = document.getElementById('reservas');
    if (target) {
      close();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#reservas';
    }
  }

  function showPacks() {
    botSay(T.packsTxt, function () {
      var chips = [];
      if (document.getElementById('packs')) {
        chips.push({
          label: T.giftBtn,
          cls: 'primary',
          fn: function () {
            var t = document.getElementById('packs');
            if (t) { close(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          }
        });
      }
      chips.push({ label: T.wa, cls: 'wa', href: waLink(T.waMsgGeneral) });
      chips.push(backChip());
      setChips(chips);
    });
  }

  function showVip() {
    botSay(T.vipTxt, function () {
      var chips = [];
      chips.push({ label: T.vipBtn, cls: 'primary', href: VIP_URLS[LANG] || VIP_URLS.es });
      chips.push({ label: T.wa, cls: 'wa', href: waLink(T.waMsgVip) });
      chips.push(backChip());
      setChips(chips);
    });
  }

  function showDoubts() {
    botSay(T.doubtsTitle, function () {
      setChips([
        { label: T.qBring, fn: function () { say(T.qBring); answer(T.aBring); } },
        { label: T.qWhere, fn: function () { say(T.qWhere); answer(T.aWhere); } },
        { label: T.qHours, fn: function () { say(T.qHours); answer(T.aHours); } },
        { label: T.qFirst, fn: function () { say(T.qFirst); answer(T.aFirst); } },
        { label: T.qPay, fn: function () { say(T.qPay); answer(T.aPay); } },
        backChip()
      ]);
    });
  }

  function answer(text) {
    botSay(text, function () {
      setChips([
        { label: T.mBook, cls: 'primary', fn: function () { say(T.mBook); startBooking(); } },
        { label: T.mDoubts, fn: function () { say(T.mDoubts); showDoubts(); } },
        { label: T.wa, cls: 'wa', href: waLink(T.waMsgGeneral) },
        backChip()
      ]);
    });
  }

  /* ---------- Texto libre ---------- */
  function detectIntent(text) {
    var n = normalize(text);
    for (var i = 0; i < KEYWORDS.length; i++) {
      var k = KEYWORDS[i];
      for (var j = 0; j < k.words.length; j++) {
        var w = normalize(k.words[j]);
        // Límite de palabra en los dos extremos: sin esto, palabras cortas
        // de un idioma (p.ej. "ile", "cuánto" en polaco) coincidían dentro
        // de palabras de otro idioma que las contienen por casualidad
        // (p.ej. "domicile" en francés), robando la intención correcta.
        if (new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(n)) {
          return k.intent;
        }
      }
    }
    return null;
  }

  function handleFreeText(text) {
    var n = normalize(text);
    // si nombra un masaje concreto, lo damos por elegido
    for (var i = 0; i < MASSAGES.length; i++) {
      // Límite de palabra (\b): "mar" no debe saltar dentro de "mariage" o
      // cualquier otra palabra que simplemente contenga esas letras.
      if (new RegExp('\\b' + MASSAGES[i] + '\\b', 'i').test(n)) {
        state.massage = MASSAGES[i].charAt(0).toUpperCase() + MASSAGES[i].slice(1);
        askDuration();
        return;
      }
    }
    switch (detectIntent(text)) {
      case 'prices':  showMassages(); break;
      case 'book':    startBooking(); break;
      case 'packs':   showPacks(); break;
      case 'vip':     showVip(); break;
      case 'hours':   answer(T.aHours); break;
      case 'where':   answer(T.aWhere); break;
      case 'bring':   answer(T.aBring); break;
      case 'first':   answer(T.aFirst); break;
      case 'pay':     answer(T.aPay); break;
      case 'sport':   recommend('sport', 'Arena'); break;
      case 'relax':   recommend('relax', 'Anochecer'); break;
      case 'greet':   botSay(T.greet, mainMenu); break;
      default:
        botSay(T.fallback, function () {
          setChips([
            { label: T.wa, cls: 'wa', href: waLink(T.waMsgGeneral) },
            backChip()
          ]);
        });
    }
  }

  /* ---------- El lanzador se adapta al fondo que tiene detrás ----------
     Sobre zonas oscuras (el vídeo de cabecera, el pie verde...) se pone
     en blanco con el logo verde; sobre zonas claras mantiene el verde
     con el logo en crema. */
  function watchBackground() {
    // Solo damos por oscuras las secciones cuyo fondo es un vídeo o un
    // dibujo (ahí no se puede leer un color). El resto — incluido el pie,
    // que es verde en la portada pero claro en las páginas de servicio —
    // se mide por su color real.
    var DARK_ZONES = '.video-hero, .hero';
    // Elementos que NO son "fondo": los propios botones flotantes y los
    // avisos. Si los contáramos, el verde de WhatsApp o el blanco de las
    // banderas falsearían la medida.
    var IGNORE = '.whatsapp-float, .whatsapp-float-big, .lang-switcher, ' +
                 '.stock-alert, .cookie-banner, .mmbot-launcher, .mmbot-nudge, .mmbot-panel';

    function luminance(rgb) {
      var m = rgb.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      var v = m[1].split(',').map(function (s) { return parseFloat(s); });
      if (v.length > 3 && v[3] === 0) return null;   // transparente: no cuenta
      return (v[0] * 299 + v[1] * 587 + v[2] * 114) / 1000;
    }

    // Luminancia de UN punto de la pantalla (null si no se puede saber)
    function lumAt(x, y) {
      var stack = [];
      try { stack = document.elementsFromPoint(x, y) || []; } catch (e) { return null; }
      for (var i = 0; i < stack.length; i++) {
        var el = stack[i];
        if (el === launcher || launcher.contains(el) ||
            el === nudge || el === panel || panel.contains(el)) continue;
        if (el.closest && el.closest(IGNORE)) continue;
        if (el.closest && el.closest(DARK_ZONES)) return 0;      // zona oscura conocida
        var lum = luminance(window.getComputedStyle(el).backgroundColor);
        if (lum !== null) return lum;
      }
      return null;
    }

    var isDark = false;   // estado actual, para la histéresis
    var pending = false;

    function apply() {
      pending = false;
      var r = launcher.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;

      // Muestreamos una rejilla amplia alrededor del botón en vez de un
      // solo punto. Así una raya, un borde o una línea suelta no bastan
      // para cambiar el color: hace falta que la mayoría del área que
      // hay detrás sea oscura.
      var STEP = Math.max(r.width, 44);
      var darkCount = 0, total = 0;
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          var x = Math.min(Math.max(cx + dx * STEP, 1), window.innerWidth - 2);
          var y = Math.min(Math.max(cy + dy * STEP, 1), window.innerHeight - 2);
          var lum = lumAt(x, y);
          if (lum === null) continue;
          total++;
          if (lum < 128) darkCount++;
        }
      }
      if (!total) return;

      var ratio = darkCount / total;
      // Histéresis: hace falta una mayoría clara para cambiar, y una
      // mayoría clara en sentido contrario para volver. Entre medias se
      // mantiene el color que ya tenía, evitando parpadeos al pasar por
      // bordes o degradados.
      if (!isDark && ratio >= 0.65) isDark = true;
      else if (isDark && ratio <= 0.35) isDark = false;

      launcher.classList.toggle('is-on-dark', isDark);
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    setTimeout(apply, 400);
    apply();
  }

  /* ---------- Aparición retardada de los botones flotantes ----------
     Los tres botones de la derecha (WhatsApp, idiomas y chatbot) no
     salen nada más cargar: esperan a que la primera pregunta frecuente
     ("¿Tengo que llevar algo?") llegue a la mitad de la pantalla. A
     partir de ahí, cada uno sigue con sus reglas propias de siempre. */
  function watchFloatsReveal() {
    // Primera aparición: cuando el bloque del test "¿No sabes cuál
    // elegir?" está a punto de salir de la pantalla por arriba (justo
    // antes de desaparecer del todo). Si se vuelve a subir por encima de
    // ese punto, se ocultan otra vez (reversible, como siempre).
    var quizSection = document.querySelector('.quiz');
    // Segunda zona: se ocultan de nuevo al llegar a "Packs / Ahorra
    // reservando por adelantado" y reaparecen al llegar a "Sobre
    // nosotros", quedándose visibles ya hasta el final de la página.
    var hideZoneStart = document.querySelector('#packs .head');
    var hideZoneEnd = document.getElementById('nosotros');
    var root = document.documentElement;

    // Si esta página no tiene esas secciones (landing pages), no se
    // retrasa nada: los botones salen desde el principio, como siempre.
    if (!quizSection) { root.classList.remove('mm-floats-hidden'); return; }

    root.classList.add('mm-floats-hidden');

    var pending = false;
    function apply() {
      pending = false;
      var r = quizSection.getBoundingClientRect();
      // "A punto de salir de la pantalla" = su borde inferior ya casi
      // llega arriba del todo (poco margen restante).
      var revealed = r.bottom <= window.innerHeight * 0.15;

      var inSecondHideZone = false;
      if (revealed && hideZoneStart && hideZoneEnd) {
        var startY = hideZoneStart.getBoundingClientRect().top;
        var endY = hideZoneEnd.getBoundingClientRect().top;
        // Empieza a ocultarse cuando el encabezado de "Packs" llega a
        // media pantalla, y reaparece al llegar "Sobre nosotros".
        if (startY <= window.innerHeight * 0.5 && endY > 0) {
          inSecondHideZone = true;
        }
      }

      root.classList.toggle('mm-floats-hidden', !revealed || inSecondHideZone);
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    apply();
  }

  /* ---------- Arranque ---------- */
  function init() {
    build();
    watchFloatsReveal();
    watchBackground();
    // burbuja de aviso a los 12 s, solo una vez por pestaña
    try {
      if (!sessionStorage.getItem('mmbot-nudged')) {
        setTimeout(function () {
          if (!state.opened) {
            nudge.classList.add('is-visible');
            sessionStorage.setItem('mmbot-nudged', '1');
            setTimeout(function () { nudge.classList.remove('is-visible'); }, 8000);
          }
        }, 12000);
      }
    } catch (e) { /* sessionStorage bloqueado: no pasa nada */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---------- Menú de email (enviar / copiar) ----------
   Intercepta el clic en cualquier enlace mailto:hola@masajemalaga.es de la
   web y muestra un menú con dos opciones en vez de navegar directamente:
   "Enviar email" (abre el cliente de correo) y "Copiar dirección" (la
   copia al portapapeles). Un solo listener delegado, vale para cualquier
   página que cargue este archivo. */
(function () {
  var menu = null;

  // Textos del menú según el idioma de la página (atributo lang del
  // <html>). Si el idioma no está en la lista, se usa español por defecto.
  var I18N = {
    es: { send: 'Enviar email', copy: 'Copiar dirección', copied: '¡Copiado!' },
    en: { send: 'Send email', copy: 'Copy address', copied: 'Copied!' },
    fr: { send: 'Envoyer un email', copy: "Copier l'adresse", copied: 'Copié !' },
    it: { send: 'Invia email', copy: 'Copia indirizzo', copied: 'Copiato!' },
    nl: { send: 'E-mail versturen', copy: 'Adres kopiëren', copied: 'Gekopieerd!' },
    pl: { send: 'Wyślij e-mail', copy: 'Kopiuj adres', copied: 'Skopiowano!' },
    pt: { send: 'Enviar email', copy: 'Copiar endereço', copied: 'Copiado!' }
  };
  var lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  var T = I18N[lang] || I18N.es;

  function closeMenu() {
    if (!menu) return;
    menu.remove();
    menu = null;
    document.removeEventListener('click', onOutsideClick, true);
    document.removeEventListener('keydown', onKeydown, true);
    window.removeEventListener('scroll', closeMenu, true);
    window.removeEventListener('resize', closeMenu, true);
  }
  function onOutsideClick(e) {
    if (menu && !menu.contains(e.target)) closeMenu();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* nada más que hacer */ }
    document.body.removeChild(ta);
  }

  function copyEmail(address, btn) {
    var mark = function () {
      btn.classList.add('is-done');
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>' +
        T.copied;
      setTimeout(closeMenu, 900);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(mark).catch(function () {
        fallbackCopy(address);
        mark();
      });
    } else {
      fallbackCopy(address);
      mark();
    }
  }

  function openMenu(link, address) {
    closeMenu();
    menu = document.createElement('div');
    menu.className = 'mm-email-menu';
    menu.innerHTML =
      '<button type="button" data-action="send">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18v12H3z"/><path d="M3 6l9 7 9-7"/></svg>' +
      T.send + '</button>' +
      '<button type="button" data-action="copy">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>' +
      T.copy + '</button>';
    document.body.appendChild(menu);

    var rect = link.getBoundingClientRect();
    var menuW = menu.offsetWidth || 200;
    var menuH = menu.offsetHeight || 96;
    var left = Math.min(rect.left, window.innerWidth - menuW - 12);
    left = Math.max(12, left);
    var top = rect.bottom + 8;
    if (top + menuH > window.innerHeight - 12) top = rect.top - menuH - 8;
    top = Math.max(12, top);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    requestAnimationFrame(function () { menu.classList.add('is-open'); });

    menu.querySelector('[data-action="send"]').addEventListener('click', function () {
      window.location.href = 'mailto:' + address;
      closeMenu();
    });
    menu.querySelector('[data-action="copy"]').addEventListener('click', function (e) {
      copyEmail(address, e.currentTarget);
    });

    setTimeout(function () {
      document.addEventListener('click', onOutsideClick, true);
      document.addEventListener('keydown', onKeydown, true);
      window.addEventListener('scroll', closeMenu, true);
      window.addEventListener('resize', closeMenu, true);
    }, 0);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="mailto:hola@masajemalaga.es"]');
    if (!link) return;
    e.preventDefault();
    var address = link.getAttribute('href').replace('mailto:', '').split('?')[0];
    openMenu(link, address);
  });
})();

/* ---------- Distribución de los 4 botones del head (video-hero-btns) ----------
   Decide en tiempo real si caben los 4 seguidos, 2+2, o uno debajo de otro,
   midiendo el ancho real de cada botón (que cambia según idioma y tamaño de
   letra) en vez de usar puntos de corte fijos en px. Con esto nunca salen
   "3 arriba y 1 suelto debajo": o entran los 4, o entran exactamente 2 en
   cada fila, o van uno a uno. */
(function () {
  var GAP = 14;

  function layoutHeroButtons() {
    var container = document.querySelector('.video-hero-btns');
    if (!container) return;
    var btns = Array.prototype.slice.call(container.children).filter(function (el) {
      return el.tagName === 'A';
    });
    if (btns.length < 2) return;

    // Para medir el ancho real de cada botón sin que el texto se corte,
    // se pone nowrap temporalmente en todos mientras se mide. También hay
    // que evitar que el grid los estire a lo ancho de la columna actual
    // (comportamiento por defecto, justify-self:stretch): si la columna de
    // partida ya es ancha, todos "medirían" ese mismo ancho en vez de su
    // ancho real de texto, dando una medición falseada.
    btns.forEach(function (b) {
      b.style.whiteSpace = 'nowrap';
      b.style.justifySelf = 'start';
    });

    var widths = btns.map(function (b) { return b.scrollWidth; });

    // OJO: el ancho disponible NO se puede leer del propio contenedor
    // (container.clientWidth), porque .video-hero-content no tiene un
    // ancho fijo — se ajusta al hijo más ancho que tenga dentro (así los
    // 4 botones seguidos ensanchan el bloque sin afectar al titular). Si
    // se mide ahí, la medición es circular: el ancho "disponible" depende
    // de las columnas que ya había puestas la vez anterior. El ancho real
    // se calcula desde la sección completa (.video-hero, que sí ocupa el
    // ancho real de pantalla), respetando el ancho máximo y el padding
    // del bloque de contenido.
    var content = container.closest('.video-hero-content');
    var hero = content ? content.closest('.video-hero') : null;
    var available = container.clientWidth;
    if (hero && content) {
      var cs = getComputedStyle(content);
      var padL = parseFloat(cs.paddingLeft) || 0;
      var padR = parseFloat(cs.paddingRight) || 0;
      var maxW = parseFloat(cs.maxWidth);
      var cap = isNaN(maxW) ? hero.clientWidth : Math.min(hero.clientWidth, maxW);
      available = cap - padL - padR;
    }

    var total4 = widths.reduce(function (a, w) { return a + w; }, 0) + GAP * (widths.length - 1);
    if (total4 <= available) {
      container.style.gridTemplateColumns = 'repeat(' + widths.length + ', max-content)';
      btns.forEach(function (b) { b.style.justifySelf = ''; });
      return;
    }

    if (widths.length >= 4) {
      var col1 = Math.max(widths[0], widths[2]);
      var col2 = Math.max(widths[1], widths[3]);
      var total2 = col1 + col2 + GAP;
      if (total2 <= available) {
        container.style.gridTemplateColumns = 'repeat(2, max-content)';
        btns.forEach(function (b) { b.style.justifySelf = ''; });
        return;
      }
    }

    // No caben ni de 2 en 2: uno debajo de otro, a todo lo ancho. Aquí sí
    // se permite que el texto salte de línea si hiciera falta, y se
    // restaura el estirado normal para que ocupe toda la columna.
    container.style.gridTemplateColumns = '1fr';
    btns.forEach(function (b) {
      b.style.whiteSpace = 'normal';
      b.style.justifySelf = '';
    });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  var run = debounce(layoutHeroButtons, 120);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', layoutHeroButtons);
  } else {
    layoutHeroButtons();
  }
  window.addEventListener('load', layoutHeroButtons);
  window.addEventListener('resize', run);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layoutHeroButtons);
  }
})();
