import { ListingPage } from "@/components/listing/ListingPage";
import { ToastProvider } from "@/hooks/useToast";
import { getListing } from "@/lib/data";

export default function Page() {
  return (
    <ToastProvider>
      <ListingPage listing={getListing()} />
    </ToastProvider>
  );
}
