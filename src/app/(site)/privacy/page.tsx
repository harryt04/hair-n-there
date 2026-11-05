import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyContact,
  PolicyLayout,
  PolicySection,
} from "@/components/legal/policy-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HairnThere handles appointment inquiries, optional SMS consent, website analytics, and your privacy choices.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Good hair starts with trust. Here is how we handle your information when you visit HairnThere or ask about an appointment."
      otherHref="/terms"
      otherLabel="Terms of Service"
    >
      <PolicySection title="Who we are">
        <p>
          HairnThere is Elisabeth’s developing hair-service brand in Suncrest,
          Draper, Utah. Current forms collect consultation and interest
          inquiries, not appointment requests. This policy applies to
          information collected through the HairnThere website and appointment
          inquiry form.
        </p>
      </PolicySection>
      <PolicySection title="Information you choose to share">
        <p>
          When you send an inquiry, we collect your name and email address,
          together with the details you provide about your appointment type,
          services, quantities, family packages, generic person labels, and city
          or neighborhood. You may also provide a phone number and a message.
          Neighborhood-day inquiries can include an estimated number of
          interested households. Please use generic labels for family members
          rather than children’s full names or dates of birth.
        </p>
        <p>
          We record whether you chose to receive inquiry and appointment texts,
          the submission time, and the version and source of the consent
          disclosure. Please do not send payment-card information, passwords,
          health records, or other sensitive information through the form.
        </p>
      </PolicySection>
      <PolicySection title="How we use your information">
        <p>
          We use inquiry information to respond to you, discuss your requested
          services, confirm pricing and availability, and coordinate an future
          plans. Appointments are not open and no inquiry creates a reservation.
          If you opt in, we may also use your number for related text-message
          follow-up when our messaging service is activated.
        </p>
        <p>
          Our form does not enroll you in a newsletter or authorize unrelated
          marketing emails, promotional texts, or automated marketing calls. We
          do not sell your personal information.
        </p>
      </PolicySection>
      <PolicySection title="Optional text messages">
        <p>
          SMS consent is separate and optional. You can submit the form without
          agreeing to receive texts, and consent is not a condition of purchase
          or booking. Inquiry and appointment message frequency varies; message
          and data rates may apply.
        </p>
        <p>
          When messaging is active, reply STOP to stop texts or HELP for
          assistance. You can also withdraw consent or request help through{" "}
          <PolicyContact />. Our{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          include the messaging program terms.
        </p>
        <p>
          Mobile information, SMS opt-in data, and consent are not sold or
          shared with third parties or affiliates for their marketing or
          promotional purposes. We may provide the information necessary to
          service providers that deliver messages or support your inquiry on our
          behalf.
        </p>
        <p>
          Automated calling and texting are not currently activated through this
          website. Before enabling an AI-assisted response or phone service, we
          will configure the service, its consent and opt-out handling, and any
          required registration. The policy will be updated to reflect material
          changes in how information is used.
        </p>
      </PolicySection>
      <PolicySection title="Inquiry delivery and service providers">
        <p>
          Submitted inquiries are sent to a private Discord destination used to
          manage HairnThere inquiries. The notification includes the information
          you submitted, service selections, any calculated estimate, and
          consent details. Complete inquiry details are included in a text
          attachment with the notification; the service list shown in the
          preview can be shortened. Discord and the people authorized to manage
          that destination process the information to support your inquiry.
        </p>
        <p>
          Vercel hosts the website and runs the contact endpoint. Hosting and
          security services may process technical information such as network
          addresses and request details to deliver and protect the website.
          Where a shared rate-limiting service is configured, a hashed
          network-address identifier and short-lived request counts are used to
          limit abuse.
        </p>
        <p>
          We share information with service providers only as needed to operate
          the website and respond to inquiries. If an email, messaging,
          telephony, or AI service is introduced, relevant information may be
          processed by that provider to support the requested communication. We
          may also disclose information where required by law or to protect
          legal rights and prevent abuse.
        </p>
      </PolicySection>
      <PolicySection title="Travel planning">
        <p>
          Current inquiries ask only for a city or neighborhood, not a street
          address. Published travel bands and the drive-time example are
          informational. No live address lookup or routing service is currently
          used, and example driving minutes are not treated as a verified travel
          fee.
        </p>
        <p>
          If address-based estimates are introduced, this policy will describe
          the routing provider and the location information it receives before
          that feature is activated.
        </p>
      </PolicySection>
      <PolicySection title="Website analytics and performance">
        <p>
          The website includes Vercel Web Analytics and Speed Insights to
          understand page visits and website performance when those services are
          enabled. These tools can collect page or route information,
          approximate visitor location, browser and device characteristics,
          referral information, and performance measurements.
        </p>
        <p>
          We do not intentionally send inquiry text, names, contact details,
          exact addresses, or SMS consent records to analytics. Optional
          conversion events describe broad actions, such as beginning an
          inquiry, rather than the contents of a message.
        </p>
        <p>
          External websites, including Instagram, have their own privacy
          practices. Following a link to another site is subject to that site’s
          policies.
        </p>
      </PolicySection>
      <PolicySection title="Browser preferences and home-screen installation">
        <p>
          The decorative mountain banner is chosen randomly on each full page
          load, including refresh. It stays consistent during navigation within
          that page session. This choice is kept only in memory, is not stored
          in browser storage, and is not sent to analytics or used for retention
          testing.
        </p>
        <p>
          You can install HairnThere on a supported device. A service worker
          stores a public offline information page in your browser. It does not
          store inquiry contents or payment information, queue submissions, or
          send notifications. Current services and inquiries require an internet
          connection.
        </p>
        <p>
          If you dismiss the installation suggestion, a preference is stored for
          the current browser tab session. You can clear this preference and the
          offline page through your browser’s site-data settings. Installation
          and removal are managed by your browser or device.
        </p>
      </PolicySection>
      <PolicySection title="Retention and security">
        <p>
          We keep inquiry and related communication records as needed to
          respond, support appointments, maintain consent or opt-out records,
          resolve disputes, and meet applicable obligations. We review records
          for removal when they are no longer needed. Service providers may also
          retain information under their own policies and service arrangements.
        </p>
        <p>
          We use reasonable safeguards and restrict access to inquiry
          information. No website, communication channel, or storage system can
          guarantee absolute security. If the form cannot confirm delivery, it
          will display an error rather than claim the inquiry was received.
        </p>
      </PolicySection>
      <PolicySection title="Your choices and requests">
        <p>
          You may request access to, correction of, or deletion of your inquiry
          information through <PolicyContact />. We may need to verify your
          identity and may retain information necessary for legal obligations,
          security, or consent and opt-out records.
        </p>
        <p>
          You can decline optional fields and SMS consent. If you withdraw
          messaging consent, we may still respond by another permitted contact
          method about an inquiry you initiated.
        </p>
      </PolicySection>
      <PolicySection title="Children and family appointments">
        <p>
          The website is intended for adults arranging appointments, including
          parents or guardians organizing family haircuts. It is not directed at
          children under 13, and we do not knowingly collect their personal
          information directly. If you believe a child has provided information,
          contact us so we can address it.
        </p>
      </PolicySection>
      <PolicySection title="Changes and contact">
        <p>
          We may update this policy to reflect changes in our services and
          practices. The effective date above identifies the current version.
        </p>
        <p>
          For privacy questions or requests, reach us through <PolicyContact />.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
