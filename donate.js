// Pre-select goal if passed in URL
const urlParams = new URLSearchParams(window.location.search);
const goal = urlParams.get('goal');
if (goal) {
    document.getElementById('goal').value = goal;
}

// Handle amount button selection
const amountBtns = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');

console.log('Found amount buttons:', amountBtns.length); // Debug log


amountBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('Amount button clicked:', this.dataset.amount); // Debug log
        amountBtns.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        if (this.dataset.amount === "0") {
            customAmountInput.style.display = "block";
            customAmountInput.value = "";
            customAmountInput.focus();
        } else {
            customAmountInput.style.display = "none";
            customAmountInput.value = this.dataset.amount;
        }
    });
});

// Handle form submission
const form = document.getElementById('donateForm');
console.log('Found form:', form !== null); // Debug log

// Replace the form submission code with this
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const amount = customAmountInput.style.display === "block" 
            ? customAmountInput.value 
            : document.querySelector('.amount-btn.selected')?.dataset.amount;

        console.log('Selected amount:', amount);

        // Validate amount
        if (!amount || isNaN(amount) || Number(amount) < 100) {
            alert("Please enter a valid donation amount (minimum ₦100).");
            return false;
        }
        
        // Show bank details and hide amount selection
        const bankDetails = document.querySelector('.bank-details');
        const amountOptions = document.querySelector('.amount-options');
        const submitBtn = document.querySelector('.bank-details .submit-btn');
        
        if (bankDetails && amountOptions) {
            // Show bank details
            bankDetails.style.display = 'block';
            
            // Hide amount selection
            amountOptions.style.display = 'none';
            if (customAmountInput) {
                customAmountInput.style.display = 'none';
            }

            // Handle transfer confirmation
            if (submitBtn) {
                submitBtn.addEventListener('click', function() {
                    const donationData = {
                        amount: amount,
                        goal: document.getElementById('goal').value,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem('pendingDonation', JSON.stringify(donationData));
                    window.location.href = 'thank_you.html';
                });
            }
        }
    });
}else {
    console.error('Donation form not found in the DOM'); // Error log
}

// Add DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded'); // Debug log
    console.log('Form exists:', !!document.getElementById('donateForm'));
    console.log('Bank details exists:', !!document.querySelector('.bank-details'));
});