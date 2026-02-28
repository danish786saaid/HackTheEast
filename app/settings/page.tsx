import TopBar from "@/components/layout/TopBar";

export default function SettingsPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1600px] px-8 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#78716c]">
          Manage your account, preferences, and tracking rules.
        </p>
        <div className="mt-8 border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <p className="text-sm text-[#a8a29e]">Settings panel coming soon.</p>
        </div>
      </main>
    </>
  );
}
