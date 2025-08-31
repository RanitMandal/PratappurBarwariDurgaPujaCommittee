// Mobile nav
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('siteNav');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
}

// Smooth scroll for same-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                nav?.classList.remove('open');
                navToggle?.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Simple form validation + mailto fallback
const form = document.getElementById('sponsorForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        let valid = true;

        const setError = (id, ok) => {
            const field = document.getElementById(id);
            const err = field?.parentElement?.querySelector('.error');
            if (!ok) {
                err && (err.style.display = 'block');
                field && field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                valid = false;
            } else {
                err && (err.style.display = 'none');
            }
        };

        const name = (data.get('name') || '').toString().trim();
        const contact = (data.get('contact') || '').toString().trim();
        const phone = (data.get('phone') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const tier = (data.get('tier') || '').toString().trim();
        const agree = document.getElementById('agree')?.checked;

        setError('name', name.length > 1);
        setError('contact', contact.length > 1);
        setError('phone', /^[0-9+\-\s]{8,}$/.test(phone));
        setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        setError('tier', !!tier);
        if (!agree) valid = false;

        if (!valid) return;

        // If valid, open an email draft with prefilled details
        const body = encodeURIComponent(
            `Organisation: ${name}
Contact Person: ${contact}
Phone: ${phone}
Email: ${email}
Sponsorship Tier: ${tier}

Message:
${(data.get('message') || '').toString().trim()}

We agree to abide by the norms of the Protappur Baroyari Durga Puja Committee.`
        );
        const mailto = `mailto:pbdpc.info@gmail.com?subject=Sponsor%20Commitment&body=${body}`;
        window.location.href = mailto;

        // Optional: show a quick toast
        toast('Opening email to submit your sponsorship details…');
        form.reset();
    });
}

// Download simple CSV rate card
const downloadBtn = document.getElementById('downloadRateCard');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const rows = [
            ['Category', 'Amount (₹)', 'Benefits'],
            ['Title Sponsor', '148000+', 'Co-Sponsor; Partners Sponsor; Associate Sponsor; Puja Special Website Advertising & Social Media Advertising'],
            ['Main Gate', '50000+', 'Main Gate; Over Gate; Main Stage Background; Puja Special Website Advertising & Social Media Advertising'],
            ['Banners', '25000+', 'Banner (20 X 10); Banner (10 X 5); Banner (6 X 3)'],
            [],
            ['Location / Item', 'Amount (₹)'],
            ['Title Sponsor', '50000'],
            ['Co-Sponsor', '40000'],
            ['Partners Sponsor', '30000'],
            ['Associate Sponsor', '25000'],
            ['Main Gate', '20000'],
            ['Over Gate', '15000'],
            ['Main Stage Background', '12000'],
            ["Banner 20'x10'", '10000'],
            ["Banner 10'x5'", '7000'],
            ["Banner 6'x3'", '5000'],
            ["Puja Special Website Advertising & Social Media Advertising", '3000'],
            [],
           
        ];
        const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Protappur_Puja_Rate_Card.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast('Rate card downloaded.');
    });
}

// Minimal toast
function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        Object.assign(el.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '10px 14px', background: '#111', color: '#fff', border: '1px solid #333',
            borderRadius: '10px', zIndex: '9999', opacity: '0', transition: 'opacity .2s ease'
        });
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 2200);
}
