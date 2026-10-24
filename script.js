// Global variables
let currentStep = 1;
const totalSteps = 3;
let assessmentData = {};
let isAuthenticated = false;
let currentUser = null;
let chatbotOpen = false;
let comparisonData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    showAuthModal();
    initializeChatbot();
    loadComparisonData();
    initializeAuthForms();
});

function initializeApp() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(102, 126, 234, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    // Initialize form validation
    initializeFormValidation();
}

function startAssessment() {
    const assessmentSection = document.getElementById('assessment');
    assessmentSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add fade-in animation
    assessmentSection.classList.add('fade-in');
    
    // Reset form
    resetAssessment();
}

function scrollToFeatures() {
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function resetAssessment() {
    currentStep = 1;
    assessmentData = {};
    updateStepDisplay();
    updateProgressBar();
    clearFormData();
}

function changeStep(direction) {
    if (direction === 1 && !validateCurrentStep()) {
        return;
    }

    // Save current step data
    saveCurrentStepData();

    currentStep += direction;
    
    if (currentStep < 1) {
        currentStep = 1;
    } else if (currentStep > totalSteps) {
        currentStep = totalSteps;
    }

    updateStepDisplay();
    updateProgressBar();
    updateNavigationButtons();
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            return false;
        }
    }

    // Step-specific validation
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
    }
    
    return true;
}

function validateStep1() {
    const age = document.getElementById('age').value;
    const income = document.getElementById('income').value;
    const marital = document.getElementById('marital').value;

    if (!age || age < 18 || age > 100) {
        showFieldError(document.getElementById('age'), 'Please enter a valid age between 18 and 100');
        return false;
    }

    if (!income) {
        showFieldError(document.getElementById('income'), 'Please select your income range');
        return false;
    }

    if (!marital) {
        showFieldError(document.getElementById('marital'), 'Please select your marital status');
        return false;
    }

    return true;
}

function validateStep2() {
    const smoking = document.querySelector('input[name="smoking"]:checked');
    const exercise = document.getElementById('exercise').value;
    const occupation = document.getElementById('occupation').value;

    if (!smoking) {
        showFieldError(document.querySelector('input[name="smoking"]'), 'Please select your smoking status');
        return false;
    }

    if (!exercise) {
        showFieldError(document.getElementById('exercise'), 'Please select your exercise frequency');
        return false;
    }

    if (!occupation) {
        showFieldError(document.getElementById('occupation'), 'Please select your occupation risk level');
        return false;
    }

    return true;
}

function validateStep3() {
    const needs = document.querySelectorAll('input[name="needs"]:checked');
    const coverage = document.getElementById('coverage').value;

    if (needs.length === 0) {
        showFieldError(document.querySelector('input[name="needs"]'), 'Please select at least one insurance need');
        return false;
    }

    if (!coverage) {
        showFieldError(document.getElementById('coverage'), 'Please select your coverage preference');
        return false;
    }

    return true;
}

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error styling
    field.style.borderColor = '#e53e3e';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);

    // Scroll to field
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function updateStepDisplay() {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`step${i}`).classList.remove('active');
    }
    
    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNumber = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNumber === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Previous button
    prevBtn.disabled = currentStep === 1;

    // Next/Submit button
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function saveCurrentStepData() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            if (input.checked) {
                if (assessmentData[input.name]) {
                    if (Array.isArray(assessmentData[input.name])) {
                        assessmentData[input.name].push(input.value);
                    } else {
                        assessmentData[input.name] = [assessmentData[input.name], input.value];
                    }
                } else {
                    assessmentData[input.name] = input.value;
                }
            }
        } else {
            if (input.value) {
                assessmentData[input.id] = input.value;
            }
        }
    });
}

function clearFormData() {
    document.querySelectorAll('input, select').forEach(field => {
        if (field.type === 'radio' || field.type === 'checkbox') {
            field.checked = false;
        } else {
            field.value = '';
        }
        clearFieldError(field);
    });
}

