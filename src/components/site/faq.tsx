"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "Can we book haircuts for the whole family?",
    answer:
      "Absolutely—start with the number of haircuts you have in mind. Share any details about your group in the inquiry, and Elisabeth can work through the timing and individual services with you.",
  },
  {
    question: "Where do you travel for house calls?",
    answer:
      "HairnThere starts in SunCrest and serves surrounding communities by arrangement. Include your city or neighborhood in the inquiry so Elisabeth can confirm travel availability and any convenience fee before you book.",
  },
  {
    question: "Can I request color or extensions?",
    answer:
      "Yes. These services start with a consultation so Elisabeth can understand your hair, your goals, and the time involved. Select the services you’re interested in and share your ideas in the contact form.",
  },
  {
    question: "Does sending an inquiry book my appointment?",
    answer:
      "Sending an inquiry starts a conversation. Elisabeth will confirm services, availability, location, and final pricing with you before an appointment is booked.",
  },
  {
    question: "Do I have to agree to text messages?",
    answer:
      "No. SMS follow-up is completely optional. You can submit your inquiry with the text-message checkbox unchecked and use email instead.",
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
