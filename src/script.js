// Global variables
let map;
let reports = [];
let socialPosts = [];
let trendChart;
let isDarkMode = false;
let isHeatmapVisible = false;
let isSatelliteView = false;
let currentFilter = 'all';
let heatmapLayer;
let notificationId = 0;
let userLocation = null;
let satelliteLayer = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLoadingOverlay();
    
    setTimeout(() => {
        initializeMap();
        loadSampleData();
        initializeChart();
        updateReportsDisplay();
        updateSocialFeed();
        updateStats();
        setupEventListeners();
        initializeNotifications();
        loadUserPreferences();
        hideLoadingOverlay();
        
        // Show welcome notification
        showNotification('Welcome to Ocean Guardian!', 'Ready to protect our oceans together.', 'success');
    }, 1500);
    
    // Auto-refresh data every 30 seconds
    setInterval(() => {
        simulateNewData();
        updateStats();
        updateSocialMetrics();
    }, 30000);
    
    // Update character counter
    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
        descriptionInput.addEventListener('input', updateCharCounter);
    }
});

// Setup enhanced event listeners
function setupEventListeners() {
    // Form submission
    const hazardForm = document.getElementById('hazardForm');
    if (hazardForm) {
        hazardForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Modal close events
    window.addEventListener('click', handleModalClick);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // File upload
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('photo');
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', () => fileInput.click());
        fileUpload.addEventListener('dragover', handleDragOver);
        fileUpload.addEventListener('drop', handleFileDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Profile menu toggle
    document.addEventListener('click', (e) => {
        const profileMenu = document.getElementById('profileMenu');
        const navProfile = document.querySelector('.nav-profile');
        
        if (navProfile && navProfile.contains(e.target)) {
            e.stopPropagation();
            toggleProfileMenu();
        } else if (profileMenu && !profileMenu.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });
    
    // Auto-hide loading overlay after 3 seconds if still visible
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay && overlay.style.display !== 'none') {
            hideLoadingOverlay();
        }
    }, 3000);
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
    
    // Scroll handlers for animations
    window.addEventListener('scroll', handleScroll);
}

// Initialize enhanced map
function initializeMap() {
    // Initialize map centered on Chennai, India
    map = L.map('map', {
        center: [13.0827, 80.2707],
        zoom: 8,
        zoomControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true
    });
    
    // Add custom zoom control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Initialize satellite layer
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    // Add sample markers for demonstration
    addSampleMarkers();
    
    // Add click event for new reports
    map.on('click', onMapClick);
    
    // Add scale control
    L.control.scale({
        position: 'bottomleft'
    }).addTo(map);
}

// Enhanced sample markers
function addSampleMarkers() {
    const sampleLocations = [
        { 
            lat: 13.0827, 
            lng: 80.2707, 
            type: 'oil-spill', 
            severity: 'high', 
            description: 'Major oil spill reported near Chennai Port - Immediate response required',
            timestamp: new Date(Date.now() - 3600000),
            verified: true,
            reporter: 'Coast Guard',
            id: 'marker-1'
        },
        { 
            lat: 12.9716, 
            lng: 80.2341, 
            type: 'plastic-waste', 
            severity: 'medium', 
            description: 'Large plastic debris field detected via satellite imagery',
            timestamp: new Date(Date.now() - 7200000),
            verified: true,
            reporter: 'Satellite Monitor',
            id: 'marker-2'
        },
        { 
            lat: 13.1500, 
            lng: 80.1800, 
            type: 'algae-bloom', 
            severity: 'low', 
            description: 'Algae bloom detected - Water quality monitoring initiated',
            timestamp: new Date(Date.now() - 10800000),
            verified: false,
            reporter: 'Local Fisherman',
            id: 'marker-3'
        },
        { 
            lat: 12.8500, 
            lng: 80.3200, 
            type: 'chemical-pollution', 
            severity: 'critical', 
            description: 'Chemical discharge reported - Environmental team dispatched',
            timestamp: new Date(Date.now() - 14400000),
            verified: true,
            reporter: 'Environmental Agency',
            id: 'marker-4'
        },
        {
            lat: 13.2000,
            lng: 80.1000,
            type: 'marine-life',
            severity: 'high',
            description: 'Unusual marine life behavior - Mass fish death reported',
            timestamp: new Date(Date.now() - 18000000),
            verified: true,
            reporter: 'Marine Biologist',
            id: 'marker-5'
        }
    ];
    
    sampleLocations.forEach(location => {
        addEnhancedMarkerToMap(location);
    });
}

