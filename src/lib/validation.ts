import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional();
const realDate = (value: string) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};
const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Please enter your name.")
      .max(100, "Please keep your name under 100 characters."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(254),
    phone: optionalText(40).refine(
      (value) =>
        !value ||
        (/^[+\d\s().-]+$/.test(value) &&
          phoneDigits(value).length >= 7 &&
          phoneDigits(value).length <= 15),
      "Please enter a valid phone number.",
    ),
    preferredDate: optionalText(10).refine(
      (value) => !value || realDate(value),
      "Please choose a valid date.",
    ),
    message: optionalText(1500),
    smsConsent: z.boolean().default(false),
    visitType: z.enum(["house", "salon"]),
    area: z.string().trim().max(120).default(""),
    services: z
      .array(
        z
          .object({
            id: z.enum(["haircut", "color", "extensions", "styling"]),
            quantity: z.number().int().min(1).max(20),
          })
          .strict(),
      )
      .max(4)
      .refine(
        (values) =>
          new Set(values.map((value) => value.id)).size === values.length,
        "Please select each service only once.",
      ),
    website: optionalText(200),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.smsConsent &&
      (!value.phone || phoneDigits(value.phone).length < 10)
    ) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "Please add a valid phone number to receive texts, or leave SMS consent unchecked.",
      });
    }
  });

export type ContactInput = z.infer<typeof contactSchema>;
