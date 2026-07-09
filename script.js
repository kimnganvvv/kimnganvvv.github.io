/**
 * Portfolio Script - Nguyen Thi Kim Ngan
 * Handles interactive features: Theme toggling, typewriter effect, project filters, modals, scroll animations, and interactive charts.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypewriter();
    initProjectModals();
    initScrollAnimations();
    initDataDashboard();
    initScrollToTop();
});

// ==========================================
// 1. THEME MANAGER (DARK / LIGHT MODE)
// ==========================================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme');
    
    // Check local storage or system preference
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
        
        // Re-draw dashboard chart with new colors if theme changes
        setTimeout(drawDashboardChart, 100);
    });
}

// ==========================================
// 2. TYPEWRITER EFFECT
// ==========================================
function initTypewriter() {
    const target = document.querySelector('.typewriter-text');
    if (!target) return;

    const phrases = JSON.parse(target.getAttribute('data-phrases') || '[]');
    if (phrases.length === 0) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            target.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end of the phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start effect
    setTimeout(type, 1000);
}



// ==========================================
// 4. PROJECT DETAIL MODALS
// ==========================================
let projectData = {
    'proj-finance': {
        title: 'Personal Finance Management Database',
        duration: '02/2026 - 05/2026',
        role: 'Database Engineer & Developer',
        desc: 'Ứng dụng quản lý tài chính cá nhân dạng E-commerce, giúp người dùng theo dõi nguồn tiền, lập ngân sách và thống kê tiết kiệm hàng tháng.',
        challenges: 'Đảm bảo tính toàn vẹn dữ liệu khi giao dịch xảy ra đồng thời, tối ưu hiệu suất các câu lệnh SQL phức tạp liên quan đến báo cáo tháng.',
        solutions: 'Thiết kế cơ sở dữ liệu chuẩn hóa (3NF), xây dựng các Stored Procedure tối ưu, sử dụng Indexes hợp lý trên bảng giao dịch lớn, áp dụng Transaction Scope trong Entity Framework Code First.',
        results: 'Thời gian tải báo cáo tài chính giảm 40%, giao dịch hoạt động chuẩn xác 100% không xảy ra xung đột dữ liệu.',
        tech: ['C#', 'ASP.NET MVC', 'SQL Server', 'HTML/CSS', 'Entity Framework']
    },
    'proj-fakenews': {
        title: 'Fake News Detection System',
        duration: '02/2026',
        role: 'Data & NLP Analyst (Team size: 2)',
        desc: 'Hệ thống tra cứu thông minh và xác thực độ tin cậy của tin tức dựa trên văn bản pháp luật hiện hành.',
        challenges: 'Dữ liệu văn bản pháp luật tiếng Việt có cấu trúc phức tạp, nhiều từ viết tắt, nhiễu và độ dài lớn gây khó khăn cho việc nhúng (embedding) và truy xuất thông tin.',
        solutions: 'Xây dựng pipeline làm sạch dữ liệu văn bản (tokenizer, stopwords tiếng Việt), triển khai kiến trúc Advanced RAG (Retrieval-Augmented Generation) kết hợp mô hình phân loại tin tức dựa trên học máy (Scikit-Learn).',
        results: 'Hệ thống đạt độ chính xác (Accuracy) khoảng 80% trong việc phân loại phát hiện tin giả và hỗ trợ truy xuất nhanh văn bản pháp luật liên quan để đối chứng.',
        tech: ['Python', 'NLP', 'RAG', 'Scikit-learn', 'Pandas', 'BeautifulSoup']
    },
    'proj-air': {
        title: 'Air Pollution Prediction - CNN-BiLSTM',
        duration: '06/2025 - 03/2026',
        role: 'Data Analyst & Deep Learning Developer (Team size: 2)',
        desc: 'Hệ thống dự báo chỉ số chất lượng không khí (AQI) dựa trên dữ liệu thời gian thực (Time-series data) tại TP. Hồ Chí Minh.',
        challenges: 'Bộ dữ liệu thời tiết bị khuyết thiếu (missing data) khá nhiều do lỗi thiết bị cảm biến, các đặc trưng có mối tương quan phi tuyến tính phức tạp.',
        solutions: 'Áp dụng các kỹ thuật xử lý dữ liệu khuyết nâng cao (KNN Imputation). Phân tích EDA sâu sắc bằng Seaborn/Matplotlib. Xây dựng và tối ưu mô hình kết hợp CNN (trích xuất đặc trưng không gian) và BiLSTM (học các mối quan hệ chuỗi thời gian hai chiều).',
        results: 'Mô hình lai CNN-BiLSTM đạt độ chính xác ấn tượng với hệ số xác định R² đạt 0.98 (98.26%), sai số tuyệt đối trung bình MAE chỉ ở mức 4.79 (vượt trội hơn hẳn so với Simple RNN là 11.41 và MLP là 21.54) và sai số phần trăm tuyệt đối trung bình MAPE chỉ ở mức 5.36%.',
        tech: ['Python', 'Pandas', 'NumPy', 'Deep Learning', 'TensorFlow', 'Seaborn']
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal || !closeBtn) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projId = btn.getAttribute('data-project');
            const data = projectData[projId];
            
            if (data) {
                document.getElementById('modal-title').textContent = data.title;
                document.getElementById('modal-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${data.duration}`;
                document.getElementById('modal-role').innerHTML = `<strong>Vai trò:</strong> ${data.role}`;
                document.getElementById('modal-desc').textContent = data.desc;
                document.getElementById('modal-challenges').textContent = data.challenges;
                document.getElementById('modal-solutions').textContent = data.solutions;
                document.getElementById('modal-results').textContent = data.results;
                
                // Tech badges
                const techContainer = document.getElementById('modal-tech');
                techContainer.innerHTML = '';
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'tech-badge';
                    span.textContent = t;
                    techContainer.appendChild(span);
                });

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scroll
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ==========================================
// 5. SCROLL REVEAL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Specific action if dashboard becomes visible
                    if (entry.target.id === 'analytics-dashboard') {
                        setTimeout(animateDashboard, 300);
                    }
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressIndicator = document.getElementById('scroll-progress');
        if (progressIndicator) {
            progressIndicator.style.width = scrolled + '%';
        }
    });
}

// ==========================================
// 6. INTERACTIVE DATA ANALYST DASHBOARD (CANVAS CHART)
// ==========================================
let dashboardAnimated = false;
let dashboardStats = [
    { label: 'SQL (Truy vấn cơ bản)', value: 60, color: '#3b82f6' },
    { label: 'Python (Xử lý dữ liệu)', value: 50, color: '#8b5cf6' },
    { label: 'Power BI & Excel (Báo cáo)', value: 55, color: '#f59e0b' },
    { label: 'Machine Learning (Cơ bản)', value: 40, color: '#10b981' },
    { label: 'English (Đọc hiểu tài liệu)', value: 65, color: '#ec4899' }
];

function initDataDashboard() {
    const canvas = document.getElementById('analytics-chart');
    if (!canvas) return;

    // Handle high DPI screens
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initial dry draw
    drawDashboardChart(0);
}

function animateDashboard() {
    if (dashboardAnimated) return;
    dashboardAnimated = true;

    let progress = 0;
    const duration = 1000; // 1s
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        drawDashboardChart(easeProgress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function drawDashboardChart(progress = 1) {
    const canvas = document.getElementById('analytics-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.clearRect(0, 0, width, height);

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#e2e8f0' : '#334155';
    const trackColor = isDarkMode ? '#1e293b' : '#f1f5f9';

    // Chart parameters - Stacked Layout
    const chartLeft = 15;
    const chartTop = 15;
    const chartWidth = width - (chartLeft * 2);
    const chartHeight = height - (chartTop * 2);
    const barSpacing = chartHeight / dashboardStats.length;
    const barHeight = 8;

    // Draw Bars and Labels
    dashboardStats.forEach((stat, index) => {
        const itemY = chartTop + (index * barSpacing);
        const textY = itemY + 15;
        const barY = itemY + 26;
        
        const targetWidth = chartWidth * (stat.value / 100);
        const currentWidth = targetWidth * progress;

        // 1. Draw Skill Label (Left aligned)
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(stat.label, chartLeft, textY);

        // 2. Draw Percentage Value (Right aligned)
        ctx.fillStyle = stat.color;
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(stat.value * progress) + '%', chartLeft + chartWidth, textY);

        // 3. Draw Progress Bar Background
        ctx.fillStyle = trackColor;
        ctx.beginPath();
        ctx.roundRect(chartLeft, barY, chartWidth, barHeight, 4);
        ctx.fill();

        // 4. Draw Progress Bar Foreground (Gradient)
        if (currentWidth > 0) {
            const gradient = ctx.createLinearGradient(chartLeft, barY, chartLeft + currentWidth, barY);
            gradient.addColorStop(0, stat.color);
            gradient.addColorStop(1, adjustColorBrightness(stat.color, 40));
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(chartLeft, barY, currentWidth, barHeight, 4);
            ctx.fill();
        }
    });
}

// Utility to make neon-like colors by brightening them
function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = (R < 255) ? R : 255;  
    G = (G < 255) ? G : 255;  
    B = (B < 255) ? B : 255;  

    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}



// ==========================================
// 8. SCROLL TO TOP & HEADER HIGHLIGHT
// ==========================================
function initScrollToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
