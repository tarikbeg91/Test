// js/utils.js

function convertToCm(value, fromUnit) {
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    // उदाहरण:
    if (value === "" || value === null || isNaN(parseFloat(value))) return "";
    return parseFloat(value) * conversionFactorsToCm[fromUnit]; // ध्यान दें: conversionFactorsToCm अभी यहाँ परिभाषित नहीं है, इसे बाद में config.js से इम्पोर्ट करेंगे या यहीं रखेंगे
}

function convertFromCm(valueInCm, toUnit) {
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    // उदाहरण:
    if (valueInCm === "" || valueInCm === null || isNaN(parseFloat(valueInCm))) return "";
    let factor = conversionFactorsToCm[toUnit]; // ध्यान दें: conversionFactorsToCm
    if (!factor) factor = 1;
    // ... बाकी का फंक्शन कोड ...
    const result = parseFloat(valueInCm) / factor;
    let dp;

    switch (toUnit) {
        case 'mm': dp = 0; break;
        case 'cm':
            if (result % 1 !== 0) {
                const s = result.toString();
                const decimalPart = s.split('.')[1];
                dp = decimalPart ? Math.min(decimalPart.length, 2) : 0;
                if (dp === 0 && result % 1 !== 0) dp = 1;
            } else {
                dp = 0;
            }
            if (dp === 0 && Math.abs(result - Math.floor(result)) > 1e-5) {
                 if (Math.abs(result * 10 - Math.floor(result * 10)) > 1e-5 && Math.abs(result * 100 - Math.floor(result * 100)) > 1e-5) dp = 2;
                 else if (Math.abs(result * 10 - Math.floor(result * 10)) > 1e-5) dp = 1;
                 else dp = 0;
            }
            break;
        case 'm': dp = 2; break;
        case 'in': case 'ft': dp = 3; break;
        default: dp = 2;
    }

    let numStr = result.toFixed(dp);
    let num = parseFloat(numStr);

    if (toUnit === 'cm' || toUnit === 'm') {
        if (num % 1 === 0) return num;
        else if (dp > 0) {
            let s = num.toString();
            if (s.includes('.') && s.endsWith('0')) {
                s = s.replace(/0+$/, '');
                if (s.endsWith('.')) s = s.slice(0, -1);
                return parseFloat(s);
            }
        }
    }
    return num;
}

function convertFromCmForArea(valueInCm2, toUnitLinear) {
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    if (valueInCm2 === "" || valueInCm2 === null || isNaN(parseFloat(valueInCm2))) return 0; 
    const factorLinear = conversionFactorsToCm[toUnitLinear]; // ध्यान दें: conversionFactorsToCm
    const factorArea = factorLinear * factorLinear; 
    const result = parseFloat(valueInCm2) / factorArea; 
    return parseFloat(result.toFixed(2));
}

function hslToRgb(h, s, l){
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    let r, g, b;
    if(s == 0){ r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => { if(t < 0) t += 1; if(t > 1) t -= 1; if(t < 1/6) return p + (q - p) * 6 * t; if(t < 1/2) return q; if(t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getRandomColor() {
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    const h = Math.floor(Math.random() * 360); 
    const s = 65; // आप इन मानों को अपनी पसंद के अनुसार समायोजित कर सकते हैं
    const l = 70; // आप इन मानों को अपनी पसंद के अनुसार समायोजित कर सकते हैं
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function escapeCsvCell(cellData) {
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    if (cellData === null || cellData === undefined) { return ''; }
    cellData = String(cellData);
    if (cellData.includes(',') || cellData.includes('"') || cellData.includes('\n')) {
        cellData = cellData.replace(/"/g, '""'); // Escape double quotes
        return `"${cellData}"`; // Enclose in double quotes
    }
    return cellData;
}

function exportToCsv(filename, rows) {
    // ... (214.html से पूरा फंक्शन कोड यहाँ पेस्ट करें) ...
    const csvContent = rows.map(row => row.map(escapeCsvCell).join(",")).join("\n");
    const bom = "\uFEFF"; // BOM for UTF-8
    const dataUri = 'data:text/csv;charset=utf-8,' + bom + encodeURIComponent(csvContent);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    linkElement.remove();
}

// महत्वपूर्ण नोट: conversionFactorsToCm यहाँ परिभाषित नहीं है।
// हम इसे config.js से utils.js में इम्पोर्ट करेंगे, या इसे utils.js में ही परिभाषित करेंगे।
// अभी के लिए, हम मान लेते हैं कि यह बाद में उपलब्ध होगा।
// यदि आप चाहें, तो आप `conversionFactorsToCm` ऑब्जेक्ट को 214.html से utils.js में भी अभी के लिए स्थानांतरित कर सकते हैं।
// उदाहरण के लिए, utils.js की शुरुआत में:
const conversionFactorsToCm = { 'cm': 1, 'mm': 0.1, 'm': 100, 'in': 2.54, 'ft': 30.48 };


export { 
    convertToCm, 
    convertFromCm, 
    convertFromCmForArea, 
    hslToRgb, 
    getRandomColor,
    escapeCsvCell,
    exportToCsv,
    conversionFactorsToCm // यदि यहीं परिभाषित किया है तो इसे भी एक्सपोर्ट करें
};
