import { z } from "zod";
import { title,markdown,safeUrl } from "@/features/shared/validation";
export const projectStatuses=["IDEA","PLANNING","BUILDING","BLOCKED","PAUSED","SHIPPED","ARCHIVED"] as const;
export const projectSchema=z.object({
 name:title,description:z.string().trim().max(300),detailedDescription:markdown.default(""),
 productStatement:markdown.default(""),problem:markdown.default(""),targetUser:markdown.default(""),desiredOutcome:markdown.default(""),valueProposition:markdown.default(""),
 status:z.enum(projectStatuses).default("IDEA"),projectType:z.string().max(100).default("Web application"),
 color:z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#497fe3"),icon:z.string().max(20).default("✦"),
 repositoryUrl:safeUrl.default(""),productionUrl:safeUrl.default(""),stagingUrl:safeUrl.default(""),localPath:z.string().max(1000).default(""),
 currentMilestone:z.string().max(300).default(""),whatWorks:markdown.default(""),partiallyBuilt:markdown.default(""),whatBroken:markdown.default(""),blocker:markdown.default(""),currentTask:markdown.default(""),nextTask:markdown.default(""),importance:z.coerce.number().int().min(1).max(5).default(3),
});
