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
    'nav.loja': 'Loja',
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
    'stat.dias': 'Dias para o evento',
    'stat.impacto': 'Pessoas',

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

    // How to become a member
    'how.label': 'Como te tornares membro',
    'how.title': 'Quatro passos.<br>Uma tribo.',
    'how.intro': 'A adesão ao Attitude Run Club é feita exclusivamente através da App Regibox. Segue estes passos e entra na tribo.',
    'how.s1.title': 'Escolhe o teu plano',
    'how.s1.desc': 'Normal, Plus ou VIP. Compara os benefícios abaixo e decide o nível que faz sentido para ti.',
    'how.s2.title': 'Regista-te no Regibox',
    'how.s2.desc': 'Cria a tua conta na App Regibox — a plataforma oficial onde a membership é gerida.',
    'how.s3.title': 'Paga inscrição + mensalidade',
    'how.s3.desc': 'Inscrição única de 10.000 Kz + a mensalidade do plano que escolheste.',
    'how.s4.title': 'Entra na tribo',
    'how.s4.desc': 'Acesso à App, grupo exclusivo, corridas, desafios e todos os benefícios do teu plano.',
    'how.cta': 'Registar no Regibox',
    'how.teaser.title': 'Três passos<br>para entrar.',
    'how.teaser.s1': 'Escolhe o plano',
    'how.teaser.s1d': 'Normal, Plus ou VIP — vê os benefícios na página de Planos.',
    'how.teaser.s2': 'Regista no Regibox',
    'how.teaser.s2d': 'A membership é feita exclusivamente através da App Regibox.',
    'how.teaser.s3': 'Corre com a tribo',
    'how.teaser.s3d': 'App, grupo, corridas e todos os benefícios do teu nível.',
    'how.teaser.cta': 'Ver Planos &amp; Passos',

    // Eventos page
    'eventos.label': 'Eventos',
    'eventos.title': 'Histórico<br>& próximos.',
    'eventos.sub': 'O que já vivemos e o que vem a seguir. Cada corrida deixa marca — e a próxima já está marcada.',
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
    'roadmap.title.mid': 'dias para',
    'roadmap.title.end': 'mudar tudo.',
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
    'contacto.ph.msg': 'A tua mensagem...',

    // Loja
    'loja.label': 'Attitude Sportwear',
    'loja.title': 'Corre com<br>estilo.',
    'loja.sub': 'Peças oficiais de performance. Encomenda via WhatsApp — confirmamos stock, tamanho e pagamento contigo.',
    'loja.size': 'Tamanho',
    'loja.qty': 'Qtd',
    'loja.add': 'Adicionar',
    'loja.oneSize': 'Único',
    'loja.tank.desc': 'Singlet leve com gradiente e logo Attitude. Ideal para treino e prova.',
    'loja.socks.name': 'Meias Attitude',
    'loja.socks.desc': 'Meias de performance com logo Attitude. Conforto e suporte no treino.',
    'loja.shortsBlack.name': 'Shorts Run Preto',
    'loja.shortsBlack.desc': 'Shorts leves com cordão e logo Attitude. Movimento livre.',
    'loja.shortsWhite.name': 'Shorts Run Branco',
    'loja.shortsWhite.desc': 'Shorts brancos com detalhe Attitude. Look limpo para o dia a dia e treino.',
    'loja.visor.desc': 'Visor perfurado com bordado ATTITUDE. Proteção e estilo em corrida.',
    'loja.jacket.name': 'Casaco Wind Attitude',
    'loja.jacket.desc': 'Casaco leve com capuz e fecho. Proteção contra vento e chuva ligeira.',
    'loja.shorts2.name': 'Shorts 2-in-1',
    'loja.shorts2.desc': 'Shorts com compression laranja integrada. Performance e suporte.',
    'loja.cart.label': 'O teu pedido',
    'loja.cart.title': 'Resumo',
    'loja.cart.empty': 'Nenhum produto adicionado.',
    'loja.cart.total': 'Total estimado',
    'loja.cart.note': 'Preços indicativos. Confirmamos stock e valor final no WhatsApp.',
    'loja.form.label': 'Checkout',
    'loja.form.title': 'Encomendar via WhatsApp',
    'loja.form.name': 'Nome completo',
    'loja.form.phone': 'Telefone / WhatsApp',
    'loja.form.city': 'Cidade / Local de entrega',
    'loja.form.notes': 'Notas (opcional)',
    'loja.form.btn': 'Enviar pedido no WhatsApp',
    'loja.form.hint': 'Abre o WhatsApp com o teu pedido pré-preenchido. Respondemos para confirmar.',
    'loja.ph.name': 'O teu nome',
    'loja.ph.phone': '+244 9XX XXX XXX',
    'loja.ph.city': 'Ex: Luanda, Talatona',
    'loja.ph.notes': 'Cor, preferência de entrega, etc.',
    'loja.cta.eyebrow': 'Membros Attitude',
    'loja.cta.title': 'Descontos exclusivos<br>nos planos.',
    'loja.cta.sub': 'Normal 10% · Plus 20% · VIP 30% em produtos Attitude Sportwear.',
    'loja.cta.btn': 'Ver Planos',
    'loja.mobile.checkout': 'Ver pedido',
    'loja.mobile.items': 'itens',
    'loja.mobile.item': 'item',
    'loja.mobile.cart': 'Ver carrinho',
    'loja.panel.title': 'Carrinho',
    'loja.panel.checkout': 'Ir para checkout',
    'loja.panel.continue': 'Continuar a comprar',
    'checkout.title': 'Finaliza<br>o pedido.',
    'checkout.sub': 'Revisa os produtos e envia a encomenda pelo WhatsApp. Confirmamos stock, tamanho e pagamento contigo.',
    'checkout.back': '← Voltar à loja'
  },

  en: {
    // Nav
    'nav.home': 'Home',
    'nav.pilares': 'Pillars',
    'nav.planos': 'Plans',
    'nav.loja': 'Shop',
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
    'stat.dias': 'Days to the event',
    'stat.impacto': 'People',

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

    // How to become a member
    'how.label': 'How to become a member',
    'how.title': 'Four steps.<br>One tribe.',
    'how.intro': 'Membership of Attitude Run Club is exclusively through the Regibox App. Follow these steps and join the tribe.',
    'how.s1.title': 'Choose your plan',
    'how.s1.desc': 'Normal, Plus or VIP. Compare the benefits below and pick the level that fits you.',
    'how.s2.title': 'Register on Regibox',
    'how.s2.desc': 'Create your account on the Regibox App — the official platform where membership is managed.',
    'how.s3.title': 'Pay registration + monthly fee',
    'how.s3.desc': 'One-time 10,000 Kz registration + the monthly fee of the plan you chose.',
    'how.s4.title': 'Join the tribe',
    'how.s4.desc': 'App access, exclusive group, runs, challenges and every benefit of your plan.',
    'how.cta': 'Register on Regibox',
    'how.teaser.title': 'Three steps<br>to join.',
    'how.teaser.s1': 'Choose your plan',
    'how.teaser.s1d': 'Normal, Plus or VIP — see the benefits on the Plans page.',
    'how.teaser.s2': 'Register on Regibox',
    'how.teaser.s2d': 'Membership is exclusively through the Regibox App.',
    'how.teaser.s3': 'Run with the tribe',
    'how.teaser.s3d': 'App, group, runs and every benefit of your level.',
    'how.teaser.cta': 'See Plans &amp; Steps',

    // Eventos
    'eventos.label': 'Events',
    'eventos.title': 'History<br>& upcoming.',
    'eventos.sub': 'What we\'ve already lived and what\'s coming next. Every run leaves a mark — and the next one is already set.',
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
    'roadmap.title.mid': 'days to',
    'roadmap.title.end': 'change everything.',
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
    'contacto.ph.msg': 'Your message...',

    // Shop
    'loja.label': 'Attitude Sportwear',
    'loja.title': 'Run with<br>style.',
    'loja.sub': 'Official performance pieces. Order via WhatsApp — we confirm stock, size and payment with you.',
    'loja.size': 'Size',
    'loja.qty': 'Qty',
    'loja.add': 'Add',
    'loja.oneSize': 'One size',
    'loja.tank.desc': 'Lightweight singlet with gradient and Attitude logo. Built for training and race day.',
    'loja.socks.name': 'Attitude Socks',
    'loja.socks.desc': 'Performance socks with Attitude logo. Comfort and support on every run.',
    'loja.shortsBlack.name': 'Black Run Shorts',
    'loja.shortsBlack.desc': 'Light shorts with drawcord and Attitude logo. Free movement.',
    'loja.shortsWhite.name': 'White Run Shorts',
    'loja.shortsWhite.desc': 'White shorts with Attitude detail. Clean look for training and everyday.',
    'loja.visor.desc': 'Perforated visor with ATTITUDE embroidery. Protection and style on the run.',
    'loja.jacket.name': 'Attitude Wind Jacket',
    'loja.jacket.desc': 'Lightweight hooded jacket with zip. Protection from wind and light rain.',
    'loja.shorts2.name': '2-in-1 Shorts',
    'loja.shorts2.desc': 'Shorts with integrated orange compression. Performance and support.',
    'loja.cart.label': 'Your order',
    'loja.cart.title': 'Summary',
    'loja.cart.empty': 'No products added.',
    'loja.cart.total': 'Estimated total',
    'loja.cart.note': 'Indicative prices. We confirm stock and final amount on WhatsApp.',
    'loja.form.label': 'Checkout',
    'loja.form.title': 'Order via WhatsApp',
    'loja.form.name': 'Full name',
    'loja.form.phone': 'Phone / WhatsApp',
    'loja.form.city': 'City / Delivery area',
    'loja.form.notes': 'Notes (optional)',
    'loja.form.btn': 'Send order on WhatsApp',
    'loja.form.hint': 'Opens WhatsApp with your order pre-filled. We reply to confirm.',
    'loja.ph.name': 'Your name',
    'loja.ph.phone': '+244 9XX XXX XXX',
    'loja.ph.city': 'e.g. Luanda, Talatona',
    'loja.ph.notes': 'Colour, delivery preference, etc.',
    'loja.cta.eyebrow': 'Attitude members',
    'loja.cta.title': 'Exclusive discounts<br>on plans.',
    'loja.cta.sub': 'Normal 10% · Plus 20% · VIP 30% on Attitude Sportwear products.',
    'loja.cta.btn': 'View Plans',
    'loja.mobile.checkout': 'View order',
    'loja.mobile.items': 'items',
    'loja.mobile.item': 'item',
    'loja.mobile.cart': 'View cart',
    'loja.panel.title': 'Cart',
    'loja.panel.checkout': 'Go to checkout',
    'loja.panel.continue': 'Continue shopping',
    'checkout.title': 'Complete<br>your order.',
    'checkout.sub': 'Review your products and send the order via WhatsApp. We confirm stock, size and payment with you.',
    'checkout.back': '← Back to shop'
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

// Days until Attituders Let's Go (30 Oct 2026, 19:00 WAT)
(function updateDaysToEvent() {
  const eventDate = new Date('2026-10-30T19:00:00+01:00');
  const now = new Date();
  const msLeft = eventDate - now;
  const days = msLeft <= 0 ? 0 : Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  const value = String(days);
  const homeEl = document.getElementById('daysToEvent');
  const roadmapEl = document.getElementById('roadmapDays');
  if (homeEl) homeEl.textContent = value;
  if (roadmapEl) roadmapEl.textContent = value;
  document.querySelectorAll('.js-days-to-event').forEach(el => {
    el.textContent = value;
  });
})();

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

// ─── PAST EVENTS CAROUSEL ───────────────────────────────────────────────────
(function () {
  const track = document.getElementById('pastTrack');
  const prevBtn = document.getElementById('pastPrev');
  const nextBtn = document.getElementById('pastNext');
  const dotsWrap = document.getElementById('pastDots');
  if (!track) return;

  const slides = track.querySelectorAll('.past-slide');
  const total = slides.length;
  let index = 0;
  let startX = 0;
  let isDragging = false;

  function slidesPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, total - slidesPerView());
  }

  function update() {
    const spv = slidesPerView();
    const slideWidth = slides[0].offsetWidth;
    const gap = 20;
    const offset = index * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      const pages = maxIndex() + 1;
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === index ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => {
          index = i;
          update();
        });
        dotsWrap.appendChild(dot);
      }
    }

    if (prevBtn) prevBtn.style.opacity = index === 0 ? '0.35' : '1';
    if (nextBtn) nextBtn.style.opacity = index >= maxIndex() ? '0.35' : '1';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      update();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = Math.min(maxIndex(), index + 1);
      update();
    });
  }

  // Touch / swipe
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) index = Math.min(maxIndex(), index + 1);
      else index = Math.max(0, index - 1);
      update();
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());
    update();
  });

  // Init after images/layout
  window.addEventListener('load', update);
  update();
})();

