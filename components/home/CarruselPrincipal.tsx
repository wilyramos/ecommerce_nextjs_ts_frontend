import { SliderService } from "@/src/services/slider-service";
import SliderBannerCarousel from "../banner/SliderBannerCarousel";

export default async function CarruselPrincipal() {
  const banners = await SliderService.getActive();

  if (!banners || banners.length === 0) return null;

  return <SliderBannerCarousel banners={banners} />;
}