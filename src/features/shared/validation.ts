import { z } from "zod";
export const shortText=z.string().trim().max(200);
export const title=shortText.min(1,"Give this a name.");
export const markdown=z.string().max(50000,"Keep each entry under 50,000 characters.");
export const safeUrl=z.string().trim().max(2048).refine(v=>{if(!v)return true;try{const u=new URL(v);return ["https:","http:"].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}},"Use an http or https URL without embedded credentials.");
export type ActionResult={ok:boolean;message:string;fieldErrors?:Record<string,string[]>};
export const initialActionResult:ActionResult={ok:false,message:""};
