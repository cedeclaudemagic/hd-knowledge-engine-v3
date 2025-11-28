#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Trigram mappings (binary patterns read bottom-to-top)
// CORRECTED: Standard I Ching trigram binary patterns
const trigramMap = {
  '111': { name: 'Heaven', chinese: '乾', pinyin: 'Qián' },   // ☰ All yang
  '000': { name: 'Earth', chinese: '坤', pinyin: 'Kūn' },     // ☷ All yin
  '100': { name: 'Thunder', chinese: '震', pinyin: 'Zhèn' },  // ☳ Yang at bottom
  '010': { name: 'Water', chinese: '坎', pinyin: 'Kǎn' },     // ☵ Yang in middle
  '001': { name: 'Mountain', chinese: '艮', pinyin: 'Gèn' },  // ☶ Yang at top
  '011': { name: 'Wind', chinese: '巽', pinyin: 'Xùn' },      // ☴ Yin at bottom
  '101': { name: 'Fire', chinese: '離', pinyin: 'Lí' },       // ☲ Yin in middle
  '110': { name: 'Lake', chinese: '兌', pinyin: 'Duì' }       // ☱ Yin at top
};

// I Ching Chinese names (hexagram number to Chinese)
const chineseNames = {
  1: '乾 (Qián)', 2: '坤 (Kūn)', 3: '屯 (Zhūn)', 4: '蒙 (Méng)',
  5: '需 (Xū)', 6: '訟 (Sòng)', 7: '師 (Shī)', 8: '比 (Bǐ)',
  9: '小畜 (Xiǎo Chù)', 10: '履 (Lǚ)', 11: '泰 (Tài)', 12: '否 (Pǐ)',
  13: '同人 (Tóng Rén)', 14: '大有 (Dà Yǒu)', 15: '謙 (Qiān)', 16: '豫 (Yù)',
  17: '隨 (Suí)', 18: '蠱 (Gǔ)', 19: '臨 (Lín)', 20: '觀 (Guān)',
  21: '噬嗑 (Shì Kè)', 22: '賁 (Bì)', 23: '剝 (Bō)', 24: '復 (Fù)',
  25: '無妄 (Wú Wàng)', 26: '大畜 (Dà Chù)', 27: '頤 (Yí)', 28: '大過 (Dà Guò)',
  29: '坎 (Kǎn)', 30: '離 (Lí)', 31: '咸 (Xián)', 32: '恆 (Héng)',
  33: '遯 (Dùn)', 34: '大壯 (Dà Zhuàng)', 35: '晉 (Jìn)', 36: '明夷 (Míng Yí)',
  37: '家人 (Jiā Rén)', 38: '睽 (Kuí)', 39: '蹇 (Jiǎn)', 40: '解 (Xiè)',
  41: '損 (Sǔn)', 42: '益 (Yì)', 43: '夬 (Guài)', 44: '姤 (Gòu)',
  45: '萃 (Cuì)', 46: '升 (Shēng)', 47: '困 (Kùn)', 48: '井 (Jǐng)',
  49: '革 (Gé)', 50: '鼎 (Dǐng)', 51: '震 (Zhèn)', 52: '艮 (Gèn)',
  53: '漸 (Jiàn)', 54: '歸妹 (Guī Mèi)', 55: '豐 (Fēng)', 56: '旅 (Lǚ)',
  57: '巽 (Xùn)', 58: '兌 (Duì)', 59: '渙 (Huàn)', 60: '節 (Jié)',
  61: '中孚 (Zhōng Fú)', 62: '小過 (Xiǎo Guò)', 63: '既濟 (Jì Jì)', 64: '未濟 (Wèi Jì)'
};

function getTrigramsFromBinary(binary) {
  // Binary stored bottom-to-top: index 0 = Line 1 (bottom)
  const lower = binary.substring(0, 3);  // Lines 1-3 = LOWER trigram
  const upper = binary.substring(3, 6);  // Lines 4-6 = UPPER trigram
  return {
    upper: trigramMap[upper].name,
    lower: trigramMap[lower].name
  };
}

// Extract gate data
const mappings = [];
const gatesDir = path.join(__dirname, '../../data/source/gates');

for (let gateNum = 1; gateNum <= 64; gateNum++) {
  const gateFile = path.join(gatesDir, `gate-${gateNum}.json`);

  try {
    const gateData = JSON.parse(fs.readFileSync(gateFile, 'utf8'));
    const gate = gateData[gateNum.toString()];

    if (!gate) {
      console.error(`Warning: Gate ${gateNum} data not found in file`);
      continue;
    }

    const trigrams = getTrigramsFromBinary(gate.binary);

    mappings.push({
      gateNumber: gateNum,
      lineNumber: null,
      knowledge: {
        ichingName: gate.name,
        chineseName: chineseNames[gateNum],
        hexagramNumber: gateNum,
        trigrams: trigrams
      }
    });
  } catch (error) {
    console.error(`Error processing gate ${gateNum}:`, error.message);
  }
}

// Sort by gate number
mappings.sort((a, b) => a.gateNumber - b.gateNumber);

// Create output structure
const output = {
  systemName: "I Ching Gate Names",
  version: "1.0.0",
  description: "Traditional I Ching hexagram names for the 64 gates",
  completeness: "full",
  dataArchitecture: "gate-level",
  mappings: mappings
};

// Write to file
const outputPath = path.join(__dirname, 'mappings/iching-names-mappings.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✅ Created mappings file with ${mappings.length} gates`);
console.log(`📝 Output: ${outputPath}`);
