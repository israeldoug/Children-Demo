document.addEventListener('DOMContentLoaded', function() {

     const logo = document.querySelector('.logo');

    // Store the original and the wrapped versions of the logo text.
    const originalLogoText = "Children's Hope";
    const wrappedLogoText = "Children's<br>Hope";

    // --- Function to adjust the logo ---
    function adjustLogo() {
        // Check the width of the browser window.
        // 480px is used to match the breakpoint in the CSS file.
        if (window.innerWidth <= 480) {
            // If the screen is narrow, use the text with the line break.
            logo.innerHTML = wrappedLogoText;
        } else {
            // If the screen is wide, use the original single-line text.
            logo.innerHTML = originalLogoText;
        }
    }

    // --- Event Listeners ---
    // Run the function once when the page first loads.
    adjustLogo();

    // Add an event listener to run the function again every time the window is resized.
    // This makes the layout responsive if the user changes their window size or rotates their phone.
    window.addEventListener('resize', adjustLogo);

    // Retrieve donation data from localStorage
   
    // Enhanced animation for thank you message
    const thankYouTitle = document.querySelector('.animate-text');
    if (thankYouTitle) {
        // Find the sparkle-text element
        const sparkleText = thankYouTitle.querySelector('.sparkle-text');
        const sparkleHTML = sparkleText.outerHTML; // Keep the original sparkle span with its content

        // Get the text content of the h1, excluding the sparkle text
        const textContent = thankYouTitle.textContent.replace(sparkleText.textContent, 'SPLIT');
        const [part1, part2] = textContent.split('SPLIT');

        // Animate the first part of the text
        const animatedPart1 = part1.split('').map(letter => `<span class="letter">${letter}</span>`).join('');

        // Reconstruct the HTML
        thankYouTitle.innerHTML = animatedPart1 + sparkleHTML;

        // Apply animation delays to the letters
        const letters = thankYouTitle.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * 0.05}s`; // Using a slightly faster delay
        });
    }

    // Add floating animation to heart
    const heart = document.querySelector('.heart-animation');
    if (heart) {
        heart.style.animation = 'heartBeat 1.5s infinite, float 3s ease-in-out infinite';
    }

    // Enhanced confirmation details animation
    const listItems = document.querySelectorAll('.confirmation-details li');
    listItems.forEach((item, index) => {
        // Add initial state
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        // Trigger animation with delay based on index
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + (index * 200));

        // Enhanced hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.color = '#28a745';
            this.querySelector('::before').style.transform = 'scale(1.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = '#2c3e50';
            this.querySelector('::before').style.transform = 'scale(1)';
        });
    });

    // Add success message with donation amount
    const donationData = JSON.parse(localStorage.getItem('pendingDonation'));
    if (donationData) {
        const amount = new Intl.NumberFormat('en-NG', { 
            style: 'currency', 
            currency: 'NGN' 
        }).format(donationData.amount);

        const messageBox = document.querySelector('.message-box');
        if (messageBox) {
            const amountDisplay = document.createElement('div');
            amountDisplay.className = 'donation-amount';
            amountDisplay.innerHTML = `
                <span class="amount-label">Your Donation:</span>
                <span class="amount-value sparkle-text">${amount}</span>
            `;
            messageBox.appendChild(amountDisplay);

            // Animate the amount number counting up
            const amountValue = amountDisplay.querySelector('.amount-value');
            const finalAmount = parseFloat(donationData.amount);
            let currentAmount = 0;
            const duration = 1500; // 1.5 seconds
            const stepTime = 20; // Update every 20ms
            const steps = duration / stepTime;
            const increment = finalAmount / steps;

            const counter = setInterval(() => {
                currentAmount += increment;
                if (currentAmount >= finalAmount) {
                    currentAmount = finalAmount;
                    clearInterval(counter);
                }
                amountValue.textContent = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                }).format(currentAmount);
            }, stepTime);
        }
    }

    // Enhanced button interactions
    const buttons = document.querySelectorAll('.primary-button, .secondary-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.2)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add background particles animation
    const container = document.createElement('div');
    container.className = 'background-particles';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${5 + Math.random() * 10}s`;
        container.appendChild(particle);
    }

    
});