"use client";

import { useEffect, useState } from "react";

interface Props {
    endsAt: Date | string;
    label?: string;
    showDays: boolean;
    theme?: "dark" | "light" | "custom";
    accentColor?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculate(endsAt: Date | string): TimeLeft {
    const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());

    return {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
    };
}

export default function SliderCountdownTimer({
    endsAt,
    label,
    showDays,
    theme,
    accentColor,
}: Props) {
    const [mounted, setMounted] = useState(false);

    const [time, setTime] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        setMounted(true);

        const update = () => {
            setTime(calculate(endsAt));
        };

        update();

        const id = setInterval(update, 1000);

        return () => clearInterval(id);
    }, [endsAt]);

    /* "custom" suele mostrarse sobre fondo oscuro */
    const isDark = theme === "dark" || theme === "custom";

    const units = showDays
        ? [
              { label: "días", value: time.days },
              { label: "horas", value: time.hours },
              { label: "min", value: time.minutes },
              { label: "seg", value: time.seconds },
          ]
        : [
              {
                  label: "horas",
                  value: time.hours + time.days * 24,
              },
              { label: "min", value: time.minutes },
              { label: "seg", value: time.seconds },
          ];

    // Evita hydration mismatch
    if (!mounted) {
        return (
            <div className="opacity-0 pointer-events-none">
                00:00:00
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 sm:gap-3">
            {label && (
                <p
                    className="
                        text-[9px] sm:text-[10px]
                        font-bold uppercase
                        tracking-[0.2em]
                        opacity-80
                    "
                    style={{ color: accentColor }}
                >
                    {label}
                </p>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {units.map(({ label: l, value }, i) => (
                    <div
                        key={l}
                        className="flex items-center gap-1.5 sm:gap-2"
                    >
                        <div
                            className={[
                                "flex flex-col items-center rounded-xl",
                                "px-2 py-1.5 sm:px-3 sm:py-2",
                                "min-w-[44px] sm:min-w-[54px]",
                                "backdrop-blur-md border",
                                "transition-all duration-300",
                                isDark
                                    ? "bg-white/10 border-white/10"
                                    : "bg-black/5 border-black/5",
                            ].join(" ")}
                        >
                            <span
                                className="
                                    text-xl sm:text-2xl md:text-3xl
                                    font-black tabular-nums leading-none
                                "
                            >
                                {String(value).padStart(2, "0")}
                            </span>

                            <span
                                className="
                                    text-[7px] sm:text-[8px]
                                    uppercase font-bold
                                    tracking-tighter
                                    opacity-60 mt-1
                                "
                            >
                                {l}
                            </span>
                        </div>

                        {i < units.length - 1 && (
                            <span
                                className="
                                    text-lg sm:text-xl
                                    font-black opacity-30
                                "
                            >
                                :
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}