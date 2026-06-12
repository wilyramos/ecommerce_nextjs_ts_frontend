// components/home/TopBarAdServer.tsx
import { AdvertisementService } from "@/src/services/advertisement-service";
import TopBarAd from "./TopBarAd";
import TopBarAdScrollWrapper from "./TopBarAdScrollWrapper";

export default async function TopBarAdServer() {
    let ads = [];
    try {
        ads = await AdvertisementService.getActiveAds();
    } catch {
        return null;
    }

    const topBarAds = ads.filter(ad => ad.layout === "top_bar");
    if (topBarAds.length === 0) return null;

    return (
        <TopBarAdScrollWrapper>
            <TopBarAd ads={topBarAds} />
        </TopBarAdScrollWrapper>
    );
}