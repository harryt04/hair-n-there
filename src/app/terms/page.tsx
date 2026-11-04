import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyContact,
  PolicyLayout,
  PolicySection,
} from "@/components/legal/policy-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for exploring HairnThere services, sharing interest, requesting consultations, and optional follow-up text messages.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      subtitle="A few clear expectations for using this website, sending an inquiry, and staying in touch about your plans."
      otherHref="/privacy"
      otherLabel="Privacy Policy"
    >
      <PolicySection title="Agreement to these terms">
        <p>
          By using the HairnThere website or submitting an inquiry, you agree to
          these Terms of Service. If you do not agree, please do not submit
          information through the website.
        </p>
      </PolicySection>
      <PolicySection title="Our services">
        <p>
          HairnThere is developing a personal hair-service offering including
          cuts, color, extensions, and styling. This website lets you explore
          the menu, build a service wish list, and ask Elisabeth questions.
        </p>
      </PolicySection>
      <PolicySection title="Current availability">
        <p>
          House-call appointments are not open. Salon services are coming in a
          future chapter, and a booth location has not been announced.
          Special-event inquiries are informational; location and service
          availability must be confirmed individually. The website does not
          currently accept appointment requests, reservations, deposits, or
          payments.
        </p>
        <p>
          The illustrated Subaru is part of the brand. It does not represent an
          available vehicle-based salon. Consultation or interest inquiries do
          not authorize a particular service location or create an appointment.
        </p>
      </PolicySection>
      <PolicySection title="An inquiry starts a conversation">
        <p>
          Submitting a form or reviewing an estimate does not reserve a time,
          create a binding booking, or guarantee availability. Service prices,
          travel charges, location, timing, and any other appointment conditions
          must be confirmed before you agree to proceed.
        </p>
        <p>
          Where a service or travel fee is marked “to be confirmed,” it is not
          included as a zero-dollar charge. The final amount may depend on the
          services, group size, location, consultation, and work involved. We do
          not collect payment through this website.
        </p>
      </PolicySection>
      <PolicySection title="Prices, packages, and future travel fees">
        <p>
          Prices marked + are starting prices. Per-row extension services are
          charged by row; extension hair is priced separately. Color corrections
          and other custom work require a consultation. A subtotal may omit
          unpriced work, pending travel, or unresolved package details and is
          not a final quote.
        </p>
        <p>
          Family packages include only the listed services and people.
          Additional services are priced separately. Mommy &amp; Me is $75 and
          includes one women’s haircut + blow-dry and one child’s haircut (ages
          0–12). Packages do not automatically include substitutions or
          upgrades.
        </p>
        <p>
          Future house calls have a $60 service minimum before travel. This is a
          minimum service requirement, not an automatic surcharge. The published
          convenience fees are added once per household appointment, not per
          person; actual travel arrangements are still to be confirmed. The
          planning example is not an address or route calculation. Longer
          distances and neighborhood haircut days require an individual quote,
          and no discount is automatically applied.
        </p>
      </PolicySection>
      <PolicySection title="Text messaging and consent">
        <p>
          By providing your phone number and separately opting in on our form,
          you agree to receive HairnThere text messages about your inquiry and
          appointment coordination. This may include automated follow-up when
          our messaging service is activated. Opt-in does not authorize
          unrelated promotional or marketing messages, or enroll you in an
          ongoing availability-update list.
        </p>
        <p>
          SMS consent is optional, is not a condition of purchase or booking,
          and is not required to submit an inquiry. If you do not opt in, we can
          use the email address you provide to respond.
        </p>
        <p>
          Message frequency varies with your inquiry and appointment. Message
          and data rates may apply, depending on your mobile plan.
        </p>
        <p>
          When messaging is active, reply STOP to opt out of text messages at
          any time. Reply HELP for assistance, or contact us through{" "}
          <PolicyContact />. After opting out, you may receive a confirmation of
          your request; further messages require a new opt-in where applicable.
        </p>
        <p>
          Carriers are not liable for delayed or undelivered messages. Delivery
          is subject to your carrier and device availability. Do not use this
          service for urgent or emergency communications.
        </p>
        <p>
          Automated calling and texting are not currently activated through this
          website. We will complete the applicable phone-number registration and
          messaging setup before enabling them. Providing SMS consent does not
          itself start an automated conversation.
        </p>
      </PolicySection>
      <PolicySection title="Accurate information and acceptable use">
        <p>
          Please provide accurate contact details and only submit information
          you are entitled to share. Do not impersonate others, send spam,
          upload malicious material, attempt to disrupt the website, or use the
          form for unlawful or abusive purposes.
        </p>
        <p>
          Do not include payment-card details, passwords, health records, or
          other sensitive information in the inquiry form.
        </p>
      </PolicySection>
      <PolicySection title="Website content and intellectual property">
        <p>
          The HairnThere name, original logo, website text, and original artwork
          are owned by or licensed to HairnThere. Any third-party images remain
          subject to their respective licenses. Images labeled as style
          inspiration are illustrative and are not presented as Elisabeth’s
          client portfolio.
        </p>
        <p>
          You may view the website for personal use. Reproducing its original
          content for another business requires permission from the relevant
          rights holder.
        </p>
      </PolicySection>
      <PolicySection title="Availability and limitations">
        <p>
          We make reasonable efforts to keep the website accurate and available,
          but it is provided on an “as is” and “as available” basis. Technical
          errors, outages, and delivery delays can occur. If a form reports a
          delivery error, your inquiry has not been confirmed and you should
          contact us again.
        </p>
        <p>
          To the extent permitted by applicable law, HairnThere is not liable
          for indirect or consequential loss arising from use of the website.
          Nothing in these terms excludes rights or liabilities that cannot
          legally be excluded.
        </p>
      </PolicySection>
      <PolicySection title="Privacy">
        <p>
          Our{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            Privacy Policy
          </Link>{" "}
          explains the information we collect, our use of service providers,
          optional SMS consent, and your choices.
        </p>
      </PolicySection>
      <PolicySection title="Changes, governing law, and contact">
        <p>
          We may update these terms as our services change. The effective date
          identifies the current version. These terms are governed by the laws
          of the State of Utah, without regard to conflict-of-laws principles,
          subject to applicable consumer protections.
        </p>
        <p>
          For questions about these terms or an appointment, reach us through{" "}
          <PolicyContact />.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
