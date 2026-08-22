import { LocationData } from '../types';

export const POPULAR_LOCATIONS: LocationData[] = [
  {
    placeName: 'VNIT Campus & Bajaj Nagar',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    lat: 21.1255,
    lng: 79.0522,
    formattedAddress: 'South Ambazari Rd, VNIT, Nagpur, Maharashtra 440010',
  },
  {
    placeName: 'Futala Lake Promenade',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    lat: 21.1539,
    lng: 79.0436,
    formattedAddress: 'Futala Lake Rd, Vayusena Nagar, Nagpur, Maharashtra 440001',
  },
  {
    placeName: 'Marine Drive Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.9438,
    lng: 72.8233,
    formattedAddress: 'Netaji Subhash Chandra Bose Rd, Churchgate, Mumbai 400020',
  },
  {
    placeName: 'Bandra Bandstand & Chapel Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 19.0494,
    lng: 72.8211,
    formattedAddress: 'Bandstand Promenade, Bandra West, Mumbai 400050',
  },
  {
    placeName: 'Baner High Street',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.5590,
    lng: 73.7868,
    formattedAddress: 'Baner Road, Pune, Maharashtra 411045',
  },
  {
    placeName: 'Sinhagad Fort',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.3663,
    lng: 73.7559,
    formattedAddress: 'Sinhagad Ghat Rd, Pune, Maharashtra 411025',
  },
  {
    placeName: 'Palolem Beach',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    lat: 15.0100,
    lng: 74.0232,
    formattedAddress: 'Canacona, South Goa, Goa 403702',
  },
  {
    placeName: 'Fontainhas Latin Quarter',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    lat: 15.4989,
    lng: 73.8315,
    formattedAddress: 'Panaji, North Goa, Goa 403001',
  },
  {
    placeName: 'Humayun’s Tomb',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    lat: 28.5933,
    lng: 77.2507,
    formattedAddress: 'Mathura Rd, Nizamuddin East, New Delhi, Delhi 110013',
  },
  {
    placeName: 'India Gate & Rajpath',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    lat: 28.6129,
    lng: 77.2295,
    formattedAddress: 'Kartavya Path, India Gate, New Delhi 110001',
  },
  {
    placeName: 'Charminar & Laad Bazaar',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    lat: 17.3616,
    lng: 78.4747,
    formattedAddress: 'Charminar Rd, Ghansi Bazaar, Hyderabad 500002',
  },
  {
    placeName: 'HITEC City & Cyber Towers',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    lat: 17.4504,
    lng: 78.3808,
    formattedAddress: 'HITEC City, Madhapur, Hyderabad 500081',
  },
  {
    placeName: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9784,
    lng: 77.6408,
    formattedAddress: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
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

    // If query is longer and user might want global geocoding, fetch from Nominatim OpenStreetMap
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
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
          const country = address.country || 'India';
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
          country: address.country || 'India',
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
      city: 'Custom Pin',
      country: 'India',
      lat,
      lng,
      formattedAddress: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };
  }
}
