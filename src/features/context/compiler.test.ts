import { describe, expect, it } from "vitest";
import { compileContext, type ContextSource } from "./compiler";
const task: ContextSource = {id:"task",kind:"task",title:"Current task",content:"Finish onboarding persistence.",relevant:true};
describe("selective context",()=>{
 it("excludes irrelevant and archived content instead of dumping history",()=>{
  const packet=compileContext({project:"Cadabry",statement:"External brain",sources:[task,{...task,id:"old",kind:"history",content:"UNRELATED",relevant:false},{...task,id:"archive",content:"ARCHIVED",archived:true}]});
  expect(packet.markdown).toContain(task.content);
  expect(packet.markdown).not.toContain("UNRELATED");expect(packet.markdown).not.toContain("ARCHIVED");expect(packet.omitted).toHaveLength(2);
 });
 it("prioritizes current work and never exceeds the bounded packet",()=>{
  const packet=compileContext({project:"Cadabry",statement:"External brain",budget:1500,sources:[{...task,id:"long",kind:"history",content:"x".repeat(3000)},task]});
  expect(packet.characterCount).toBeLessThanOrEqual(1500);expect(packet.included[0].id).toBe("task");expect(packet.omitted[0].reason).toContain("budget");
 });
 it("is deterministic across query order and deduplicates sources",()=>{
  const extra:ContextSource={...task,id:"decision",kind:"decision",title:"Keep Prisma"};
  const a=compileContext({project:"A",statement:"B",sources:[extra,task,task]});
  const b=compileContext({project:"A",statement:"B",sources:[task,extra]});expect(a).toEqual(b);
 });
});
