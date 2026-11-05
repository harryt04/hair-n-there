import { redirect } from "next/navigation";

// Old planner links lead to the simple inquiry, without publishing price estimates.
export default function QuotePage() {
  redirect("/contact");
}
