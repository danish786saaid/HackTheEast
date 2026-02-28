export default function ContactPage() {
  return (
    <section className="mx-auto max-w-oax-content px-4 py-16 md:px-6 md:py-20">
      <h1 className="text-3xl font-bold text-oax-navy">Contact Us</h1>
      <p className="mt-6 max-w-3xl text-oax-gray-text">
        Fill in the form below and we&apos;ll get back to you as soon as we can.
      </p>
      <div className="mt-10">
        <p className="text-oax-gray-muted">
          <strong className="text-oax-navy">Our email:</strong>{" "}
          <a href="mailto:info@oax.org" className="text-oax-accent hover:underline">
            info@oax.org
          </a>
        </p>
      </div>
    </section>
  );
}
