import {expect,it} from "vitest";
import {projectHealth} from "./health";
const now=new Date("2026-09-08T00:00:00Z");
const base={status:"BUILDING",lastActivity:now,nextTask:"Finish authentication",openBugs:0,totalFeatures:10,shippedFeatures:9};
it("explains signals without a fake numerical health score",()=>{expect(projectHealth(base,now).label).toBe("Almost shipped");expect(projectHealth({...base,blocker:"Database unavailable"},now)).toMatchObject({label:"Blocked",reason:"Database unavailable"});});
it("makes abandoned work visible and prioritizes a blocker",()=>{const old={...base,lastActivity:new Date("2026-08-01")};expect(projectHealth(old,now).label).toBe("Dormant");expect(projectHealth({...old,blocker:"Needs credentials"},now).label).toBe("Blocked");});
it("does not call a project healthy without a next action",()=>{expect(projectHealth({...base,nextTask:""},now).label).toBe("Needs attention");});
