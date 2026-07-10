import { useEffect, useRef, useState } from "react";

interface SeamlessVideoBackgroundProps {
  videoSrc: string;
}

export function SeamlessVideoBackground({ videoSrc }: SeamlessVideoBackgroundProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    const container = containerRef.current;

    if (!video1 || !video2 || !container) return;

    const handleTimeUpdate = (video: HTMLVideoElement, otherVideo: HTMLVideoElement) => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      // 비디오가 끝나기 1.5초 전부터 크로스페이드 시작
      if (duration - currentTime < 1.5) {
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

    // IntersectionObserver로 화면에 보일 때만 재생
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video1.play().catch(() => {
              // 자동 재생 실패 시 조용히 처리
            });
          } else {
            video1.pause();
            video2.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      video1.removeEventListener("timeupdate", onVideo1TimeUpdate);
      video2.removeEventListener("timeupdate", onVideo2TimeUpdate);
      observer.disconnect();
    };
  }, [videoSrc]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <video
        ref={video1Ref}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.75) saturate(1.3)",
          transition: "opacity 0.1s linear",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <video
        ref={video2Ref}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.75) saturate(1.3)",
          opacity: 0,
          transition: "opacity 0.1s linear",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(14, 165, 233, 0.4) 100%)"
        }}
      />
    </div>
  );
}