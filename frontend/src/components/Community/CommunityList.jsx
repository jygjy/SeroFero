import CommunityCard from "./CommunityCard";

export default function CommunityList({ locations }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {locations.length === 0 ? (
        <p className="text-center text-gray-500 col-span-3">No locations found.</p>
      ) : (
        locations.map((location) => <CommunityCard key={location._id} location={location} />)
      )}
    </div>
  );
}
