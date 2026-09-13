import persona from "@/lib/core/persona/minorum_persona.json";

export type SystemPromptOptions = {
  /** True when web_search tools are attached to this chat request. */
  webToolsActive?: boolean;
};

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function section(title: string, body: string): string {
  return `## ${title}\n${body}`;
}

function entries(record: Record<string, string>): string {
  return Object.entries(record)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
}

export function buildSystemPrompt(options: SystemPromptOptions = {}): string {
  const webToolsActive = options.webToolsActive ?? false;
  const lang = persona.communication.language;
  const mix = persona.communication.englishMix;
  const domains = persona.knowledgeDomains;
  const skill = persona.skillLevelDetection;
  const humor = persona.humor;
  const formatting = persona.responseFormatting;
  const tech = persona.technicalCapabilities;

  const webAccessLines = [
    tech.note,
    "",
    `Available in THIS request: ${webToolsActive ? "YES — web_search tool is attached; verify link content before answering." : "NO — do not claim you opened or browsed URLs."}`,
    `Catalog setting: ${tech.webAccess.available} (${tech.webAccess.condition})`,
    "",
    "Behavior:",
    bulletList(tech.webAccess.behavior),
    "",
    `Link output: ${tech.linkOutput.rule}`,
  ];

  const parts: string[] = [
    section(
      "LANGUAGE LOCK (MANDATORY — overrides every other instruction)",
      [
        "Default output language: English.",
        "If the user writes / asks in Indonesian — even just part of the message, not only a technical term — answer in Indonesian.",
        "If the user explicitly asks for an explanation/answer in Indonesian (even if their own message is in English), switch to Indonesian and stay there until the user switches back.",
        "Outside those two conditions, default to answering in English.",
        "Indonesian may only appear as a short word/phrase dropped into an English sentence when it genuinely fits — never replacing a whole paragraph.",
        "Code, paths, error messages, product/AWS service names stay untranslated in either language.",
        lang.priority,
        lang.rule,
      ].join("\n"),
    ),
    "",
    `You are ${persona.identity.name}, ${persona.identity.role}. ${persona.identity.mission}`,
    persona.identity.persona,
    "",
    section("Technical capabilities", webAccessLines.join("\n")),
    "",
    section(
      "Personality",
      [
        "Core traits:",
        bulletList(persona.personality.core),
        "",
        "Principles:",
        bulletList(persona.personality.principles),
      ].join("\n"),
    ),
    "",
    section(
      "Communication",
      [
        `Language priority: ${lang.priority}`,
        `Rule: ${lang.rule}`,
        "",
        "Exceptions:",
        bulletList(lang.exceptions),
        "",
        "Anti-patterns:",
        bulletList(lang.antiPattern),
        "",
        "Tone:",
        bulletList(persona.communication.tone),
        "",
        "English mix:",
        `- Enabled: ${mix.enabled ? "yes" : "no"}`,
        `- Style: ${mix.style}`,
        `- Placement: ${mix.placement}`,
        `- Avoid: ${mix.avoid}`,
      ].join("\n"),
    ),
    "",
    section(
      "Knowledge domains",
      [
        domains.scope,
        domains.principle,
        "",
        "Domain adaptation:",
        entries(domains.domainAdaptation),
      ].join("\n"),
    ),
    "",
    section(
      "Skill level detection",
      [
        "Signals:",
        bulletList(skill.signals),
        "",
        "Behavior by level:",
        entries(skill.behavior),
      ].join("\n"),
    ),
    "",
    section(
      "Source handling",
      [
        persona.sourceHandling.principle,
        "",
        "Rules:",
        bulletList(persona.sourceHandling.rules),
      ].join("\n"),
    ),
    "",
    section(
      "Humor",
      [
        `Types: ${humor.types.join(", ")}`,
        `Frequency: ${humor.frequency}`,
        `Rule: ${humor.rule}`,
        "",
        "Triggers:",
        bulletList(humor.triggers),
        "",
        "Never trigger:",
        bulletList(humor.neverTrigger),
      ].join("\n"),
    ),
    "",
    section(
      "Sarcasm",
      [
        `Enabled: ${persona.sarcasm.enabled ? "yes" : "no"}`,
        `Condition: ${persona.sarcasm.condition}`,
        "",
        "Rules:",
        bulletList(persona.sarcasm.rules),
      ].join("\n"),
    ),
    "",
    section(
      "Roasting",
      [
        persona.roasting.style,
        "",
        "Target (OK to roast):",
        bulletList(persona.roasting.target),
        "",
        "Never target:",
        bulletList(persona.roasting.neverTarget),
      ].join("\n"),
    ),
    "",
    section(
      "Safety",
      [
        "Refusals:",
        bulletList(persona.safety.refusals),
        "",
        "Controversial topics:",
        bulletList(persona.safety.controversialTopics),
      ].join("\n"),
    ),
    "",
    section(
      "Behavior",
      [
        "When answering:",
        bulletList(persona.behavior.answering),
        "",
        "When ambiguous:",
        bulletList(persona.behavior.ambiguity),
        "",
        "Honesty:",
        bulletList(persona.behavior.honesty),
        "",
        "Mistakes:",
        bulletList(persona.behavior.mistakes),
      ].join("\n"),
    ),
    "",
    section(
      "Serious mode",
      [
        "Triggers:",
        bulletList(persona.seriousMode.trigger),
        "",
        "Behavior:",
        bulletList(persona.seriousMode.behavior),
      ].join("\n"),
    ),
    "",
    section(
      "Coding",
      [
        persona.coding.note,
        "",
        "Principles:",
        bulletList(persona.coding.principles),
        "",
        "Decision ladder (before writing new code, stop at the first rung that holds):",
        persona.coding.decisionLadder.note,
        bulletList(persona.coding.decisionLadder.steps),
        persona.coding.decisionLadder.neverSkip,
        "",
        "Output anti-patterns (MANDATORY — do not do these regardless of what feels natural to complete):",
        bulletList(persona.coding.outputAntiPattern),
        "",
        "When a bug is found:",
        bulletList(persona.coding.whenBugFound),
        "",
        `Skill adaptation: ${persona.coding.skillAdaptation}`,
      ].join("\n"),
    ),
    "",
    section(
      "Research",
      [
        persona.research.note,
        "",
        "Principles:",
        bulletList(persona.research.principles),
        "",
        `Citations: ${persona.research.citations.rule}`,
        `No tool available: ${persona.research.citations.noToolAvailable}`,
        "",
        "Source priority (highest to lowest):",
        bulletList(persona.research.sourcePriority.order),
        `On conflict: ${persona.research.sourcePriority.onConflict}`,
        "",
        "When asked to research:",
        bulletList(persona.research.whenAsked),
      ].join("\n"),
    ),
    "",
    section(
      "Response formatting",
      [
        formatting.principle,
        "",
        "Short answers:",
        `- Trigger: ${formatting.shortAnswers.trigger}`,
        `- Rule: ${formatting.shortAnswers.rule}`,
        "",
        "Long answers:",
        `- Trigger: ${formatting.longAnswers.trigger}`,
        bulletList(formatting.longAnswers.rules),
        "",
        `Code: ${formatting.code.rule}`,
        "",
        "Comparison formatting:",
        `- Trigger: ${formatting.comparisonFormatting.trigger}`,
        `- Rule: ${formatting.comparisonFormatting.rule}`,
        bulletList(formatting.comparisonFormatting.structure),
        `- Exception: ${formatting.comparisonFormatting.exception}`,
        "",
        "Humor exceptions:",
        bulletList(formatting.humorExceptions),
      ].join("\n"),
    ),
    "",
    section(
      "LANGUAGE REMINDER",
      "Before answering: default to English. Switch to Indonesian if the user writes in Indonesian, or explicitly asks for it.",
    ),
  ];

  return parts.join("\n");
}

/** Default system prompt (no web tools). */
export const systemPrompt = buildSystemPrompt();

export const personaMeta = {
  name: persona.name,
  description: persona.description,
  version: persona.version,
} as const;
