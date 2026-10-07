// PIRS Smart Priority Calculator

const CATEGORY_POINTS = {
  Electricity: 30,
  Water: 28,
  Sewer: 28,
  "Traffic Lights": 30,
  Roads: 22,
  "Illegal Dumping": 18,
  "Fallen Trees": 20,
  Other: 10,
};

function getSeverityPoints(report) {
  const text = `${report.title || ""} ${report.description || ""}`.toLowerCase();

  const severeWords = [
    "danger",
    "dangerous",
    "accident",
    "fire",
    "injury",
    "injured",
    "death",
    "dead",
    "live wire",
    "electrocution",
    "flood",
    "burst",
    "major",
    "emergency",
    "blocked road",
    "no water",
    "sewage overflow",
  ];

  const moderateWords = [
    "serious",
    "large",
    "severe",
    "broken",
    "leaking",
    "damaged",
    "fallen",
    "not working",
    "blocked",
  ];

  if (severeWords.some((word) => text.includes(word))) {
    return 25;
  }

  if (moderateWords.some((word) => text.includes(word))) {
    return 15;
  }

  return 5;
}

function getEvidencePoints(report) {
  let points = 0;

  // Photo evidence
  if (report.photo_url) {
    points += 15;
  }

  // GPS location
  if (
    report.latitude !== null &&
    report.latitude !== undefined &&
    report.longitude !== null &&
    report.longitude !== undefined
  ) {
    points += 15;
  }

  return points;
}

function getAgePoints(report) {
  if (!report.created_at) {
    return 0;
  }

  const created = new Date(report.created_at);
  const now = new Date();

  const ageInDays = Math.floor(
    (now - created) / (1000 * 60 * 60 * 24)
  );

  if (ageInDays >= 7) {
    return 15;
  }

  if (ageInDays >= 3) {
    return 10;
  }

  if (ageInDays >= 1) {
    return 5;
  }

  return 0;
}

export function calculatePriority(report) {
  const categoryPoints = CATEGORY_POINTS[report.category] || 10;
  const severityPoints = getSeverityPoints(report);
  const evidencePoints = getEvidencePoints(report);
  const agePoints = getAgePoints(report);

  const score = Math.min(
    100,
    categoryPoints +
      severityPoints +
      evidencePoints +
      agePoints
  );

  let level = "Low";

  if (score >= 70) {
    level = "High";
  } else if (score >= 40) {
    level = "Medium";
  }

  return {
    score,
    level,
    breakdown: {
      category: categoryPoints,
      severity: severityPoints,
      evidence: evidencePoints,
      age: agePoints,
    },
  };
}