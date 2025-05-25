// js/main.js

// config.js से इम्पोर्ट्स
import {
    // main.js की शुरुआत में (परीक्षण के लिए)
(function() {
    const logOutput = document.getElementById('mobileLogOutput');
    if (!logOutput) return; // यदि div मौजूद नहीं है

    const oldLog = console.log;
    console.log = function(...messages) {
        oldLog.apply(console, messages); // मूल कंसोल पर भी लॉग करें
        const messageDiv = document.createElement('div');
        messageDiv.textContent = messages.map(m => {
            try {
                return typeof m === 'object' ? JSON.stringify(m) : String(m);
            } catch (e) {
                return '[Unstringifiable Object]';
            }
        }).join(' ');
        logOutput.appendChild(messageDiv);
        logOutput.scrollTop = logOutput.scrollHeight; // सबसे नीचे स्क्रॉल करें
    };

    const oldError = console.error;
    console.error = function(...messages) {
        oldError.apply(console, messages);
        const messageDiv = document.createElement('div');
        messageDiv.style.color = 'red';
        messageDiv.textContent = "ERROR: " + messages.map(m => typeof m === 'object' ? JSON.stringify(m) : String(m)).join(' ');
        logOutput.appendChild(messageDiv);
        logOutput.scrollTop = logOutput.scrollHeight;
    };
    // इसी तरह console.warn, console.info आदि के लिए भी कर सकते हैं
})();
    STORAGE_KEY_PIECES,
    STORAGE_KEY_SETTINGS,
    STORAGE_KEY_ID_COUNTER,
    STORAGE_KEY_HISTORY,
    STORAGE_KEY_LANGUAGE,
    STORAGE_KEY_CURRENT_UNIT,
    STORAGE_KEY_CUTTING_LIST_CHECKS,
    STORAGE_KEY_PROJECTS,
    STORAGE_KEY_GRAIN_COLOR,
    STORAGE_KEY_GRAIN_PATTERN,
    STORAGE_KEY_FITTING_STRATEGY,
    STORAGE_KEY_SAVED_OFFCUTS,
    STORAGE_KEY_OFFCUT_SETTINGS,
    STORAGE_KEY_PROJECT_LOCATION,
    STORAGE_KEY_PROJECT_NOTES,
    MAX_HISTORY_STATES,
    BASE_CANVAS_SCALE
} from './config.js';

// lang.js से इम्पोर्ट्स
import { langStrings } from './lang.js';

// utils.js से इम्पोर्ट्स
import {
    convertToCm,
    convertFromCm,
    convertFromCmForArea,
    hslToRgb,
    getRandomColor,
    escapeCsvCell,
    exportToCsv,
    conversionFactorsToCm
} from './utils.js';

// === GLOBAL VARIABLES ===
let pieces = [];
let pieceIdCounter = 0;

let modalSheetLengthEl, modalSheetWidthEl, modalSheetHasGrainEl, modalSheetNameEl, modalSheetCostEl, modalKerfWidthEl,
    sheetSettingsModalEl,
    partNameEl, partLengthEl, partWidthEl, partQuantityEl, piecesTableBodyEl,
    resultsSummaryEl, sheetsContainerEl, historyModalEl, historyListEl, jsonMenuEl, sharePdfExcelMenuEl,
    unitSettingsModalEl, currentUnitSelectorEl, unitDisplayElements = [], wastageSectionEl,
    piecesTableSummaryRowEl, totalPiecesInListCountEl, totalWastagePiecesSummaryEl, usefulOffcutsSummaryEl, loadingIndicatorEl,
    addedPiecesSectionEl, mainActionButtonsEl,
    projectManagementModalEl, projectNameInputEl, projectListEl, noProjectsMessageEl,
    projectLocationEl, projectNotesEl,
    modalGrainColorEl, modalGrainPatternEl, fittingStrategySelectorEl, useOffcutsCheckboxEl,
    minOffcutWidthEl, minOffcutLengthEl,
    offcutsLibraryModalEl, offcutsListContainerEl, noOffcutsMessageEl_Modal,
    wastageOverallStatsEl, usefulOffcutsDisplayListContainerEl, otherSmallWastageContainerEl,
    usefulOffcutsListTotalSummaryEl,
    manualOffcutWidthEl, manualOffcutLengthEl, manualOffcutSourceNameEl,
    totalEdgeBandingReportEl, totalEdgeBandingLengthDisplayEl;

let historyStack = [];
let currentLanguage = 'hi';
let currentUnit = 'cm';
let cuttingListCheckboxStates = {};
let savedProjects = [];
let currentGrainColor = 'rgba(0,0,0,0.08)';
let currentGrainPattern = 'fine';
let currentFittingStrategy = 'defaultScore';
let savedOffcuts = [];
let offcutSettings = { minWidth: 10, minLength: 45 };
let currentCalculationOffcuts = [];
let lastGeneratedUsefulOffcuts = [];
let lastGeneratedNonUsefulRects = [];
let currentEdgeSelections = { L1: false, L2: false, W1: false, W2: false };

