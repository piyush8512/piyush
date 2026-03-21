import Link from "next/link";

async function getBooking(id: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/booking?id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data?.data || null;
}

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const id = params?.id;

  if (!id) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-primary">
        <h1 className="text-3xl font-bold">Booking Not Found</h1>
        <p className="mt-3 text-sm opacity-80">Missing booking id in URL.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-primary px-4 py-2 text-sm"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  const booking = await getBooking(id);

  if (!booking) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-primary">
        <h1 className="text-3xl font-bold">Booking Unavailable</h1>
        <p className="mt-3 text-sm opacity-80">
          This booking does not exist or may have been cancelled.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-primary px-4 py-2 text-sm"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-primary">
      <h1 className="text-3xl font-bold">Booking Confirmed</h1>
      <p className="mt-3 text-sm opacity-80">
        Your meeting request has been confirmed and added to the calendar.
      </p>

      <div className="mt-8 space-y-2 rounded-2xl border border-primary p-5 text-sm">
        <p>
          <strong>Booking ID:</strong> {booking.bookingId}
        </p>
        <p>
          <strong>Name:</strong> {booking.visitorName}
        </p>
        <p>
          <strong>Email:</strong> {booking.visitorEmail}
        </p>
        <p>
          <strong>Purpose:</strong> {booking.purpose}
        </p>
        <p>
          <strong>Timezone:</strong> {booking.timezone}
        </p>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
        <p>
          <strong>Start:</strong> {new Date(booking.slotStart).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(booking.slotEnd).toLocaleString()}
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block rounded-full border border-primary px-4 py-2 text-sm"
      >
        Back to Home
      </Link>
    </section>
  );
}
