import type { VisitType } from "@/lib/quote-types";

// Changing availability requires an explicit business decision and server deployment.
// The Subaru illustration is branding, not an offered vehicle-based salon.
export const availability = {
  house: {
    label: "House calls",
    model: "client_home",
    status: "Taking inquiries",
    acceptsAppointments: true,
    message:
      "House-call inquiries are open. Elisabeth or her team will follow up to discuss your visit, pricing, and availability. Your time is confirmed together.",
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
  "House-call inquiries are open. Let’s find a good hair day for you.";
