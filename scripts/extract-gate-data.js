const fs = require("fs");

// Load all data sources
const raData = JSON.parse(fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json", "utf8"));
const ichingData = JSON.parse(fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/knowledge-systems/iching-names/mappings/iching-names-mappings.json", "utf8"));
const hdGates = JSON.parse(fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/knowledge-systems/hd-gates/mappings/hd-gates-mappings.json", "utf8"));
const channels = JSON.parse(fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/knowledge-systems/channels/mappings/channels-mappings.json", "utf8"));

const pos = {
  "Heaven": -4, "Lake": -3, "Fire": -2, "Wind": -1,
  "Thunder": 1, "Water": 2, "Mountain": 3, "Earth": 4
};

// Get gate numbers from command line or default
const gates = process.argv.slice(2).map(Number);
if (gates.length === 0) {
  console.log("Usage: node extract-gate-data.js 17 54 21 48");
  process.exit(1);
}

gates.forEach(gateNum => {
  const iching = ichingData.mappings.find(m => m.gateNumber === gateNum);
  const hdGate = hdGates.mappings.find(m => m.gateNumber === gateNum);
  const raLines = raData.mappings.filter(m => m.gateNumber === gateNum);

  // Find channel
  const channel = channels.mappings.find(m =>
    m.knowledge.gates && m.knowledge.gates.includes(gateNum)
  );

  const inner = iching.knowledge.trigrams.lower;
  const outer = iching.knowledge.trigrams.upper;
  const innerPos = pos[inner];
  const outerPos = pos[outer];

  // Determine gate type
  let gateType;
  if (innerPos === outerPos) gateType = "Standing Wave";
  else if (innerPos < 0 && outerPos > 0) gateType = "Cross-Zero Manifesting";
  else if (innerPos > 0 && outerPos < 0) gateType = "Cross-Zero Dematerialising";
  else if (innerPos > 0 && outerPos > 0) gateType = "Same-Phase Material";
  else gateType = "Same-Phase Void";

  console.log("╔════════════════════════════════════════════════════════════════");
  console.log("║ GATE " + gateNum + ": " + iching.knowledge.ichingName);
  console.log("╠════════════════════════════════════════════════════════════════");
  console.log("║ HD Keyword: " + (hdGate ? hdGate.knowledge.keyword : "N/A"));
  console.log("║ Inner Trigram: " + inner + " (" + innerPos + ")");
  console.log("║ Outer Trigram: " + outer + " (" + outerPos + ")");
  console.log("║ Vector: " + innerPos + " → " + outerPos);
  console.log("║ Amplitude: " + Math.abs(outerPos - innerPos));
  console.log("║ Type: " + gateType);
  if (channel) {
    console.log("║ Channel: " + channel.knowledge.channelNumber + " (" + channel.knowledge.name + ")");
    console.log("║ Partner: Gate " + channel.knowledge.gates.find(g => g !== gateNum));
    console.log("║ Centre: " + (hdGate ? hdGate.knowledge.center : "N/A"));
  }
  console.log("╠════════════════════════════════════════════════════════════════");

  raLines.forEach(line => {
    const k = line.knowledge;
    const exPlanet = k.blackBook.exaltation.planets[0];
    const detPlanet = k.blackBook.detriment.planets[0];

    console.log("║ Line " + line.lineNumber + ": " + k.lineKeynote + " [" + k.polarity + "]");
    if (exPlanet) {
      console.log("║   Exalt (" + exPlanet.planet + "): " + exPlanet.description.whiteBook);
    } else {
      console.log("║   Exalt: NO EXALTATION");
    }
    if (detPlanet) {
      console.log("║   Detri (" + detPlanet.planet + "): " + detPlanet.description.whiteBook);
    } else {
      console.log("║   Detri: NO DETRIMENT");
    }
    console.log("║");
  });

  console.log("╚════════════════════════════════════════════════════════════════\n");
});
