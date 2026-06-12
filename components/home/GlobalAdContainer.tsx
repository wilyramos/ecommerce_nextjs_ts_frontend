// components/home/GlobalAdContainer.tsx
import { AdvertisementService } from "@/src/services/advertisement-service";
import ModalPopupAd from "./ModalPopupAd";

export default async function GlobalAdContainer() {
    let ads = [];
    try {
        ads = await AdvertisementService.getActiveAds();
    } catch (error) {
        console.error("Fallo al recuperar avisos para storefront:", error);
        return null;
    }

    const currentModal = ads.find(ad => ad.layout === "modal_popup");
    if (!currentModal) return null;

    return <ModalPopupAd ad={currentModal} />;
}