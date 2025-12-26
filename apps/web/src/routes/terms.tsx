import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "../components/layouts/legal-layout";

export const Route = createFileRoute("/terms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LegalLayout
      title='Terms of Service'
      children={
        <>
          <p className='text-sm leading-7 text-zinc-300'>
            These Terms of Service (&quot;Terms&quot;) govern your use of AuroraCal. By accessing or using the service,
            you agree to be bound by these Terms.
          </p>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Service Description:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              AuroraCal provides scheduling and booking functionality that allows users to share availability and accept
              bookings. The service is provided on an “as-is” and “as-available” basis.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>User Accounts:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              You are responsible for maintaining the confidentiality of your account and for all activities that occur
              under your account.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Acceptable Use:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              You agree not to misuse the service, attempt unauthorized access, interfere with its operation, or use it
              in violation of applicable laws.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Availability and Reliability:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              While we aim to provide a reliable service, we do not guarantee uninterrupted availability or error-free
              operation.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Limitation of Liability:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              To the maximum extent permitted by law, AuroraCal shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the service.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Termination:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              We may suspend or terminate access to the service if these Terms are violated or if necessary to protect
              the integrity of the service.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Changes to These Terms:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              We may update these Terms from time to time. Continued use of the service after changes become effective
              constitutes acceptance of the updated Terms.
            </p>
          </div>

          <h2 className='mt-10 text-base font-semibold text-zinc-100'>Contact:</h2>
          <div className='mt-3 ml-4 space-y-3'>
            <p className='text-sm leading-7 text-zinc-300'>
              If you have questions about these Terms, you can contact us at{" "}
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
