import { LocationData } from '../types';

export const POPULAR_LOCATIONS: LocationData[] = [
  {
    placeName: 'Eiffel Tower & Champ de Mars',
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    lat: 48.8584,
    lng: 2.2945,
    formattedAddress: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
  },
  {
    placeName: 'Shibuya Crossing & Hachiko',
    city: 'Tokyo',
    state: 'Kanto',
    country: 'Japan',
    lat: 35.6595,
    lng: 139.7005,
    formattedAddress: '1 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan',
  },
  {
    placeName: 'Brooklyn Bridge & DUMBO',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    lat: 40.7061,
    lng: -73.9969,
    formattedAddress: 'Brooklyn Bridge, New York, NY 10038, USA',
  },
  {
    placeName: 'Tower Bridge & Thames Walk',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    lat: 51.5055,
    lng: -0.0754,
    formattedAddress: 'Tower Bridge Rd, London SE1 2UP, UK',
  },
  {
    placeName: 'Burj Khalifa Downtown',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.1972,
    lng: 55.2744,
    formattedAddress: '1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE',
  },
  {
    placeName: 'Sydney Opera House & Harbour',
    city: 'Sydney',
    state: 'New South Wales',
    country: 'Australia',
    lat: -33.8568,
    lng: 151.2153,
    formattedAddress: 'Bennelong Point, Sydney NSW 2000, Australia',
  },
  {
    placeName: 'Marine Drive Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.9438,
    lng: 72.8233,
    formattedAddress: 'Netaji Subhash Chandra Bose Rd, Churchgate, Mumbai 400020, India',
  },
  {
    placeName: 'VNIT Campus & Ambazari',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    lat: 21.1255,
    lng: 79.0522,
    formattedAddress: 'South Ambazari Rd, VNIT, Nagpur, Maharashtra 440010, India',
  },
];

export class GeocodingService {
  static async searchLocations(query: string): Promise<LocationData[]> {
    if (!query || query.trim().length < 2) return [];

    const q = query.toLowerCase().trim();

    // First, filter instant presets
    const matchedPresets = POPULAR_LOCATIONS.filter(
      (loc) =>
        loc.placeName.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.state?.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q)
    );

    // Fetch from Nominatim OpenStreetMap worldwide geocoder
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=6`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const apiResults: LocationData[] = data.map((item: any) => {
          const address = item.address || {};
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district ||
            item.name;
          const state = address.state;
          const country = address.country || 'Global';
          return {
            placeName: item.name || item.display_name.split(',')[0],
            city: city || 'Unknown City',
            state: state,
            country: country,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            formattedAddress: item.display_name,
          };
        });

        // Combine deduplicating by proximity
        const combined = [...matchedPresets, ...apiResults];
        const unique: LocationData[] = [];
        combined.forEach((c) => {
          if (!unique.some((u) => Math.abs(u.lat - c.lat) < 0.005 && Math.abs(u.lng - c.lng) < 0.005)) {
            unique.push(c);
          }
        });
        return unique.slice(0, 6);
      }
    } catch (e) {
      console.warn('Nominatim search failed, returning preset matches:', e);
    }

    return matchedPresets;
  }

  static async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const item = await response.json();
        const address = item.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          address.state_district ||
          'Unknown Place';
        return {
          placeName: item.name || address.suburb || address.neighbourhood || city,
          city: city,
          state: address.state,
          country: address.country || 'Global',
          lat,
          lng,
          formattedAddress: item.display_name,
        };
      }
    } catch (e) {
      console.warn('Reverse geocode failed, using coordinates fallback:', e);
    }

    return {
      placeName: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      city: 'Pinned Location',
      country: 'Global',
      lat,
      lng,
      formattedAddress: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };
  }
}
