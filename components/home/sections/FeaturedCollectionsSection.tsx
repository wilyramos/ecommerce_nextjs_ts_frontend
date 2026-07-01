"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SectionResponse, SectionBlock, VideoAspectRatio } from "@/src/schemas/section.schema";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface FeaturedCollectionsGridProps {
    section: SectionResponse;
}

const PUBLIC_GRID_MAP: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-4 md:grid-cols-4 lg:grid-cols-4",
    5: "grid-cols-4 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6",
    7: "grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7",
    8: "grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
};

const ASPECT_RATIO_MAP: Record<VideoAspectRatio, string> = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
};

export default function FeaturedCollectionsGrid({ section }: FeaturedCollectionsGridProps) {
    const columns = section.settings?.gridColumns ?? 4;
    
    const gridClass = useMemo(() => {
        return PUBLIC_GRID_MAP[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }, [columns]);

    return (
        <section className="w-full space-y-4 py-4">
            {section.title && (
                <SectionHeader title={section.title} />
            )}

            <div className={`grid ${gridClass} gap-4 w-full`}>
                {section.blocks.map((block: SectionBlock, idx: number) => {
                    const hasValidLink = typeof block.linkTo === "string" && block.linkTo.trim() !== "";
                    const aspectClass = ASPECT_RATIO_MAP[block.aspectRatio] || "aspect-video";

                    const InnerBlockLayout = (
                        <GridBlockMediaWrapper 
                            block={block} 
                            aspectClass={aspectClass} 
                            columns={columns} 
                            idx={idx} 
                        />
                    );

                    if (hasValidLink) {
                        return (
                            <Link
                                key={`link-block-${block._id || idx}`}
                                href={block.linkTo!.trim()}
                                className="block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl transition-transform active:scale-[0.99]"
                            >
                                {InnerBlockLayout}
                            </Link>
                        );
                    }

                    return (
                        <div key={`static-block-${block._id || idx}`} className="w-full">
                            {InnerBlockLayout}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// ── SUB-COMPONENTE CON REPRODUCTOR PERSONALIZADO ──

interface GridBlockMediaWrapperProps {
    block: SectionBlock;
    aspectClass: string;
    columns: number;
    idx: number;
}

function GridBlockMediaWrapper({ block, aspectClass, columns, idx }: GridBlockMediaWrapperProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const isVideoResource = block.videoUrl && block.videoUrl.trim() !== "";

    // Mostrar controles (hover o reproducción)
    const showControls = isHovering || isPlaying;

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handlePlayPause = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch((err) => {
                    console.debug("Error en reproducción:", err);
                });
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setIsPlaying(!videoRef.current.paused);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
        if (newVolume > 0) {
            setIsMuted(false);
        }
    };

    const handleMuteToggle = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = volume || 0.5;
                setIsMuted(false);
            } else {
                videoRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div 
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`group relative w-full overflow-hidden ${aspectClass}`}
        >
            {/* Capa multimedia */}
            <div className="absolute inset-0 z-0">
                {isVideoResource ? (
                    <video
                        ref={videoRef}
                        src={block.videoUrl}
                        poster={block.imageUrl || undefined}
                        muted={isMuted}
                        loop={false}
                        playsInline
                        preload="metadata"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                        onClick={handlePlayPause}
                        className="w-full h-full object-cover"
                    />
                ) : block.imageUrl && block.imageUrl.trim() !== "" ? (
                    <Image
                        src={block.imageUrl}
                        alt={block.title || "Recurso multimedia de la colección"}
                        fill
                        sizes={`(max-width: 640px) 50vw, (max-width: 1024px) 33vw, ${Math.floor(100 / columns)}vw`}
                        className="object-contain"
                        priority={idx < 4}
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full " />
                )}
            </div>

            {/* Botón Play/Pause central (solo para videos) */}
            {isVideoResource && (
                <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 z-15 flex items-center justify-center transition-opacity duration-200"
                    aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
                >
                    {!isPlaying && (
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
                            <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                    )}
                </button>
            )}

            {/* Controles personalizados (barra de progreso y volumen) */}
            {isVideoResource && (
                <div
                    className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    {/* Barra de progreso */}
                    <div className="px-3 pt-3">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="w-full h-1 bg-gray-400/30 rounded-full appearance-none cursor-pointer accent-white hover:h-1.5 transition-all"
                            style={{
                                background: `linear-gradient(to right, white 0%, white ${progressPercentage}%, rgba(156, 163, 175, 0.3) ${progressPercentage}%, rgba(156, 163, 175, 0.3) 100%)`
                            }}
                        />
                    </div>

                    {/* Controles inferiores */}
                    <div className="px-3 py-2 flex items-center justify-between gap-2">
                        {/* Play/Pause y Tiempo */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePlayPause}
                                className="text-white hover:text-gray-300 transition-colors p-1"
                                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                    <Play className="w-4 h-4 fill-current" />
                                )}
                            </button>
                            <span className="text-xs text-white/70 font-medium whitespace-nowrap">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Volumen */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleMuteToggle}
                                className="text-white hover:text-gray-300 transition-colors p-1"
                                aria-label={isMuted ? "Activar sonido" : "Muteado"}
                            >
                                {isMuted ? (
                                    <VolumeX className="w-4 h-4" />
                                ) : (
                                    <Volume2 className="w-4 h-4" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-12 h-1 bg-gray-400/30 rounded-full appearance-none cursor-pointer accent-white transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Textos descriptivos */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 flex flex-col justify-end gap-1 text-white select-none pointer-events-none ">
                {block.title && (
                    <h3 className="font-extrabold text-base md:text-lg uppercase line-clamp-2">
                        {block.title}
                    </h3>
                )}
                {block.subtitle && (
                    <p className="text-white/80 text-xs font-medium tracking-wide line-clamp-1">
                        {block.subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}