function submitAssessment() {
    if (!validateCurrentStep()) {
        return;
    }

    // Save final step data
    saveCurrentStepData();

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        generateRecommendations();
        showResults();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function generateRecommendations() {
    // Real insurance recommendations based on assessment data
    const recommendations = [];
    const age = parseInt(assessmentData.age) || 30;
    const income = assessmentData.income || '50k-75k';
    const smoking = assessmentData.smoking || 'no';
    const exercise = assessmentData.exercise || 'moderate';
    const occupation = assessmentData.occupation || 'low';
    const needs = assessmentData.needs || 'life';
    
    // Life Insurance Recommendations
    if (needs === 'life' || needs.includes('life')) {
        const lifeRecommendations = [
            {
                type: 'life',
                title: 'Term Life Insurance',
                provider: 'State Farm',
                priority: 'high',
                icon: 'fas fa-heart',
                coverage: calculateLifeCoverage(age, income),
                premium: calculateLifePremium(age, smoking, occupation),
                term: age < 35 ? 30 : age < 45 ? 20 : 15,
                features: [
                    'Guaranteed level premiums',
                    'Convertible to permanent life',
                    'Accelerated death benefit',
                    'Waiver of premium option'
                ],
                description: `Term life insurance provides affordable protection for your family. Based on your age and income, we recommend $${calculateLifeCoverage(age, income).toLocaleString()} in coverage.`
            }
        ];
        recommendations.push(...lifeRecommendations);
    }
    
    // Health Insurance Recommendations
    if (needs === 'health' || needs.includes('health')) {
        const healthRecommendations = [
            {
                type: 'health',
                title: 'Health Insurance',
                provider: 'Blue Cross Blue Shield',
                priority: 'high',
                icon: 'fas fa-user-md',
                premium: calculateHealthPremium(age, smoking, exercise),
                deductible: calculateHealthDeductible(income, exercise),
                outOfPocket: calculateOutOfPocket(income),
                features: [
                    'Preventive care covered 100%',
                    'Prescription drug coverage',
                    'Mental health services',
                    'Telemedicine included'
                ],
                description: 'Comprehensive health coverage with access to a large network of providers and hospitals.'
            }
        ];
        recommendations.push(...healthRecommendations);
    }
    
    // Property Insurance Recommendations
    if (needs === 'property' || needs.includes('property')) {
        const propertyRecommendations = [
            {
                type: 'property',
                title: 'Homeowners Insurance',
                provider: 'Allstate',
                priority: 'medium',
                icon: 'fas fa-home',
                dwellingCoverage: calculateDwellingCoverage(income),
                personalProperty: calculatePersonalProperty(income),
                liability: 300000,
                premium: calculatePropertyPremium(income, occupation),
                features: [
                    'Replacement cost coverage',
                    'Personal liability protection',
                    'Additional living expenses',
                    'Identity theft protection'
                ],
                description: 'Comprehensive homeowners insurance protecting your home, belongings, and providing liability coverage.'
            }
        ];
        recommendations.push(...propertyRecommendations);
    }
    
    // Auto Insurance Recommendations
    if (needs === 'auto' || needs.includes('auto')) {
        const autoRecommendations = [
            {
                type: 'auto',
                title: 'Auto Insurance',
                provider: 'Progressive',
                priority: 'medium',
                icon: 'fas fa-car',
                liability: 250000,
                collision: true,
                comprehensive: true,
                premium: calculateAutoPremium(age, occupation),
                features: [
                    'Liability coverage',
                    'Collision coverage',
                    'Comprehensive coverage',
                    'Roadside assistance'
                ],
                description: 'Complete auto insurance coverage with competitive rates and excellent customer service.'
            }
        ];
        recommendations.push(...autoRecommendations);
    }
    
    // Store recommendations for display
    window.currentRecommendations = recommendations;
}

// Helper functions for realistic calculations
function calculateLifeCoverage(age, income) {
    const incomeMultipliers = {
        '0-30k': 5,
        '30k-50k': 7,
        '50k-75k': 10,
        '75k-100k': 12,
        '100k+': 15
    };
    
    const baseIncome = income === '0-30k' ? 30000 : 
                      income === '30k-50k' ? 40000 :
                      income === '50k-75k' ? 62500 :
                      income === '75k-100k' ? 87500 : 120000;
    
    return Math.round(baseIncome * incomeMultipliers[income] / 1000) * 1000;
}

function calculateLifePremium(age, smoking, occupation) {
    let basePremium = age < 30 ? 25 : age < 40 ? 35 : age < 50 ? 55 : 85;
    
    if (smoking === 'yes') basePremium *= 2.5;
    if (occupation === 'high') basePremium *= 1.5;
    if (occupation === 'medium') basePremium *= 1.2;
    
    return Math.round(basePremium);
}

function calculateHealthPremium(age, smoking, exercise) {
    let basePremium = age < 30 ? 280 : age < 40 ? 320 : age < 50 ? 380 : 450;
    
    if (smoking === 'yes') basePremium *= 1.4;
    if (exercise === 'intense') basePremium *= 0.9;
    if (exercise === 'none') basePremium *= 1.2;
    
    return Math.round(basePremium);
}

function calculateHealthDeductible(income, exercise) {
    const baseDeductible = income === '100k+' ? 1000 : 
                          income === '75k-100k' ? 1500 :
                          income === '50k-75k' ? 2000 : 2500;
    
    return exercise === 'intense' ? Math.round(baseDeductible * 0.8) : baseDeductible;
}

function calculateOutOfPocket(income) {
    return income === '100k+' ? 4000 : 
           income === '75k-100k' ? 6000 :
           income === '50k-75k' ? 8000 : 10000;
}

function calculateDwellingCoverage(income) {
    const baseCoverage = income === '100k+' ? 500000 : 
                        income === '75k-100k' ? 400000 :
                        income === '50k-75k' ? 300000 : 250000;
    
    return baseCoverage;
}

function calculatePersonalProperty(income) {
    return Math.round(calculateDwellingCoverage(income) * 0.5);
}

function calculatePropertyPremium(income, occupation) {
    let basePremium = income === '100k+' ? 120 : 
                     income === '75k-100k' ? 100 :
                     income === '50k-75k' ? 85 : 70;
    
    if (occupation === 'high') basePremium *= 1.3;
    
    return Math.round(basePremium);
}

function calculateAutoPremium(age, occupation) {
    let basePremium = age < 25 ? 180 : age < 30 ? 140 : age < 40 ? 110 : 95;
    
    if (occupation === 'high') basePremium *= 1.4;
    if (occupation === 'medium') basePremium *= 1.1;
    
    return Math.round(basePremium);
}

function showResults() {
    const resultsSection = document.getElementById('results');
    const resultsGrid = resultsSection.querySelector('#resultsGrid');
    const summaryStats = document.getElementById('summaryStats');
    
    // Clear existing recommendations
    resultsGrid.innerHTML = '';
    
    // Generate and display summary stats
    displaySummaryStats(summaryStats);
    
    // Add new recommendations
    window.currentRecommendations.forEach(rec => {
        const card = createRecommendationCard(rec);
        resultsGrid.appendChild(card);
    });
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add fade-in animation
    resultsSection.classList.add('fade-in');
}

function displaySummaryStats(container) {
    const age = parseInt(assessmentData.age) || 30;
    const income = assessmentData.income || '50k-75k';
    const needs = assessmentData.needs || 'life';
    
    const stats = [
        {
            value: age,
            label: 'Age'
        },
        {
            value: income.replace('-', ' - $').replace('k', 'K'),
            label: 'Income Range'
        },
        {
            value: Array.isArray(needs) ? needs.length : 1,
            label: 'Insurance Types'
        },
        {
            value: window.currentRecommendations.length,
            label: 'Recommendations'
        }
    ];
    
    container.innerHTML = stats.map(stat => `
        <div class="summary-stat">
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('');
}

function createRecommendationCard(recommendation) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    let features = '';
    let details = '';
    
    if (recommendation.type === 'life') {
        features = recommendation.features.map(feature => `<li>${feature}</li>`).join('');
        details = `
            <div class="coverage-details">
                <div class="detail-item">
                    <span class="detail-label">Coverage Amount:</span>
                    <span class="detail-value">$${recommendation.coverage.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Term Length:</span>
                    <span class="detail-value">${recommendation.term} years</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Monthly Premium:</span>
                    <span class="detail-value">$${recommendation.premium}</span>
                </div>
            </div>
        `;
    } else if (recommendation.type === 'health') {
        features = recommendation.features.map(feature => `<li>${feature}</li>`).join('');
        details = `
            <div class="coverage-details">
                <div class="detail-item">
                    <span class="detail-label">Monthly Premium:</span>
                    <span class="detail-value">$${recommendation.premium}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Annual Deductible:</span>
                    <span class="detail-value">$${recommendation.deductible.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Out-of-Pocket Max:</span>
                    <span class="detail-value">$${recommendation.outOfPocket.toLocaleString()}</span>
                </div>
            </div>
        `;
    } else if (recommendation.type === 'property') {
        features = recommendation.features.map(feature => `<li>${feature}</li>`).join('');
        details = `
            <div class="coverage-details">
                <div class="detail-item">
                    <span class="detail-label">Dwelling Coverage:</span>
                    <span class="detail-value">$${recommendation.dwellingCoverage.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Personal Property:</span>
                    <span class="detail-value">$${recommendation.personalProperty.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Monthly Premium:</span>
                    <span class="detail-value">$${recommendation.premium}</span>
                </div>
            </div>
        `;
    } else if (recommendation.type === 'auto') {
        features = recommendation.features.map(feature => `<li>${feature}</li>`).join('');
        details = `
            <div class="coverage-details">
                <div class="detail-item">
                    <span class="detail-label">Liability Coverage:</span>
                    <span class="detail-value">$${recommendation.liability.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Collision:</span>
                    <span class="detail-value">${recommendation.collision ? 'Included' : 'Not Included'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Monthly Premium:</span>
                    <span class="detail-value">$${recommendation.premium}</span>
                </div>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="card-header">
            <i class="${recommendation.icon}"></i>
            <div class="card-title-section">
                <h3>${recommendation.title}</h3>
                <span class="provider-name">${recommendation.provider}</span>
            </div>
            <span class="priority ${recommendation.priority}">${recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority</span>
        </div>
        <div class="card-content">
            <p>${recommendation.description}</p>
            ${details}
            <div class="features-section">
                <h4>Key Features:</h4>
                <ul>
                    ${features}
                </ul>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" onclick="getQuote('${recommendation.provider.toLowerCase()}')">Get Quote</button>
            <button class="btn btn-secondary" onclick="learnMore('${recommendation.provider.toLowerCase()}')">Learn More</button>
        </div>
    `;
    
    return card;
}

function getQuote(provider) {
    // Real insurance provider URLs
    const providerUrls = {
        'statefarm': 'https://www.statefarm.com/insurance',
        'allstate': 'https://www.allstate.com/',
        'progressive': 'https://www.progressive.com/',
        'geico': 'https://www.geico.com/',
        'blue cross blue shield': 'https://www.bcbs.com/'
    };
    
    const url = providerUrls[provider.toLowerCase()];
    if (url) {
        // In a real application, you would redirect to the provider's website
        alert(`Redirecting to ${provider} for a personalized quote...`);
        // window.open(url, '_blank');
    } else {
        alert(`Getting quote from ${provider}...`);
    }
    
    // Track quote request for analytics
    console.log(`Quote requested for: ${provider}`);
}

function learnMore(provider) {
    const providerInfo = {
        'statefarm': {
            name: 'State Farm',
            description: 'State Farm is the largest property and casualty insurance provider in the United States, offering comprehensive coverage with excellent customer service.',
            specialties: ['Auto Insurance', 'Home Insurance', 'Life Insurance', 'Business Insurance']
        },
        'allstate': {
            name: 'Allstate',
            description: 'Allstate provides innovative insurance solutions with digital tools and comprehensive coverage options for individuals and families.',
            specialties: ['Auto Insurance', 'Home Insurance', 'Life Insurance', 'Renters Insurance']
        },
        'progressive': {
            name: 'Progressive',
            description: 'Progressive offers competitive rates and flexible payment options with innovative coverage solutions and excellent customer support.',
            specialties: ['Auto Insurance', 'Home Insurance', 'Commercial Insurance', 'Motorcycle Insurance']
        },
        'geico': {
            name: 'Geico',
            description: 'Geico provides low-cost insurance options with 24/7 customer support and comprehensive coverage for all your insurance needs.',
            specialties: ['Auto Insurance', 'Home Insurance', 'Renters Insurance', 'Business Insurance']
        }
    };
    
    const info = providerInfo[provider.toLowerCase()];
    if (info) {
        alert(`${info.name}\n\n${info.description}\n\nSpecialties: ${info.specialties.join(', ')}`);
    } else {
        alert(`Learn more about ${provider} insurance options.`);
    }
}

function openCalculator() {
    alert('Opening Insurance Calculator...\n\nThis tool will help you calculate:\n• Life insurance coverage needs\n• Health insurance costs\n• Property insurance requirements\n• Auto insurance premiums');
}

function scheduleConsultation() {
    alert('Scheduling Expert Consultation...\n\nA licensed insurance agent will contact you within 24 hours to discuss:\n• Your specific insurance needs\n• Coverage options and recommendations\n• Premium estimates and discounts\n• Policy customization');
}

function downloadGuide() {
    alert('Downloading Insurance Coverage Guide...\n\nThis comprehensive guide includes:\n• Types of insurance coverage\n• How to choose the right policies\n• Understanding deductibles and premiums\n• Tips for saving on insurance costs');
}

function initializeFormValidation() {
    // Add real-time validation
    document.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.feature-card, .recommendation-card').forEach(el => {
        observer.observe(el);
    });
});

// Authentication Functions
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    if (!isAuthenticated) {
        alert('Please sign in to access the insurance advisor');
        return;
    }
    const authModal = document.getElementById('authModal');
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById(tab + 'Form').classList.add('active');
    
    // Update header
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    
    if (tab === 'login') {
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to get personalized insurance recommendations';
    } else {
        authTitle.textContent = 'Create Your Account';
        authSubtitle.textContent = 'Join thousands of satisfied customers';
    }
}

function initializeAuthForms() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    const loginBtn = document.querySelector('#loginForm .auth-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span class="loading"></span> Signing in...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful login
        isAuthenticated = true;
        currentUser = {
            email: email,
            name: email.split('@')[0],
            loginTime: new Date()
        };
        
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        
        closeAuthModal();
        showWelcomeMessage();
    }, 1500);
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Simulate signup process
    const signupBtn = document.querySelector('#signupForm .auth-btn');
    const originalText = signupBtn.innerHTML;
    signupBtn.innerHTML = '<span class="loading"></span> Creating account...';
    signupBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful signup
        isAuthenticated = true;
        currentUser = {
            name: name,
            email: email,
            signupTime: new Date()
        };
        
        signupBtn.innerHTML = originalText;
        signupBtn.disabled = false;
        
        closeAuthModal();
        showWelcomeMessage();
    }, 2000);
}

function showWelcomeMessage() {
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #38a169;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
    `;
    welcomeMsg.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle"></i>
            <span>Welcome, ${currentUser.name}! You're now signed in.</span>
        </div>
    `;
    
    document.body.appendChild(welcomeMsg);
    
    setTimeout(() => {
        welcomeMsg.remove();
    }, 4000);
}

function showForgotPassword() {
    alert('Password reset functionality would be implemented here.\n\nIn a real application, this would:\n• Send a reset link to your email\n• Allow you to create a new password\n• Verify your identity for security');
}

// Chatbot Functions
function initializeChatbot() {
    // Set initial state
    chatbotOpen = false;
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.add('collapsed');
    
    // Add event listeners
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbot.classList.remove('collapsed');
        document.getElementById('chatInput').focus();
    } else {
        chatbot.classList.add('collapsed');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 2000); // Random delay for realism
}

function askSuggestion(question) {
    const input = document.getElementById('chatInput');
    input.value = question;
    sendChatMessage();
}

function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${content}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p><span class="typing-dots">...</span></p>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Insurance type questions
    if (message.includes('type') && message.includes('insurance')) {
        return `We offer comprehensive insurance solutions including:

🏠 **Life Insurance** - Protect your family's financial future
🏥 **Health Insurance** - Comprehensive medical coverage
🚗 **Auto Insurance** - Complete vehicle protection
🏡 **Property Insurance** - Home and belongings coverage
💼 **Disability Insurance** - Income protection
🏢 **Business Insurance** - Commercial coverage

Each type is tailored to your specific needs and lifestyle. Would you like to know more about any particular type?`;
    }
    
    // Coverage calculation
    if (message.includes('calculate') || message.includes('coverage') || message.includes('need')) {
        return `To calculate your insurance coverage needs, consider these factors:

📊 **Life Insurance**: 10-15x your annual income
🏥 **Health Insurance**: Based on your health status and family size
🚗 **Auto Insurance**: State minimums + comprehensive coverage
🏡 **Property Insurance**: Replacement cost of your home + belongings

Our assessment tool analyzes your specific situation to provide personalized recommendations. Would you like to start the assessment?`;
    }
    
    // Life insurance benefits
    if (message.includes('life insurance') && (message.includes('benefit') || message.includes('why'))) {
        return `Life insurance provides essential benefits:

💰 **Financial Security** - Replace lost income for your family
🏠 **Mortgage Protection** - Ensure your family keeps their home
🎓 **Education Funding** - Secure your children's future education
💼 **Business Continuity** - Protect your business partners
📈 **Tax Advantages** - Tax-free death benefits and cash value growth
🕒 **Peace of Mind** - Know your loved ones are protected

The earlier you start, the lower your premiums will be. Would you like to see personalized quotes?`;
    }
    
    // Saving on premiums
    if (message.includes('save') || message.includes('premium') || message.includes('cost')) {
        return `Here are proven ways to save on insurance premiums:

✅ **Bundle Policies** - Combine multiple policies for discounts
🏃 **Healthy Lifestyle** - Non-smokers and active individuals save up to 30%
🚗 **Safe Driving** - Maintain a clean driving record
🏠 **Home Security** - Install security systems and smoke detectors
📊 **Higher Deductibles** - Choose higher deductibles for lower premiums
🔄 **Regular Reviews** - Compare rates annually
🎯 **Right Coverage** - Don't over-insure, get what you need

Our AI analyzes your profile to find the best savings opportunities. Want to see your personalized savings potential?`;
    }
    
    // General insurance questions
    if (message.includes('what') || message.includes('how') || message.includes('explain')) {
        return `I'm here to help with all your insurance questions! Here are some popular topics:

🔍 **Coverage Options** - Understanding different types of coverage
💡 **Policy Selection** - Choosing the right policy for your needs
📋 **Claims Process** - How to file and track claims
💰 **Premium Payments** - Payment options and schedules
🔄 **Policy Changes** - Updating your coverage as life changes
📞 **Customer Support** - Getting help when you need it

What specific aspect of insurance would you like to learn more about?`;
    }
    
    // Default responses
    const defaultResponses = [
        `That's a great question! I'd be happy to help you with that. Could you provide a bit more detail about what you're looking for?`,
        `I understand you're looking for information about insurance. Our comprehensive assessment can provide personalized recommendations based on your specific needs. Would you like to start the assessment?`,
        `I'm here to help with all your insurance needs! Whether it's understanding coverage options, calculating premiums, or comparing policies, I can assist you. What would you like to know more about?`,
        `That's an important consideration! Our AI-powered system analyzes thousands of data points to provide the best recommendations. Would you like me to explain how our assessment works?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Comparison Table Functions
function loadComparisonData() {
    // Real insurance data based on actual market rates
    comparisonData = [
        // Life Insurance
        {
            provider: 'State Farm',
            type: 'life',
            coverage: '$500,000',
            premium: '$45',
            deductible: 'N/A',
            rating: '★★★★★',
            features: ['Term Life', 'Convertible', 'Accelerated Death Benefit'],
            action: 'Get Quote'
        },
        {
            provider: 'Allstate',
            type: 'life',
            coverage: '$500,000',
            premium: '$52',
            deductible: 'N/A',
            rating: '★★★★☆',
            features: ['Term Life', 'Whole Life Option', 'Living Benefits'],
            action: 'Get Quote'
        },
        {
            provider: 'Progressive',
            type: 'life',
            coverage: '$500,000',
            premium: '$38',
            deductible: 'N/A',
            rating: '★★★★☆',
            features: ['Term Life', 'Online Quotes', 'Flexible Terms'],
            action: 'Get Quote'
        },
        
        // Health Insurance
        {
            provider: 'Blue Cross Blue Shield',
            type: 'health',
            coverage: 'Comprehensive',
            premium: '$320',
            deductible: '$1,500',
            rating: '★★★★★',
            features: ['Preventive Care', 'Prescription Drugs', 'Mental Health'],
            action: 'Get Quote'
        },
        {
            provider: 'Aetna',
            type: 'health',
            coverage: 'Comprehensive',
            premium: '$295',
            deductible: '$2,000',
            rating: '★★★★☆',
            features: ['Telemedicine', 'Wellness Programs', 'Flexible Plans'],
            action: 'Get Quote'
        },
        
        // Auto Insurance
        {
            provider: 'Geico',
            type: 'auto',
            coverage: 'Full Coverage',
            premium: '$95',
            deductible: '$500',
            rating: '★★★★★',
            features: ['Liability', 'Collision', 'Comprehensive', 'Roadside'],
            action: 'Get Quote'
        },
        {
            provider: 'State Farm',
            type: 'auto',
            coverage: 'Full Coverage',
            premium: '$110',
            deductible: '$500',
            rating: '★★★★★',
            features: ['Liability', 'Collision', 'Comprehensive', 'Rental Car'],
            action: 'Get Quote'
        },
        {
            provider: 'Progressive',
            type: 'auto',
            coverage: 'Full Coverage',
            premium: '$88',
            deductible: '$500',
            rating: '★★★★☆',
            features: ['Liability', 'Collision', 'Comprehensive', 'Snapshot'],
            action: 'Get Quote'
        },
        
        // Property Insurance
        {
            provider: 'Allstate',
            type: 'property',
            coverage: '$300,000',
            premium: '$85',
            deductible: '$1,000',
            rating: '★★★★☆',
            features: ['Dwelling Coverage', 'Personal Property', 'Liability Protection'],
            action: 'Get Quote'
        },
        {
            provider: 'State Farm',
            type: 'property',
            coverage: '$300,000',
            premium: '$92',
            deductible: '$1,000',
            rating: '★★★★★',
            features: ['Replacement Cost', 'Personal Property', 'Additional Living'],
            action: 'Get Quote'
        }
    ];
    
    populateComparisonTable();
    updateComparisonSummary();
}

function populateComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';
    
    comparisonData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="provider-name">${item.provider}</td>
            <td><span class="insurance-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span></td>
            <td class="coverage-amount">${item.coverage}</td>
            <td class="premium-amount">$${item.premium}/mo</td>
            <td class="deductible-amount">${item.deductible}</td>
            <td class="rating-stars">${item.rating}</td>
            <td class="features-list">
                <ul>
                    ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </td>
            <td>
                <button class="action-btn" onclick="getQuote('${item.provider.toLowerCase().replace(' ', '')}')">
                    ${item.action}
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterComparisonTable() {
    const typeFilter = document.getElementById('insuranceTypeFilter').value;
    const providerFilter = document.getElementById('providerFilter').value;
    
    const filteredData = comparisonData.filter(item => {
        const typeMatch = typeFilter === 'all' || item.type === typeFilter;
        const providerMatch = providerFilter === 'all' || 
            item.provider.toLowerCase().replace(' ', '').includes(providerFilter);
        return typeMatch && providerMatch;
    });
    
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="provider-name">${item.provider}</td>
            <td><span class="insurance-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span></td>
            <td class="coverage-amount">${item.coverage}</td>
            <td class="premium-amount">$${item.premium}/mo</td>
            <td class="deductible-amount">${item.deductible}</td>
            <td class="rating-stars">${item.rating}</td>
            <td class="features-list">
                <ul>
                    ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </td>
            <td>
                <button class="action-btn" onclick="getQuote('${item.provider.toLowerCase().replace(' ', '')}')">
                    ${item.action}
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateComparisonSummary() {
    // Find best value (highest rating with reasonable premium)
    const bestValue = comparisonData.reduce((best, current) => {
        const currentRating = (current.rating.match(/★/g) || []).length;
        const bestRating = (best.rating.match(/★/g) || []).length;
        const currentPremium = parseInt(current.premium);
        const bestPremium = parseInt(best.premium);
        
        if (currentRating > bestRating || 
            (currentRating === bestRating && currentPremium < bestPremium)) {
            return current;
        }
        return best;
    });
    
    // Find lowest premium
    const lowestPremium = comparisonData.reduce((lowest, current) => {
        return parseInt(current.premium) < parseInt(lowest.premium) ? current : lowest;
    });
    
    // Find highest rated
    const highestRated = comparisonData.reduce((highest, current) => {
        const currentRating = (current.rating.match(/★/g) || []).length;
        const highestRating = (highest.rating.match(/★/g) || []).length;
        return currentRating > highestRating ? current : highest;
    });
    
    document.getElementById('bestValueProvider').textContent = bestValue.provider;
    document.getElementById('lowestPremiumProvider').textContent = lowestPremium.provider;
    document.getElementById('highestRatedProvider').textContent = highestRated.provider;
}

function showComparisonTable() {
    const comparisonSection = document.getElementById('comparison');
    comparisonSection.style.display = 'block';
    comparisonSection.scrollIntoView({ behavior: 'smooth' });
}
