import { Header } from "@/components/layout/Header";
import { StickyNav } from "@/components/layout/StickyNav";
import { Toast } from "@/components/layout/Toast";
import { Amenities } from "@/components/listing/Amenities";
import { BookingSidebar } from "@/components/listing/BookingSidebar";
import { Calendar } from "@/components/listing/Calendar";
import { Description } from "@/components/listing/Description";
import { GuestFavourite } from "@/components/listing/GuestFavourite";
import { HeroGallery } from "@/components/listing/HeroGallery";
import { Highlights } from "@/components/listing/Highlights";
import { HostRow } from "@/components/listing/HostRow";
import { Location } from "@/components/listing/Location";
import { MeetHost } from "@/components/listing/MeetHost";
import { MoreStays } from "@/components/listing/MoreStays";
import { Overview } from "@/components/listing/Overview";
import { Reviews } from "@/components/listing/Reviews";
import { Sleep } from "@/components/listing/Sleep";
import { ThingsToKnow } from "@/components/listing/ThingsToKnow";
import { TitleRow } from "@/components/listing/TitleRow";
import { AmenitiesModal } from "@/components/overlays/AmenitiesModal";
import { PhotoTour } from "@/components/overlays/PhotoTour";
import { PhotoViewer } from "@/components/overlays/PhotoViewer";
import styles from "./page.module.css";

// Page skeleton: SPEC §1
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <div className={styles.container}>
          <TitleRow />
          <HeroGallery />
          <div className={styles.grid}>
            <div className={styles.left}>
              <Overview />
              <GuestFavourite />
              <HostRow />
              <Highlights />
              <Description />
              <Sleep />
              <Amenities />
              <Calendar />
            </div>
            <BookingSidebar />
          </div>
          <div className={styles.bottom}>
            <Reviews />
            <Location />
            <MeetHost />
            <ThingsToKnow />
            <MoreStays />
          </div>
        </div>
      </main>
      <StickyNav />
      <PhotoTour />
      <PhotoViewer />
      <AmenitiesModal />
      <Toast />
    </>
  );
}
