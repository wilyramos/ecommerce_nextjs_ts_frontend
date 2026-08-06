'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { globalAnimationStore, type AnimationPayload } from '@/hooks/useAddToCartAnimation';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface FloatingItem {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image?: string;
  progress: number;
}

const ANIMATION_DURATION = 600; // ms
const ANIMATION_CLEANUP_DELAY = 100; // ms
const PARTICLE_COUNT = 3;

// Easing functions
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export default function CartAnimationOverlay() {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const getCartButtonPosition = useCallback((): { x: number; y: number } | null => {
    const cartButton = document.querySelector('[data-cart-button]');
    if (!cartButton) return null;

    const cartRect = cartButton.getBoundingClientRect();
    return {
      x: cartRect.left + cartRect.width / 2,
      y: cartRect.top + cartRect.height / 2,
    };
  }, []);

  const createFloatingItem = useCallback(
    (payload: AnimationPayload): FloatingItem | null => {
      const cartPosition = getCartButtonPosition();
      if (!cartPosition) return null;

      return {
        id: `${Math.random()}_${Date.now()}`,
        startX: payload.fromRect.left + payload.fromRect.width / 2,
        startY: payload.fromRect.top + payload.fromRect.height / 2,
        endX: cartPosition.x,
        endY: cartPosition.y,
        image: payload.productImage,
        progress: 0,
      };
    },
    [getCartButtonPosition]
  );

  const animateItem = useCallback(
    (item: FloatingItem) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

        setFloatingItems((prev) =>
          prev.map((prevItem) =>
            prevItem.id === item.id ? { ...prevItem, progress } : prevItem
          )
        );

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Cleanup después de la animación
          const cleanupTimeout = setTimeout(() => {
            setFloatingItems((prev) => prev.filter((prevItem) => prevItem.id !== item.id));
          }, ANIMATION_CLEANUP_DELAY);

          return () => clearTimeout(cleanupTimeout);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    []
  );

  useEffect(() => {
    const handleAnimation = (payload: AnimationPayload) => {
      const newItem = createFloatingItem(payload);
      if (!newItem) return;

      setFloatingItems((prev) => [...prev, newItem]);
      animateItem(newItem);
    };

    unsubscribeRef.current = globalAnimationStore.subscribe(handleAnimation);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createFloatingItem, animateItem]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {floatingItems.map((item) => (
          <FloatingItemComponent key={item.id} item={item} />
        ))}
      </div>
      <style jsx global>{`
        @keyframes float {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0);
          }
        }
      `}</style>
    </>
  );
}

interface FloatingItemComponentProps {
  item: FloatingItem;
}

function FloatingItemComponent({ item }: FloatingItemComponentProps) {
  const easedProgress = easeOutCubic(item.progress);

  // Interpolación lineal
  const currentX = item.startX + (item.endX - item.startX) * easedProgress;
  const currentY = item.startY + (item.endY - item.startY) * easedProgress;

  // Animaciones
  const scale = 1 - easedProgress * 0.7;
  const opacity = 1 - item.progress * 0.7;
  const rotation = item.progress * 360;

  return (
    <div
      className="fixed w-16 h-16 pointer-events-none"
      style={{
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        transition: 'none',
        willChange: 'transform, opacity',
      }}
    >
      {item.image ? (
        <ProductImage src={item.image} />
      ) : (
        <FallbackCartIcon />
      )}

      {/* Partículas de luz */}
      <ParticleContainer opacity={opacity} />
    </div>
  );
}

interface ProductImageProps {
  src: string;
}

function ProductImage({ src }: ProductImageProps) {
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl bg-white border border-border">
      <Image
        src={src}
        alt="Product"
        fill
        className="object-cover"
        unoptimized
        quality={60}
        priority={false}
      />
    </div>
  );
}

function FallbackCartIcon() {
  return (
    <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary/90 to-primary shadow-2xl flex items-center justify-center border border-primary-foreground/20">
      <ShoppingCart
        size={24}
        className="text-primary-foreground"
        strokeWidth={2}
      />
    </div>
  );
}

interface ParticleContainerProps {
  opacity: number;
}

function ParticleContainer({ opacity }: ParticleContainerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} opacity={opacity} />
      ))}
    </div>
  );
}

interface ParticleProps {
  index: number;
  opacity: number;
}

function Particle({ index, opacity }: ParticleProps) {
  const duration = 0.8 + index * 0.2;
  const left = 30 + index * 25;
  const top = 20 + index * 15;

  return (
    <div
      className="absolute w-1 h-1 bg-primary rounded-full"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        opacity: opacity * 0.6,
        animation: `float ${duration}s ease-out forwards`,
        pointerEvents: 'none',
      }}
    />
  );
}