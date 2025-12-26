import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "../components/layouts/legal-layout";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout
      title='Privacy Policy'
      children={
        <>
          <p className='text-sm leading-7 text-zinc-300'>
            AuroraCal (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a scheduling application that helps users
            share availability and book meetings.
          </p>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Data We Collect:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              We collect only the information necessary to operate the service, including:
            </p>
            <ul className='list-disc pl-5 space-y-1 text-sm text-zinc-300 marker:text-emerald-400'>
              <li>Account information such as email address and optional name</li>
              <li>Availability settings and scheduling preferences</li>
              <li>Booking details including guest name, email address, and meeting time</li>
              <li>Authentication data such as session identifiers and cookies</li>
            </ul>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>How We Use Data:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              We use the collected information solely to provide and improve the service, including to:
            </p>
            <ul className='list-disc pl-5 space-y-1 text-sm text-zinc-300 marker:text-emerald-400'>
              <li>Enable scheduling and booking functionality</li>
              <li>Authenticate users and secure accounts</li>
              <li>Send transactional emails such as booking confirmations and cancellations</li>
            </ul>
            <p className='text-sm leading-7 text-zinc-300'>
              We do not sell personal data or use it for advertising or marketing purposes.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Cookies:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              AuroraCal uses essential cookies required for authentication, security, and basic application
              functionality. These cookies are necessary for the service to operate and cannot be disabled.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Data Storage and Security:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              We store data using industry-standard infrastructure and apply reasonable technical and organizational
              measures to protect it from unauthorized access.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Third-Party Services:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              AuroraCal relies on trusted third-party service providers to operate the application, including for:
            </p>
            <ul className='list-disc pl-5 space-y-1 text-sm text-zinc-300 marker:text-emerald-400'>
              <li>Application hosting</li>
              <li>Database hosting</li>
              <li>Transactional email delivery</li>
            </ul>
            <p className='text-sm leading-7 text-zinc-300'>
              These providers process data only as required to deliver their services.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Your Rights:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              You may request access to or deletion of your personal data by contacting us.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Contact:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              If you have questions about this Privacy Policy or how your data is handled, you can contact us at{" "}
              <a
                className='text-zinc-100 underline decoration-white/20 underline-offset-4 hover:decoration-white/50'
                href='mailto:hello@auroracal.com'
              >
                hello@auroracal.com
              </a>
              .
            </p>
          </div>
        </>
      }
    />
  );
}
