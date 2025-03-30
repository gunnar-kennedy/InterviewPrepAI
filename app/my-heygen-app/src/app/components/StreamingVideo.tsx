"use client";

import { useEffect } from "react";
import {
  Room,
  RemoteParticipant,
  Track,
  TrackPublication,
} from "livekit-client";

interface StreamingVideoProps {
  sessionData: any;
}

export default function StreamingVideo({ sessionData }: StreamingVideoProps) {
  useEffect(() => {
    let room: Room | null = null;

    const start = async () => {
      if (!sessionData?.livekit_rtc) {
        console.error("Missing LiveKit connection info.");
        return;
      }

      const { url, token } = sessionData.livekit_rtc;

      try {
        // 1) Create the Room instance
        room = new Room();

        // 2) Connect to the LiveKit server
        await room.connect(url, token);

        // 3) Listen for new participants
        room.on("participantConnected", (participant: RemoteParticipant) => {
          participant.on("trackSubscribed", (track: Track) => {
            if (track.kind === Track.Kind.Video) {
              attachTrack(track);
            }
          });
        });

        // 4) For already connected participants, use remoteParticipants map
        room.remoteParticipants.forEach((participant: RemoteParticipant) => {
          // NEW: Use getTracks() to retrieve publications
          participant.getTracks().forEach((pub: TrackPublication) => {
            const track = pub.track;
            if (track?.kind === Track.Kind.Video) {
              attachTrack(track);
            }
          });
        });
      } catch (err) {
        console.error("Error connecting to LiveKit:", err);
      }
    };

    const attachTrack = (track: Track) => {
      const videoEl = document.getElementById("avatarVideo") as HTMLVideoElement;
      if (videoEl) {
        track.attach(videoEl);
      }
    };

    start();

    // Cleanup on unmount
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [sessionData]);

  return (
    <div>
      <video
        id="avatarVideo"
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          backgroundColor: "#000",
          borderRadius: "12px",
        }}
      />
    </div>
  );
}
