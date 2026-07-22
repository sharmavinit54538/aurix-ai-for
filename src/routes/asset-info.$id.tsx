import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicAssetInfo } from "@/features/public/asset-info/api";
import { PublicAssetInfoCard } from "@/features/public/asset-info/PublicAssetInfoCard";

export const Route = createFileRoute("/asset-info/$id")({
  head: () => ({ meta: [{ title: "Asset Info — Aurix" }] }),
  component: PublicAssetInfoPage,
});

function PublicAssetInfoPage() {
  const { id } = Route.useParams();

  const { data: asset, isLoading, isError, error } = useQuery({
    queryKey: ["public-asset-info", id],
    queryFn: () => fetchPublicAssetInfo(id),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading asset details…</p>
      </div>
    );
  }

  if (isError || !asset) {
    const notFound = error instanceof Error && error.message === "NOT_FOUND";
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="text-center max-w-sm">
          <p className="font-semibold text-foreground">
            {notFound ? "Asset not found" : "Couldn't load asset details"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {notFound
              ? "This QR code doesn't match any asset on file. Double-check the sticker or contact IT."
              : "Something went wrong fetching this asset. Please try again in a moment."}
          </p>
        </div>
      </div>
    );
  }

  return <PublicAssetInfoCard asset={asset} />;
}