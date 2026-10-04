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
  const lens = persona.identity.roleLenses;
  const tone = persona.tone;
  const skill = persona.skillLevelDetection;
  const coding = persona.coding;
  const lc = coding.languageConventions;

  const parts: string[] = [
    section(
      persona.languageLock.title,
      [
        `Default: ${persona.languageLock.modes.default}`,
        `Implicit Indonesian: ${persona.languageLock.modes.implicitIndonesian}`,
        `Explicit Indonesian: ${persona.languageLock.modes.explicitIndonesian}`,
        "",
        "Mixing:",
        bulletList(persona.languageLock.mixing),
        "",
        `Never translate: ${persona.languageLock.neverTranslate}`,
      ].join("\n"),
    ),
    "",
    `You are ${persona.identity.name}. ${persona.identity.role} ${persona.identity.mission}`,
    "",
    section(
      "Role lenses",
      [
        lens.rule,
        "",
        `- Engineer: ${lens.engineer}`,
        `- Software Architect: ${lens.softwareArchitect}`,
        `- Data Architect: ${lens.dataArchitect}`,
        `- CTO: ${lens.cto}`,
      ].join("\n"),
    ),
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
      "Tone",
      [
        tone.note,
        `Vibe: ${tone.vibe}`,
        "",
        `Register (Indonesian): ${tone.register.indonesian}`,
        `Register (English): ${tone.register.english}`,
        "",
        `Humor types: ${tone.humor.types.join(", ")}`,
        `Humor frequency: ${tone.humor.frequency}`,
        `Absurd analogies: ${tone.humor.absurdAnalogies}`,
        "Where humor fits:",
        bulletList(tone.humor.where),
        "Never (humor):",
        bulletList(tone.humor.never),
        "",
        `Sarcasm — when: ${tone.sarcasm.when}`,
        `Sarcasm — intensity: ${tone.sarcasm.intensity}`,
        "Roast targets:",
        bulletList(tone.roastTargets),
        "Never target:",
        bulletList(tone.neverTarget),
        `Rule: ${tone.rule}`,
        `Formatting: ${tone.formatting}`,
      ].join("\n"),
    ),
    "",
    section(
      "Serious mode",
      [
        "Triggers:",
        bulletList(persona.seriousMode.trigger),
        "",
        `Behavior: ${persona.seriousMode.behavior}`,
      ].join("\n"),
    ),
    "",
    section(
      "Tools",
      [
        persona.tools.web.rule,
        `Available in THIS request: ${webToolsActive ? "YES — web_search/web_fetch is attached." : "NO — do not claim you opened or browsed URLs."}`,
        `Workflow: ${persona.tools.web.workflow}`,
        "",
        `Repo access: ${persona.tools.repo}`,
        `Links: ${persona.tools.links}`,
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
      "Mentorship",
      [
        persona.mentorship.principle,
        "",
        "Practices:",
        bulletList(persona.mentorship.practices),
        "",
        `Teaching mode (opt-in): ${persona.mentorship.teachingMode}`,
      ].join("\n"),
    ),
    "",
    section(
      "Behavior",
      [
        "When answering:",
        bulletList(persona.behavior.answering),
        "",
        `Ambiguity: ${persona.behavior.ambiguity}`,
        "",
        "Honesty:",
        bulletList(persona.behavior.honesty),
        "",
        `Mistakes: ${persona.behavior.mistakes}`,
      ].join("\n"),
    ),
    "",
    section(
      "Safety",
      [
        "Rules:",
        bulletList(persona.safety.rules),
        "",
        `Controversial topics: ${persona.safety.controversialTopics}`,
      ].join("\n"),
    ),
    "",
    section(
      "Knowledge domains",
      [
        "Primary:",
        bulletList(persona.knowledgeDomains.primary),
        "",
        `Other topics: ${persona.knowledgeDomains.other}`,
      ].join("\n"),
    ),
    "",
    section(
      "Coding",
      [
        "Principles:",
        bulletList(coding.principles),
        "",
        "Decision ladder (before writing new code, stop at the first rung that holds):",
        coding.decisionLadder.note,
        bulletList(coding.decisionLadder.steps),
        coding.decisionLadder.neverSkip,
        "",
        "Bug fixing:",
        bulletList(coding.bugFixing),
        "",
        "Efficiency:",
        bulletList(coding.efficiency),
        "",
        "Output:",
        bulletList(coding.output),
        "",
        "Language conventions:",
        lc.principle,
        `Precedence: ${lc.precedence}`,
        "Comments:",
        bulletList(lc.comments),
        `Team's picks where the community is split: ${lc.teamChoices}`,
      ].join("\n"),
    ),
    "",
    section("Data engineering", bulletList(persona.dataEngineering.principles)),
    "",
    section(
      "Software architecture",
      [
        `When this lens applies: ${persona.softwareArchitecture.when}`,
        "",
        "Approach:",
        bulletList(persona.softwareArchitecture.approach),
        "",
        persona.softwareArchitecture.output,
      ].join("\n"),
    ),
    "",
    section(
      "Data architecture",
      [
        `When this lens applies: ${persona.dataArchitecture.when}`,
        "",
        "Approach:",
        bulletList(persona.dataArchitecture.approach),
      ].join("\n"),
    ),
    "",
    section(
      "Technology leadership",
      [
        `When this lens applies: ${persona.technologyLeadership.when}`,
        "",
        "Approach:",
        bulletList(persona.technologyLeadership.approach),
        "",
        persona.technologyLeadership.honesty,
      ].join("\n"),
    ),
    "",
    section(
      "Research",
      [
        "Principles:",
        bulletList(persona.research.principles),
        "",
        "Source priority (highest to lowest):",
        bulletList(persona.research.sourcePriority),
        `On conflict: ${persona.research.onConflict}`,
        `Citations: ${persona.research.citations}`,
        "",
        "Source handling:",
        bulletList(persona.research.sourceHandling),
      ].join("\n"),
    ),
    "",
    section(
      "Response formatting",
      [
        persona.responseFormatting.principle,
        "",
        `Short answers: ${persona.responseFormatting.short}`,
        "",
        "Long answers:",
        bulletList(persona.responseFormatting.long),
        "",
        `Comparisons: ${persona.responseFormatting.comparison}`,
      ].join("\n"),
    ),
    "",
    section("LANGUAGE REMINDER", persona.languageLock.reminder),
  ];

  return parts.join("\n");
}
