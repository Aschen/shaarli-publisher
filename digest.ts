import { writeFileSync } from "fs";
import { Link, listLinks } from "./lib/shaarli";

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }

  return value;
}

function getLastSunday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - (dayOfWeek === 0 ? 7 : dayOfWeek));
  lastSunday.setHours(11, 0, 0, 0);
  return lastSunday;
}

function groupLinksByTags(links: Link[]): Record<string, Link[]> {
  const groupedLinks: Record<string, Link[]> = {
    "prompt-engineering": [],
    "assistant-ai": [],
    "retrieval-augmented-generation": [],
    "text-ai": [],
    "image-ai": [],
    "video-ai": [],
    others: [],
  };

  for (const link of links) {
    let isGrouped = false;
    for (const group of Object.keys(groupedLinks)) {
      if (link.tags.includes(group)) {
        groupedLinks[group].push(link);
        isGrouped = true;
        break;
      }
    }
    if (!isGrouped) {
      groupedLinks["others"].push(link);
    }
  }

  return groupedLinks;
}

const links = await listLinks({
  url: getEnv("SHAARLI_URL"),
  secret: getEnv("SHAARLI_SECRET"),
  limit: 30,
  date: getLastSunday(),
});

console.log(`${links.length} links found`);

function processDescription(description: string): string {
  let insidePreBlock = false;
  return description
    .split("\n")
    .map((line) => {
      // Replace triple backticks with <pre> and </pre> tags
      if (line.startsWith("```")) {
        if (insidePreBlock === false) {
          insidePreBlock = true;
          return "<pre>";
        }
        insidePreBlock = false;
        return "</pre>";
      } else {
        if (insidePreBlock) {
          return line;
        }

        return `<p>${line.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank">$1</a>'
        )}</p>`;
      }
    })
    .join("\n");
}
function generateHTMLDigest(groupedLinks: Record<string, Link[]>): string {
  const groupTitles: Record<string, string> = {
    "prompt-engineering": "⚙️ Prompt Engineering",
    "assistant-ai": "🤖 Agents LLM",
    "retrieval-augmented-generation": "🔍 Retrieval-Augmented-Generation",
    "text-ai": "🧠 Large-Language-Models",
    "image-ai": "🎨 Image",
    "video-ai": "🎥 Video",
    others: "📰 Autres",
  };

  let html = "";

  html += '<img src="https://aschen.ovh/banner.png"/>\n';
  html +=
    "<p><i>Retrouvez un résumé de l'actualité Generative AI en français sélectionnée par Olivier Cavadenti et Adrien Maret.</i></p>";
  for (const group in groupedLinks) {
    html += `<h2>${groupTitles[group] || group}</h2>\n`;
    groupedLinks[group].forEach((link) => {
      html += `<b><a href="${link.url}">💡 ${link.title}</a></b>\n`;
      html += processDescription(link.description) + "<hr/>" + "\n";
    });
  }

  html +=
    '<span><i>Generative AI France est une newsletter technique francophone. Retrouvez nous sur <a href="https://gen-ai.fr">https://gen-ai.fr</a></i></span>';

  return html;
}

const htmlDigest = generateHTMLDigest(groupLinksByTags(links));

writeFileSync("./digest.html", htmlDigest);