// ─── LOJA CART + PANEL + CHECKOUT (localStorage) ───────────────────────────
(function () {
  const CART_KEY = 'arc-cart';
  const WA_NUMBER = '244933953989';
  const PRODUCT_IMAGES = {
    tank: '../images/product-tank.jpg',
    socks: '../images/product-socks.jpg',
    'shorts-black': '../images/product-shorts-black.jpg',
    'shorts-white': '../images/product-shorts-white.jpg',
    visor: '../images/product-visor.jpg',
    jacket: '../images/product-jacket.jpg',
    'shorts-2in1': '../images/product-shorts-2in1.jpg'
  };
  const grid = document.getElementById('productsGrid');
  const isShop = !!grid;
  const isCheckout = !!document.getElementById('checkoutCartList');
  if (!isShop && !isCheckout) return;

  const mobileBar = document.getElementById('mobileCartBar');
  const mobileCount = document.getElementById('mobileCartCount');
  const mobileTotal = document.getElementById('mobileCartTotal');
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  const panelList = document.getElementById('cartPanelList');
  const panelTotal = document.getElementById('cartPanelTotal');
  const checkoutList = document.getElementById('checkoutCartList');
  const checkoutTotal = document.getElementById('checkoutCartTotal');
  const waBtn = document.getElementById('checkoutWhatsApp');

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data)) return [];
      // Backfill image for items saved before this feature
      return data.map(item => {
        if (!item.image && item.id && PRODUCT_IMAGES[item.id]) {
          item.image = PRODUCT_IMAGES[item.id];
        }
        return item;
      });
    } catch (e) {
      return [];
    }
  }

  function itemImage(item) {
    if (item.image) return item.image;
    if (item.id && PRODUCT_IMAGES[item.id]) return PRODUCT_IMAGES[item.id];
    return '../images/logo.jpg';
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  let cart = loadCart();

  function formatKz(n) {
    return n.toLocaleString('pt-AO') + ' Kz';
  }

  function t(key, fallback) {
    return (translations[currentLang] && translations[currentLang][key]) || fallback;
  }

  function cartQty() {
    return cart.reduce((s, i) => s + i.qty, 0);
  }

  function cartSum() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function productName(card) {
    const lang = currentLang || 'pt';
    return lang === 'en'
      ? (card.dataset.nameEn || card.dataset.namePt || '')
      : (card.dataset.namePt || card.dataset.nameEn || '');
  }

  function openPanel() {
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add('visible');
    }
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (overlay) {
      overlay.classList.remove('visible');
      overlay.hidden = true;
    }
    document.body.style.overflow = '';
  }

  function updateMobileBar() {
    const qty = cartQty();
    const total = cartSum();
    if (mobileBar) {
      if (qty > 0) {
        mobileBar.classList.add('visible');
        document.body.classList.add('has-mobile-cart');
      } else {
        mobileBar.classList.remove('visible');
        document.body.classList.remove('has-mobile-cart');
      }
    }
    if (mobileCount) {
      const unit = qty === 1 ? t('loja.mobile.item', 'item') : t('loja.mobile.items', 'itens');
      mobileCount.textContent = qty + ' ' + unit;
    }
    if (mobileTotal) mobileTotal.textContent = formatKz(total);
  }

  function updateTotalsOnly() {
    if (panelTotal) panelTotal.textContent = formatKz(cartSum());
    if (checkoutTotal) checkoutTotal.textContent = formatKz(cartSum());
    updateMobileBar();
  }

  /** Update qty + line price in existing DOM — keeps <img> in place (no reload). */
  function patchLineQty(idx) {
    const item = cart[idx];
    if (!item) return;
    const lineTotal = formatKz(item.price * item.qty);
    document.querySelectorAll('.cart-line').forEach(li => {
      const stepper = li.querySelector('.cart-qty-stepper');
      if (!stepper) return;
      if (parseInt(stepper.getAttribute('data-idx'), 10) !== idx) return;
      const val = stepper.querySelector('.qty-value');
      if (val) val.textContent = String(item.qty);
      const priceEl = li.querySelector('.cart-item-price');
      if (priceEl) priceEl.textContent = lineTotal;
    });
    updateTotalsOnly();
  }

  function bindListActions(listEl) {
    if (!listEl) return;

    listEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-idx'), 10);
        cart.splice(i, 1);
        saveCart(cart);
        renderAll(); // structure changed — full re-render
      });
    });

    listEl.querySelectorAll('.cart-qty-stepper').forEach(stepper => {
      const idx = parseInt(stepper.getAttribute('data-idx'), 10);
      const minus = stepper.querySelector('.qty-minus');
      const plus = stepper.querySelector('.qty-plus');
      if (minus) {
        minus.addEventListener('click', () => {
          if (!cart[idx]) return;
          if (cart[idx].qty > 1) {
            cart[idx].qty -= 1;
            saveCart(cart);
            patchLineQty(idx); // in-place — images stay
          } else {
            cart.splice(idx, 1);
            saveCart(cart);
            renderAll();
          }
        });
      }
      if (plus) {
        plus.addEventListener('click', () => {
          if (cart[idx] && cart[idx].qty < 10) {
            cart[idx].qty += 1;
            saveCart(cart);
            patchLineQty(idx); // in-place — images stay
          }
        });
      }
    });
  }

  function renderList(listEl, totalEl, options) {
    if (!listEl) return;
    const opts = options || {};
    const emptyText = t('loja.cart.empty', 'Nenhum produto adicionado.');

    if (cart.length === 0) {
      listEl.innerHTML = '<li class="cart-empty">' + emptyText + '</li>';
      if (totalEl) totalEl.textContent = '0 Kz';
      return;
    }

    listEl.innerHTML = '';
    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-line';
      const lineTotal = formatKz(item.price * item.qty);
      const imgSrc = itemImage(item);
      const thumb =
        '<div class="cart-item-thumb">' +
          '<img src="' + imgSrc + '" alt="' + (item.name || '') + '" loading="lazy" decoding="async">' +
        '</div>';

      if (opts.editable) {
        li.innerHTML =
          thumb +
          '<div class="cart-item-info">' +
            '<span class="cart-item-name">' + item.name + '</span>' +
            '<span class="cart-item-meta">' + item.size + '</span>' +
            '<div class="qty-stepper cart-qty-stepper" data-idx="' + idx + '">' +
              '<button type="button" class="qty-btn qty-minus" aria-label="Diminuir">−</button>' +
              '<span class="qty-value">' + item.qty + '</span>' +
              '<button type="button" class="qty-btn qty-plus" aria-label="Aumentar">+</button>' +
            '</div>' +
          '</div>' +
          '<span class="cart-item-price">' + lineTotal + '</span>' +
          '<button type="button" class="cart-item-remove" data-idx="' + idx + '" aria-label="Remover">×</button>';
      } else {
        li.innerHTML =
          thumb +
          '<div class="cart-item-info">' +
            '<span class="cart-item-name">' + item.name + '</span>' +
            '<span class="cart-item-meta">' + item.size + ' · ×' + item.qty + '</span>' +
          '</div>' +
          '<span class="cart-item-price">' + lineTotal + '</span>' +
          '<button type="button" class="cart-item-remove" data-idx="' + idx + '" aria-label="Remover">×</button>';
      }
      listEl.appendChild(li);
    });

    if (totalEl) totalEl.textContent = formatKz(cartSum());
    bindListActions(listEl);
  }

  function renderAll() {
    renderList(panelList, panelTotal, { editable: true });
    renderList(checkoutList, checkoutTotal, { editable: true });
    updateMobileBar();
  }

  // Quantity steppers on product cards
  if (isShop) {
    grid.querySelectorAll('.qty-stepper').forEach(stepper => {
      const input = stepper.querySelector('.product-qty');
      const minus = stepper.querySelector('.qty-minus');
      const plus = stepper.querySelector('.qty-plus');
      if (!input) return;

      function setQty(n) {
        n = Math.max(1, Math.min(10, n));
        input.value = String(n);
      }

      if (minus) {
        minus.addEventListener('click', () => setQty(parseInt(input.value, 10) - 1));
      }
      if (plus) {
        plus.addEventListener('click', () => setQty(parseInt(input.value, 10) + 1));
      }
    });

    grid.querySelectorAll('.product-card').forEach(card => {
      const addBtn = card.querySelector('.product-add');
      if (!addBtn) return;
      addBtn.addEventListener('click', () => {
        const id = card.dataset.id;
        const price = parseInt(card.dataset.price, 10) || 0;
        const sizeEl = card.querySelector('.product-size');
        const qtyEl = card.querySelector('.product-qty');
        const size = sizeEl ? sizeEl.value : '—';
        let qty = qtyEl ? parseInt(qtyEl.value, 10) : 1;
        if (isNaN(qty) || qty < 1) qty = 1;
        if (qty > 10) qty = 10;

        const name = productName(card);
        const imgEl = card.querySelector('.product-img-wrap img');
        let image = PRODUCT_IMAGES[id] || '';
        if (imgEl && imgEl.getAttribute('src')) {
          image = imgEl.getAttribute('src');
        }
        const existing = cart.find(c => c.id === id && c.size === size);
        if (existing) {
          existing.qty = Math.min(10, existing.qty + qty);
          if (!existing.image && image) existing.image = image;
        } else {
          cart.push({ id, name, size, qty, price, image });
        }
        saveCart(cart);

        addBtn.classList.add('added');
        const prev = addBtn.innerHTML;
        addBtn.innerHTML = currentLang === 'en' ? 'Added' : 'Adicionado';
        setTimeout(() => {
          addBtn.classList.remove('added');
          addBtn.innerHTML = prev;
          if (addBtn.hasAttribute('data-i18n') && translations[currentLang]) {
            const key = addBtn.getAttribute('data-i18n');
            if (translations[currentLang][key]) addBtn.innerHTML = translations[currentLang][key];
          }
        }, 1000);

        renderAll();
        openPanel();
      });
    });
  }

  // Panel open / close
  const openBtn = document.getElementById('openCartPanel');
  if (openBtn) openBtn.addEventListener('click', openPanel);
  const closeBtn = document.getElementById('cartPanelClose');
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  const continueBtn = document.getElementById('cartPanelContinue');
  if (continueBtn) continueBtn.addEventListener('click', closePanel);
  if (overlay) overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  // WhatsApp checkout
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      cart = loadCart();
      if (cart.length === 0) {
        alert(currentLang === 'en' ? 'Add at least one product.' : 'Adiciona pelo menos um produto.');
        return;
      }
      const name = (document.getElementById('checkoutName') || {}).value || '';
      const phone = (document.getElementById('checkoutPhone') || {}).value || '';
      const city = (document.getElementById('checkoutCity') || {}).value || '';
      const notes = (document.getElementById('checkoutNotes') || {}).value || '';

      if (!name.trim() || !phone.trim()) {
        alert(currentLang === 'en'
          ? 'Please fill in your name and phone number.'
          : 'Preenche o nome e o telefone.');
        return;
      }

      let total = 0;
      const lines = cart.map(item => {
        total += item.price * item.qty;
        return '• ' + item.name + ' | ' + item.size + ' | x' + item.qty + ' | ' + formatKz(item.price * item.qty);
      });

      const header = currentLang === 'en'
        ? 'Hello! I would like to order from Attitude Sportwear:'
        : 'Olá! Gostaria de encomendar na Attitude Sportwear:';
      const totalLine = (currentLang === 'en' ? 'Estimated total: ' : 'Total estimado: ') + formatKz(total);
      const clientBlock =
        (currentLang === 'en' ? 'Name: ' : 'Nome: ') + name.trim() + '\n' +
        (currentLang === 'en' ? 'Phone: ' : 'Telefone: ') + phone.trim() + '\n' +
        (city.trim() ? ((currentLang === 'en' ? 'City: ' : 'Cidade: ') + city.trim() + '\n') : '') +
        (notes.trim() ? ((currentLang === 'en' ? 'Notes: ' : 'Notas: ') + notes.trim() + '\n') : '');

      const message = header + '\n\n' + lines.join('\n') + '\n\n' + totalLine + '\n\n' + clientBlock;
      const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener');
    });
  }

  renderAll();
})();
