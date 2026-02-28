import TopBar from "@/components/layout/TopBar";

export default function NotifsPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1440px] px-8 py-8">
        <h1 className="text-2xl font-semibold text-white">Notifs Panel</h1>
        <p className="mt-2 text-sm text-[#78716c]">
          Logs events and displays simulated l2_anchor_tx for badge issuance. (FE branch implements.)
        </p>
        <div className="mt-6 glass-card p-6">
          <p className="text-sm text-[#a8a29e]">No events yet.</p>
        </div>
      </main>
    </>
  );
}
