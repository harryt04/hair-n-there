import { services } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { inquirySchema } from "@/lib/inquiry-validation";
import type { z } from "zod";

// Catalog data stays on the server; the public form only needs inquiry validation.
export const contactSchema = inquirySchema.superRefine((value, context) => {
  value.services.forEach((line, index) => {
    if (!services.some((service) => service.id === line.id))
      context.addIssue({
        code: "custom",
        path: ["services", index, "id"],
        message: "Please choose a current service from the menu.",
      });
  });
  value.packages.forEach((line, index) => {
    if (!familyPackages.some((pack) => pack.id === line.id))
      context.addIssue({
        code: "custom",
        path: ["packages", index, "id"],
        message: "Please choose a current family package.",
      });
  });
});
export type ContactInput = z.infer<typeof contactSchema>;
