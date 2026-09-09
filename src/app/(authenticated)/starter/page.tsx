import { redirect } from "next/navigation";

export const metadata = { title: "New project" };

export default async function StarterPromptBuilder() {
  redirect("/projects/new");
}
