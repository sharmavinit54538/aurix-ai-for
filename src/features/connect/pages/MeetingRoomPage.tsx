import { useParams } from "@tanstack/react-router";
import { MeetingRoomView } from "../components/MeetingRoomView";

export function MeetingRoomPage() {
  const { meetingId } = useParams({ strict: false }) as { meetingId: string };
  return <MeetingRoomView meetingId={meetingId} />;
}
