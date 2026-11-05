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
          HairnThere is developing a personal hair-service offering including
          cuts, color, extensions, and styling. This website lets you explore
          the menu and send visit details for Elisabeth or her team to discuss.
        </p>
      </PolicySection>
      <PolicySection title="Current availability">
        <p>
          House-call inquiries are open. Elisabeth or a member of her team will
          follow up to discuss pricing, timing, and the visit location. Salon
          services remain a future plan; special-event inquiries are
          informational until location and services are confirmed. The website
          does not automatically reserve appointments or collect deposits or
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
          Public service descriptions are not fixed-price offers. We discuss a
          personal quote based on your services, group, location, and the work
          involved. Any family or neighborhood-day discount must be agreed
          individually; no discount is automatically applied. Extension hair is
          priced separately from installation and maintenance.
        </p>
        <p>
          A house-call service minimum may apply and will be discussed before
          confirmation. A minimum is a service requirement, not an automatic
          surcharge. Any travel fee applies once per household visit rather than
          per person. There is no automated route-based quote on this site.
        </p>
      </PolicySection>
      <PolicySection title="Email follow-up and messaging">
        <p>
          We use the email you provide to respond to your inquiry. Submitting
          the form does not subscribe you to marketing. The current form does
          not collect phone numbers or SMS consent, and this website does not
          send automated calls or texts. Any future text-messaging service will
          require separate consent and updated terms before activation.
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
          email follow-up, and your choices.
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
