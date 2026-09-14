import { AdvertisementService } from "@/src/services/advertisement-service";
import TopBarAd from "./TopBarAd";

export default async function TopBarAdServer() {
  let ads = [];
  try {
    ads = await AdvertisementService.getActiveAds();
  } catch {
    return null;
  }

  const topBarAds = ads.filter((ad) => ad.layout === "top_bar");
  if (topBarAds.length === 0) return null;

  // Se retorna limpio, su posición e interpolación ahora dependen del NavBarClient
  return <TopBarAd ads={topBarAds} />;
}