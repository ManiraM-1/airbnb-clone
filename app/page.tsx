import { ListingPage } from "@/components/listing/ListingPage";
import { getListing } from "@/lib/data";

export default function Page() {
  return <ListingPage listing={getListing()} />;
}
