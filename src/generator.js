import {
  agentOptions,
  disallowGroupOptions,
  permittedUseOptions,
  prohibitedUseOptions,
  publicPathOptions,
} from "./config";

function normalizeBaseUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "https://example.com";
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
}

function unique(values) {
  return [...new Set(values)];
}

function resolveSitemapUrl(baseUrl, entry) {
  const trimmed = entry.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${baseUrl}${normalizedPath}`;
}

function buildAgentSection(agent, settings) {
  const lines = [`# ${agent.label}`, `User-Agent: ${agent.userAgent}`];

  if (agent.mode === "curated") {
    const selectedPaths = publicPathOptions
      .filter((option) => settings.publicPaths[option.id])
      .filter((option) => agent.allowPathIds.includes(option.id))
      .map((option) => option.label);

    if (selectedPaths.length > 0) {
      selectedPaths.forEach((path) => {
        lines.push(`Allow: ${path}`);
      });
      lines.push("Disallow: /");
    } else {
      lines.push("Disallow: /");
    }
  } else {
    lines.push("Disallow: /");
  }

  return lines.join("\n");
}

export function generateAiTxt(formValues, settings) {
  const baseUrl = normalizeBaseUrl(formValues.siteUrl);
  const companyName = formValues.companyName.trim() || "Your Company";
  const email = formValues.maintainerEmail.trim() || "policy@example.com";
  const version = formValues.version.trim() || "1.0.0";
  const lastUpdated = formValues.lastUpdated.trim() || "2026-03-10";
  const crawlDelay = formValues.crawlDelay.trim() || "5";

  const defaultDisallowLines = unique(
    disallowGroupOptions
      .filter((group) => settings.disallowGroups[group.id])
      .flatMap((group) => group.paths),
  ).map((path) => `Disallow: ${path}`);

  const agentSections = agentOptions
    .filter((agent) => settings.agents[agent.id])
    .map((agent) => buildAgentSection(agent, settings))
    .join("\n\n");

  const sitemapEntries = [
    `${baseUrl}/sitemap.xml`,
    ...formValues.extraSitemaps
      .split(/[\n,]+/)
      .map((entry) => resolveSitemapUrl(baseUrl, entry))
      .filter(Boolean),
  ];

  const permittedLines = permittedUseOptions
    .filter((option) => settings.permittedUses[option.id])
    .map((option) => option.line.replaceAll("{{COMPANY_NAME}}", companyName));

  const prohibitedLines = prohibitedUseOptions
    .filter((option) => settings.prohibitedUses[option.id])
    .map((option) => option.line);

  const documentLines = [
    "# ===========================================================",
    "# ai.txt - AI & Agent Access Policy",
    `# Site    : ${baseUrl}`,
    `# Version : ${version}`,
    `# Updated : ${lastUpdated}`,
    `# Contact : ${email}`,
    "# ===========================================================",
    "# Purpose:",
    "#   This file declares how AI systems (crawlers, agents,",
    "#   training pipelines) may access and use content from",
    `#   ${baseUrl}.`,
    "#   Note: robots.txt always governs crawl rules; this file",
    "#   extends policy intent for AI-specific use cases.",
    "# ===========================================================",
    "",
    "# -----------------------------------------------------------",
    "# SECTION 1 - DEFAULT RULE (catch-all)",
    "# -----------------------------------------------------------",
    "User-Agent: *",
    "Allow: /",
    ...defaultDisallowLines,
    "",
    `Crawl-Delay: ${crawlDelay}`,
    "",
    "# -----------------------------------------------------------",
    "# SECTION 2 - WELL-KNOWN AI CRAWLERS (per-agent overrides)",
    "# -----------------------------------------------------------",
    agentSections || "# No per-agent overrides are enabled.",
    "",
    "# -----------------------------------------------------------",
    "# SECTION 3 - SITEMAP",
    "# -----------------------------------------------------------",
    ...sitemapEntries.map((entry) => `Sitemap: ${entry}`),
    "",
    "# -----------------------------------------------------------",
    "# SECTION 4 - USE POLICY (human-readable)",
    "# -----------------------------------------------------------",
    "",
    "# PERMITTED USES:",
    ...(permittedLines.length > 0
      ? permittedLines.map((line) => `# - ${line}`)
      : ["# - No permitted uses have been declared."]),
    "",
    "# PROHIBITED USES:",
    ...(prohibitedLines.length > 0
      ? prohibitedLines.map((line) => `# - ${line}`)
      : ["# - No prohibited uses have been declared."]),
    "",
    "# ATTRIBUTION:",
    `# When content from ${baseUrl} is surfaced to end users,`,
    `# attribution to "${companyName}" with a link to the source`,
    "# page is strongly recommended.",
    "",
    "# CONTACT FOR LICENSING / EXCEPTIONS:",
    `# ${email}`,
    "# ===========================================================",
  ];

  return documentLines.join("\n");
}
