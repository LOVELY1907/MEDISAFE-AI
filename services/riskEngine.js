function calculateRisk(analysisText) {
  if (!analysisText) {
    return { score: 10, level: "Low" };
  }

  const text = analysisText.toLowerCase();

  const severeKeywords = [
    "severe",
    "fatal",
    "death",
    "bleeding",
    "heart",
    "stroke",
    "liver",
    "kidney",
    "organ failure"
  ];

  const mediumKeywords = [
    "vomiting",
    "diarrhea",
    "infection",
    "allergic",
    "swelling",
    "chest pain"
  ];

  const mildKeywords = [
    "nausea",
    "headache",
    "dizziness",
    "tired",
    "dry mouth"
  ];

  let score = 0;

  severeKeywords.forEach(word => {
    if (text.includes(word)) score += 15;
  });

  mediumKeywords.forEach(word => {
    if (text.includes(word)) score += 8;
  });

  mildKeywords.forEach(word => {
    if (text.includes(word)) score += 4;
  });

  if (score > 100) score = 100;

  let level = "Low";

  if (score > 75) {
    level = "High";
  } else if (score > 25) {
    level = "Medium";
  }

  return { score, level };
}

module.exports = { calculateRisk };