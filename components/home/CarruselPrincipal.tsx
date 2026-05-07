import { SliderService } from "@/src/services/slider-service";
import SliderBannerCarousel from '../banner/SliderBannerCarousel';


export default async function Carruselprincipal() {

    const banners = await SliderService.getActive();
    return (
        <SliderBannerCarousel banners={banners} />
    )
}
