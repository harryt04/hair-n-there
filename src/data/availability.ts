import type { VisitType } from "@/lib/quote-types";

// Changing availability requires an explicit business decision and server deployment.
// The Subaru illustration is branding, not an offered vehicle-based salon.
export const availability = {
  house: {
    label: "House calls",
    model: "client_home",
    status: "Taking inquiries",
    acceptsAppointments: false,
    message:
      "Tell me about your hair goals and household. I’ll follow up to discuss availability, your visit, and a personal quote.",
  },
  salon: {
    label: "Salon services",
    model: "salon_booth",
    status: "Ask for details",
    acceptsAppointments: false,
    message:
      "Contact me to discuss salon arrangements. We’ll confirm the location, services, and availability together.",
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
export const inquiryNotice =
  "Let’s plan your hair day. Get in touch for availability and a personal quote.";
