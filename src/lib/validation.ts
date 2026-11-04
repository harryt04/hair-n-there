import { z } from "zod";
import { services } from "@/data/services";
import { familyPackages } from "@/data/packages";

const optionalText = (max: number) => z.string().trim().max(max).optional();
const phoneDigits = (value: string) => value.replace(/\D/g, "");
const realDate = (value: string) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};
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
    visitType: z.enum(["house", "salon", "event"]),
    intent: z
      .enum(["consultation", "interest", "appointment_request"])
      .default("interest"),
    topic: z.enum(["general", "neighborhood"]).default("general"),
    neighborhoodHouseholds: z.number().int().min(1).max(100).optional(),
    area: z.string().trim().max(120).default(""),
    services: z
      .array(
        z
          .object({
            id: z
              .string()
              .max(64)
              .refine(
                (id) => services.some((service) => service.id === id),
                "Please choose a current service from the menu.",
              ),
            quantity: z.number().int().min(1).max(20),
            member: optionalText(40),
          })
          .strict(),
      )
      .max(60)
      .refine(
        (values) =>
          new Set(values.map((value) => `${value.id}:${value.member || ""}`))
            .size === values.length,
        "Please combine duplicate services for the same person.",
      ),
    packages: z
      .array(
        z
          .object({
            id: z
              .string()
              .max(64)
              .refine(
                (id) => familyPackages.some((pack) => pack.id === id),
                "Please choose a current family package.",
              ),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .max(3)
      .refine(
        (values) =>
          new Set(values.map((value) => value.id)).size === values.length,
        "Please select each package only once.",
      )
      .default([]),
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
