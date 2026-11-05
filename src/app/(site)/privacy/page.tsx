import type { Metadata } from "next";
import {
  PolicyContact,
  PolicyLayout,
  PolicySection,
} from "@/components/legal/policy-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HairnThere handles house-call inquiries, visit addresses, email follow-up, website analytics, and your privacy choices.",
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
          HairnThere is Elisabeth’s hair-service brand in Suncrest, Draper,
          Utah. We accept house-call inquiries and informational consultations
          for other settings. This policy applies to information collected
          through the HairnThere website and appointment inquiry form.
        </p>
      </PolicySection>
      <PolicySection title="Information you choose to share">
        <p>
          When you send an inquiry, we collect your name and email, the number
          of people wanting haircuts or color, your preferred date and time, the
          visit address or venue, and any optional note. One person may appear
          in both service counts. We do not need family members’ names, dates of
          birth, payment details, or health records.
        </p>
        <p>
          The current form uses email follow-up and does not ask for a phone
          number or text-message consent. Previously submitted consent records
          may remain with the original inquiry; they do not authorize marketing.
        </p>
      </PolicySection>
      <PolicySection title="How we use your information">
        <p>
          Elisabeth or authorized team members use your details to respond by
          email, discuss services and a personal quote, check the visit location
          and availability, and coordinate your visit. Sending an inquiry does
          not automatically reserve a date or confirm an appointment.
        </p>
        <p>
          Our form does not enroll you in a newsletter or authorize unrelated
          marketing emails, promotional texts, or automated marketing calls. We
          do not sell your personal information.
        </p>
      </PolicySection>
      <PolicySection title="Phone and text messages">
        <p>
          The website does not send automated calls or texts and the current
          form does not collect SMS consent. Any future messaging service will
          need its own opt-in, opt-out handling, and updated disclosures before
          it is activated. To ask about a previous consent record, contact us
          through <PolicyContact />.
        </p>
      </PolicySection>
      <PolicySection title="Inquiry delivery and service providers">
        <p>
          Submitted inquiries are sent to a private Discord destination used to
          manage HairnThere inquiries. The notification includes the information
          you submitted, including service counts and date/time preferences.
          Your visit address is included in the private text attachment rather
          than the notification preview. Older inquiries may also include
          service selections, planning estimates, or consent details. Discord
          and the people authorized to manage that destination process the
          information to support your inquiry.
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
          House-call inquiries ask for a street address, city, and ZIP so the
          team can discuss the visit location and any travel cost with you. No
          live address lookup, geocoding, or routing service is used. An address
          does not generate an automatic travel quote.
        </p>
        <p>
          If address-based estimates are introduced, this policy will describe
          the routing provider and the location information it receives before
          that feature is activated.
        </p>
      </PolicySection>
      <PolicySection title="Website analytics and performance">
        <p>
          When configured in production, the website uses PostHog Cloud US to
          understand page visits and website performance. It can process page
          paths, referral information with query strings and fragments removed,
          approximate visitor location, browser and device characteristics, and
          performance measurements. Vercel continues to host the website and
          forwards analytics requests to PostHog.
        </p>
        <p>
          We send broad actions, such as beginning an inquiry, a confirmed
          submission, or clicking Instagram. We do not send inquiry text, names,
          contact details, exact addresses, family-member labels, or consent
          records to analytics. Query strings, fragments, and campaign
          attribution data are removed before analytics are sent. Analytics
          availability does not determine whether an inquiry can be delivered.
        </p>
        <p>
          We disable automatic interaction recording, session replay, automatic
          error collection, and identified person profiles. Anonymous analytics
          identifiers stay only in page memory; we do not store them in
          analytics cookies or local storage, and they reset on a full reload.
          Local development and preview deployments do not collect analytics.
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
          You can leave the preferred date and optional note blank. If you would
          rather discuss an address before submitting it, contact HairnThere
          directly through the linked Instagram profile. You can request that we
          stop follow-up through <PolicyContact />.
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
