// File: src/components/banner/SliderBannerSlide.tsx
import type { SliderBanner }    from "@/src/schemas/slider.schema";
import LayoutDefault            from "./layouts/LayoutDefault";
import LayoutImageLeft          from "./layouts/LayoutImageLeft";
import LayoutImageCenter        from "./layouts/LayoutImageCenter";
import LayoutImageCenterSplit   from "./layouts/LayoutImageCenterSplit";
import LayoutBackgroundMedia    from "./layouts/LayoutBackgroundMedia";
import LayoutPromoBox           from "./layouts/LayoutPromoBox";
import LayoutSplitDiagonal      from "./layouts/LayoutSplitDiagonal";
import LayoutMinimal            from "./layouts/LayoutMinimal";
import LayoutCountdown          from "./layouts/LayoutCountdown";
import LayoutVideo              from "./layouts/LayoutVideo";

interface Props {
    banner: SliderBanner;
}

export function SliderBannerSlide({ banner }: Props) {
    switch (banner.design.layout) {
        case "image-left":         return <LayoutImageLeft        banner={banner} />;
        case "image-center":       return <LayoutImageCenter      banner={banner} />;
        case "image-center-split": return <LayoutImageCenterSplit banner={banner} />;
        case "background-media":   return <LayoutBackgroundMedia  banner={banner} />;
        case "promo-box":          return <LayoutPromoBox         banner={banner} />;
        case "fullbleed":          return <LayoutBackgroundMedia  banner={banner} />;
        case "split-diagonal":     return <LayoutSplitDiagonal    banner={banner} />;
        case "minimal":            return <LayoutMinimal          banner={banner} />;
        case "countdown":          return <LayoutCountdown        banner={banner} />;
        case "video":              return <LayoutVideo            banner={banner} />;
        default:                   return <LayoutDefault          banner={banner} />;
    }
}