"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const questions = [
  {
    question: "Are appointments open yet?",
    answer:
      "Not yet. House calls and salon services are coming soon, and special-event locations are reviewed individually. You can send a consultation or interest inquiry now; it does not reserve a time or create a booking.",
  },
  {
    question: "Can I plan haircuts for my whole family?",
    answer:
      "Yes—use the service wish list to explore individual services or one of the family packages. Package prices cover their listed services, and any future house-call convenience fee is added once per household, not once per person. House-call appointments are not currently open.",
  },
  {
    question: "Which areas are part of your house-call plans?",
    answer:
      "HairnThere is based in Suncrest, a neighborhood in Draper, Utah. Planned areas include Draper, Highland, Alpine, and surrounding communities. Specific service locations and availability will be confirmed before appointments are offered.",
  },
  {
    question: "What does a starting price mean?",
    answer:
      "A price marked + is a starting price, not a guaranteed total. Color and extensions may need a personal quote. Extension hair is priced separately, and installation or move-up services marked per row use the number of rows.",
  },
  {
    question: "How do house-call fees and the minimum work?",
    answer:
      "The planned house-call minimum is $60 in services before travel. Travel is a separate convenience fee, added once per household appointment. If your service total is below $60, the planner shows the difference rather than adding a hidden surcharge. Exact travel and consultation arrangements still need confirmation.",
  },
  {
    question: "What about neighborhood haircut days?",
    answer:
      "Several households can share their interest in a neighborhood haircut day. Scheduling and any reduced travel arrangement will be discussed individually. The website does not assume a discount or automatically split a travel fee.",
  },
  {
    question: "Do I have to agree to text messages?",
    answer:
      "No. SMS follow-up is optional and the checkbox starts unchecked. You can send an inquiry without text-message consent and use email instead. The website does not currently send automated calls or texts.",
  },
];
export function FrequentlyAskedQuestions() {
  return (
    <Accordion className="w-full">
      {questions.map(({ question, answer }, index) => (
        <AccordionItem
          key={question}
          value={`question-${index}`}
          className="border-border"
        >
          <AccordionTrigger className="gap-5 py-6 text-sm leading-relaxed font-medium hover:no-underline">
            {question}
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
