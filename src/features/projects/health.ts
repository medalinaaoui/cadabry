export type Health = {label:"Moving"|"Needs attention"|"Blocked"|"Dormant"|"Almost shipped"|"Shipped";reason:string;tone:"blue"|"gold"|"red"|"muted"|"green"};
export function projectHealth(input:{status:string;lastActivity:Date;blocker?:string|null;nextTask?:string|null;openBugs:number;totalFeatures:number;shippedFeatures:number},now=new Date()):Health {
 if(input.status==="SHIPPED")return {label:"Shipped",reason:"Your project is released.",tone:"green"};
 if(input.status==="BLOCKED"||input.blocker?.trim())return {label:"Blocked",reason:input.blocker?.trim()||"Resolve the blocker before continuing.",tone:"red"};
 if(now.getTime()-input.lastActivity.getTime()>14*86400000)return {label:"Dormant",reason:"No activity for more than two weeks. Resume with a focused next step.",tone:"muted"};
 if(input.openBugs>0)return {label:"Needs attention",reason:`${input.openBugs} unresolved bug${input.openBugs===1?"":"s"} to review.`,tone:"gold"};
 if(!input.nextTask?.trim())return {label:"Needs attention",reason:"Choose a next action so returning is effortless.",tone:"gold"};
 if(input.totalFeatures>0&&input.shippedFeatures/input.totalFeatures>=.8)return {label:"Almost shipped",reason:"Most features are shipped. Review the remaining launch checks.",tone:"gold"};
 return {label:"Moving",reason:"Recent activity and a clear next step.",tone:"blue"};
}