// Add enhanced marker to map
function addEnhancedMarkerToMap(location) {
    const color = getSeverityColor(location.severity);
    const radius = getSeverityRadius(location.severity);
    
    // Create pulsing effect for high priority markers
    const isPulsing = location.severity === 'critical' || location.severity === 'high';
    
    const marker = L.circleMarker([location.lat, location.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        radius: radius,
        weight: 3,
        className: isPulsing ? 'pulsing-marker' : ''
    }).addTo(map);
    
    // Create enhanced popup content
    const popupContent = createEnhancedPopup(location);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });
    
    // Add click event
    marker.on('click', () => {
        showMarkerDetails(location);
    });
    
    return marker;
}

// Create enhanced popup content
function createEnhancedPopup(location) {
    const severityClass = `severity-${location.severity}`;
    const statusIcon = location.verified ? 'fa-check-circle' : 'fa-clock';
    const statusColor = location.verified ? '#10b981' : '#f59e0b';
    
    return `
        <div class="popup-content">
            <div class="popup-header ${severityClass}">
                <h4>${formatHazardType(location.type)}</h4>
                <span class="severity-badge ${severityClass}">${location.severity.toUpperCase()}</span>
            </div>
            <div class="popup-body">
                <div class="popup-info">
                    <i class="fas fa-clock"></i>
                    <span>${formatTimeAgo(location.timestamp)}</span>
                </div>
                <div class="popup-info">
                    <i class="fas fa-user"></i>
                    <span>${location.reporter}</span>
                </div>
                <div class="popup-info">
                    <i class="fas ${statusIcon}" style="color: ${statusColor};"></i>
                    <span>${location.verified ? 'Verified' : 'Pending'}</span>
                </div>
                <p class="popup-description">${location.description}</p>
                <div class="popup-actions">
                    <button class="popup-btn" onclick="viewMarkerDetails('${location.id}')">
                        <i class="fas fa-eye"></i> Details
                    </button>
                    <button class="popup-btn" onclick="reportSimilar(${location.lat}, ${location.lng})">
                        <i class="fas fa-plus"></i> Report Similar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load enhanced sample data
function loadSampleData() {
    reports = [
        {
            id: 1,
            type: 'oil-spill',
            severity: 'high',
            location: 'Bay of Bengal, 15km from Chennai Port',
            description: 'Large oil spill detected affecting approximately 2km of coastline. Immediate response team dispatched. Wildlife rescue operations underway.',
            timestamp: new Date(Date.now() - 3600000),
            verified: true,
            reporter: 'Coast Guard Patrol',
            contact: 'coastguard@marine.gov.in',
            coordinates: [13.0827, 80.2707],
            images: 2
        },
        {
            id: 2,
            type: 'plastic-waste',
            severity: 'medium',
            location: 'Marina Beach, Chennai',
            description: 'Significant plastic debris accumulation after recent monsoon. Beach cleanup operations scheduled. Community volunteers needed.',
            timestamp: new Date(Date.now() - 7200000),
            verified: true,
            reporter: 'Environmental NGO',
            contact: 'cleanup@oceancare.org',
            coordinates: [12.9716, 80.2341],
            images: 5
        },
        {
            id: 3,
            type: 'algae-bloom',
            severity: 'low',
            location: 'Pulicat Lake',
            description: 'Unusual algae bloom detected with water discoloration. Water quality testing in progress. Local fishing temporarily suspended.',
            timestamp: new Date(Date.now() - 10800000),
            verified: false,
            reporter: 'Local Fisherman',
            contact: 'fisher@local.com',
            coordinates: [13.1500, 80.1800],
            images: 1
        },
        {
            id: 4,
            type: 'chemical-pollution',
            severity: 'critical',
            location: 'Ennore Creek',
            description: 'Suspected industrial chemical discharge with fish kill reported. Environmental investigation team deployed. Area cordoned off.',
            timestamp: new Date(Date.now() - 14400000),
            verified: true,
            reporter: 'Environmental Protection Agency',
            contact: 'emergency@epa.gov.in',
            coordinates: [12.8500, 80.3200],
            images: 3
        },
        {
            id: 5,
            type: 'marine-life',
            severity: 'high',
            location: 'Covelong Beach',
            description: 'Mass turtle nesting disruption and unusual marine behavior observed. Marine biologists investigating possible causes.',
            timestamp: new Date(Date.now() - 18000000),
            verified: true,
            reporter: 'Marine Research Institute',
            contact: 'research@marine.ac.in',
            coordinates: [13.2000, 80.1000],
            images: 4
        }
    ];

    socialPosts = [
        {
            id: 1,
            username: 'MarineExplorer_IN',
            content: 'URGENT: Massive oil spill spotted near Chennai port! This is devastating for marine life. Cleanup crews needed immediately! #OceanPollution #SaveOurSeas #ChennaiPort #MarineEmergency',
            timestamp: new Date(Date.now() - 1800000),
            sentiment: 'negative',
            platform: 'twitter',
            engagement: 1247,
            verified: true
        },
        {
            id: 2,
            username: 'EcoWarrior2024',
            content: 'Amazing community spirit at Marina Beach cleanup today! 500+ volunteers collected 2 tons of plastic waste. Together we can heal our oceans 🌊💙 #CleanOcean #CommunityAction #ZeroWaste',
            timestamp: new Date(Date.now() - 3600000),
            sentiment: 'positive',
            platform: 'instagram',
            engagement: 892,
            verified: false
        },
        {
            id: 3,
            username: 'FishermanDaily',
            content: 'Water color changed drastically near Pulicat Lake. Fish behavior very unusual - they seem distressed. Is this climate change effect or something else? Need experts to investigate 🐟',
            timestamp: new Date(Date.now() - 5400000),
            sentiment: 'neutral',
            platform: 'twitter',
            engagement: 234,
            verified: false
        },
        {
            id: 4,
            username: 'CoastalGuardIndia',
            content: 'Regular maritime patrol identified debris field 10km offshore. Monitoring situation closely. Citizens please report any unusual marine sightings to our emergency hotline.',
            timestamp: new Date(Date.now() - 7200000),
            sentiment: 'neutral',
            platform: 'facebook',
            engagement: 567,
            verified: true
        },
        {
            id: 5,
            username: 'OceanConservation',
            content: 'New satellite data reveals alarming increase in Bay of Bengal pollution levels. Microplastics up 40% this year. We need immediate policy action! 📊 #DataScience #OceanHealth #PolicyChange',
            timestamp: new Date(Date.now() - 9000000),
            sentiment: 'negative',
            platform: 'twitter',
            engagement: 1312,
            verified: true
        }
    ];
}

// Initialize Chart.js visualization
function initializeChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const chartData = generateChartData();
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Oil Spills',
                    data: chartData.oilSpills,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Plastic Waste',
                    data: chartData.plasticWaste,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Chemical Pollution',
                    data: chartData.chemicalPollution,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Marine Life Issues',
                    data: chartData.marineLife,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 16
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(226, 232, 240, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                }
            }
        }
    });
}

// Generate chart data
function generateChartData() {
    const days = 7;
    const labels = [];
    const oilSpills = [];
    const plasticWaste = [];
    const chemicalPollution = [];
    const marineLife = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
        
        // Generate realistic trend data
        oilSpills.push(Math.floor(Math.random() * 15) + 5);
        plasticWaste.push(Math.floor(Math.random() * 25) + 15);
        chemicalPollution.push(Math.floor(Math.random() * 8) + 2);
        marineLife.push(Math.floor(Math.random() * 12) + 8);
    }

    return { labels, oilSpills, plasticWaste, chemicalPollution, marineLife };
}

// Update reports display
function updateReportsDisplay() {
    const reportsContainer = document.getElementById('reportsList');
    if (!reportsContainer) return;

    const filteredReports = filterReportsByCurrentFilter();
    
    reportsContainer.innerHTML = filteredReports.map(report => `
        <div class="report-item severity-${report.severity} fade-in" onclick="viewReportDetails(${report.id})">
            <div class="report-header">
                <span class="report-type">${formatHazardType(report.type)}</span>
                <span class="report-time">${formatTimeAgo(report.timestamp)}</span>
            </div>
            <div class="report-meta">
                <div><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${report.location}</div>
                <div><i class="fas fa-user"></i> <strong>Reporter:</strong> ${report.reporter}</div>
                ${report.images ? `<div><i class="fas fa-camera"></i> <strong>Images:</strong> ${report.images}</div>` : ''}
            </div>
            <p class="report-description">${report.description}</p>
            <div class="report-footer">
                <div class="verification-status ${report.verified ? 'verified' : 'pending'}">
                    <i class="fas ${report.verified ? 'fa-check-circle' : 'fa-clock'}"></i>
                    ${report.verified ? 'Verified' : 'Pending Verification'}
                </div>
                <div class="report-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); viewOnMap(${report.coordinates[0]}, ${report.coordinates[1]})" title="View on Map">
                        <i class="fas fa-map"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); shareReport(${report.id})" title="Share Report">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); bookmarkReport(${report.id})" title="Bookmark">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add animation class to new items
    setTimeout(() => {
        document.querySelectorAll('.report-item').forEach((item, index) => {
            setTimeout(() => item.classList.add('slide-in'), index * 100);
        });
    }, 50);
}

