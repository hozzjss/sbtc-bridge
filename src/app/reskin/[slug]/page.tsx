import { StatusClient } from "./status-client";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center flex-1 py-6">
      <StatusClient />
    </div>
  );
}
