import { MiIaSetup } from "@/components/MiIaSetup";

export const metadata = { title: "Mi IA" };

export default function MiIaPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <MiIaSetup />
    </div>
  );
}
