// js/config.js

const STORAGE_KEY_PIECES = 'sheetLayoutCalcPieces_v24_finalShare_bfdh';
const STORAGE_KEY_SETTINGS = 'sheetLayoutCalcSettings_v24_finalShare_bfdh';
const STORAGE_KEY_ID_COUNTER = 'sheetLayoutCalcIdCounter_v24_finalShare_bfdh';
const STORAGE_KEY_HISTORY = 'sheetLayoutCalcHistory_v24_finalShare_bfdh';
const STORAGE_KEY_LANGUAGE = 'sheetLayoutCalcLang_v12_finalShare';
const STORAGE_KEY_CURRENT_UNIT = 'sheetLayoutCalcUnit_v12_finalShare';
const STORAGE_KEY_CUTTING_LIST_CHECKS = 'sheetLayoutCalcCutChecks_v12_finalShare';
const STORAGE_KEY_PROJECTS = 'sheetLayoutCalcProjects_v11_finalShare_bfdh';
const STORAGE_KEY_GRAIN_COLOR = 'sheetLayoutCalculatorGrainColor_v6_finalShare';
const STORAGE_KEY_GRAIN_PATTERN = 'sheetLayoutCalculatorGrainPattern_v2_finalShare';
const STORAGE_KEY_FITTING_STRATEGY = 'sheetLayoutCalculatorFittingStrategy_v6_finalShare';
const STORAGE_KEY_SAVED_OFFCUTS = 'sheetLayoutCalculatorSavedOffcuts_v6_finalShare';
const STORAGE_KEY_OFFCUT_SETTINGS = 'sheetLayoutCalculatorOffcutSettings_v4_finalShare';
const STORAGE_KEY_PROJECT_LOCATION = 'sheetLayoutProjectLocation_v1';
const STORAGE_KEY_PROJECT_NOTES = 'sheetLayoutProjectNotes_v1';

const MAX_HISTORY_STATES = 20;
const BASE_CANVAS_SCALE = 3.0;

// conversionFactorsToCm यहाँ नहीं है, यह utils.js में है और वहीं से एक्सपोर्ट होगा।

export {
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
    // conversionFactorsToCm यहाँ से एक्सपोर्ट नहीं होगा
};
