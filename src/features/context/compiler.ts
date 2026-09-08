export type ContextSource = {
  id: string;
  title: string;
  content: string;
  kind: "task" | "architecture" | "decision" | "constraint" | "criteria" | "history" | "issue" | "pack";
  relevant: boolean;
  archived?: boolean;
  priority?: number;
};
export type ContextPacket = {
  markdown: string;
  included: { id: string; title: string; reason: string }[];
  omitted: { id: string; reason: string }[];
  characterCount: number;
};
const rank: Record<ContextSource["kind"], number> = {
  task: 0, criteria: 1, architecture: 2, decision: 3, constraint: 4, issue: 5, pack: 6, history: 7,
};
const instructions = "## Instructions\nInspect existing patterns before implementing. Preserve established decisions. Do not rewrite unrelated systems. Validate input and ownership. Run lint, typecheck and relevant tests. Report what changed, what was verified and what remains.";
/** Deterministic selection, not AI summarization. Never receives auth or secret data. */
export function compileContext(input: {
  project: string;
  statement: string;
  sources: ContextSource[];
  budget?: number;
}): ContextPacket {
  const budget = Math.min(24000, Math.max(1500, input.budget ?? 12000));
  const included: ContextPacket["included"] = [];
  const omitted: ContextPacket["omitted"] = [];
  const heading = `# ${input.project.slice(0, 150)}\n\n${input.statement.slice(0, 700)}\n\n`;
  let body = heading;
  const candidates = [...input.sources].sort((a, b) => rank[a.kind] - rank[b.kind] || (b.priority ?? 0) - (a.priority ?? 0) || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  for (const source of candidates) {
    if (seen.has(source.id)) continue;
    seen.add(source.id);
    const reason = source.archived ? "Archived" : !source.relevant ? "Not relevant to the selected task" : !source.content.trim() ? "Empty" : null;
    if (reason) { omitted.push({id:source.id,reason}); continue; }
    const section = `## ${source.title.slice(0, 160)}\n${source.content.trim()}\n\n`;
    if (body.length + section.length + instructions.length + 100 > budget) {
      omitted.push({id:source.id,reason:"Exceeds selected context budget"});
      continue;
    }
    body += section;
    included.push({id:source.id,title:source.title,reason:`Relevant ${source.kind}`});
  }
  body += instructions;
  if (omitted.length) body += `\n\n_${omitted.length} source(s) omitted. Review the selection before copying._`;
  return {markdown:body,included,omitted,characterCount:body.length};
}
