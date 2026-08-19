import { MISSION_POOL } from "@/data/mission-templates";
import MissionDetailClient from "./MissionDetailClient";

/**
 * Every mission id is known statically (the mission catalog is app code,
 * not user data — see data/mission-templates), so this route can be
 * fully static-exported for the Capacitor build: no server needed at
 * runtime, ever.
 */
export function generateStaticParams() {
  return MISSION_POOL.map((m) => ({ missionId: m.id }));
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;
  return <MissionDetailClient missionId={missionId} />;
}
