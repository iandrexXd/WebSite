// Selectarea elementelor din DOM
const contactBtn = document.getElementById('contact-btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const contactForm = document.getElementById('contact-form');
const numeInput = document.getElementById('nume');
const emailInput = document.getElementById('email');
const discordInput = document.getElementById('discord');
const descriereInput = document.getElementById('descriere');
const paymentBtnFooter = document.getElementById('payment-btn-footer');
const termsBtn = document.getElementById('terms-btn');
const paymentModal = document.getElementById('payment-modal');
const closePaymentModal = document.getElementById('close-payment-modal');

// Variabile pentru numărul comenzii și protecție anti-spam
let commandNumber = 0; // Vom începe de la 0 și vom incrementa la fiecare comandă
let lastSubmitTime = 0; // Timpul ultimei trimiteri a formularului

// Obținerea IP-ului utilizatorului folosind un serviciu extern
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'IP necunoscut'; // Dacă nu se poate obține IP-ul
    }
}

// Deschiderea modalului de contact
contactBtn.addEventListener('click', () => modal.style.display = 'flex');

// Închiderea modalului de contact
closeBtn.addEventListener('click', () => closeModal());

// Închiderea modalului de contact dacă se face click în afara formularului
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Funcție pentru resetarea formularului
function resetForm() {
    contactForm.reset();
}

// Funcție pentru a închide modalul și reseta formularul
function closeModal() {
    modal.style.display = 'none';
    resetForm();
}

// Validarea formularului înainte de trimitere
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Obținerea valorilor din formular
    const nume = numeInput.value.trim();
    const email = emailInput.value.trim();
    const discord = discordInput.value.trim();
    const descriere = descriereInput.value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    // Verificarea anti-spam: nu permitem trimiterea prea rapidă a formularului
    const currentTime = Date.now();
    if (currentTime - lastSubmitTime < 5000) { // 5 secunde între trimiteri
        alert('Te rugăm să aștepți câteva secunde înainte de a trimite o nouă comandă.');
        return;
    }

    // Actualizăm timpul ultimei trimiteri
    lastSubmitTime = currentTime;

    // Validarea câmpurilor
    if (!validateForm(nume, email, discord, descriere)) return;

    // Obținem IP-ul utilizatorului
    getUserIP().then(ip => {
        // Dacă toate validările sunt trecute, trimiterea formularului
        sendWebhook(nume, email, discord, descriere, ip, paymentMethod);
    });
});

// Validarea câmpurilor formularului
function validateForm(nume, email, discord, descriere) {
    if (nume.length < 6) {
        alert('Numele trebuie să aibă cel puțin 6 caractere!');
        return false;
    }
    if (!email.includes('@')) {
        alert('Te rog să introduci un email valid!');
        return false;
    }
    if (discord.length < 17) {
        alert('ID-ul Discord trebuie să aibă cel puțin 17 caractere!');
        return false;
    }
    if (descriere.split(' ').length < 10) {
        alert('Descrierea trebuie să aibă cel puțin 10 cuvinte!');
        return false;
    }
    return true;
}

// Funcție pentru a trimite webhook-ul cu Embed
function sendWebhook(nume, email, discord, descriere, ip, paymentMethod) {
    console.log(`Comanda #${++commandNumber}:`);
    console.log(`Nume: ${nume}`);
    console.log(`Email: ${email}`);
    console.log(`Discord ID: ${discord}`);
    console.log(`Descriere: ${descriere}`);
    console.log(`IP: ${ip}`);
    console.log(`Metoda de plată aleasă: ${paymentMethod}`);

    // Definim structura Embed pentru Discord
    const embed = {
        title: `Comanda #${commandNumber}`,
        description: `**Nume**: ${nume}\n**Email**: ${email}\n**Discord ID**: ${discord}\n**Descriere**: ${descriere}\n**IP**: ${ip}\n**Metoda de plată aleasă**: ${paymentMethod}`,
        color: 0xFF5733, // O culoare vibrantă
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Trimis prin Formularul de Contact',
            icon_url: 'https://example.com/icon.png', // Poți pune un icon aici
        },
        author: {
            name: 'Comanda Nouă',
            icon_url: 'https://example.com/logo.png', // Poți pune un logo aici
        },
    };

    // Trimitem webhook-ul
    fetch('https://discord.com/api/webhooks/1319355059464831008/64YvyXiHO-CLFTgzt70LR11O983FDVj2-2-2zjdGF9OOHTZwDQupE_bD8COQ4Vb8DIrH', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [embed], // Trimiterea embed-ului
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Webhook trimis cu succes!', data);
    })
    .catch(error => {
        console.error('Eroare la trimiterea webhook-ului:', error);
    });

    // Resetăm formularul după trimitere
    closeModal();
    alert('Comanda a fost trimisă cu succes!');
}

// Deschiderea modalului pentru metode de plată
paymentBtnFooter.addEventListener('click', () => paymentModal.style.display = 'flex');

// Închiderea modalului pentru metodele de plată
closePaymentModal.addEventListener('click', () => paymentModal.style.display = 'none');

// Deschiderea fișierului pentru termeni și condiții
termsBtn.addEventListener('click', () => window.location.href = 'T&C/tac.html');
