// فئة التطبيق الرئيسية
class ElliottWaveApp {
    constructor() {
        this.cryptoData = [];
        this.currentTab = 'overview';
        this.updateInterval = 5; // دقائق
        this.updateTimer = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCryptoData();
        this.startAutoUpdate();
        this.updateLastUpdateTime();
        this.loadSavedSettings();
    }

    loadSavedSettings() {
        // تحميل الإعدادات المحفوظة
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLanguage = localStorage.getItem('language') || 'ar';
        
        // تطبيق المظهر المحفوظ
        this.setTheme(savedTheme);
        
        // تحديث قوائم الاختيار
        const themeSelect = document.getElementById('themeSelect');
        const languageSelect = document.getElementById('languageSelect');
        
        if (themeSelect) themeSelect.value = savedTheme;
        if (languageSelect) languageSelect.value = savedLanguage;
    }

    setupEventListeners() {
        // التنقل بين التبويبات
        const navTabs = document.querySelectorAll('.nav-tab');
        if (navTabs.length > 0) {
            navTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    this.switchTab(e.target.dataset.tab);
                });
            });
        }

        // الفلاتر
        const waveTypeFilter = document.getElementById('waveTypeFilter');
        if (waveTypeFilter) {
            waveTypeFilter.addEventListener('change', () => {
                this.filterCryptoData();
            });
        }

        const confidenceFilter = document.getElementById('confidenceFilter');
        if (confidenceFilter) {
            confidenceFilter.addEventListener('change', () => {
                this.filterCryptoData();
            });
        }

        // إعدادات التحديث
        const updateInterval = document.getElementById('updateInterval');
        if (updateInterval) {
            updateInterval.addEventListener('change', (e) => {
                this.updateInterval = parseInt(e.target.value);
                this.startAutoUpdate();
            });
        }

        // إعدادات المظهر
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        // إعدادات اللغة
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // Modal
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // إغلاق Modal عند النقر خارجه
        const analysisModal = document.getElementById('analysisModal');
        if (analysisModal) {
            analysisModal.addEventListener('click', (e) => {
                if (e.target.id === 'analysisModal') {
                    this.closeModal();
                }
            });
        }

        // اختيار العملة للرسوم البيانية - لا يتم تحميل الشارت تلقائياً
        const chartSymbol = document.getElementById('chartSymbol');
        if (chartSymbol) {
            chartSymbol.addEventListener('change', (e) => {
                // لا يتم تحميل الشارت تلقائياً، فقط عند الضغط على الزر
                console.log('Selected symbol:', e.target.value);
            });
        }

        const chartTimeframe = document.getElementById('chartTimeframe');
        if (chartTimeframe) {
            chartTimeframe.addEventListener('change', (e) => {
                // لا يتم تحميل الشارت تلقائياً، فقط عند الضغط على الزر
                console.log('Selected timeframe:', e.target.value);
            });
        }

        // مراقبة تغيير تفضيل النظام للمظهر
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery && mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', (e) => {
                const currentTheme = localStorage.getItem('theme');
                if (currentTheme === 'auto') {
                    this.setTheme('auto');
                }
            });
        }
    }

    async loadCryptoData() {
        try {
            this.showLoading(true);
            
            // بيانات وهمية للاختبار
            const mockData = [
                {
                    symbol: 'BTC',
                    currentPrice: 43250.50,
                    priceChange: 2.45,
                    volume: 28475000000,
                    high24h: 43500.00,
                    low24h: 42800.00,
                    lastUpdate: new Date(),
                    elliottWave: {
                        waveType: 'impulse',
                        currentPhase: 'wave-3',
                        peaks: 5,
                        troughs: 4,
                        peaksData: [43000, 43200, 43500, 43300, 43400],
                        troughsData: [42800, 42900, 43100, 43250],
                        fibonacciRatios: { '0.382': 43100, '0.618': 43300 },
                        nextDirection: 'bullish',
                        confidence: 'high',
                                        timestamp: new Date()
                    }
                },
                {
                    symbol: 'ETH',
                    currentPrice: 2650.75,
                    priceChange: -1.20,
                    volume: 15800000000,
                    high24h: 2680.00,
                    low24h: 2620.00,
                        lastUpdate: new Date(),
                    elliottWave: {
                        waveType: 'correction',
                        currentPhase: 'wave-b',
                        peaks: 3,
                        troughs: 2,
                        peaksData: [2680, 2660, 2655],
                        troughsData: [2620, 2640],
                        fibonacciRatios: { '0.382': 2640, '0.618': 2660 },
                        nextDirection: 'bearish',
                        confidence: 'medium',
                        timestamp: new Date()
                    }
                },
                {
                    symbol: 'BNB',
                    currentPrice: 315.25,
                    priceChange: 0.85,
                    volume: 8500000000,
                    high24h: 318.00,
                    low24h: 312.00,
                    lastUpdate: new Date(),
                    elliottWave: {
                        waveType: 'impulse',
                        currentPhase: 'wave-5',
                        peaks: 4,
                        troughs: 3,
                        peaksData: [312, 314, 316, 318],
                        troughsData: [310, 313, 315],
                        fibonacciRatios: { '0.382': 313, '0.618': 316 },
                        nextDirection: 'bullish',
                        confidence: 'high',
                        timestamp: new Date()
                    }
                },
                {
                    symbol: 'ADA',
                    currentPrice: 0.485,
                    priceChange: 3.20,
                    volume: 1200000000,
                    high24h: 0.490,
                    low24h: 0.470,
                    lastUpdate: new Date(),
                    elliottWave: {
                        waveType: 'impulse',
                        currentPhase: 'wave-1',
                        peaks: 2,
                        troughs: 1,
                        peaksData: [0.485, 0.490],
                        troughsData: [0.470],
                        fibonacciRatios: { '0.382': 0.475, '0.618': 0.485 },
                        nextDirection: 'bullish',
                        confidence: 'medium',
                        timestamp: new Date()
                    }
                },
                {
                    symbol: 'XRP',
                    currentPrice: 0.625,
                    priceChange: -0.80,
                    volume: 980000000,
                    high24h: 0.630,
                    low24h: 0.620,
                    lastUpdate: new Date(),
                    elliottWave: {
                        waveType: 'correction',
                        currentPhase: 'wave-c',
                        peaks: 2,
                        troughs: 2,
                        peaksData: [0.630, 0.625],
                        troughsData: [0.620, 0.622],
                        fibonacciRatios: { '0.382': 0.622, '0.618': 0.625 },
                        nextDirection: 'neutral',
                        confidence: 'low',
                        timestamp: new Date()
                    }
                }
            ];
            
            this.cryptoData = mockData;
            this.renderCryptoGrid();
            this.updateMarketSummary();
            this.populateChartSymbols();
            this.showLoading(false);
            this.updateLastUpdateTime();
            
        } catch (error) {
            console.error('Error loading crypto data:', error);
            this.showError('حدث خطأ في تحميل البيانات. سيتم المحاولة مرة أخرى...');
            this.showLoading(false);
        }
    }

    // دالة تحليل موجات إليوت
    analyzeElliottWave(klineData) {
        if (!klineData || klineData.length === 0) {
            console.warn('No kline data provided for Elliott Wave analysis');
            return {
                waveType: 'unknown',
                currentPhase: 'unknown',
                peaks: 0,
                troughs: 0,
                peaksData: [],
                troughsData: [],
                fibonacciRatios: {},
                nextDirection: 'neutral',
                confidence: 'low',
                timestamp: new Date()
            };
        }
        
        const highs = klineData.map(candle => parseFloat(candle[2]));
        const lows = klineData.map(candle => parseFloat(candle[3]));
        const closes = klineData.map(candle => parseFloat(candle[4]));
        
        // التحقق من صحة البيانات
        if (highs.some(h => isNaN(h)) || lows.some(l => isNaN(l)) || closes.some(c => isNaN(c))) {
            console.warn('Invalid data detected in kline data');
            return {
                waveType: 'unknown',
                currentPhase: 'unknown',
                peaks: 0,
                troughs: 0,
                peaksData: [],
                troughsData: [],
                fibonacciRatios: {},
                nextDirection: 'neutral',
                confidence: 'low',
                timestamp: new Date()
            };
        }
        
        // إيجاد القمم والقيعان
        const peaks = this.findPeaks(highs);
        const troughs = this.findTroughs(lows);
        
        console.log('Elliott Wave Analysis Debug:', {
            dataPoints: klineData.length,
            peaksFound: peaks.length,
            troughsFound: troughs.length,
            peaks: peaks,
            troughs: troughs
        });
        
        // تحديد نوع الموجة
        const waveType = this.determineWaveType(peaks, troughs);
        
        // حساب نسب فيبوناتشي
        const fibonacciRatios = this.calculateFibonacciRatios(peaks, troughs);
        
        // تحديد المرحلة الحالية
        const currentPhase = this.identifyCurrentPhase(peaks, troughs, closes);
        
        // التنبؤ بالاتجاه التالي
        const nextDirection = this.predictNextDirection(waveType, currentPhase, fibonacciRatios);
        
        // حساب مستوى الثقة
        const confidence = this.calculateConfidence(peaks, troughs);
        
        return {
            waveType,
            currentPhase,
            peaks: peaks.length,
            troughs: troughs.length,
            peaksData: peaks,
            troughsData: troughs,
            fibonacciRatios,
            nextDirection,
            confidence,
            timestamp: new Date()
        };
    }

    findPeaks(highs) {
        const peaks = [];
        if (!highs || highs.length < 3) {
            console.warn('Insufficient data for peak detection:', highs ? highs.length : 0);
            return peaks;
        }
        
        // تحقق من صحة البيانات
        const validHighs = highs.filter(h => !isNaN(h) && h !== null && h !== undefined);
        if (validHighs.length < 3) {
            console.warn('Insufficient valid data for peak detection:', validHighs.length);
            return peaks;
        }
        
        for (let i = 1; i < validHighs.length - 1; i++) {
            if (validHighs[i] > validHighs[i-1] && validHighs[i] > validHighs[i+1]) {
                peaks.push({ index: i, value: validHighs[i] });
            }
        }
        
        console.log(`Found ${peaks.length} peaks in ${validHighs.length} data points`);
        return peaks;
    }

    findTroughs(lows) {
        const troughs = [];
        if (!lows || lows.length < 3) {
            console.warn('Insufficient data for trough detection:', lows ? lows.length : 0);
            return troughs;
        }
        
        // تحقق من صحة البيانات
        const validLows = lows.filter(l => !isNaN(l) && l !== null && l !== undefined);
        if (validLows.length < 3) {
            console.warn('Insufficient valid data for trough detection:', validLows.length);
            return troughs;
        }
        
        for (let i = 1; i < validLows.length - 1; i++) {
            if (validLows[i] < validLows[i-1] && validLows[i] < validLows[i+1]) {
                troughs.push({ index: i, value: validLows[i] });
            }
        }
        
        console.log(`Found ${troughs.length} troughs in ${validLows.length} data points`);
        return troughs;
    }

    determineWaveType(peaks, troughs) {
        // تحليل أكثر دقة لأنماط موجات إليوت
        const totalWaves = peaks.length + troughs.length;
        
        if (totalWaves < 3) {
            return 'unknown';
        }
        
        // تحليل نمط الموجات
        if (peaks.length >= 3 && troughs.length >= 2) {
            // نمط موجة دفع (5 موجات)
            const peakValues = peaks.map(p => p.value);
            const troughValues = troughs.map(t => t.value);
            
            // التحقق من أن الموجة 3 ليست الأقصر
            if (peakValues.length >= 3) {
                const wave1 = Math.abs(peakValues[0] - (troughValues[0] || peakValues[0]));
                const wave3 = Math.abs(peakValues[1] - (troughValues[1] || peakValues[1]));
                const wave5 = Math.abs(peakValues[2] - (troughValues[2] || peakValues[2]));
                
                if (wave3 > wave1 && wave3 > wave5) {
                    return 'impulse';
                }
            }
            
            return 'impulse';
        } else if (peaks.length >= 2 && troughs.length >= 2) {
            // نمط موجة تصحيح (3 موجات)
            return 'correction';
        } else if (peaks.length >= 3 || troughs.length >= 3) {
            // نمط مثلثي
            return 'triangle';
        }
        
        return 'unknown';
    }

    calculateFibonacciRatios(peaks, troughs) {
        const ratios = {};
        
        if (peaks.length >= 2) {
            const peak1 = peaks[0].value;
            const peak2 = peaks[peaks.length - 1].value;
            const range = Math.abs(peak2 - peak1);
            
            ratios.retracement_38 = peak1 + (range * 0.382);
            ratios.retracement_50 = peak1 + (range * 0.5);
            ratios.retracement_61 = peak1 + (range * 0.618);
        }
        
        return ratios;
    }

    identifyCurrentPhase(peaks, troughs, closes) {
        const currentPrice = closes[closes.length - 1];
        
        if (peaks.length === 0 && troughs.length === 0) {
            return 'accumulation';
        }
        
        const lastPeak = peaks.length > 0 ? peaks[peaks.length - 1].value : 0;
        const lastTrough = troughs.length > 0 ? troughs[troughs.length - 1].value : 0;
        
        if (currentPrice > lastPeak) {
            return 'wave_3';
        } else if (currentPrice < lastTrough) {
            return 'wave_5';
        } else {
            return 'consolidation';
        }
    }

    predictNextDirection(waveType, currentPhase, fibonacciRatios) {
        // تحليل أكثر دقة للاتجاه المتوقع
        if (waveType === 'impulse') {
            if (currentPhase === 'wave_3') {
                return 'bullish';
            } else if (currentPhase === 'wave_5') {
                return 'bearish';
            } else if (currentPhase === 'accumulation') {
                return 'bullish';
            }
        } else if (waveType === 'correction') {
            if (currentPhase === 'consolidation') {
                // تحليل نسب فيبوناتشي للتنبؤ
                if (Object.keys(fibonacciRatios).length > 0) {
                    const retracement38 = fibonacciRatios.retracement_38;
                    const retracement50 = fibonacciRatios.retracement_50;
                    const retracement61 = fibonacciRatios.retracement_61;
                    
                    // إذا كان السعر قريب من مستوى 38.2%، فمن المحتمل أن يرتد للأعلى
                    if (retracement38 && retracement38 > 0) {
                        return 'bullish';
                    }
                }
                return 'neutral';
            }
        } else if (waveType === 'triangle') {
            return 'neutral';
        }
        
        // إذا لم نتمكن من تحديد الاتجاه بوضوح
        return 'neutral';
    }

    calculateConfidence(peaks, troughs) {
        const totalPoints = peaks.length + troughs.length;
        
        // حساب مستوى الثقة بناءً على جودة البيانات
        if (totalPoints >= 8) {
            return 'high';
        } else if (totalPoints >= 5) {
            return 'medium';
        } else if (totalPoints >= 3) {
            return 'low';
        } else {
            return 'very_low';
        }
    }

    renderCryptoGrid() {
        const grid = document.getElementById('cryptoGrid');
        if (!grid) {
            console.warn('Crypto grid element not found');
            return;
        }
        
        grid.innerHTML = '';

        this.cryptoData.forEach(crypto => {
            const card = this.createCryptoCard(crypto);
            grid.appendChild(card);
        });
    }

    createCryptoCard(crypto) {
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.addEventListener('click', () => {
            this.showDetailedAnalysis(crypto);
        });

        const priceChangeClass = crypto.priceChange >= 0 ? 'positive' : 'negative';
        const priceChangeIcon = crypto.priceChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        // التأكد من وجود بيانات التحليل
        const elliottWave = crypto.elliottWave || {
            waveType: 'unknown',
            confidence: 'low',
            nextDirection: 'neutral'
        };
        
        const waveTypeText = this.getWaveTypeText(elliottWave.waveType);
        const confidenceText = this.getConfidenceText(elliottWave.confidence);
        const directionText = this.getDirectionText(elliottWave.nextDirection);

        card.innerHTML = `
            <div class="crypto-header">
                <div class="crypto-symbol">${crypto.symbol}</div>
                <div class="crypto-price">$${this.formatPrice(crypto.currentPrice)}</div>
            </div>
            
            <div class="price-change ${priceChangeClass}">
                <i class="fas ${priceChangeIcon}"></i>
                <span>${crypto.priceChange.toFixed(2)}%</span>
            </div>
            
            <div class="crypto-details">
                <div class="detail-item">
                    <div class="detail-label">الحجم (24س)</div>
                    <div class="detail-value">${this.formatVolume(crypto.volume)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">أعلى (24س)</div>
                    <div class="detail-value">$${this.formatPrice(crypto.high24h)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">أقل (24س)</div>
                    <div class="detail-value">$${this.formatPrice(crypto.low24h)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">آخر تحديث</div>
                    <div class="detail-value">${this.formatTime(crypto.lastUpdate)}</div>
                </div>
            </div>
            
            <div class="elliott-wave-info">
                <div class="wave-type">
                    <span class="wave-type-badge ${elliottWave.waveType}">${waveTypeText}</span>
                    <span class="confidence-badge ${elliottWave.confidence}">
                        <i class="fas fa-shield-alt"></i>
                        ${confidenceText}
                    </span>
                </div>
                <div class="direction-indicator ${this.getDirectionClass(elliottWave.nextDirection)}">
                    <i class="fas ${this.getDirectionIcon(elliottWave.nextDirection)}"></i>
                    <span>${directionText}</span>
                </div>
            </div>
        `;

        return card;
    }

    updateMarketSummary() {
        const totalCoins = this.cryptoData.length;
        const bullishCount = this.cryptoData.filter(crypto => crypto.priceChange > 0).length;
        const bearishCount = this.cryptoData.filter(crypto => crypto.priceChange < 0).length;
        const highConfidenceCount = this.cryptoData.filter(crypto => crypto.elliottWave?.confidence === 'high').length;

        // التحقق من وجود العناصر قبل تحديثها
        const totalCoinsElement = document.getElementById('totalCoins');
        const bullishCountElement = document.getElementById('bullishCount');
        const bearishCountElement = document.getElementById('bearishCount');
        const highConfidenceCountElement = document.getElementById('highConfidenceCount');

        if (totalCoinsElement) totalCoinsElement.textContent = totalCoins;
        if (bullishCountElement) bullishCountElement.textContent = bullishCount;
        if (bearishCountElement) bearishCountElement.textContent = bearishCount;
        if (highConfidenceCountElement) highConfidenceCountElement.textContent = highConfidenceCount;
    }

    filterCryptoData() {
        const waveTypeFilterElement = document.getElementById('waveTypeFilter');
        const confidenceFilterElement = document.getElementById('confidenceFilter');
        
        if (!waveTypeFilterElement || !confidenceFilterElement) {
            console.warn('Filter elements not found');
            return;
        }
        
        const waveTypeFilter = waveTypeFilterElement.value;
        const confidenceFilter = confidenceFilterElement.value;

        let filteredData = this.cryptoData;

        if (waveTypeFilter !== 'all') {
            filteredData = filteredData.filter(crypto => crypto.elliottWave?.waveType === waveTypeFilter);
        }

        if (confidenceFilter !== 'all') {
            filteredData = filteredData.filter(crypto => crypto.elliottWave?.confidence === confidenceFilter);
        }

        this.renderFilteredGrid(filteredData);
    }

    renderFilteredGrid(filteredData) {
        const grid = document.getElementById('cryptoGrid');
        if (!grid) {
            console.warn('Crypto grid element not found');
            return;
        }
        
        grid.innerHTML = '';

        if (filteredData.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>لا توجد نتائج تطابق الفلتر المحدد</p>
                </div>
            `;
            return;
        }

        filteredData.forEach(crypto => {
            const card = this.createCryptoCard(crypto);
            grid.appendChild(card);
        });
    }

    showDetailedAnalysis(crypto) {
        const modal = document.getElementById('analysisModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalTitle || !modalBody) {
            console.warn('Modal elements not found');
            return;
        }

        modalTitle.textContent = `تحليل موجات إليوت - ${crypto.symbol}`;
        
        // التأكد من وجود بيانات التحليل
        if (!crypto.elliottWave) {
            modalBody.innerHTML = `
                <div class="analysis-details">
                    <div class="analysis-section">
                        <h4>
                            <i class="fas fa-exclamation-triangle"></i>
                            خطأ في البيانات
                        </h4>
                        <p>لا توجد بيانات تحليل متاحة لهذه العملة. يرجى المحاولة مرة أخرى.</p>
                    </div>
                </div>
            `;
            modal.classList.add('active');
            return;
        }

        const analysis = crypto.elliottWave;
        const fibonacciRatios = analysis.fibonacciRatios || {};

        modalBody.innerHTML = `
            <div class="analysis-details">
                <div class="analysis-section">
                    <h4>
                        <i class="fas fa-info-circle"></i>
                        معلومات عامة
                    </h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">السعر الحالي:</span>
                            <span class="info-value">$${this.formatPrice(crypto.currentPrice)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">التغير (24س):</span>
                            <span class="info-value ${crypto.priceChange >= 0 ? 'positive' : 'negative'}">
                                ${crypto.priceChange.toFixed(2)}%
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">نوع الموجة:</span>
                            <span class="info-value">${this.getWaveTypeText(analysis.waveType || 'unknown')}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">مستوى الثقة:</span>
                            <span class="info-value">${this.getConfidenceText(analysis.confidence || 'low')}</span>
                        </div>
                    </div>
                </div>

                <div class="analysis-section">
                    <h4>
                        <i class="fas fa-chart-line"></i>
                        تحليل الموجات
                    </h4>
                    <div class="wave-analysis">
                        <div class="wave-item">
                            <span class="wave-label">المرحلة الحالية:</span>
                            <span class="wave-value">${this.getPhaseText(analysis.currentPhase || 'unknown')}</span>
                        </div>
                        <div class="wave-item">
                            <span class="wave-label">الاتجاه المتوقع:</span>
                            <span class="wave-value">${this.getDirectionText(analysis.nextDirection || 'neutral')}</span>
                        </div>
                        <div class="wave-item">
                            <span class="wave-label">عدد القمم:</span>
                            <span class="wave-value">${analysis.peaks || 0}</span>
                        </div>
                        <div class="wave-item">
                            <span class="wave-label">عدد القيعان:</span>
                            <span class="wave-value">${analysis.troughs || 0}</span>
                        </div>
                    </div>
                </div>

                ${Object.keys(fibonacciRatios).length > 0 ? `
                <div class="analysis-section">
                    <h4>
                        <i class="fas fa-percentage"></i>
                        نسب فيبوناتشي
                    </h4>
                    <div class="fibonacci-ratios">
                        ${Object.entries(fibonacciRatios).map(([key, value]) => `
                            <div class="ratio-item">
                                <span class="ratio-label">${this.getFibonacciLabel(key)}:</span>
                                <span class="ratio-value">${typeof value === 'number' ? value.toFixed(4) : value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="analysis-section">
                    <h4>
                        <i class="fas fa-lightbulb"></i>
                        التوصيات
                    </h4>
                    <div class="recommendations">
                        ${this.generateRecommendations(analysis)}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('analysisModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    switchTab(tabName) {
        // إزالة الفئة النشطة من جميع التبويبات
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // إخفاء جميع المحتويات
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // تفعيل التبويب المحدد - التحقق من وجود العناصر
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        if (selectedContent) {
            selectedContent.classList.add('active');
        }

        this.currentTab = tabName;

        // تحميل البيانات المطلوبة للتبويب
        if (tabName === 'charts') {
            this.populateChartSymbols();
        }
    }

    populateChartSymbols() {
        const chartSymbol = document.getElementById('chartSymbol');
        if (!chartSymbol) {
            console.warn('Chart symbol element not found');
            return;
        }
        
        chartSymbol.innerHTML = '<option value="">اختر العملة</option>';
        
        if (this.cryptoData && this.cryptoData.length > 0) {
            this.cryptoData.forEach(crypto => {
                const option = document.createElement('option');
                option.value = crypto.symbol;
                option.textContent = crypto.symbol;
                chartSymbol.appendChild(option);
            });
        }
        
        // ملء قائمة التحليل التفصيلي أيضاً
        const analysisSymbol = document.getElementById('analysisSymbol');
        if (analysisSymbol) {
            analysisSymbol.innerHTML = '<option value="">اختر العملة</option>';
            
            if (this.cryptoData && this.cryptoData.length > 0) {
                this.cryptoData.forEach(crypto => {
                    const option = document.createElement('option');
                    option.value = crypto.symbol;
                    option.textContent = crypto.symbol;
                    analysisSymbol.appendChild(option);
                });
            }
        }
    }

    showSelectedAnalysis() {
        const analysisSymbol = document.getElementById('analysisSymbol');
        const analysisContent = document.getElementById('analysisContent');
        
        if (!analysisSymbol || !analysisContent) {
            console.warn('Analysis elements not found');
            return;
        }
        
        const selectedSymbol = analysisSymbol.value;
        if (!selectedSymbol) {
            this.showError('يرجى اختيار عملة أولاً');
            return;
        }
        
        const crypto = this.cryptoData.find(c => c.symbol === selectedSymbol);
        if (crypto) {
            this.showDetailedAnalysis(crypto);
        } else {
            this.showError('لم يتم العثور على بيانات للعملة المحددة');
        }
    }

    generateMockKlineData(symbol, timeframe) {
        // إنشاء بيانات وهمية للشارت
        const data = [];
        const basePrice = 1000; // سعر أساسي
        const now = Date.now();
        
        for (let i = 0; i < 100; i++) {
            const time = now - (100 - i) * 60 * 60 * 1000; // كل ساعة
            const open = basePrice + Math.random() * 100;
            const high = open + Math.random() * 50;
            const low = open - Math.random() * 50;
            const close = open + (Math.random() - 0.5) * 20;
            const volume = Math.random() * 1000000;
            
            data.push([
                time, // وقت الفتح
                open, // سعر الفتح
                high, // أعلى سعر
                low, // أقل سعر
                close, // سعر الإغلاق
                volume, // الحجم
                time + 3600000, // وقت الإغلاق
                volume * close, // قيمة التداول
                0, // عدد الصفقات
                0, // حجم المشتري
                0, // قيمة المشتري
                0 // تجاهل
            ]);
        }
        
        return data;
    }

    async loadChart(symbol, timeframe = '1h') {
        const chartContainer = document.getElementById('chartContainer');
        if (!chartContainer) {
            console.warn('Chart container element not found');
            return;
        }
        
        // التحقق من وجود عنصر TradingView Widget
        const tradingViewWidget = document.getElementById('tradingview-widget');
        if (!tradingViewWidget) {
            console.warn('TradingView widget element not found');
            chartContainer.innerHTML = `
                <div class="chart-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>عنصر الشارت غير موجود</p>
                </div>
            `;
            return;
        }
        
        // إزالة الشارت السابق إذا كان موجوداً
        if (window.tvWidget && typeof window.tvWidget.remove === 'function') {
            try {
                window.tvWidget.remove();
            } catch (error) {
                console.log('Widget removal failed:', error);
            }
        }
        
        // إعادة إنشاء عنصر tradingview-widget
        if (tradingViewWidget) {
            tradingViewWidget.innerHTML = `
                <div class="chart-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل الرسم البياني...</p>
                </div>
            `;
        }

        try {
            // استخدام TradingView Widget بدلاً من البيانات المباشرة
            console.log('Loading TradingView chart for:', symbol);
            
            // إزالة الشارت السابق إذا كان موجوداً
            if (window.tvWidget) {
                window.tvWidget.remove();
            }
            
            // تحويل الرمز إلى تنسيق TradingView
            const tradingViewSymbol = `BINANCE:${symbol}USDT`;
            
            // إنشاء شارت TradingView جديد
            window.tvWidget = new TradingView.widget({
                "width": "100%",
                "height": 500,
                "symbol": tradingViewSymbol,
                "interval": timeframe,
                "timezone": "Asia/Riyadh",
                "theme": document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
                "style": "1",
                "locale": "ar",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview-widget",
                "studies": [
                    "MASimple@tv-basicstudies",
                    "RSI@tv-basicstudies",
                    "Volume@tv-basicstudies"
                ],
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650"
            });
            
            console.log('TradingView chart loaded successfully');
            
        } catch (error) {
            console.error('Error loading chart:', error);
            chartContainer.innerHTML = `
                <div class="chart-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>حدث خطأ في تحميل الرسم البياني</p>
                </div>
            `;
        }
    }

    startAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        this.updateTimer = setInterval(() => {
            this.loadCryptoData();
        }, this.updateInterval * 60 * 1000);
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA');
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = timeString;
        }
    }

    showLoading(show) {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) {
            console.warn('Loading screen element not found');
            return;
        }
        
        if (show) {
            loadingScreen.style.display = 'flex';
        } else {
            loadingScreen.style.display = 'none';
        }
        this.isLoading = show;
    }

    showError(message) {
        // يمكن إضافة toast notification هنا
        console.error(message);
    }

    setTheme(theme) {
        // إزالة جميع المظاهر السابقة
        document.body.removeAttribute('data-theme');
        document.body.classList.remove('light', 'dark');
        
        // تطبيق المظهر الجديد
        if (theme === 'auto') {
            // استخدام تفضيل النظام
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.body.setAttribute('data-theme', theme);
        }
        
        localStorage.setItem('theme', theme);
    }

    setLanguage(language) {
        // يمكن إضافة تغيير اللغة هنا
        localStorage.setItem('language', language);
    }

    // دوال مساعدة
    formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return price.toFixed(6);
        }
    }

    formatVolume(volume) {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(2) + 'M';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(2) + 'K';
        } else {
            return volume.toFixed(2);
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    }

    getWaveTypeText(waveType) {
        const types = {
            'impulse': 'موجة دفع',
            'correction': 'موجة تصحيح',
            'triangle': 'موجة مثلثية',
            'unknown': 'غير محدد'
        };
        return types[waveType] || waveType;
    }

    getConfidenceText(confidence) {
        const levels = {
            'high': 'عالي',
            'medium': 'متوسط',
            'low': 'منخفض',
            'very_low': 'منخفض جداً'
        };
        return levels[confidence] || confidence;
    }

    getDirectionText(direction) {
        const directions = {
            'bullish': 'صاعد',
            'bearish': 'هابط',
            'neutral': 'محايد'
        };
        return directions[direction] || direction;
    }

    getDirectionClass(direction) {
        return direction === 'bullish' ? 'bullish' : direction === 'bearish' ? 'bearish' : 'neutral';
    }

    getDirectionIcon(direction) {
        return direction === 'bullish' ? 'fa-arrow-up' : direction === 'bearish' ? 'fa-arrow-down' : 'fa-minus';
    }

    getPhaseText(phase) {
        const phases = {
            'wave_3': 'الموجة الثالثة',
            'wave_5': 'الموجة الخامسة',
            'accumulation': 'مرحلة التراكم',
            'consolidation': 'مرحلة التوحيد',
            'unknown': 'غير محدد'
        };
        return phases[phase] || phase;
    }

    getTimeframeText(timeframe) {
        const timeframes = {
            '1h': 'ساعة واحدة',
            '4h': '4 ساعات',
            '1d': 'يوم واحد',
            '1w': 'أسبوع واحد'
        };
        return timeframes[timeframe] || timeframe;
    }

    getFibonacciLabel(key) {
        const labels = {
            'retracement_38': 'ارتداد 38.2%',
            'retracement_50': 'ارتداد 50%',
            'retracement_61': 'ارتداد 61.8%'
        };
        return labels[key] || key;
    }

    generateRecommendations(analysis) {
        let recommendations = [];
        
        // التحقق من وجود البيانات
        if (!analysis) {
            recommendations.push('لا توجد بيانات تحليل كافية - انتظر المزيد من البيانات');
            return recommendations.map(rec => `<div class="recommendation">• ${rec}</div>`).join('');
        }
        
        // توصيات بناءً على مستوى الثقة
        if (analysis.confidence === 'high') {
            recommendations.push('مستوى الثقة عالي - يمكن الاعتماد على التحليل');
        } else if (analysis.confidence === 'very_low') {
            recommendations.push('مستوى الثقة منخفض جداً - لا يُنصح باتخاذ قرارات استثمارية');
        }
        
        // توصيات بناءً على نوع الموجة
        if (analysis.waveType === 'impulse') {
            recommendations.push('نمط موجة دفع واضح - اتبع الاتجاه الرئيسي');
        } else if (analysis.waveType === 'correction') {
            recommendations.push('نمط موجة تصحيح - احترس من الانعكاسات');
        } else if (analysis.waveType === 'triangle') {
            recommendations.push('نمط مثلثي - انتظر كسر النمط');
        } else if (analysis.waveType === 'unknown') {
            recommendations.push('نمط غير محدد - انتظر المزيد من التأكيدات');
        }
        
        // توصيات بناءً على الاتجاه المتوقع
        if (analysis.nextDirection === 'bullish') {
            recommendations.push('الاتجاه المتوقع صاعد - فكر في الشراء');
        } else if (analysis.nextDirection === 'bearish') {
            recommendations.push('الاتجاه المتوقع هابط - فكر في البيع');
        } else if (analysis.nextDirection === 'neutral') {
            recommendations.push('الاتجاه محايد - انتظر إشارات أوضح');
        }
        
        // توصيات بناءً على المرحلة الحالية
        if (analysis.currentPhase === 'wave_3') {
            recommendations.push('في الموجة الثالثة - استمر في الاتجاه الحالي');
        } else if (analysis.currentPhase === 'wave_5') {
            recommendations.push('في الموجة الخامسة - احترس من الانعكاس');
        } else if (analysis.currentPhase === 'accumulation') {
            recommendations.push('في مرحلة التراكم - قد تكون فرصة شراء جيدة');
        } else if (analysis.currentPhase === 'consolidation') {
            recommendations.push('في مرحلة التوحيد - انتظر كسر النطاق');
        }
        
        // إذا لم تكن هناك توصيات محددة
        if (recommendations.length === 0) {
            recommendations.push('انتظر المزيد من التأكيدات قبل اتخاذ القرار');
        }
        
        return recommendations.map(rec => `<div class="recommendation">• ${rec}</div>`).join('');
    }

    // TradingView Integration Functions
    loadTradingViewChart() {
        const symbol = document.getElementById('chartSymbol').value;
        const timeframe = document.getElementById('chartTimeframe').value;
        
        if (!symbol) {
            this.showError('يرجى اختيار عملة أولاً');
            return;
        }
        
        // إزالة الشارت السابق إذا كان موجوداً
        if (window.tvWidget && typeof window.tvWidget.remove === 'function') {
            try {
                window.tvWidget.remove();
            } catch (error) {
                console.log('Widget removal failed:', error);
            }
        }
        
        // إعادة إنشاء عنصر tradingview-widget
        const tradingViewWidget = document.getElementById('tradingview-widget');
        if (tradingViewWidget) {
            tradingViewWidget.innerHTML = `
                <div class="chart-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل الرسم البياني...</p>
                </div>
            `;
        }
        
        // تحويل الرمز إلى تنسيق TradingView
        const tradingViewSymbol = `BINANCE:${symbol}USDT`;
        
        // تأخير قصير لضمان إزالة Widget السابق
        setTimeout(() => {
            // إنشاء شارت TradingView جديد
            window.tvWidget = new TradingView.widget({
                "width": "100%",
                "height": 500,
                "symbol": tradingViewSymbol,
                "interval": timeframe,
                "timezone": "Asia/Riyadh",
                "theme": document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
                "style": "1",
                "locale": "ar",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview-widget",
                "studies": [
                    "MASimple@tv-basicstudies",
                    "RSI@tv-basicstudies",
                    "Volume@tv-basicstudies"
                ],
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650"
            });
            
            console.log('TradingView chart loaded successfully');
        }, 200);
    }

    analyzeElliottWaves() {
        const symbol = document.getElementById('chartSymbol').value;
        const analysisPanel = document.getElementById('elliottAnalysisPanel');
        
        if (!symbol) {
            this.showError('يرجى اختيار عملة أولاً');
            return;
        }
        
        // محاكاة تحليل موجات إليوت
        const analysis = this.performElliottWaveAnalysis(symbol);
        
        analysisPanel.innerHTML = `
            <h4>تحليل موجات إليوت لـ ${symbol}</h4>
            <div class="elliott-analysis">
                <div class="analysis-card">
                    <h5>الموجة الحالية</h5>
                    <span class="wave-indicator wave-${analysis.currentWave.toLowerCase()}">الموجة ${analysis.currentWave}</span>
                    <p>${analysis.currentWaveDescription}</p>
                </div>
                <div class="analysis-card">
                    <h5>نوع النمط</h5>
                    <span class="wave-indicator ${analysis.patternType === 'impulse' ? 'wave-3' : 'wave-a'}">${analysis.patternTypeText}</span>
                    <p>${analysis.patternDescription}</p>
                </div>
                <div class="analysis-card">
                    <h5>الاتجاه المتوقع</h5>
                    <span class="wave-indicator ${analysis.nextDirection === 'bullish' ? 'wave-3' : 'wave-c'}">${analysis.nextDirectionText}</span>
                    <p>${analysis.nextDirectionDescription}</p>
                </div>
                <div class="analysis-card">
                    <h5>مستوى الثقة</h5>
                    <span class="wave-indicator ${analysis.confidence === 'high' ? 'wave-3' : 'wave-2'}">${analysis.confidenceText}</span>
                    <p>${analysis.confidenceDescription}</p>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h5>التوصيات:</h5>
                <ul>
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    performElliottWaveAnalysis(symbol) {
        // محاكاة تحليل موجات إليوت
        const waveTypes = ['1', '2', '3', '4', '5', 'A', 'B', 'C'];
        const patternTypes = ['impulse', 'correction'];
        const directions = ['bullish', 'bearish', 'neutral'];
        const confidenceLevels = ['high', 'medium', 'low'];
        
        const currentWave = waveTypes[Math.floor(Math.random() * waveTypes.length)];
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const nextDirection = directions[Math.floor(Math.random() * directions.length)];
        const confidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
        
        return {
            currentWave: currentWave,
            currentWaveDescription: this.getWaveDescription(currentWave),
            patternType: patternType,
            patternTypeText: patternType === 'impulse' ? 'نمط دفع' : 'نمط تصحيح',
            patternDescription: patternType === 'impulse' ? 'نمط صاعد قوي' : 'نمط تصحيح مؤقت',
            nextDirection: nextDirection,
            nextDirectionText: nextDirection === 'bullish' ? 'صاعد' : nextDirection === 'bearish' ? 'هابط' : 'محايد',
            nextDirectionDescription: this.getDirectionDescription(nextDirection),
            confidence: confidence,
            confidenceText: confidence === 'high' ? 'عالي' : confidence === 'medium' ? 'متوسط' : 'منخفض',
            confidenceDescription: this.getConfidenceDescription(confidence),
            recommendations: this.getRecommendations(currentWave, patternType, nextDirection, confidence)
        };
    }

    getWaveDescription(wave) {
        const descriptions = {
            '1': 'موجة البداية - بداية الاتجاه الجديد',
            '2': 'موجة التصحيح - تراجع مؤقت',
            '3': 'موجة الدفع الرئيسية - الأقوى والأطول',
            '4': 'موجة التصحيح - تراجع قبل الموجة الأخيرة',
            '5': 'موجة النهاية - إتمام النمط',
            'A': 'موجة التصحيح الأولى',
            'B': 'موجة الارتداد المؤقت',
            'C': 'موجة التصحيح النهائية'
        };
        return descriptions[wave] || 'موجة غير محددة';
    }

    getDirectionDescription(direction) {
        const descriptions = {
            'bullish': 'اتجاه صاعد - فرصة شراء جيدة',
            'bearish': 'اتجاه هابط - احترس من البيع',
            'neutral': 'اتجاه محايد - انتظر إشارات أوضح'
        };
        return descriptions[direction] || 'اتجاه غير محدد';
    }

    getConfidenceDescription(confidence) {
        const descriptions = {
            'high': 'مستوى ثقة عالي - يمكن الاعتماد على التحليل',
            'medium': 'مستوى ثقة متوسط - احترس من المخاطر',
            'low': 'مستوى ثقة منخفض - لا يُنصح باتخاذ قرارات'
        };
        return descriptions[confidence] || 'مستوى ثقة غير محدد';
    }

    getRecommendations(wave, pattern, direction, confidence) {
        const recommendations = [];
        
        if (confidence === 'high') {
            recommendations.push('مستوى الثقة عالي - يمكن الاعتماد على التحليل');
        } else if (confidence === 'low') {
            recommendations.push('مستوى الثقة منخفض - انتظر المزيد من التأكيدات');
        }
        
        if (pattern === 'impulse' && ['3', '5'].includes(wave)) {
            recommendations.push('في موجة دفع قوية - استمر في الاتجاه الحالي');
        } else if (pattern === 'correction') {
            recommendations.push('في موجة تصحيح - احترس من الانعكاسات');
        }
        
        if (direction === 'bullish') {
            recommendations.push('الاتجاه المتوقع صاعد - فكر في الشراء');
        } else if (direction === 'bearish') {
            recommendations.push('الاتجاه المتوقع هابط - فكر في البيع');
        }
        
        return recommendations;
    }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.elliottWaveApp = new ElliottWaveApp();
}); 

// دوال عامة للوصول من HTML
function loadTradingViewChart() {
    if (window.elliottWaveApp) {
        window.elliottWaveApp.loadTradingViewChart();
    }
}

function analyzeElliottWaves() {
    if (window.elliottWaveApp) {
        window.elliottWaveApp.analyzeElliottWaves();
    }
}

function showSelectedAnalysis() {
    if (window.elliottWaveApp) {
        window.elliottWaveApp.showSelectedAnalysis();
    }
} 