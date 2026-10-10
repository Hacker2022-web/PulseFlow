import React, { useState } from "react";
import { Component } from "@/components/ui/sign-in-card-2";
import DisplayCards from "@/components/ui/display-cards";
import BellToggle from "./BellToggle";

const DemoOne = () => {
  const [unread, setUnread] = useState(3);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#05010b]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 95% 70% at 50% 45%, #4c116d 0%, #440f62 14%, #3a0c54 28%, #2f0844 42%, #240536 56%, #1a0328 69%, #12021c 80%, #0b0113 90%, #05010b 100%),
          radial-gradient(ellipse 130% 90% at 50% 50%, rgba(47, 6, 70, 0.45) 0%, rgba(25, 2, 38, 0.3) 45%, #05010b 100%)
        `,
      }}
    >
      {/* Top right notification toggle for demo page */}
      <div className="absolute top-6 right-6 z-20">
        <BellToggle
          offLabel="Notify me"
          onLabel="You'll be notified"
          color="#f5f5f5"
          background="#27272a"
          onColor="#18181b"
          onBackground="#f5f5f5"
          size="md"
          radius={22}
          ringAmplitude={17}
          ringPasses={5}
          ringDecay={1}
          ringDuration={820}
          ringPivot={16}
          crossfadeMs={200}
          revealBounce={0}
          count={unread}
          badge
          badgeColor="#ef4444"
          waves
          clapper={false}
          defaultPressed={false}
          onChange={(pressed) => console.log('Notification toggled:', pressed)}
          disabled={false}
        />
      </div>

      {/* Ambient diffuse blur glows for rich atmospheric depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-purple-600/18 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[450px] bg-fuchsia-600/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-violet-700/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle micro-noise texture to prevent banding across monitors */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Two-column layout: display cards left, sign-in right */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-10">
        
        {/* Left: Stacked feature preview cards */}
        <div className="hidden lg:flex flex-col items-start justify-center gap-10 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-300 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/25">
                PulseFlow OS
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Your daily pulse,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                in complete flow.
              </span>
            </h2>
            <p className="text-purple-200/60 text-sm max-w-xs leading-relaxed">
              Habits, milestone targets, and cash flow – synced in real-time with duo accountability.
            </p>
          </div>
          <DisplayCards />
        </div>

        {/* Right: Sign-in card */}
        <div className="w-full max-w-[390px] flex-shrink-0">
          <Component embedded />
        </div>
      </div>
    </div>
  );
};

export { DemoOne };
export default DemoOne;
