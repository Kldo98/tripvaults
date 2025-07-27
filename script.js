// TripVaults - AI Travel Planning System
// Last updated: December 2024

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(8, 8, 8, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 15, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .process-step, .stat');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// AI Planner Functionality - Updated for OpenAI API
async function generatePlan() {
    const destination = document.getElementById('destination').value;
    const travelers = document.getElementById('travelers').value;
    const groupType = document.getElementById('group-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const selectedStyles = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    const budget = document.querySelector('input[name="budget"]:checked')?.value;
    
    // Validation
    if (!destination || !travelers || selectedStyles.length === 0) {
        showNotification('Please fill in destination, number of travelers, and select at least one travel style.', 'error');
        return;
    }
    
    if (!startDate || !endDate) {
        showNotification('Please select both departure and return dates.', 'error');
        return;
    }
    
    if (!budget) {
        showNotification('Please select a budget option.', 'error');
        return;
    }
    
    // Show loading state
    const resultContainer = document.getElementById('planner-result');
    
    // Check if we're in test mode (no backend available)
    const isTestMode = !window.location.hostname || window.location.protocol === 'file:';
    
    if (isTestMode) {
        resultContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-brain fa-spin"></i>
                <h3>AI is creating your perfect travel plan...</h3>
                <p>Testing mode - using simulated AI response for ${travelers} ${groupType} traveling to ${destination}.</p>
                <p style="font-size: 0.9rem; color: var(--text-gray); margin-top: 1rem;">
                    <i class="fas fa-info-circle"></i> 
                    To use real AI, install Python and start the Flask backend on port 5000.
                </p>
            </div>
        `;
        
        // Simulate API delay and response for testing
        setTimeout(() => {
            const testResponse = generateTestAPIResponse(destination, travelers, groupType, selectedStyles, budget);
            displayAIPlanFromAPI(testResponse, {
                destination,
                people: travelers,
                interests: selectedStyles,
                groupType,
                startDate,
                endDate,
                budget
            });
        }, 2000);
        return;
    }
    
    resultContainer.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-brain fa-spin"></i>
            <h3>AI is creating your perfect travel plan...</h3>
            <p>Analyzing your preferences for ${travelers} ${groupType} traveling to ${destination}.</p>
        </div>
    `;
    
    try {
        // Prepare data for API
        const requestData = {
            destination: destination,
            people: travelers,
            interests: selectedStyles,
            groupType: groupType,
            startDate: startDate,
            endDate: endDate,
            budget: budget
        };
        
        console.log('Sending API request:', requestData);
        
        // Determine API URL based on environment
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:5000/api/travel-plan'  // Flask backend (local development)
            : 'https://tripvaults.onrender.com/api/travel-plan';  // Production backend (Render)
        
        console.log('Using API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('API Response status:', response.status);
        console.log('API Response headers:', response.headers);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        // Handle different response formats
        let planText = '';
        if (data.plan) {
            planText = data.plan;
            console.log('Found plan in data.plan');
        } else if (data.result) {
            planText = data.result;
            console.log('Found plan in data.result');
        } else if (typeof data === 'string') {
            planText = data;
            console.log('Found plan as string data');
        } else if (data.text) {
            planText = data.text;
            console.log('Found plan in data.text');
        } else {
            console.log('No plan found in response, using fallback');
            // If no plan found in response, use fallback
            const plan = generateLocalPlan(requestData);
            displayAIPlan(plan);
            return;
        }
        
        // Display the AI-generated plan
        displayAIPlanFromAPI(planText, requestData);
        
    } catch (error) {
        console.error('Error calling API:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Check if it's a CORS error
        if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
            showNotification('Cannot connect to AI service. Please ensure the Flask backend is running on port 5000.', 'error');
        } else {
            showNotification('AI service temporarily unavailable. Using local recommendations.', 'info');
        }
        
        const requestData = {
            destination: destination,
            people: travelers,
            interests: selectedStyles,
            groupType: groupType,
            startDate: startDate,
            endDate: endDate,
            budget: budget
        };
        
        const plan = generateLocalPlan(requestData);
        displayAIPlan(plan);
    }
}

// Function to display plan from API response
function displayAIPlanFromAPI(planText, requestData) {
    const resultContainer = document.getElementById('planner-result');
    
    const planHTML = `
        <div class="travel-plan">
            <div class="plan-header">
                <h3><i class="fas fa-brain"></i> AI Travel Plan for ${requestData.destination}</h3>
                <p class="plan-dates">${requestData.startDate} - ${requestData.endDate}</p>
                <p class="plan-group">${requestData.people} ${requestData.groupType} • ${requestData.budget} Budget</p>
            </div>
            
            <div class="plan-content">
                <div class="ai-plan-text">
                    ${planText.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div class="plan-actions">
                <button class="btn btn-primary" onclick="generateTravelPlanPDF()">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </button>
                <button class="btn btn-secondary" onclick="sharePlan()">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
    resultContainer.innerHTML = planHTML;
    
    // Add animation
    resultContainer.style.opacity = '0';
    resultContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
    }, 100);
}

// Local plan generation as fallback
function generateLocalPlan(requestData) {
    const start = new Date(requestData.startDate);
    const end = new Date(requestData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const budgetRanges = {
        'budget': { min: 50, max: 100, label: 'Budget' },
        'mid': { min: 100, max: 300, label: 'Mid-Range' },
        'luxury': { min: 300, max: 800, label: 'Luxury' }
    };
    
    const budgetRange = budgetRanges[requestData.budget] || budgetRanges.mid;
    const dailyBudget = Math.floor((budgetRange.min + budgetRange.max) / 2);
    const totalBudget = dailyBudget * days * parseInt(requestData.people);
    
    const styleActivities = {
        'adventure': ['Hiking trails', 'Rock climbing', 'Water sports', 'Zip lining', 'Paragliding'],
        'relaxation': ['Spa treatments', 'Beach lounging', 'Yoga sessions', 'Meditation retreats', 'Hot springs'],
        'culture': ['Museum visits', 'Historical tours', 'Local workshops', 'Traditional performances', 'Art galleries'],
        'food': ['Cooking classes', 'Wine tastings', 'Food tours', 'Fine dining', 'Local markets'],
        'nightlife': ['Rooftop bars', 'Live music venues', 'Nightclubs', 'Jazz clubs', 'Cultural shows'],
        'shopping': ['Local markets', 'Boutique stores', 'Artisan shops', 'Designer outlets', 'Craft fairs']
    };
    
    const selectedActivities = requestData.interests.flatMap(style => styleActivities[style] || []);
    
    const plan = {
        travelers: requestData.people,
        groupType: requestData.groupType,
        destination: requestData.destination,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        days: days,
        budget: requestData.budget,
        budgetLabel: budgetRange.label,
        dailyBudget: dailyBudget,
        totalBudget: totalBudget,
        styles: requestData.interests,
        activities: selectedActivities.slice(0, Math.min(selectedActivities.length, 10)),
        accommodation: getAccommodationSuggestion(requestData.groupType, requestData.budget),
        transportation: getTransportationSuggestion(requestData.groupType, requestData.budget),
        restaurants: getRestaurantSuggestions(requestData.destination, requestData.budget, requestData.interests),
        hiddenGems: getHiddenGems(requestData.destination, requestData.interests),
        photoSpots: getPhotoSpots(requestData.destination, requestData.interests),
        bookingLinks: getBookingLinks(requestData.destination, requestData.budget),
        dailySchedule: generateDailySchedule(days, requestData.interests, requestData.destination)
    };
    
    return plan;
}

function getAccommodationSuggestion(groupType, budget) {
    const suggestions = {
        'couple': {
            'budget': ['Cozy boutique hotel', 'Romantic B&B', 'Private apartment'],
            'mid': ['Luxury boutique hotel', 'Spa resort', 'Design hotel'],
            'luxury': ['5-star luxury hotel', 'Private villa', 'Exclusive resort']
        },
        'family': {
            'budget': ['Family-friendly hotel', 'Vacation rental', 'Resort with kids club'],
            'mid': ['Family resort', 'Apartment with amenities', 'Hotel with pool'],
            'luxury': ['Luxury family resort', 'Private villa with staff', 'Exclusive family retreat']
        },
        'friends': {
            'budget': ['Hostel with private rooms', 'Shared apartment', 'Budget hotel'],
            'mid': ['Boutique hotel', 'Apartment rental', 'Design hotel'],
            'luxury': ['Luxury hotel suite', 'Private villa', 'Exclusive resort']
        },
        'solo': {
            'budget': ['Hostel', 'Budget hotel', 'Guesthouse'],
            'mid': ['Boutique hotel', 'Apartment', 'B&B'],
            'luxury': ['Luxury hotel', 'Private villa', 'Exclusive retreat']
        },
        'business': {
            'budget': ['Business hotel', 'Serviced apartment', 'Conference hotel'],
            'mid': ['Business center hotel', 'Executive apartment', 'Corporate resort'],
            'luxury': ['5-star business hotel', 'Executive suite', 'Corporate luxury resort']
        }
    };
    return suggestions[groupType]?.[budget] || suggestions.couple.mid;
}

function getTransportationSuggestion(groupType, budget) {
    const suggestions = {
        'couple': {
            'budget': ['Public transport', 'Walking tours', 'Occasional taxi'],
            'mid': ['Rent a car', 'Private transfers', 'Bike rentals'],
            'luxury': ['Private driver', 'Luxury car rental', 'Helicopter transfers']
        },
        'family': {
            'budget': ['Public transport', 'Family car rental', 'Walking'],
            'mid': ['Family car rental', 'Private transfers', 'Tour bus'],
            'luxury': ['Private driver', 'Luxury van', 'Private tours']
        },
        'friends': {
            'budget': ['Public transport', 'Shared car rental', 'Walking'],
            'mid': ['Car rental', 'Private transfers', 'Group tours'],
            'luxury': ['Private driver', 'Luxury car rental', 'Exclusive tours']
        },
        'solo': {
            'budget': ['Public transport', 'Walking', 'Bike rental'],
            'mid': ['Car rental', 'Occasional taxi', 'Small group tours'],
            'luxury': ['Private driver', 'Luxury car', 'Exclusive experiences']
        },
        'business': {
            'budget': ['Public transport', 'Business car rental', 'Taxi'],
            'mid': ['Business car rental', 'Private transfers', 'Corporate transport'],
            'luxury': ['Private driver', 'Luxury car', 'Corporate helicopter']
        }
    };
    return suggestions[groupType]?.[budget] || suggestions.couple.mid;
}

function getRestaurantSuggestions(destination, budget, styles) {
    const restaurants = {
        'budget': ['Local markets', 'Street food', 'Café culture', 'Food trucks'],
        'mid': ['Traditional restaurants', 'Bistros', 'Wine bars', 'Local favorites'],
        'luxury': ['Fine dining', 'Michelin starred', 'Private dining', 'Celebrity chef restaurants']
    };
    
    const styleRestaurants = {
        'food': ['Cooking classes', 'Wine tastings', 'Food tours', 'Local markets'],
        'culture': ['Traditional restaurants', 'Local eateries', 'Cultural dining experiences'],
        'nightlife': ['Rooftop restaurants', 'Live music venues', 'Late-night dining']
    };
    
    const baseRestaurants = restaurants[budget] || restaurants.mid;
    const styleSpecific = styles.flatMap(style => styleRestaurants[style] || []);
    
    return [...baseRestaurants, ...styleSpecific].slice(0, 6);
}

function getHiddenGems(destination, styles) {
    const gems = {
        'adventure': [
            'Secret hiking trails',
            'Hidden climbing spots',
            'Off-the-beaten-path adventure locations',
            'Local adventure guides'
        ],
        'relaxation': [
            'Hidden spa retreats',
            'Secret beach spots',
            'Peaceful meditation gardens',
            'Local wellness centers'
        ],
        'culture': [
            'Local artisan workshops',
            'Hidden historical sites',
            'Traditional craft markets',
            'Local cultural centers'
        ],
        'food': [
            'Secret local restaurants',
            'Hidden food markets',
            'Family-run eateries',
            'Local cooking secrets'
        ],
        'nightlife': [
            'Underground music venues',
            'Local jazz clubs',
            'Hidden rooftop bars',
            'Authentic nightlife spots'
        ],
        'shopping': [
            'Local artisan shops',
            'Hidden vintage stores',
            'Traditional craft markets',
            'Local designer boutiques'
        ]
    };
    
    const selectedGems = styles.flatMap(style => gems[style] || []);
    return selectedGems.slice(0, 4);
}

function getPhotoSpots(destination, styles) {
    const spots = {
        'adventure': [
            'Mountain viewpoints',
            'Adventure activity locations',
            'Natural landscapes',
            'Action shot locations'
        ],
        'relaxation': [
            'Peaceful garden spots',
            'Sunset viewpoints',
            'Serene landscapes',
            'Wellness retreat views'
        ],
        'culture': [
            'Historical monuments',
            'Traditional architecture',
            'Cultural event locations',
            'Local life scenes'
        ],
        'food': [
            'Food market scenes',
            'Restaurant interiors',
            'Cooking class moments',
            'Local dining experiences'
        ],
        'nightlife': [
            'City nightscapes',
            'Venue interiors',
            'Street night scenes',
            'Cultural performances'
        ],
        'shopping': [
            'Market scenes',
            'Boutique interiors',
            'Street shopping scenes',
            'Local craft displays'
        ]
    };
    
    const selectedSpots = styles.flatMap(style => spots[style] || []);
    return selectedSpots.slice(0, 4);
}

function generateDailySchedule(days, styles, destination) {
    const schedule = [];
    for (let day = 1; day <= days; day++) {
        const daySchedule = {
            day: day,
            morning: getMorningActivity(styles),
            afternoon: getAfternoonActivity(styles),
            evening: getEveningActivity(styles),
            night: getNightActivity(styles)
        };
        schedule.push(daySchedule);
    }
    return schedule;
}

function getMorningActivity(styles) {
    const activities = {
        'adventure': 'Early morning hike or outdoor activity',
        'relaxation': 'Sunrise yoga or meditation',
        'culture': 'Museum or historical site visit',
        'food': 'Local breakfast and food market tour',
        'nightlife': 'Late morning start with brunch',
        'shopping': 'Morning market exploration'
    };
    return styles.map(style => activities[style]).filter(Boolean)[0] || 'Local breakfast and exploration';
}

function getAfternoonActivity(styles) {
    const activities = {
        'adventure': 'Adventure sports or outdoor activities',
        'relaxation': 'Spa treatment or beach time',
        'culture': 'Cultural workshop or guided tour',
        'food': 'Cooking class or food tour',
        'nightlife': 'City exploration and preparation',
        'shopping': 'Shopping district exploration'
    };
    return styles.map(style => activities[style]).filter(Boolean)[0] || 'Local exploration and activities';
}

function getEveningActivity(styles) {
    const activities = {
        'adventure': 'Sunset adventure or outdoor dining',
        'relaxation': 'Evening spa or peaceful dinner',
        'culture': 'Traditional dinner or cultural show',
        'food': 'Fine dining experience',
        'nightlife': 'Pre-nightlife dinner',
        'shopping': 'Evening market or boutique shopping'
    };
    return styles.map(style => activities[style]).filter(Boolean)[0] || 'Local dinner experience';
}

function getNightActivity(styles) {
    const activities = {
        'adventure': 'Stargazing or night adventure',
        'relaxation': 'Evening relaxation or early night',
        'culture': 'Cultural performance or night tour',
        'food': 'Late night food scene',
        'nightlife': 'Nightlife and entertainment',
        'shopping': 'Night market or late shopping'
    };
    return styles.map(style => activities[style]).filter(Boolean)[0] || 'Local nightlife or relaxation';
}

function getBookingLinks(destination, budget) {
    const links = {
        'budget': [
            { name: 'Booking.com', url: 'https://booking.com' },
            { name: 'Hostelworld', url: 'https://hostelworld.com' },
            { name: 'Airbnb', url: 'https://airbnb.com' },
            { name: 'Skyscanner', url: 'https://skyscanner.com' }
        ],
        'mid': [
            { name: 'Booking.com', url: 'https://booking.com' },
            { name: 'Airbnb', url: 'https://airbnb.com' },
            { name: 'Expedia', url: 'https://expedia.com' },
            { name: 'TripAdvisor', url: 'https://tripadvisor.com' }
        ],
        'luxury': [
            { name: 'Luxury Hotels', url: 'https://luxuryhotels.com' },
            { name: 'Aman Resorts', url: 'https://aman.com' },
            { name: 'Four Seasons', url: 'https://fourseasons.com' },
            { name: 'Virtuoso', url: 'https://virtuoso.com' }
        ]
    };
    return links[budget] || links.mid;
}

function displayAIPlan(plan) {
    const resultContainer = document.getElementById('planner-result');
    
    const planHTML = `
        <div class="travel-plan">
            <div class="plan-header">
                <h3><i class="fas fa-brain"></i> AI Travel Plan for ${plan.destination}</h3>
                <p class="plan-dates">${plan.startDate} - ${plan.endDate} (${plan.days} days)</p>
                <p class="plan-group">${plan.travelers} ${plan.groupType} • ${plan.budgetLabel} Trip</p>
            </div>
            
            <div class="plan-budget">
                <h4><i class="fas fa-euro-sign"></i> Budget Overview</h4>
                <p>Daily budget per person: ${plan.dailyBudget}€</p>
                <p>Total trip budget: ${plan.totalBudget}€</p>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-bed"></i> Recommended Accommodation</h4>
                <ul>
                    ${plan.accommodation.map(acc => `<li>${acc}</li>`).join('')}
                </ul>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-car"></i> Transportation</h4>
                <ul>
                    ${plan.transportation.map(trans => `<li>${trans}</li>`).join('')}
                </ul>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-utensils"></i> Dining Recommendations</h4>
                <ul>
                    ${plan.restaurants.map(rest => `<li>${rest}</li>`).join('')}
                </ul>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-gem"></i> Hidden Gems</h4>
                <ul>
                    ${plan.hiddenGems.map(gem => `<li>${gem}</li>`).join('')}
                </ul>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-camera"></i> Photo Opportunities</h4>
                <ul>
                    ${plan.photoSpots.map(spot => `<li>${spot}</li>`).join('')}
                </ul>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-calendar-alt"></i> Daily Schedule Preview</h4>
                <div class="schedule-preview">
                    ${plan.dailySchedule.slice(0, 3).map(day => `
                        <div class="day-schedule">
                            <h5>Day ${day.day}</h5>
                            <p><strong>Morning:</strong> ${day.morning}</p>
                            <p><strong>Afternoon:</strong> ${day.afternoon}</p>
                            <p><strong>Evening:</strong> ${day.evening}</p>
                            <p><strong>Night:</strong> ${day.night}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="plan-section">
                <h4><i class="fas fa-link"></i> Quick Booking</h4>
                <div class="booking-links">
                    ${plan.bookingLinks.map(link => 
                        `<a href="${link.url}" target="_blank" class="booking-link">
                            <i class="fas fa-external-link-alt"></i> ${link.name}
                        </a>`
                    ).join('')}
                </div>
            </div>
            
            <div class="plan-actions">
                <button class="btn btn-primary" onclick="savePlan()">
                    <i class="fas fa-download"></i> Save Plan
                </button>
                <button class="btn btn-secondary" onclick="sharePlan()">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
    resultContainer.innerHTML = planHTML;
    
    // Add animation
    resultContainer.style.opacity = '0';
    resultContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
    }, 100);
}

function savePlan() {
    // Generate PDF
    generateTravelPlanPDF();
    showNotification('Your AI travel plan has been saved as PDF!', 'success');
}

function generateTravelPlanPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get current plan data
    const resultContainer = document.getElementById('planner-result');
    const planContent = resultContainer.querySelector('.travel-plan');
    
    if (!planContent) {
        showNotification('No travel plan available to save.', 'error');
        return;
    }
    
    // Extract plan data
    const destination = document.getElementById('destination').value;
    const travelers = document.getElementById('travelers').value;
    const groupType = document.getElementById('group-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const selectedStyles = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    const budget = document.querySelector('input[name="budget"]:checked')?.value;
    
    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // PDF Styling
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    let yPosition = 30;
    
    // Create professional header
    createPDFHeader(doc, pageWidth, destination);
    
    // Trip Overview Section
    yPosition = createTripOverview(doc, margin, yPosition, {
        destination,
        travelers,
        groupType,
        startDate,
        endDate,
        days,
        selectedStyles,
        budget
    });
    
    // Check if we need a new page
    if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
    }
    
    // Travel Plan Content
    yPosition = createTravelPlanContent(doc, margin, yPosition, planContent, contentWidth);
    
    // Additional Information Page
    doc.addPage();
    createAdditionalInfoPage(doc, margin);
    
    // Save the PDF
    const fileName = `TripVaults_${destination.replace(/\s+/g, '_')}_${startDate}_${endDate}.pdf`;
    doc.save(fileName);
}

function createPDFHeader(doc, pageWidth, destination) {
    // Gold header background
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Logo and title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('TripVaults', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.text('Your AI Travel Plan', pageWidth / 2, 32, { align: 'center' });
    
    // Destination
    doc.setFontSize(16);
    doc.text(destination, pageWidth / 2, 42, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
}

function createTripOverview(doc, margin, yPosition, data) {
    // Section title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip Overview', margin, yPosition);
    
    yPosition += 20;
    
    // Create overview table
    const overviewData = [
        ['Destination:', data.destination],
        ['Travelers:', `${data.travelers} ${data.groupType}`],
        ['Duration:', `${data.days} days`],
        ['Dates:', `${data.startDate} - ${data.endDate}`],
        ['Travel Styles:', data.selectedStyles.join(', ')],
        ['Budget Level:', data.budget]
    ];
    
    doc.setFontSize(11);
    
    overviewData.forEach(([label, value]) => {
        // Label
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, yPosition);
        
        // Value
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(value, 120);
        valueLines.forEach((line, index) => {
            doc.text(line, margin + 50, yPosition + (index * 5));
        });
        
        yPosition += Math.max(8, valueLines.length * 5);
    });
    
    return yPosition + 10;
}

function createTravelPlanContent(doc, margin, yPosition, planContent, contentWidth) {
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Your AI Travel Plan', margin, yPosition);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Get the plan text content
    const planTextElement = planContent.querySelector('.ai-plan-text');
    if (planTextElement) {
        // If we have AI-generated text, format it nicely
        const planText = planTextElement.textContent || planTextElement.innerText;
        const formattedText = formatPlanText(planText);
        
        formattedText.forEach(block => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 30;
            }
            
            if (block.type === 'title') {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.text(block.text, margin, yPosition);
                yPosition += 8;
                doc.setFontSize(10);
            } else if (block.type === 'subtitle') {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text(block.text, margin + 5, yPosition);
                yPosition += 6;
                doc.setFontSize(10);
            } else {
                doc.setFont('helvetica', 'normal');
                const lines = doc.splitTextToSize(block.text, contentWidth - 10);
                lines.forEach(line => {
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 30;
                    }
                    doc.text(line, margin + 10, yPosition);
                    yPosition += 5;
                });
                yPosition += 2;
            }
        });
    } else {
        // Fallback to structured plan
        const sections = planContent.querySelectorAll('.plan-section');
        sections.forEach(section => {
            const title = section.querySelector('h4');
            const content = section.querySelector('ul');
            
            if (title && yPosition > 240) {
                doc.addPage();
                yPosition = 30;
            }
            
            if (title) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.text(title.textContent, margin, yPosition);
                yPosition += 8;
                doc.setFontSize(10);
            }
            
            if (content) {
                doc.setFont('helvetica', 'normal');
                const items = content.querySelectorAll('li');
                items.forEach(item => {
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 30;
                    }
                    const text = `• ${item.textContent}`;
                    const lines = doc.splitTextToSize(text, contentWidth - 10);
                    lines.forEach(line => {
                        doc.text(line, margin + 5, yPosition);
                        yPosition += 5;
                    });
                    yPosition += 3;
                });
            }
            
            yPosition += 5;
        });
    }
    
    return yPosition;
}

function formatPlanText(text) {
    const blocks = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;
        
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
            // Main day title
            blocks.push({
                type: 'title',
                text: trimmedLine.replace(/\*\*/g, '')
            });
        } else if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
            // Subtitle (morning, afternoon, evening)
            blocks.push({
                type: 'subtitle',
                text: trimmedLine.replace(/\*/g, '')
            });
        } else if (trimmedLine.startsWith('-')) {
            // Activity item
            blocks.push({
                type: 'activity',
                text: trimmedLine
            });
        } else {
            // Regular text
            blocks.push({
                type: 'text',
                text: trimmedLine
            });
        }
    });
    
    return blocks;
}

function createAdditionalInfoPage(doc, margin) {
    let yPosition = 30;
    
    // Page title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Information', margin, yPosition);
    
    yPosition += 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const additionalInfo = [
        '• This travel plan was generated by TripVaults AI',
        '• All recommendations are based on your preferences',
        '• Please verify all information before booking',
        '• Contact local tourism offices for latest updates',
        '• Keep this document with you during your trip',
        '',
        'Travel Tips:',
        '• Book accommodations in advance',
        '• Check local weather forecasts',
        '• Have emergency contact numbers ready',
        '• Keep copies of important documents',
        '• Research local customs and etiquette'
    ];
    
    additionalInfo.forEach(info => {
        if (info === '') {
            yPosition += 5;
        } else if (info === 'Travel Tips:') {
            doc.setFont('helvetica', 'bold');
            doc.text(info, margin, yPosition);
            yPosition += 8;
            doc.setFont('helvetica', 'normal');
        } else {
            doc.text(info, margin, yPosition);
            yPosition += 6;
        }
    });
    
    // Footer
    yPosition = 250;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by TripVaults AI - Your AI Guide for Carefree Travel', margin, yPosition);
}

function sharePlan() {
    if (navigator.share) {
        navigator.share({
            title: 'My AI Travel Plan - TripVaults',
            text: 'Check out my AI-generated travel plan!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link has been copied to clipboard!', 'success');
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add CSS for travel plan display
const planStyles = `
    <style>
        .travel-plan {
            text-align: left;
            max-height: 600px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        .travel-plan::-webkit-scrollbar {
            width: 8px;
        }
        
        .travel-plan::-webkit-scrollbar-track {
            background: var(--card-bg);
            border-radius: 4px;
        }
        
        .travel-plan::-webkit-scrollbar-thumb {
            background: var(--primary-gold);
            border-radius: 4px;
        }
        
        .plan-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--primary-gold);
        }
        
        .plan-header h3 {
            color: var(--primary-gold);
            margin-bottom: 0.5rem;
        }
        
        .plan-dates {
            color: var(--text-gray);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .plan-group {
            color: var(--primary-gold);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .plan-content {
            margin-bottom: 2rem;
        }
        
        .ai-plan-text {
            background: rgba(212, 175, 55, 0.05);
            padding: 1.5rem;
            border-radius: 10px;
            border: 1px solid rgba(212, 175, 55, 0.2);
            color: var(--text-light);
            line-height: 1.6;
            white-space: pre-line;
        }
        
        .plan-budget {
            background: rgba(212, 175, 55, 0.1);
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
        }
        
        .plan-budget h4 {
            color: var(--primary-gold);
            margin-bottom: 0.5rem;
        }
        
        .plan-section {
            margin-bottom: 1.5rem;
        }
        
        .plan-section h4 {
            color: var(--primary-gold);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .plan-section ul {
            list-style: none;
            padding-left: 0;
        }
        
        .plan-section li {
            color: var(--text-gray);
            margin-bottom: 0.3rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .plan-section li::before {
            content: '•';
            color: var(--primary-gold);
            position: absolute;
            left: 0;
        }
        
        .schedule-preview {
            display: grid;
            gap: 1rem;
        }
        
        .day-schedule {
            background: rgba(212, 175, 55, 0.05);
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .day-schedule h5 {
            color: var(--primary-gold);
            margin-bottom: 0.5rem;
        }
        
        .day-schedule p {
            color: var(--text-gray);
            margin-bottom: 0.3rem;
            font-size: 0.9rem;
        }
        
        .booking-links {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .booking-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary-gold);
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .booking-link:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--primary-gold);
        }
        
        .plan-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            justify-content: center;
        }
        
        .loading-state {
            text-align: center;
            color: var(--text-gray);
        }
        
        .loading-state i {
            font-size: 3rem;
            color: var(--primary-gold);
            margin-bottom: 1rem;
        }
        
        .loading-state h3 {
            margin-bottom: 0.5rem;
            color: var(--text-light);
        }
        
        @media (max-width: 768px) {
            .plan-actions {
                flex-direction: column;
            }
            
            .booking-links {
                flex-direction: column;
            }
        }
    </style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', planStyles);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card, .style-card, .budget-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.planner-form input, .planner-form select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = 'rgba(212, 175, 55, 0.2)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-gold)';
        });
    });
}); 

// Test API response generator
function generateTestAPIResponse(destination, travelers, groupType, selectedStyles, budget) {
    const styles = selectedStyles.join(', ');
    const budgetText = budget === 'budget' ? 'Budget' : budget === 'mid' ? 'Mid-Range' : 'Luxury';
    
    return `**Day 1:**

*Morning:*
- Start your day with a local breakfast at a traditional café
- Explore the main attractions of ${destination} with a guided walking tour

*Afternoon:*
- Visit the most popular landmarks and cultural sites
- Enjoy a traditional lunch at a local restaurant

*Evening:*
- Experience the local nightlife and entertainment scene
- Dinner at a recommended restaurant based on your ${styles} preferences

**Day 2:**

*Morning:*
- Early morning activity based on your ${styles} interests
- Visit local markets and shops

*Afternoon:*
- Continue exploring ${destination} with focus on ${styles}
- Optional activities based on your group type (${groupType})

*Evening:*
- Evening entertainment and dining options
- Relaxation time at your ${budgetText} accommodation

**Day 3:**

*Morning:*
- Final day activities in ${destination}
- Last-minute shopping and sightseeing

*Afternoon:*
- Farewell lunch at a local favorite
- Prepare for departure

*Evening:*
- Final evening in ${destination}
- Reflection on your amazing trip

This ${budgetText} travel plan for ${travelers} ${groupType} focuses on ${styles} activities in ${destination}. Enjoy your trip!`;
} 