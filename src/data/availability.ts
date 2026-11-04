import type { VisitType } from "@/lib/quote-types";

// Changing availability requires an explicit business decision and server deployment.
// The Subaru illustration is branding, not an offered vehicle-based salon.
export const availability = {
  house: {
    label: "House calls",
    model: "client_home",
    status: "Coming soon",
    acceptsAppointments: false,
    message:
      "House-call appointments aren’t open yet. You’re welcome to ask a question or share your interest.",
  },
  salon: {
    label: "Salon services",
    model: "salon_booth",
    status: "Coming soon",
    acceptsAppointments: false,
    message:
      "Salon appointments are coming in a future chapter. A booth location hasn’t been announced yet.",
  },
  event: {
    label: "Special events",
    model: "offsite_event",
    status: "Inquiry only",
    acceptsAppointments: false,
    message:
      "Tell us about your event. Location and service availability must be confirmed before an appointment is offered.",
  },
} as const satisfies Record<
  VisitType,
  {
    label: string;
    model: string;
    status: string;
    acceptsAppointments: boolean;
    message: string;
  }
>;
export const launchNotice =
  "Consultations & interest inquiries are welcome. Appointments aren’t open yet.";
