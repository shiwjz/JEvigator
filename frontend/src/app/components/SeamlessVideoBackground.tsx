import { useEffect, useRef } from "react";

interface SeamlessVideoBackgroundProps {
  videoSrc: string;
}

export function SeamlessVideoBackground({ videoSrc }: SeamlessVideoBackgroundProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    const handleTimeUpdate = (video: HTMLVideoElement, otherVideo: HTMLVideoElement) => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      // 비디오가 끝나기 1.5초 전부터 크로스페이드 시작
      if (Number.isFinite(duration) && duration - currentTime < 1.5) {
        const fadeProgress = (1.5 - (duration - currentTime)) / 1.5;
        
        // 현재 비디오는 페이드 아웃
        video.style.opacity = String(1 - fadeProgress);
        
        // 다른 비디오는 페이드 인하면서 재생 시작
        if (otherVideo.paused) {
          otherVideo.currentTime = 0;
          otherVideo.play().catch(() => {
            // 자동 재생 실패 시 조용히 처리
          });
        }
        otherVideo.style.opacity = String(fadeProgress);
      } else {
        video.style.opacity = "1";
      }
    };

    const onVideo1TimeUpdate = () => handleTimeUpdate(video1, video2);
    const onVideo2TimeUpdate = () => handleTimeUpdate(video2, video1);

    video1.addEventListener("timeupdate", onVideo1TimeUpdate);
    video2.addEventListener("timeupdate", onVideo2TimeUpdate);

    // 배경 전환 때 까만 화면이 길게 보이지 않도록 즉시 버퍼링/재생을 시도합니다.
    video1.play().catch(() => {
      // 자동 재생 실패 시 조용히 처리
    });

    return () => {
      video1.removeEventListener("timeupdate", onVideo1TimeUpdate);
      video2.removeEventListener("timeupdate", onVideo2TimeUpdate);
    };
  }, [videoSrc]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={video1Ref}
        muted
        playsInline
        preload="auto"
        loop={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.75) saturate(1.3)",
          transition: "opacity 0.15s linear",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <video
        ref={video2Ref}
        muted
        playsInline
        preload="auto"
        loop={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.75) saturate(1.3)",
          opacity: 0,
          transition: "opacity 0.15s linear",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.35) 100%)"
        }}
      />
    </div>
  );
}
