document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Create a flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = 'white';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        flash.style.animation = 'flashEffect 0.5s forwards';
        document.body.appendChild(flash);

        // Shake the body
        document.body.style.animation = 'screenShake 0.2s 3';

        setTimeout(() => {
            flash.remove();
            document.body.style.animation = '';
            alert('🔥 感謝您的支持！美味即將送到您的手中！ 🔥');
        }, 500);
    });
});

// Add keyframes dynamically for the script effects
const style = document.createElement('style');
style.innerHTML = `
    @keyframes flashEffect {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    @keyframes screenShake {
        0% { transform: translate(0, 0); }
        25% { transform: translate(10px, 10px); }
        50% { transform: translate(-10px, -10px); }
        75% { transform: translate(10px, -10px); }
        100% { transform: translate(0, 0); }
    }
`;
document.head.appendChild(style);

// Simple scroll reveal
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if(cardTop < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Initial state for scroll reveal
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease-out';
});
