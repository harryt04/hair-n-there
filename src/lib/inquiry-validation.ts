import { z } from "zod";

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
export const inquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Please enter your name.")
      .max(100, "Please keep your name under 100 characters."),
    email: z
      .string()
      .trim()
      .max(254)
      .refine(
        (value) => !value || z.email().safeParse(value).success,
        "Please enter a valid email address.",
      )
      .optional(),
    phone: optionalText(40).refine(
      (value) =>
        !value ||
        (/^[+\d\s().-]+$/.test(value) &&
          phoneDigits(value).length >= 10 &&
          phoneDigits(value).length <= 15),
      "Please enter a valid phone number.",
    ),
    preferredDate: optionalText(10).refine(
      (value) => !value || realDate(value),
      "Please choose a valid date.",
    ),
    haircutCount: z
      .number({ error: "Please enter a whole number from 0 to 50." })
      .int("Please enter a whole number.")
      .min(0, "Use zero or more people.")
      .max(50, "For groups over 50, please contact us directly.")
      .optional(),
    colorCount: z
      .number({ error: "Please enter a whole number from 0 to 50." })
      .int("Please enter a whole number.")
      .min(0, "Use zero or more people.")
      .max(50, "For groups over 50, please contact us directly.")
      .optional(),
    preferredTime: z
      .enum(["flexible", "morning", "afternoon", "evening", "specific"])
      .default("flexible"),
    exactTime: optionalText(5).refine(
      (value) => !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
      "Please enter a valid time.",
    ),
    address: optionalText(400),
    message: optionalText(1500),
    smsConsent: z.boolean().default(false),
    phoneContactConsent: z.boolean().default(false),
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
            id: z.string().max(64),
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
            id: z.string().max(64),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .max(5)
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
    if (!value.email && !value.phone) {
      for (const field of ["email", "phone"]) {
        context.addIssue({
          code: "custom",
          path: [field],
          message:
            "Please provide a phone number or email so we can reach you.",
        });
      }
    }
    if (value.phoneContactConsent && !value.phone) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "Please provide a phone number for appointment calls or texts.",
      });
    }
    if (value.preferredTime === "specific" && !value.exactTime) {
      context.addIssue({
        code: "custom",
        path: ["exactTime"],
        message: "Please add a time or choose a flexible time of day.",
      });
    }
    if (
      value.visitType === "house" &&
      (value.intent === "appointment_request" ||
        value.haircutCount !== undefined ||
        value.colorCount !== undefined)
    ) {
      for (const key of ["haircutCount", "colorCount"] as const) {
        if (value[key] === undefined)
          context.addIssue({
            code: "custom",
            path: [key],
            message: "Please enter a number, including zero if none.",
          });
      }
      if (!value.address)
        context.addIssue({
          code: "custom",
          path: ["address"],
          message: "Please add the visit address, including city and ZIP.",
        });
      if (
        value.haircutCount === 0 &&
        value.colorCount === 0 &&
        !value.message &&
        !value.services.length &&
        !value.packages.length
      ) {
        context.addIssue({
          code: "custom",
          path: ["haircutCount"],
          message:
            "Add someone for a cut or color, or tell us about another service in the optional note.",
        });
      }
    }
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
export type InquiryInput = z.infer<typeof inquirySchema>;