let lastCalculatedSheetsData = null;
let isLoadedFromHistory = false;
let layoutWorker = null;
let pieceColors = {};
let openDropdownMenuId = null;

// === DOM ELEMENT CACHING ===
function cacheDOMElements() {
    modalSheetLengthEl = document.getElementById('modalSheetLength');
    modalSheetWidthEl = document.getElementById('modalSheetWidth');
    modalSheetHasGrainEl = document.getElementById('modalHasGrainDirection');
    modalSheetNameEl = document.getElementById('modalSheetName');
    modalSheetCostEl = document.getElementById('modalSheetCost');
    modalKerfWidthEl = document.getElementById('modalKerfWidth');
    sheetSettingsModalEl = document.getElementById('sheetSettingsModal');
    partNameEl = document.getElementById('partName');
    partLengthEl = document.getElementById('partLength');
    partWidthEl = document.getElementById('partWidth');
    partQuantityEl = document.getElementById('partQuantity');
    piecesTableBodyEl = document.querySelector('#piecesTable tbody');
    resultsSummaryEl = document.getElementById('resultsSummary');
    sheetsContainerEl = document.getElementById('sheetsContainer');
    historyModalEl = document.getElementById('historyModal');
    historyListEl = document.getElementById('historyList');
    jsonMenuEl = document.getElementById('jsonMenu');
    sharePdfExcelMenuEl = document.getElementById('sharePdfExcelMenu');
    unitSettingsModalEl = document.getElementById('unitSettingsModal');
    currentUnitSelectorEl = document.getElementById('currentUnitSelector');
    unitDisplayElements = Array.from(document.querySelectorAll('.unit-display'));
    wastageSectionEl = document.getElementById('wastageSection');
    projectLocationEl = document.getElementById('projectLocation');
    projectNotesEl = document.getElementById('projectNotes');
    wastageOverallStatsEl = document.getElementById('wastageOverallStats');
    usefulOffcutsSummaryEl = document.getElementById('usefulOffcutsSummary');
    usefulOffcutsDisplayListContainerEl = document.getElementById('usefulOffcutsDisplayListContainer');
    usefulOffcutsListTotalSummaryEl = document.getElementById('usefulOffcutsListTotalSummary');
    otherSmallWastageContainerEl = document.getElementById('otherSmallWastageContainer');
    piecesTableSummaryRowEl = document.getElementById('piecesTableSummaryRow');
    totalPiecesInListCountEl = document.getElementById('totalPiecesInListCount');
    totalWastagePiecesSummaryEl = document.getElementById('totalWastagePiecesSummary');
    loadingIndicatorEl = document.getElementById('loadingIndicator');
    addedPiecesSectionEl = document.getElementById('addedPiecesSection');
    mainActionButtonsEl = document.getElementById('mainActionButtons');
    projectManagementModalEl = document.getElementById('projectManagementModal');
    projectNameInputEl = document.getElementById('projectNameInput');
    projectListEl = document.getElementById('projectList');
    noProjectsMessageEl = document.getElementById('noProjectsMessage');
    modalGrainColorEl = document.getElementById('modalGrainColor');
    modalGrainPatternEl = document.getElementById('modalGrainPattern');
    fittingStrategySelectorEl = document.getElementById('fittingStrategySelector');
    useOffcutsCheckboxEl = document.getElementById('useOffcutsCheckbox');
    minOffcutWidthEl = document.getElementById('minOffcutWidth');
    minOffcutLengthEl = document.getElementById('minOffcutLength');
    offcutsLibraryModalEl = document.getElementById('offcutsLibraryModal');
    offcutsListContainerEl = document.getElementById('offcutsListContainer');
    if (offcutsLibraryModalEl) { // Null check for safety
        noOffcutsMessageEl_Modal = offcutsLibraryModalEl.querySelector('#noOffcutsMessageModal');
    }
    manualOffcutWidthEl = document.getElementById('manualOffcutWidth');
    manualOffcutLengthEl = document.getElementById('manualOffcutLength');
    manualOffcutSourceNameEl = document.getElementById('manualOffcutSourceName');
    totalEdgeBandingReportEl = document.getElementById('totalEdgeBandingReport');
    totalEdgeBandingLengthDisplayEl = document.getElementById('totalEdgeBandingLengthDisplay');
}


