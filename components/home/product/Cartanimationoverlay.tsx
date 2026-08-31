'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { globalAnimationStore, type AnimationPayload } from '@/hooks/useAddToCartAnimation';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface FloatingItem {
  id: string;
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
  image?: string;
  progress: number;
}

const ANIMATION_DURATION = 700; // ms
const ANIMATION_CLEANUP_DELAY = 60; // ms
const PARTICLE_COUNT = 3;

// Curva Bezier Cuadrática
const getBezierPoint = (p0: number, p1: number, p2: number, t: number): number => {
  const oneMinusT = 1 - t;
  return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
};

// Easing para entrada acelerada
const easeInCubic = (t: number): number => t * t * t;

export default function CartAnimationOverlay() {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const getCartButtonPosition = useCallback((): { x: number; y: number } => {
    // 1. Obtener todos los botones de carrito y filtrar el que realmente está visible en el viewport
    const cartButtons = Array.from(document.querySelectorAll('[data-cart-button]'));
    
    for (const btn of cartButtons) {
      const rect = btn.getBoundingClientRect();
      // Validar que el botón tenga dimensiones reales y esté en la mitad derecha (> 50vw)
      if (rect.width > 0 && rect.height > 0 && rect.right > window.innerWidth * 0.4) {
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    }

    // 2. Si hay un botón visible aunque no esté a >50vw, usar el primero visible con width > 0
    for (const btn of cartButtons) {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    }

    // 3. Fallback estricto a la derecha superior (tanto móvil como desktop)
    return {
      x: window.innerWidth - 32,
      y: 28,
    };
  }, []);

  const createFloatingItem = useCallback(
    (payload: AnimationPayload): FloatingItem => {
      const cartPosition = getCartButtonPosition();
      
      const startX = payload.fromRect.left + payload.fromRect.width / 2;
      const startY = payload.fromRect.top + payload.fromRect.height / 2;
      const endX = cartPosition.x;
      const endY = cartPosition.y;

      // Trayectoria parabólica ascendente hacia la derecha
      const deltaX = endX - startX;
      const controlX = startX + deltaX * 0.55;
      const controlY = Math.min(startY, endY) - Math.max(100, Math.abs(startY - endY) * 0.35);

      return {
        id: `${Math.random()}_${Date.now()}`,
        startX,
        startY,
        controlX,
        controlY,
        endX,
        endY,
        image: payload.productImage,
        progress: 0,
      };
    },
    [getCartButtonPosition]
  );

  const animateItem = useCallback((item: FloatingItem) => {
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
        const cleanupTimeout = setTimeout(() => {
          setFloatingItems((prev) => prev.filter((prevItem) => prevItem.id !== item.id));
        }, ANIMATION_CLEANUP_DELAY);

        return () => clearTimeout(cleanupTimeout);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleAnimation = (payload: AnimationPayload) => {
      const newItem = createFloatingItem(payload);
      setFloatingItems((prev) => [...prev, newItem]);
      animateItem(newItem);
    };

    unsubscribeRef.current = globalAnimationStore.subscribe(handleAnimation);

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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
        @keyframes floatParticle {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(10px, -20px, 0) scale(0);
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
  const p = item.progress;

  const currentX = getBezierPoint(item.startX, item.controlX, item.endX, p);
  const currentY = getBezierPoint(item.startY, item.controlY, item.endY, p);

  // Pop inicial y encogimiento progresivo
  let scale = 1;
  if (p < 0.15) {
    scale = 1 + (p / 0.15) * 0.2;
  } else {
    const decay = (p - 0.15) / 0.85;
    scale = 1.2 - easeInCubic(decay) * 0.95;
  }

  const rotation = p * 40;
  const opacity = p > 0.88 ? Math.max(0, 1 - (p - 0.88) / 0.12) : 1;

  return (
    <div
      className="fixed w-14 h-14 pointer-events-none"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${currentX - 28}px, ${currentY - 28}px, 0) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      {item.image ? (
        <ProductImage src={item.image} />
      ) : (
        <FallbackCartIcon />
      )}

      <ParticleContainer opacity={opacity} />
    </div>
  );
}

interface ProductImageProps {
  src: string;
}

function ProductImage({ src }: ProductImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden shadow-2xl bg-white border border-border">
      <Image
        src={src}
        alt="Product"
        fill
        className="object-cover"
        unoptimized
        quality={50}
        priority={false}
      />
    </div>
  );
}

function FallbackCartIcon() {
  return (
    <div className="w-full h-full bg-foreground shadow-2xl flex items-center justify-center border border-border text-background">
      <ShoppingCart size={22} strokeWidth={2} />
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
  const duration = 0.5 + index * 0.15;
  const left = 20 + index * 30;
  const top = 30 + index * 20;

  return (
    <div
      className="absolute w-1.5 h-1.5 bg-foreground"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        opacity: opacity * 0.7,
        animation: `floatParticle ${duration}s ease-out forwards`,
        pointerEvents: 'none',
      }}
    />
  );
}