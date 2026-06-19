const fs = require("fs");
const path = require("path");

const dirs = ["app", "components", "design.md"];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // Match any class word containing "shadow" or "drop-shadow"
  // Lookbehind for space or quote
  // Lookahead for space or quote
  const regex = /(?<=[\s"'`])([a-z0-9-:]*(?:shadow|drop-shadow)[-a-zA-Z0-9/\[\]\.]*)(?=[\s"'`])/g;

  let newContent = content.replace(regex, "");
  newContent = newContent.replace(/transition-\[color,box-shadow\]/g, "transition-colors");

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log("Updated: " + filePath);
  }
}

function walk(dir) {
  if (fs.statSync(dir).isDirectory()) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      walk(fullPath);
    }
  } else if (dir.endsWith(".tsx") || dir.endsWith(".ts") || dir.endsWith(".md")) {
    processFile(dir);
  }
}

dirs.forEach(d => {
  if (fs.existsSync(d)) walk(d);
});
console.log("Done");