// === INITIALIZATION FUNCTION ===
function initializeApp() {
    cacheDOMElements();

    // Set step="any" for number inputs
    if (partWidthEl) partWidthEl.step = "any";
    if (partLengthEl) partLengthEl.step = "any";
    if (modalSheetWidthEl) modalSheetWidthEl.step = "any";
    if (modalSheetLengthEl) modalSheetLengthEl.step = "any";
    if (modalSheetCostEl) modalSheetCostEl.step = "any";
    if (modalKerfWidthEl) modalKerfWidthEl.step = "any";
    if (minOffcutWidthEl) minOffcutWidthEl.step = "any";
    if (minOffcutLengthEl) minOffcutLengthEl.step = "any";

    // Load initial settings from localStorage (부분적으로 구현)
    // पूरी setLanguage और अन्य लोडिंग फ़ंक्शंस को अगले चरणों में लाया जाएगा।
    // अभी के लिए, हम केवल localStorage से कुछ बुनियादी मान लोड करेंगे।

    currentLanguage = localStorage.getItem(STORAGE_KEY_LANGUAGE) || 'hi';
    currentUnit = localStorage.getItem(STORAGE_KEY_CURRENT_UNIT) || 'cm';
    currentGrainColor = localStorage.getItem(STORAGE_KEY_GRAIN_COLOR) || 'rgba(0,0,0,0.08)';
    currentGrainPattern = localStorage.getItem(STORAGE_KEY_GRAIN_PATTERN) || 'fine';
    currentFittingStrategy = localStorage.getItem(STORAGE_KEY_FITTING_STRATEGY) || 'defaultScore';
    
    const offcutSettingsStr = localStorage.getItem(STORAGE_KEY_OFFCUT_SETTINGS);
    if (offcutSettingsStr) {
        try { offcutSettings = JSON.parse(offcutSettingsStr); } catch (e) { /* डिफ़ॉल्ट का उपयोग करें */ }
    }

    if (projectLocationEl) projectLocationEl.value = localStorage.getItem(STORAGE_KEY_PROJECT_LOCATION) || '';
    if (projectNotesEl) projectNotesEl.value = localStorage.getItem(STORAGE_KEY_PROJECT_NOTES) || '';


    // UI में प्रारंभिक मान सेट करें (यह setLanguage और अन्य फ़ंक्शंस में अधिक व्यापक रूप से किया जाएगा)
    if (document.documentElement) document.documentElement.lang = currentLanguage;
    if (currentUnitSelectorEl) currentUnitSelectorEl.value = currentUnit;
    if (modalGrainColorEl) modalGrainColorEl.value = currentGrainColor;
    if (modalGrainPatternEl) modalGrainPatternEl.value = currentGrainPattern;
    if (fittingStrategySelectorEl) fittingStrategySelectorEl.value = currentFittingStrategy;
    
    // शीट सेटिंग्स के लिए डिफ़ॉल्ट मान या localStorage से लोड किए गए मान सेट करें
    const settingsStr = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (settingsStr) {
        try {
            const settings = JSON.parse(settingsStr);
            if(modalSheetWidthEl) modalSheetWidthEl.value = convertFromCm(settings.sheetWidth, currentUnit) || "";
            if(modalSheetLengthEl) modalSheetLengthEl.value = convertFromCm(settings.sheetLength, currentUnit) || "";
            if(modalSheetHasGrainEl) modalSheetHasGrainEl.checked = typeof settings.hasGrain === 'boolean' ? settings.hasGrain : true;
            if(modalSheetNameEl) modalSheetNameEl.value = settings.sheetName || "";
            if (modalSheetCostEl && settings.sheetCost !== undefined && !isNaN(parseFloat(settings.sheetCost))) {
                modalSheetCostEl.value = settings.sheetCost;
            } else if (modalSheetCostEl) {
                modalSheetCostEl.value = '';
            }
            if (modalKerfWidthEl && settings.kerfWidth !== undefined) {
                modalKerfWidthEl.value = convertFromCm(settings.kerfWidth, currentUnit);
            } else if (modalKerfWidthEl) {
                modalKerfWidthEl.value = convertFromCm(0.3, currentUnit); // डिफ़ॉल्ट केरफ़
            }
        } catch (e) {
            console.error("Error parsing settings from localStorage:", e);
            // डिफ़ॉल्ट सेटिंग्स यदि पार्सिंग विफल हो जाती है
            if(modalSheetWidthEl) modalSheetWidthEl.value = convertFromCm(122, currentUnit);
            if(modalSheetLengthEl) modalSheetLengthEl.value = convertFromCm(244, currentUnit);
            if(modalSheetHasGrainEl) modalSheetHasGrainEl.checked = true;
            if(modalKerfWidthEl) modalKerfWidthEl.value = convertFromCm(0.3, currentUnit);
        }
    } else {
        // कोई सेटिंग सेव नहीं है, डिफ़ॉल्ट सेट करें
        if(modalSheetWidthEl) modalSheetWidthEl.value = convertFromCm(122, currentUnit);
        if(modalSheetLengthEl) modalSheetLengthEl.value = convertFromCm(244, currentUnit);
        if(modalSheetHasGrainEl) modalSheetHasGrainEl.checked = true;
        if(modalKerfWidthEl) modalKerfWidthEl.value = convertFromCm(0.3, currentUnit);
        if(modalSheetNameEl) modalSheetNameEl.value = "";
        if(modalSheetCostEl) modalSheetCostEl.value = "";
    }

    if(minOffcutWidthEl) minOffcutWidthEl.value = convertFromCm(offcutSettings.minWidth, currentUnit);
    if(minOffcutLengthEl) minOffcutLengthEl.value = convertFromCm(offcutSettings.minLength, currentUnit);


    // पीस डेटा लोड करें
    const piecesStr = localStorage.getItem(STORAGE_KEY_PIECES);
    if (piecesStr) {
        try {
            pieces = JSON.parse(piecesStr).map(ensureEdgeBandingPropertyInternal); // एक आंतरिक ensureEdgeBandingProperty की आवश्यकता होगी
             pieces.forEach(p => {
                p.allowRotationOnGrainedSheet = p.allowRotationOnGrainedSheet || false;
            });
        } catch (e) { console.error("Error parsing pieces from localStorage:", e); pieces = []; }
    }
    const idCounterStr = localStorage.getItem(STORAGE_KEY_ID_COUNTER);
    pieceIdCounter = idCounterStr ? parseInt(idCounterStr) : 0;
     if (pieces && pieces.length > 0 && pieceIdCounter === 0) { // यदि आईडी काउंटर रीसेट हो गया है
        const maxId = pieces.reduce((max, p) => (typeof p.id === 'number' && p.id > max ? p.id : max), -1);
        pieceIdCounter = maxId >= 0 ? maxId + 1 : pieces.length;
    }


    // TODO: setLanguage() को यहाँ कॉल करें जब वह main.js में आ जाए
    // TODO: renderPiecesTable() को यहाँ कॉल करें जब वह main.js में आ जाए
    // TODO: updateSelectedEdgesDisplay() को यहाँ कॉल करें जब वह main.js में आ जाए
    // TODO: loadSavedOffcuts(), loadProjectsFromStorage(), loadHistoryFromStorage(), loadCuttingListCheckboxStates()
    // TODO: बचे हुए इवेंट लिस्टनर्स जोड़ें

    console.log("initializeApp partially implemented in main.js.");
    console.log("Current unit from storage or default:", currentUnit);
    console.log("Sheet width input value after init:", modalSheetWidthEl ? modalSheetWidthEl.value : 'N/A');

    // यह सुनिश्चित करने के लिए कि यूनिट डिस्प्ले अपडेट हो (setLanguage इसे अधिक व्यापक रूप से करेगा)
    if (unitDisplayElements && unitDisplayElements.length > 0) {
        unitDisplayElements.forEach(el => { if (el) el.textContent = currentUnit; });
    }
    if (resultsSummaryEl) resultsSummaryEl.textContent = getLangStringInternal("totalSheetsDefault"); // एक आंतरिक getLangString की आवश्यकता होगी
    if (wastageSectionEl) wastageSectionEl.style.display = 'none';

}