// Update social media feed
function updateSocialFeed() {
    const socialContainer = document.getElementById('socialFeed');
    if (!socialContainer) return;

    socialContainer.innerHTML = socialPosts.map(post => `
        <div class="social-post sentiment-${post.sentiment} fade-in" onclick="viewSocialPost(${post.id})">
            <div class="post-header">
                <div class="post-avatar">${post.username.charAt(0).toUpperCase()}</div>
                <div class="post-info">
                    <div class="post-username">
                        ${post.username}
                        ${post.verified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                        <span class="platform-badge">${getPlatformIcon(post.platform)}</span>
                    </div>
                    <div class="post-time">${formatTimeAgo(post.timestamp)}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-footer">
                <div class="sentiment-indicator sentiment-${post.sentiment}">
                    <i class="fas ${getSentimentIcon(post.sentiment)}"></i>
                    ${post.sentiment}
                </div>
                <div class="engagement-stats">
                    <span><i class="fas fa-heart"></i> ${post.engagement}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add animation to social posts
    setTimeout(() => {
        document.querySelectorAll('.social-post').forEach((post, index) => {
            setTimeout(() => post.classList.add('slide-in'), index * 150);
        });
    }, 100);
}

// Update statistics
function updateStats() {
    const stats = calculateStats();
    
    // Update stat numbers with animation
    animateCounter('totalReports', stats.totalReports);
    animateCounter('activeHazards', stats.activeHazards);
    animateCounter('verifiedReports', stats.verifiedReports);
    animateCounter('socialMentions', stats.socialMentions);
    animateCounter('activeUsers', stats.activeUsers);
    animateCounter('coverage', stats.coverage, '%');
}

// Calculate statistics
function calculateStats() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentReports = reports.filter(r => r.timestamp > dayAgo);
    const activeHazards = reports.filter(r => r.severity === 'high' || r.severity === 'critical');
    const verifiedReports = reports.filter(r => r.verified);
    const totalSocialEngagement = socialPosts.reduce((sum, post) => sum + post.engagement, 0);
    
    return {
        totalReports: 247 + Math.floor(Math.random() * 10),
        activeHazards: 23 + Math.floor(Math.random() * 5),
        verifiedReports: 189 + Math.floor(Math.random() * 8),
        socialMentions: 1342 + Math.floor(Math.random() * 50),
        activeUsers: 1847 + Math.floor(Math.random() * 30),
        coverage: 94 + Math.floor(Math.random() * 3)
    };
}

// Animate counter numbers
function animateCounter(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = (targetValue - startValue) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
        currentStep++;
        const currentValue = Math.floor(startValue + (increment * currentStep));
        element.textContent = currentValue + suffix;
        
        if (currentStep >= steps) {
            clearInterval(timer);
            element.textContent = targetValue + suffix;
        }
    }, duration / steps);
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const formData = {
        hazardType: document.getElementById('hazardType').value,
        severity: document.getElementById('severity').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        contact: document.getElementById('contact').value,
        photo: document.getElementById('photo').files[0],
        timestamp: new Date(),
        coordinates: userLocation || [13.0827, 80.2707]
    };

    // Validate form
    if (!formData.hazardType || !formData.severity || !formData.location || !formData.description) {
        showNotification('Form Error', 'Please fill in all required fields.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Add to reports array
        const newReport = {
            id: reports.length + 1,
            type: formData.hazardType,
            severity: formData.severity,
            location: formData.location,
            description: formData.description,
            timestamp: formData.timestamp,
            verified: false,
            reporter: 'Anonymous User',
            contact: formData.contact || 'N/A',
            coordinates: formData.coordinates,
            images: formData.photo ? 1 : 0
        };

        reports.unshift(newReport);
        
        // Add marker to map
        addEnhancedMarkerToMap({
            lat: formData.coordinates[0],
            lng: formData.coordinates[1],
            type: formData.hazardType,
            severity: formData.severity,
            description: formData.description,
            timestamp: formData.timestamp,
            verified: false,
            reporter: 'Anonymous User',
            id: `marker-${newReport.id}`
        });

        // Update displays
        updateReportsDisplay();
        updateStats();
        
        // Reset form
        document.getElementById('hazardForm').reset();
        updateCharCounter();
        clearFilePreview();
        
        // Close modal
        closeReportModal();
        
        // Show success notification
        showNotification('Report Submitted!', 'Your hazard report has been submitted successfully.', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Focus map on new report
        map.setView(formData.coordinates, 12);
        
    }, 2000);
}

// Handle modal clicks
function handleModalClick(event) {
    const modals = ['reportModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // ESC to close modals
    if (event.key === 'Escape') {
        closeReportModal();
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) profileMenu.style.display = 'none';
    }
    
    // Ctrl/Cmd + R to show report modal
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        showReportModal();
    }
    
    // Ctrl/Cmd + D to toggle dark mode
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        toggleDarkMode();
    }
}

// File handling functions
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleFileDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    handleFiles(files);
}

function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const preview = document.getElementById('uploadPreview');
    
    preview.innerHTML = '';
    
    files.forEach(file => {
        if (!validTypes.includes(file.type)) {
            showNotification('File Error', `${file.name} is not a valid image format.`, 'error');
            return;
        }
        
        if (file.size > maxSize) {
            showNotification('File Error', `${file.name} is too large. Maximum size is 5MB.`, 'error');
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid var(--border-color);">
                <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">${file.name}</span>
            `;
            preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function clearFilePreview() {
    const preview = document.getElementById('uploadPreview');
    if (preview) preview.innerHTML = '';
}

// Character counter
function updateCharCounter() {
    const description = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    
    if (description && charCount) {
        const current = description.value.length;
        const max = 500;
        charCount.textContent = current;
        charCount.style.color = current > max * 0.8 ? '#ef4444' : 'var(--text-secondary)';
    }
}

// Map interaction functions
function onMapClick(event) {
    const { lat, lng } = event.latlng;
    reportSimilar(lat, lng);
}

function reportSimilar(lat, lng) {
    userLocation = [lat, lng];
    showReportModal();
    
    // Pre-fill location if possible
    setTimeout(() => {
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        }
    }, 100);
}

function viewOnMap(lat, lng) {
    map.setView([lat, lng], 14);
    showNotification('Location Found', 'Map centered on report location.', 'success');
}

function centerMap() {
    map.setView([13.0827, 80.2707], 8);
}

function toggleHeatmap() {
    if (isHeatmapVisible) {
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
        }
        isHeatmapVisible = false;
    } else {
        // Create heatmap data
        const heatmapData = reports.map(report => [
            report.coordinates[0],
            report.coordinates[1],
            getSeverityWeight(report.severity)
        ]);
        
        // Note: This would require leaflet-heat plugin in a real implementation
        showNotification('Heatmap', 'Heatmap visualization would require additional plugin.', 'warning');
        isHeatmapVisible = true;
    }
}

