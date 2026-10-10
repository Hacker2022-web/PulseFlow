"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-purple-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "bg-purple-500/20 border-purple-500/30",
  titleClassName = "text-purple-300",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[26rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-purple-500/20 bg-[#170d26]/80 backdrop-blur-sm px-4 py-3 transition-all duration-700 hover:border-purple-400/40 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "relative inline-flex size-8 items-center justify-center rounded-full border",
            iconClassName
          )}
        >
          {icon}
        </span>
        <p className={cn("text-sm font-semibold", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-sm text-purple-200/60">{description}</p>
      <p className="text-xs text-purple-300/40">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      icon: <Sparkles className="size-4 text-purple-300" />,
      title: "Habits",
      description: "Build streaks that last a lifetime",
      date: "Track daily",
      iconClassName: "bg-purple-500/20 border-purple-500/30",
      titleClassName: "text-purple-300",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline before:outline-1 before:-outline-offset-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/5 grayscale-[20%]",
    },
    {
      icon: <Sparkles className="size-4 text-fuchsia-300" />,
      title: "Goals",
      description: "Milestones that keep you focused",
      date: "Progress tracking",
      iconClassName: "bg-fuchsia-500/20 border-fuchsia-500/30",
      titleClassName: "text-fuchsia-300",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline before:outline-1 before:-outline-offset-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/5 grayscale-[10%]",
    },
    {
      icon: <Sparkles className="size-4 text-violet-300" />,
      title: "Expenses",
      description: "Stay on budget, spend with clarity",
      date: "Monthly insights",
      iconClassName: "bg-violet-500/20 border-violet-500/30",
      titleClassName: "text-violet-300",
      className: "[grid-area:stack] hover:-translate-y-10",
    },
  ];

  const displayCards = cards ?? defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-fade-in">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

export { DisplayCard };
