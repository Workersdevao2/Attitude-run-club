// Custom Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .plan-btn, .event-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '52px';
      ring.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Nav scroll effect
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ─── FULL PT / EN TRANSLATIONS ───────────────────────────────────────────────
const translations = {
  pt: {
    // Nav
    'nav.home': 'Início',
    'nav.pilares': 'Pilares',
    'nav.planos': 'Planos',
    'nav.eventos': 'Eventos',
    'nav.roadmap': 'Roadmap',
    'nav.contacto': 'Contacto',
    'nav.cta': 'Juntar ao Clube',

    // Home hero
    'hero.eyebrow': 'Luanda · Lisboa · Maputo · Cape Town',
    'hero.title1': 'Corre Com',
    'hero.title2': 'Atitude.',
    'hero.sub': 'A maior comunidade lusófona de corrida ligada a uma <strong>marca africana</strong>. Não é só treino — é tribo, identidade e movimento.',
    'hero.cta1': 'Quero Entrar',
    'hero.cta2': 'Ver Eventos',
    'hero.scroll': 'Scroll',

    // Marquee / pillars labels
    'marquee.corrida': 'Corrida',
    'marquee.lifestyle': 'Lifestyle',
    'marquee.moda': 'Moda',
    'marquee.educacao': 'Educação',
    'marquee.pertencimento': 'Pertencimento',
    'marquee.nightruns': 'Night Runs',
    'marquee.comunidade': 'Comunidade',

    // Pillars section
    'pillars.label': 'Os Cinco Pilares',
    'pillars.title': 'O clube<br>é mais que<br>a corrida.',
    'pillar.1.title': 'Corrida',
    'pillar.1.desc': 'Treinos semanais para todos os níveis. Pace groups, longões, night runs e treinos técnicos que te tornam melhor a cada semana.',
    'pillar.2.title': 'Lifestyle',
    'pillar.2.desc': 'Brunch pós-corrida, sunset runs, run + música, run + fotografia. O treino é só o começo da experiência.',
    'pillar.3.title': 'Moda',
    'pillar.3.desc': 'Drops exclusivos para membros, edições limitadas por cidade, coleções Night Run. A roupa é identidade, não apenas tecido.',
    'pillar.4.title': 'Educação',
    'pillar.4.desc': 'Técnicas, mobilidade, nutrição, mindset e preparação para provas. Workshops e conteúdos para evoluíres dentro e fora da pista.',
    'pillar.5.title': 'Pertencimento',
    'pillar.5.desc': 'O verdadeiro valor: sentires que fazes parte de algo maior. É isso que cria retenção. É isso que cria lealdade. É a tribo.',

    // Stats
    'stat.pilares': 'Pilares',
    'stat.cidades': 'Cidades',
    'stat.dias': 'Dias para lançar',
    'stat.impacto': 'Impacto',

    // Gallery
    'gallery.label': 'A Tribo',
    'gallery.title': 'Isto não é<br>só corrida.<br>É família.',

    // Home CTA
    'cta.eyebrow': 'Junta-te à Tribo',
    'cta.title1': 'A tribo está',
    'cta.title2': 'a correr.',
    'cta.sub': 'O maior ativo não será a roupa. Será a tribo Attitude. A roupa vira símbolo. O treino vira ritual. A comunidade vira movimento.',
    'cta.btn1': 'Entrar Agora',
    'cta.btn2': 'Saber Mais',

    // Footer
    'footer.tagline': 'Move With Purpose · Corre Com Atitude',
    'footer.nav': 'Navegação',
    'footer.cidades': 'Cidades',
    'footer.fase1': 'Fase 1 — Luanda',
    'footer.fase2': 'Fase 2 — Lisboa · Maputo',
    'footer.fase3': 'Fase 3 — Cape Town · Benguela · Porto',
    'footer.contacto': 'Contacto',
    'footer.rights': '© 2025 Attitude Run Club · Attitude Sportwear',

    // Planos page
    'planos.label': 'Memberships',
    'planos.title': 'Escolhe<br>o teu nível.',
    'planos.sub': 'Inscrição única de 10.000 Kz + mensalidade. Todos os planos dão acesso à App Regibox e à tribo Attitude.',
    'plan.entry': 'Entry',
    'plan.popular': 'Mais Popular',
    'plan.elite': 'Elite',
    'plan.normal': 'Normal',
    'plan.plus': 'Plus',
    'plan.vip': 'VIP',
    'plan.period': 'por mês + 10.000 Kz inscrição',
    'plan.btn': 'Entrar Agora',
    'plan.n1': 'Participação nas corridas e caminhadas regulares',
    'plan.n2': 'Acesso ao grupo exclusivo de comunicação',
    'plan.n3': 'Desconto de 10% em produtos Attitude Sportwear',
    'plan.n4': 'Participação em desafios mensais',
    'plan.n5': 'Acesso aos parceiros do clube com descontos',
    'plan.n6': 'Prioridade nas inscrições para eventos pagos',
    'plan.n7': 'Certificado anual de participação',
    'plan.n8': 'Acesso à App Regibox',
    'plan.p1': 'Tudo do plano Normal',
    'plan.p2': 'Atividades especiais grátis (Yoga, Pilates, Mobilidade, Técnica)',
    'plan.p3': 'Plano de treino mensal na App',
    'plan.p4': 'Avaliação física trimestral',
    'plan.p5': 'Desconto de 20% em produtos Attitude',
    'plan.p6': 'Desconto em eventos do clube',
    'plan.p7': 'T-shirt oficial anual',
    'plan.p8': 'Acesso prioritário e vagas reservadas',
    'plan.p9': 'Sorteios exclusivos',
    'plan.p10': 'Medalha de reconhecimento por metas anuais',
    'plan.v1': 'Tudo dos planos anteriores',
    'plan.v2': 'Participação gratuita em todas as atividades',
    'plan.v3': 'Acesso completo a programas de performance',
    'plan.v4': 'Avaliação física e acompanhamento mensal',
    'plan.v5': 'Convites para eventos exclusivos VIP',
    'plan.v6': 'Desconto de 30% em produtos Attitude',
    'plan.v7': 'Kit VIP de boas-vindas',
    'plan.v8': 'Prioridade máxima em inscrições',
    'plan.v9': 'Área VIP nos eventos do clube',
    'plan.v10': 'Workshops e palestras grátis',
    'plan.v11': 'Nome no mural de membros VIP',
    'planos.cta.eyebrow': 'Pronto para começar?',
    'planos.cta.title': 'A tribo<br>espera por ti.',
    'planos.cta.btn': 'Inscrever Agora',

    // Eventos page
    'eventos.label': 'Eventos',
    'eventos.title': 'Histórico<br>& próximos.',
    'eventos.sub': 'Passados à esquerda, próximos à direita. Cada corrida deixa marca — e a próxima já está marcada.',
    'eventos.past.title': 'Eventos passados',
    'eventos.upcoming.title': 'Próximos eventos',
    'eventos.past.1.date': 'Agosto 2025 · Luanda',
    'eventos.past.1.name': 'Night Run — Neon Edition',
    'eventos.past.1.meta': 'LED Run · DJ no ponto final · Best outfit',
    'eventos.past.1.recap': 'Noite cheia de energia. Dezenas de Attituders em neon, percurso iluminado e vibe de tribo do início ao fim. Resumo: comunidade a 100%.',
    'eventos.past.2.date': 'Julho 2025 · Luanda',
    'eventos.past.2.name': 'Sunset Run + Networking',
    'eventos.past.2.meta': 'Pace social · Vista · Música',
    'eventos.past.2.recap': 'O pôr do sol mais bonito da semana. Corrida leve, conversas fortes e novas amizades no clube. Ideal para quem estava a começar.',
    'eventos.past.3.date': 'Junho 2025 · Luanda',
    'eventos.past.3.name': 'Run + Brunch',
    'eventos.past.3.meta': '5 km · Recovery · Café',
    'eventos.past.3.recap': 'Treino + mesa partilhada. Smoothies, café e networking depois dos 5 km. Formato que a tribo pediu para voltar.',
    'eventos.up.1.date': 'Sexta · 30 Outubro · 19h',
    'eventos.up.1.name': 'Attituders Let\'s Go',
    'eventos.up.1.meta': 'Save the date · Ingressos disponíveis · ticket.ao',
    'eventos.up.1.recap': 'O próximo grande encontro da tribo. Energia, corrida e atitude. Não fiques de fora.',
    'eventos.up.1.btn': 'Comprar ingresso',
    'eventos.formats.label': 'Experiências',
    'eventos.formats.title': 'Formatos<br>de eventos.',
    'event.tag.semanal': 'Semanal',
    'event.tag.especial': 'Especial',
    'event.tag.quinzenal': 'Quinzenal',
    'event.tag.cultural': 'Cultural',
    'event.tag.trimestral': 'Trimestral',
    'event.1.name': 'Night Run',
    'event.1.desc': 'Corrida noturna · Luzes · Música · Energia da tribo',
    'event.2.name': 'Fancy Run',
    'event.2.desc': 'Superheroes · Wakanda · Angola Heritage · White Party · Black & Gold',
    'event.3.name': 'Run + Brunch',
    'event.3.desc': '5km · Recovery · Smoothie bar · Café · Networking · Boa energia',
    'event.4.name': 'Story Run',
    'event.4.desc': 'Percurso com storytelling · Arte · Frases motivacionais · Fotos cinematográficas',
    'event.5.name': 'Sunset Run',
    'event.5.desc': 'O treino mais bonito da semana. Pace social, vista, música e tribo.',
    'event.6.name': 'Prova Interna',
    'event.6.desc': 'Ranking oficial · Medalhas · Badges de milestone · 100km Club',
    'eventos.cta.eyebrow': 'Não percas o próximo',
    'eventos.cta.title': 'Junta-te<br>à tribo.',
    'eventos.cta.btn': 'Quero Participar',

    // Roadmap page
    'roadmap.label': 'Roadmap',
    'roadmap.title': '90 dias para<br>mudar tudo.',
    'roadmap.sub': 'Do zero à tribo. O plano de lançamento em três meses.',
    'roadmap.m1.label': 'Mês Um',
    'roadmap.m1.title': 'Fundação',
    'roadmap.m1.1': 'Branding do clube',
    'roadmap.m1.2': 'Grupo piloto — 30 pessoas',
    'roadmap.m1.3': 'Kit do Fundador',
    'roadmap.m1.4': 'Primeiro treino oficial',
    'roadmap.m1.5': 'Reels teaser nas redes',
    'roadmap.m2.label': 'Mês Dois',
    'roadmap.m2.title': 'Crescimento',
    'roadmap.m2.1': 'Abrir membership pago',
    'roadmap.m2.2': 'Primeiro drop exclusivo',
    'roadmap.m2.3': '2 eventos sociais',
    'roadmap.m2.4': 'Parceria com café local',
    'roadmap.m2.5': 'Primeiros sponsors',
    'roadmap.m3.label': 'Mês Três',
    'roadmap.m3.title': 'Expansão',
    'roadmap.m3.1': 'Night Run inaugural',
    'roadmap.m3.2': 'Prova interna 5K',
    'roadmap.m3.3': 'Ranking oficial publicado',
    'roadmap.m3.4': 'Programa de referral',
    'roadmap.m3.5': 'Lançamento em Lisboa',
    'roadmap.cta.eyebrow': 'Faz parte desde o início',
    'roadmap.cta.title': 'O movimento<br>começa agora.',
    'roadmap.cta.btn': 'Juntar-me',

    // Contacto page
    'contacto.label': 'Contacto',
    'contacto.title': 'Fala<br>connosco.',
    'contacto.sub': 'Dúvidas, parcerias ou só queres dizer olá? Estamos aqui.',
    'contacto.talk': 'Vamos conversar',
    'contacto.email': 'Email',
    'contacto.whatsapp': 'WhatsApp',
    'contacto.instagram': 'Instagram',
    'contacto.inscricao': 'Inscrição',
    'contacto.regibox': 'Registar na App Regibox →',
    'contacto.form.name': 'Nome',
    'contacto.form.email': 'Email',
    'contacto.form.msg': 'Mensagem',
    'contacto.form.btn': 'Enviar Mensagem',
    'contacto.form.note': 'Ou fala connosco diretamente no WhatsApp para resposta mais rápida.',
    'contacto.ph.name': 'O teu nome',
    'contacto.ph.email': 'O teu email',
    'contacto.ph.msg': 'A tua mensagem...'
  },

  en: {
    // Nav
    'nav.home': 'Home',
    'nav.pilares': 'Pillars',
    'nav.planos': 'Plans',
    'nav.eventos': 'Events',
    'nav.roadmap': 'Roadmap',
    'nav.contacto': 'Contact',
    'nav.cta': 'Join the Club',

    // Home hero
    'hero.eyebrow': 'Luanda · Lisbon · Maputo · Cape Town',
    'hero.title1': 'Run With',
    'hero.title2': 'Attitude.',
    'hero.sub': 'The largest Portuguese-speaking running community linked to an <strong>African brand</strong>. It\'s not just training — it\'s tribe, identity and movement.',
    'hero.cta1': 'I Want In',
    'hero.cta2': 'See Events',
    'hero.scroll': 'Scroll',

    // Marquee
    'marquee.corrida': 'Running',
    'marquee.lifestyle': 'Lifestyle',
    'marquee.moda': 'Fashion',
    'marquee.educacao': 'Education',
    'marquee.pertencimento': 'Belonging',
    'marquee.nightruns': 'Night Runs',
    'marquee.comunidade': 'Community',

    // Pillars
    'pillars.label': 'The Five Pillars',
    'pillars.title': 'The club<br>is more than<br>running.',
    'pillar.1.title': 'Running',
    'pillar.1.desc': 'Weekly training for every level. Pace groups, long runs, night runs and technical sessions that make you better every week.',
    'pillar.2.title': 'Lifestyle',
    'pillar.2.desc': 'Post-run brunch, sunset runs, run + music, run + photography. Training is only the start of the experience.',
    'pillar.3.title': 'Fashion',
    'pillar.3.desc': 'Exclusive member drops, limited city editions, Night Run collections. Clothing is identity, not just fabric.',
    'pillar.4.title': 'Education',
    'pillar.4.desc': 'Technique, mobility, nutrition, mindset and race prep. Workshops and content to grow on and off the track.',
    'pillar.5.title': 'Belonging',
    'pillar.5.desc': 'The real value: feeling part of something bigger. That builds retention. That builds loyalty. That is the tribe.',

    // Stats
    'stat.pilares': 'Pillars',
    'stat.cidades': 'Cities',
    'stat.dias': 'Days to launch',
    'stat.impacto': 'Impact',

    // Gallery
    'gallery.label': 'The Tribe',
    'gallery.title': 'This isn\'t<br>just running.<br>It\'s family.',

    // Home CTA
    'cta.eyebrow': 'Join the Tribe',
    'cta.title1': 'The tribe is',
    'cta.title2': 'running.',
    'cta.sub': 'The greatest asset won\'t be the clothes. It will be the Attitude tribe. Clothes become a symbol. Training becomes ritual. Community becomes movement.',
    'cta.btn1': 'Join Now',
    'cta.btn2': 'Learn More',

    // Footer
    'footer.tagline': 'Move With Purpose · Run With Attitude',
    'footer.nav': 'Navigation',
    'footer.cidades': 'Cities',
    'footer.fase1': 'Phase 1 — Luanda',
    'footer.fase2': 'Phase 2 — Lisbon · Maputo',
    'footer.fase3': 'Phase 3 — Cape Town · Benguela · Porto',
    'footer.contacto': 'Contact',
    'footer.rights': '© 2025 Attitude Run Club · Attitude Sportwear',

    // Planos
    'planos.label': 'Memberships',
    'planos.title': 'Choose<br>your level.',
    'planos.sub': 'One-time 10,000 Kz registration + monthly fee. Every plan includes Regibox App access and the Attitude tribe.',
    'plan.entry': 'Entry',
    'plan.popular': 'Most Popular',
    'plan.elite': 'Elite',
    'plan.normal': 'Normal',
    'plan.plus': 'Plus',
    'plan.vip': 'VIP',
    'plan.period': 'per month + 10,000 Kz registration',
    'plan.btn': 'Join Now',
    'plan.n1': 'Participation in regular runs and walks',
    'plan.n2': 'Access to the exclusive community group',
    'plan.n3': '10% off Attitude Sportwear products',
    'plan.n4': 'Monthly challenges',
    'plan.n5': 'Partner discounts',
    'plan.n6': 'Priority registration for paid events',
    'plan.n7': 'Annual participation certificate',
    'plan.n8': 'Regibox App access',
    'plan.p1': 'Everything in Normal',
    'plan.p2': 'Free special activities (Yoga, Pilates, Mobility, Technique)',
    'plan.p3': 'Monthly training plan in the App',
    'plan.p4': 'Quarterly fitness assessment',
    'plan.p5': '20% off Attitude products',
    'plan.p6': 'Discounts on club events',
    'plan.p7': 'Official annual T-shirt',
    'plan.p8': 'Priority access and reserved spots',
    'plan.p9': 'Exclusive giveaways',
    'plan.p10': 'Recognition medal for annual goals',
    'plan.v1': 'Everything in previous plans',
    'plan.v2': 'Free entry to all club activities',
    'plan.v3': 'Full access to performance programs',
    'plan.v4': 'Monthly assessment and coaching',
    'plan.v5': 'Invites to exclusive VIP events',
    'plan.v6': '30% off Attitude products',
    'plan.v7': 'VIP welcome kit',
    'plan.v8': 'Highest priority on registrations',
    'plan.v9': 'VIP area at club events',
    'plan.v10': 'Free workshops and talks',
    'plan.v11': 'Name on the VIP members wall',
    'planos.cta.eyebrow': 'Ready to start?',
    'planos.cta.title': 'The tribe<br>is waiting for you.',
    'planos.cta.btn': 'Register Now',

    // Eventos
    'eventos.label': 'Events',
    'eventos.title': 'History<br>& upcoming.',
    'eventos.sub': 'Past on the left, upcoming on the right. Every run leaves a mark — and the next one is already set.',
    'eventos.past.title': 'Past events',
    'eventos.upcoming.title': 'Upcoming events',
    'eventos.past.1.date': 'August 2025 · Luanda',
    'eventos.past.1.name': 'Night Run — Neon Edition',
    'eventos.past.1.meta': 'LED Run · DJ at the finish · Best outfit',
    'eventos.past.1.recap': 'A night full of energy. Dozens of Attituders in neon, lit course and tribe vibes from start to finish. Summary: community at 100%.',
    'eventos.past.2.date': 'July 2025 · Luanda',
    'eventos.past.2.name': 'Sunset Run + Networking',
    'eventos.past.2.meta': 'Social pace · Views · Music',
    'eventos.past.2.recap': 'The most beautiful sunset of the week. Easy run, strong conversations and new friendships in the club. Ideal for beginners.',
    'eventos.past.3.date': 'June 2025 · Luanda',
    'eventos.past.3.name': 'Run + Brunch',
    'eventos.past.3.meta': '5 km · Recovery · Coffee',
    'eventos.past.3.recap': 'Training + shared table. Smoothies, coffee and networking after the 5 km. A format the tribe asked to bring back.',
    'eventos.up.1.date': 'Friday · 30 October · 7pm',
    'eventos.up.1.name': 'Attituders Let\'s Go',
    'eventos.up.1.meta': 'Save the date · Tickets available · ticket.ao',
    'eventos.up.1.recap': 'The next big tribe meet-up. Energy, running and attitude. Don\'t miss it.',
    'eventos.up.1.btn': 'Buy ticket',
    'eventos.formats.label': 'Experiences',
    'eventos.formats.title': 'Event<br>formats.',
    'event.tag.semanal': 'Weekly',
    'event.tag.especial': 'Special',
    'event.tag.quinzenal': 'Biweekly',
    'event.tag.cultural': 'Cultural',
    'event.tag.trimestral': 'Quarterly',
    'event.1.name': 'Night Run',
    'event.1.desc': 'Night run · Lights · Music · Tribe energy',
    'event.2.name': 'Fancy Run',
    'event.2.desc': 'Superheroes · Wakanda · Angola Heritage · White Party · Black & Gold',
    'event.3.name': 'Run + Brunch',
    'event.3.desc': '5km · Recovery · Smoothie bar · Coffee · Networking · Good vibes',
    'event.4.name': 'Story Run',
    'event.4.desc': 'Storytelling route · Art · Motivational lines · Cinematic photos',
    'event.5.name': 'Sunset Run',
    'event.5.desc': 'The most beautiful session of the week. Social pace, views, music and tribe.',
    'event.6.name': 'Internal Race',
    'event.6.desc': 'Official ranking · Medals · Milestone badges · 100km Club',
    'eventos.cta.eyebrow': 'Don\'t miss the next one',
    'eventos.cta.title': 'Join<br>the tribe.',
    'eventos.cta.btn': 'I Want In',

    // Roadmap
    'roadmap.label': 'Roadmap',
    'roadmap.title': '90 days to<br>change everything.',
    'roadmap.sub': 'From zero to tribe. The three-month launch plan.',
    'roadmap.m1.label': 'Month One',
    'roadmap.m1.title': 'Foundation',
    'roadmap.m1.1': 'Club branding',
    'roadmap.m1.2': 'Pilot group — 30 people',
    'roadmap.m1.3': 'Founder kit',
    'roadmap.m1.4': 'First official training',
    'roadmap.m1.5': 'Teaser reels on social',
    'roadmap.m2.label': 'Month Two',
    'roadmap.m2.title': 'Growth',
    'roadmap.m2.1': 'Open paid membership',
    'roadmap.m2.2': 'First exclusive drop',
    'roadmap.m2.3': '2 social events',
    'roadmap.m2.4': 'Local café partnership',
    'roadmap.m2.5': 'First sponsors',
    'roadmap.m3.label': 'Month Three',
    'roadmap.m3.title': 'Expansion',
    'roadmap.m3.1': 'Inaugural Night Run',
    'roadmap.m3.2': 'Internal 5K race',
    'roadmap.m3.3': 'Official ranking published',
    'roadmap.m3.4': 'Referral program',
    'roadmap.m3.5': 'Launch in Lisbon',
    'roadmap.cta.eyebrow': 'Be part of it from day one',
    'roadmap.cta.title': 'The movement<br>starts now.',
    'roadmap.cta.btn': 'Join Me',

    // Contacto
    'contacto.label': 'Contact',
    'contacto.title': 'Talk<br>to us.',
    'contacto.sub': 'Questions, partnerships or just saying hi? We\'re here.',
    'contacto.talk': 'Let\'s talk',
    'contacto.email': 'Email',
    'contacto.whatsapp': 'WhatsApp',
    'contacto.instagram': 'Instagram',
    'contacto.inscricao': 'Registration',
    'contacto.regibox': 'Register on the Regibox App →',
    'contacto.form.name': 'Name',
    'contacto.form.email': 'Email',
    'contacto.form.msg': 'Message',
    'contacto.form.btn': 'Send Message',
    'contacto.form.note': 'Or message us on WhatsApp for a faster reply.',
    'contacto.ph.name': 'Your name',
    'contacto.ph.email': 'Your email',
    'contacto.ph.msg': 'Your message...'
  }
};

let currentLang = localStorage.getItem('arc-lang') || 'pt';

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('arc-lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key] !== undefined) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key] !== undefined) {
      el.placeholder = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

setLanguage(currentLang);

// Hamburger / Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('active');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  const mobileClose = document.getElementById('mobileClose');
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
}
