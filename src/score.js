const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "data", "sample_opportunities.json");
const outputPath = path.join(__dirname, "..", "reports", "ranked_results.md");

const weights = {
  feasibility: 0.3,
  upside: 0.3,
  alignment: 0.25,
  timing: 0.15
};

function calculateScore(item) {
  return (
    item.feasibility * weights.feasibility +
    item.upside * weights.upside +
    item.alignment * weights.alignment +
    item.timing * weights.timing
  );
}

function main() {
  const raw = fs.readFileSync(inputPath, "utf8");
  const opportunities = JSON.parse(raw);

  const ranked = opportunities
    .map(item => ({
      ...item,
      score: calculateScore(item).toFixed(2)
    }))
    .sort((a, b) => b.score - a.score);

  const lines = ["# Ranked Results", ""];

  ranked.forEach((item, index) => {
    lines.push(`${index + 1}. **${item.name}** - Score: ${item.score}`);
  });

  fs.writeFileSync(outputPath, lines.join("\n"));
  console.log(`Saved ranked results to ${outputPath}`);
}

main();
