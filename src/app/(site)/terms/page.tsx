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
    "Terms for exploring HairnThere services, sending house-call inquiries, receiving personal quotes, and coordinating visits.",
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
          HairnThere offers personal hair services including cuts, color,
          extensions, and styling. Explore the menu and get in touch to discuss
          your hair goals and arrange a visit.
        </p>
      </PolicySection>
      <PolicySection title="Current availability">
        <p>
          I confirm pricing, timing, and the visit location with you personally.
          Salon arrangements and special-event services are discussed
          individually, including location and availability. The website does
          not automatically reserve appointments or collect deposits or
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
      <PolicySection title="Personal quotes and travel">
        <p>
          The service menu lists prices and estimated durations. Prices marked
          “+” are starting prices and may increase for extra product, hair
          length, density, or complexity. Final pricing and timing are confirmed
          during consultation. Published bundles are charged once, without
          charging their included services again. Additional services are extra.
          Neighborhood-day reductions need a custom quote. Extension hair is
          priced separately from installation and maintenance.
        </p>
        <p>
          House calls require $60 in services before travel. A minimum is a
          service requirement, not an automatic surcharge. Any travel fee
          applies once per household visit rather than per person. There is no
          automated route-based quote on this site.
        </p>
      </PolicySection>
      <PolicySection title="Appointment follow-up and messaging">
        <p>
          Provide a phone number or email so we can respond. By providing a
          phone number, you choose personal calls or texts from me about your
          appointment inquiry and appointment confirmations, now or for future
          appointments. These contacts may be one-time or ongoing for
          appointments only, never for marketing or unrelated messages. We never
          sell your contact information. You can ask us to stop calling or
          texting at any time. Message and data rates may apply. If you prefer
          email, leave phone blank and provide an email address.
        </p>
        <p>
          This website does not send automated calls or texts. Any future
          automated messaging service will require separate consent, opt-out
          handling, and updated terms before activation.
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
          appointment follow-up, and your choices.
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
