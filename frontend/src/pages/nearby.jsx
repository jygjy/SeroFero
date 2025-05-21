import NearbyMap from "@/components/NearbyMap";

export default function NearbyPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-6">Nearby Recommendations</h2>
      <NearbyMap />
    </div>
  );
}