function toggleSatellite() {
    if (isSatelliteView) {
        map.removeLayer(satelliteLayer);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        isSatelliteView = false;
    } else {
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        map.addLayer(satelliteLayer);
        isSatelliteView = true;
    }
}

function toggleFullscreen() {
    const mapCard = document.querySelector('.map-card');
    if (!document.fullscreenElement) {
        mapCard.requestFullscreen().catch(err => {
            showNotification('Fullscreen Error', 'Could not enter fullscreen mode.', 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

// Modal functions
function showReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('select, input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showDashboard() {
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

// Profile menu
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

// Dark mode toggle
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-theme');
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Save preference
    localStorage.setItem('oceanGuardian_darkMode', isDarkMode);
    
    // Update chart colors if chart exists
    if (trendChart) {
        updateChartColors();
    }
    
    showNotification('Theme Changed', `Switched to ${isDarkMode ? 'dark' : 'light'} mode.`, 'success');
}

function updateChartColors() {
    const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    
    trendChart.options.plugins.legend.labels.color = textPrimary;
    trendChart.options.scales.x.ticks.color = textSecondary;
    trendChart.options.scales.y.ticks.color = textSecondary;
    trendChart.update();
}

// Notification system
function showNotification(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-header">
                <strong>${title}</strong>
                <button class="notification-close" onclick="removeNotification(this)">×</button>
            </div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        removeNotification(notification.querySelector('.notification-close'));
    }, duration);
    
    // Add entrance animation
    setTimeout(() => notification.classList.add('slide-in'), 10);
}

function removeNotification(element) {
    const notification = element.closest('.notification');
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

function initializeNotifications() {
    // Clear any existing notifications
    const container = document.getElementById('notificationContainer');
    if (container) {
        container.innerHTML = '';
    }
}

// Data filtering and sorting
function filterReports() {
    currentFilter = document.getElementById('reportFilter').value;
    updateReportsDisplay();
}

function filterReportsByCurrentFilter() {
    let filtered = [...reports];
    
    switch (currentFilter) {
        case 'verified':
            filtered = filtered.filter(report => report.verified);
            break;
        case 'pending':
            filtered = filtered.filter(report => !report.verified);
            break;
        case 'high':
            filtered = filtered.filter(report => report.severity === 'high' || report.severity === 'critical');
            break;
        case 'all':
        default:
            break;
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function refreshReports() {
    const btn = document.querySelector('.card-btn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            simulateNewData();
            updateReportsDisplay();
            updateStats();
            btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            showNotification('Data Refreshed', 'Reports have been updated with latest data.', 'success');
        }, 1000);
    }
}

// Chart updates
function updateChart() {
    const timeRange = document.getElementById('timeRange').value;
    const newData = generateChartDataForRange(parseInt(timeRange));
    
    trendChart.data.labels = newData.labels;
    trendChart.data.datasets[0].data = newData.oilSpills;
    trendChart.data.datasets[1].data = newData.plasticWaste;
    trendChart.data.datasets[2].data = newData.chemicalPollution;
    trendChart.data.datasets[3].data = newData.marineLife;
    
    trendChart.update('active');
}

function generateChartDataForRange(days) {
    const labels = [];
    const oilSpills = [];
    const plasticWaste = [];
    const chemicalPollution = [];
    const marineLife = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (days <= 7) {
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        } else if (days <= 30) {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        } else {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
        }
        
        // Generate realistic trend data with seasonal variations
        const seasonFactor = Math.sin((date.getTime() / 86400000) * Math.PI / 182.5) * 0.3 + 1;
        
        oilSpills.push(Math.floor((Math.random() * 15 + 5) * seasonFactor));
        plasticWaste.push(Math.floor((Math.random() * 25 + 15) * seasonFactor));
        chemicalPollution.push(Math.floor((Math.random() * 8 + 2) * seasonFactor));
        marineLife.push(Math.floor((Math.random() * 12 + 8) * seasonFactor));
    }

    return { labels, oilSpills, plasticWaste, chemicalPollution, marineLife };
}

// Social media functions
function updateSocialMetrics() {
    const positive = socialPosts.filter(post => post.sentiment === 'positive').length;
    const neutral = socialPosts.filter(post => post.sentiment === 'neutral').length;
    const negative = socialPosts.filter(post => post.sentiment === 'negative').length;
    const total = socialPosts.length;
    
    document.getElementById('positiveCount').textContent = Math.round((positive / total) * 100) + '%';
    document.getElementById('neutralCount').textContent = Math.round((neutral / total) * 100) + '%';
    document.getElementById('negativeCount').textContent = Math.round((negative / total) * 100) + '%';
}

function viewSocialPost(postId) {
    const post = socialPosts.find(p => p.id === postId);
    if (post) {
        showNotification('Social Post', `Viewing post by ${post.username} on ${post.platform}`, 'info');
    }
}

// Detailed view functions
function viewReportDetails(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (report) {
        // In a real app, this would open a detailed modal
        showNotification('Report Details', `Viewing detailed information for ${formatHazardType(report.type)} report.`, 'info');
        viewOnMap(report.coordinates[0], report.coordinates[1]);
    }
}

function viewMarkerDetails(markerId) {
    showNotification('Marker Details', 'Viewing detailed marker information.', 'info');
}

function showMarkerDetails(location) {
    const detailsHtml = `
        <div style="max-width: 400px;">
            <h3>${formatHazardType(location.type)}</h3>
            <p><strong>Severity:</strong> ${location.severity.toUpperCase()}</p>
            <p><strong>Reporter:</strong> ${location.reporter}</p>
            <p><strong>Time:</strong> ${formatTimeAgo(location.timestamp)}</p>
            <p><strong>Status:</strong> ${location.verified ? 'Verified' : 'Pending'}</p>
            <p><strong>Description:</strong> ${location.description}</p>
        </div>
    `;
    
    showNotification('Hazard Details', detailsHtml, 'info', 10000);
}

// Action functions
function shareReport(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (report) {
        const shareText = `Ocean Guardian Alert: ${formatHazardType(report.type)} reported at ${report.location}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Ocean Guardian Report',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Shared', 'Report details copied to clipboard.', 'success');
            });
        }
    }
}

function bookmarkReport(reportId) {
    // In a real app, this would save to user's bookmarks
    showNotification('Bookmarked', 'Report has been added to your bookmarks.', 'success');
}

// Location services
function getCurrentLocation() {
    if (navigator.geolocation) {
        const btn = document.querySelector('.location-btn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                userLocation = [latitude, longitude];
                
                // Update location input
                const locationInput = document.getElementById('location');
                if (locationInput) {
                    locationInput.value = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                }
                
                btn.innerHTML = originalHtml;
                showNotification('Location Found', 'Using your current location.', 'success');
            },
            (error) => {
                btn.innerHTML = originalHtml;
                showNotification('Location Error', 'Could not get your location. Please enter manually.', 'error');
            }
        );
    } else {
        showNotification('Not Supported', 'Geolocation is not supported by this browser.', 'error');
    }
}

// Data simulation
function simulateNewData() {
    // Simulate new reports occasionally
    if (Math.random() < 0.3) {
        const hazardTypes = ['oil-spill', 'plastic-waste', 'chemical-pollution', 'marine-life', 'algae-bloom'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const locations = [
            'Bay of Bengal Coast',
            'Marina Beach Area',
            'Ennore Creek',
            'Pulicat Lake Region',
            'Covelong Beach'
        ];
        
        const newReport = {
            id: reports.length + 1,
            type: hazardTypes[Math.floor(Math.random() * hazardTypes.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            description: 'New hazard detected through automated monitoring system.',
            timestamp: new Date(),
            verified: Math.random() > 0.5,
            reporter: 'Automated System',
            contact: 'system@oceanguardian.org',
            coordinates: [
                13.0827 + (Math.random() - 0.5) * 0.5,
                80.2707 + (Math.random() - 0.5) * 0.5
            ],
            images: Math.floor(Math.random() * 3)
        };
        
        reports.unshift(newReport);
        
        // Add to map if visible
        addEnhancedMarkerToMap({
            lat: newReport.coordinates[0],
            lng: newReport.coordinates[1],
            type: newReport.type,
            severity: newReport.severity,
            description: newReport.description,
            timestamp: newReport.timestamp,
            verified: newReport.verified,
            reporter: newReport.reporter,
            id: `marker-${newReport.id}`
        });
    }
    
    // Simulate new social posts
    if (Math.random() < 0.4) {
        const usernames = ['OceanWatcher', 'MarineAlert', 'EcoWarrior', 'CoastGuardian', 'BlueDefender'];
        const platforms = ['twitter', 'instagram', 'facebook'];
        const sentiments = ['positive', 'negative', 'neutral'];
        
        const newPost = {
            id: socialPosts.length + 1,
            username: usernames[Math.floor(Math.random() * usernames.length)],
            content: 'Monitoring ocean conditions and marine life safety. Stay alert for environmental changes.',
            timestamp: new Date(),
            sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
            platform: platforms[Math.floor(Math.random() * platforms.length)],
            engagement: Math.floor(Math.random() * 500) + 50,
            verified: Math.random() > 0.7
        };
        
        socialPosts.unshift(newPost);
    }
}

// Utility functions
function getSeverityColor(severity) {
    const colors = {
        low: '#059669',
        medium: '#d97706',
        high: '#ea580c',
        critical: '#dc2626'
    };
    return colors[severity] || colors.medium;
}

function getSeverityRadius(severity) {
    const radii = {
        low: 8,
        medium: 12,
        high: 16,
        critical: 20
    };
    return radii[severity] || radii.medium;
}

function getSeverityWeight(severity) {
    const weights = {
        low: 0.2,
        medium: 0.4,
        high: 0.7,
        critical: 1.0
    };
    return weights[severity] || weights.medium;
}

function formatHazardType(type) {
    const types = {
        'oil-spill': 'Oil Spill',
        'plastic-waste': 'Plastic Waste',
        'chemical-pollution': 'Chemical Pollution',
        'marine-life': 'Marine Life Issue',
        'algae-bloom': 'Algae Bloom',
        'debris': 'Marine Debris'
    };
    return types[type] || type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

function getPlatformIcon(platform) {
    const icons = {
        twitter: '🐦',
        instagram: '📸',
        facebook: '👥',
        youtube: '📺',
        tiktok: '🎵'
    };
    return icons[platform] || '🌐';
}

function getSentimentIcon(sentiment) {
    const icons = {
        positive: 'fa-smile',
        negative: 'fa-frown',
        neutral: 'fa-meh'
    };
    return icons[sentiment] || 'fa-meh';
}

// Preference management
function loadUserPreferences() {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('oceanGuardian_darkMode');
    if (savedDarkMode === 'true') {
        toggleDarkMode();
    }
    
    // Load other preferences
    const savedFilter = localStorage.getItem('oceanGuardian_reportFilter');
    if (savedFilter) {
        const filterSelect = document.getElementById('reportFilter');
        if (filterSelect) {
            filterSelect.value = savedFilter;
            currentFilter = savedFilter;
        }
    }
}

function saveUserPreferences() {
    localStorage.setItem('oceanGuardian_darkMode', isDarkMode);
    localStorage.setItem('oceanGuardian_reportFilter', currentFilter);
}

// Window event handlers
function handleWindowResize() {
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
    
    if (trendChart) {
        trendChart.resize();
    }
}

function handleScroll() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !card.classList.contains('fade-in')) {
            card.classList.add('fade-in');
        }
    });
}

// Loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }
}

// Save preferences when page unloads
window.addEventListener('beforeunload', saveUserPreferences);

// Initialize tooltips and other UI enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add loading animations to cards
    setTimeout(() => {
        document.querySelectorAll('.card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }, 100);
        });
    }, 1600);
});