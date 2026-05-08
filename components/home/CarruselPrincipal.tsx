//File: frontend/components/home/Carruselprincipal.tsx

import { SliderService } from "@/src/services/slider-service";
import SliderBannerCarousel from '../banner/SliderBannerCarousel';


export default async function CarruselPrincipal() {

    const banners = await SliderService.getActive();
    
    return (
        <SliderBannerCarousel banners={banners} />
    )
}
