import { Property } from "@/types/property";
import { Bed, Bath, Home } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={property.imageUrl || `https://via.placeholder.com/300x200?text=Property`}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.address}</p>
        <p className="text-xl font-bold text-gray-800 mb-4">
          ${property.price.toLocaleString()}
        </p>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