// ensureEdgeBandingProperty का एक आंतरिक संस्करण (मुख्य एप्लिकेशन लॉजिक से)
// इसे बाद में ठीक से एकीकृत किया जाएगा
function ensureEdgeBandingPropertyInternal(piece) {
    if (typeof piece.edgeBanding === 'undefined') {
        piece.edgeBanding = { L1: false, L2: false, W1: false, W2: false };
    }
    return piece;
}

// getLangString का एक अस्थायी आंतरिक संस्करण
// setLanguage को स्थानांतरित करने के बाद इसे ठीक से एकीकृत किया जाएगा
function getLangStringInternal(key, replacements = {}) {
    let str = (langStrings[currentLanguage] && langStrings[currentLanguage][key]) || `[[${key}]]`;
    for (const placeholder in replacements) {
        str = str.replace(`{${placeholder}}`, replacements[placeholder]);
    }
    return str;
}


// === EVENT LISTENERS AND OTHER FUNCTIONS WILL BE ADDED HERE IN SUBSEQUENT STEPS ===

// DOMContentLoaded इवेंट लिस्टनर
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// कुछ ग्लोबल फंक्शन्स को window ऑब्जेक्ट पर असाइन करें ताकि HTML उन्हें कॉल कर सके
// (यह एक अस्थायी समाधान है, आदर्श रूप से इवेंट लिस्टनर्स का उपयोग किया जाना चाहिए)
// हम इसे बाद में रिफैक्टर करेंगे।
// window.toggleLanguage = toggleLanguage; // जब toggleLanguage यहाँ आ जाए
// window.addPiece = addPiece; // जब addPiece यहाँ आ जाए
// ... आदि ...
