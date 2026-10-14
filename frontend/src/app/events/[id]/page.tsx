import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { EventDetail } from "@/components/events/event-detail";

type Props = {
  params: Promise<{ id: string }>;
};

async function EventContent({ params }: Props) {
  const { id } = await params;

  return <EventDetail key={id} eventId={id} />;
}

export default function EventPage({ params }: Props) {
  return (
    <>
      <Navbar />

      <main>
        <Suspense
          fallback={
            <p role="status" className="py-20 text-center text-sm text-muted">
              Loading event…
            </p>
          }
        >
          <EventContent params={params} />
        </Suspense>
      </main>
    </>
  );
}
