import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plz: string }> }
) {
  const resolvedParams = await params;
  const plz = resolvedParams?.plz || '00000';

  // Get query parameters
  const url = new URL(request.url);
  const radius = parseInt(url.searchParams.get('radius') || '15');
  const fuels = url.searchParams.get('fuels')?.split(',') || ['diesel', 'e5', 'e10'];

  // Validate PLZ format
  if (!/^\d{5}$/.test(plz)) {
    return NextResponse.json({ error: 'Ungültige Postleitzahl' }, { status: 400 });
  }

  const apiKey = process.env.TANKERKOENIG_API_KEY;

  try {
    console.log('Starting geocoding for PLZ:', plz);

    let lat: number | null = null;
    let lng: number | null = null;

    let city: string = '';

    // Try multiple geocoding approaches
    const geocodingAttempts = [
      // 0. First try fallback coordinates for known PLZ areas
      null, // Special handling for PLZ areas
      // 1. Direct PLZ search
      `https://nominatim.openstreetmap.org/search?postalcode=${plz}&country=germany&format=json&limit=1`,
      // 2. PLZ with Germany (but filter out non-German results)
      `https://nominatim.openstreetmap.org/search?q=${plz}%20Germany&format=json&limit=1`
    ];

    for (const url of geocodingAttempts) {
      if (!url) {
        // Fallback coordinates for all German PLZ areas (Bundesländer)
        const firstTwoDigits = plz.substring(0, 2);
        
        switch (firstTwoDigits) {
          case '60': // Frankfurt am Main
            lat = 50.1109;
            lng = 8.6821;
            city = 'Frankfurt am Main';
            console.log('Using fallback for PLZ area 60xxx (Frankfurt am Main):', lat, lng);
            break;
          case '61': // Hochtaunus (Bad Homburg, Oberursel, etc.)
            lat = 50.2268;
            lng = 8.6319;
            city = 'Bad Homburg v.d. Höhe';
            console.log('Using fallback for PLZ area 61xxx (Hochtaunus - Bad Homburg):', lat, lng);
            break;
          case '62': // Wiesbaden
            lat = 50.0782;
            lng = 8.2398;
            city = 'Wiesbaden';
            console.log('Using fallback for PLZ area 62xxx (Wiesbaden):', lat, lng);
            break;
          case '63': // Mainz
            lat = 49.9995;
            lng = 8.2736;
            city = 'Mainz';
            console.log('Using fallback for PLZ area 63xxx (Mainz):', lat, lng);
            break;
          case '64': // Darmstadt
            lat = 49.8728;
            lng = 8.6512;
            city = 'Darmstadt';
            console.log('Using fallback for PLZ area 64xxx (Darmstadt):', lat, lng);
            break;
          case '65': // Hanau
            lat = 50.1264;
            lng = 8.9281;
            city = 'Hanau';
            console.log('Using fallback for PLZ area 65xxx (Hanau):', lat, lng);
            break;
          case '66': // Fulda
            lat = 50.5548;
            lng = 9.6808;
            city = 'Fulda';
            console.log('Using fallback for PLZ area 66xxx (Fulda):', lat, lng);
            break;
          case '67': // Rheinland-Pfalz (Kaiserslautern)
            lat = 49.4447;
            lng = 7.7689;
            city = 'Kaiserslautern';
            console.log('Using fallback for PLZ area 67xxx (Kaiserslautern):', lat, lng);
            break;
          case '0': // Sachsen
            lat = 51.0504;
            lng = 13.7373;
            city = 'Dresden';
            console.log('Using fallback for PLZ area 0xx (Sachsen - Dresden):', lat, lng);
            break;
          case '1': // Brandenburg/Berlin
            lat = 52.5200;
            lng = 13.4050;
            city = 'Berlin';
            console.log('Using fallback for PLZ area 1xx (Brandenburg/Berlin):', lat, lng);
            break;
          case '2': // Schleswig-Holstein/Mecklenburg-Vorpommern
            lat = 53.5511;
            lng = 9.9937;
            city = 'Hamburg';
            console.log('Using fallback for PLZ area 2xx (SH/MVP - Hamburg):', lat, lng);
            break;
          case '3': // Niedersachsen/Bremen
            lat = 52.3705;
            lng = 9.7331;
            city = 'Hannover';
            console.log('Using fallback for PLZ area 3xx (Niedersachsen/Bremen - Hannover):', lat, lng);
            break;
          case '4': // Sachsen-Anhalt/Thüringen/NRW
            lat = 51.3397;
            lng = 12.3731;
            city = 'Leipzig';
            console.log('Using fallback for PLZ area 4xx (Sachsen-Anhalt - Leipzig):', lat, lng);
            break;
          case '5': // Rheinland-Pfalz/Saarland
            lat = 49.9995;
            lng = 8.2736;
            city = 'Mainz';
            console.log('Using fallback for PLZ area 5xx (Rheinland-Pfalz/Saarland - Mainz):', lat, lng);
            break;
          case '7': // Baden-Württemberg
            lat = 48.7758;
            lng = 9.1829;
            city = 'Stuttgart';
            console.log('Using fallback for PLZ area 7xx (Baden-Württemberg - Stuttgart):', lat, lng);
            break;
          case '8': // Bayern
            lat = 48.1351;
            lng = 11.5820;
            city = 'München';
            console.log('Using fallback for PLZ area 8xx (Bayern - München):', lat, lng);
            break;
          case '9': // Bayern
            lat = 49.4518;
            lng = 11.0761;
            city = 'Nürnberg';
            console.log('Using fallback for PLZ area 9xx (Bayern - Nürnberg):', lat, lng);
            break;
          default:
            console.log('Unknown PLZ area:', plz);
        }
        
        if (lat && lng) break;
        continue;
      }

      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Energie-Sparschwein/1.0' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Filter out non-German results
            const result = data[0];
            if (result.display_name && result.display_name.includes('Deutschland')) {
              lat = parseFloat(result.lat);
              lng = parseFloat(result.lon);
              // Extract city from display_name
              const parts = result.display_name.split(', ');
              city = parts.find((part: string) => /^\d{5}/.test(part)) ? parts[parts.findIndex((part: string) => /^\d{5}/.test(part)) - 1] : parts[0];
              console.log('Geocoding successful with URL:', url, 'Coordinates:', lat, lng, 'City:', city);
              break;
            } else {
              console.log('Skipping non-German result:', result.display_name);
            }
          }
        }
      } catch (error) {
        console.log('Geocoding attempt failed for URL:', url, error);
      }
    }

    if (!lat || !lng) {
      console.log('All geocoding attempts failed for PLZ:', plz);
      return getMockData(plz);
    }

    if (!apiKey) {
      console.log('No API key configured');
      return getMockData(plz);
    }

    console.log('API key loaded:', !!apiKey, 'length:', apiKey.length);

    // Get stations from Tankerkönig API
    const tankerUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${radius}&type=all&apikey=${apiKey}`;
    console.log('Calling Tankerkönig API for coordinates:', lat, lng, 'Radius:', radius, 'URL length:', tankerUrl.length);
    const tankerResponse = await fetch(tankerUrl);

    console.log('Tankerkönig response status:', tankerResponse.status);

    if (!tankerResponse.ok) {
      console.log('Tankerkönig API error:', tankerResponse.status);
      return getMockData(plz);
    }

    const tankerData = await tankerResponse.json();

    console.log('Tankerkönig response ok:', tankerData.ok, 'stations count:', tankerData.stations?.length || 0);

    if (!tankerData.ok || !tankerData.stations || tankerData.stations.length === 0) {
      console.log('Tankerkönig API returned no stations or error');
      return getMockData(plz);
    }

    // Get the closest stations in the area
    const relevantStations = tankerData.stations
      .filter((station: any) => {
        // Check if station has any of the selected fuels
        const hasFuel = fuels.some(fuel => {
          switch (fuel) {
            case 'diesel': return station.diesel && station.diesel > 0;
            case 'e5': return station.e5 && station.e5 > 0;
            case 'e10': return station.e10 && station.e10 > 0;
            case 'e5plus': return station.e5 && station.e5 > 0; // Same as e5 for now
            case 'lpg': return station.lpg && station.lpg > 0;
            case 'cng': return station.cng && station.cng > 0;
            case 'hvodiesel': return station.hvodiesel && station.hvodiesel > 0;
            case 'h2': return station.h2 && station.h2 > 0;
            default: return false;
          }
        });
        return hasFuel;
      })
      .sort((a: any, b: any) => a.dist - b.dist) // Sort by distance
      .slice(0, 20) // Take closest 20
      .map((station: any) => ({
        id: station.id,
        name: station.name,
        brand: station.brand,
        street: `${station.street} ${station.houseNumber}`.trim(),
        place: `${station.place} (${station.postCode})`,
        dist: station.dist,
        prices: {
          diesel: station.diesel,
          e5: station.e5,
          e10: station.e10,
          e5plus: station.e5 ? station.e5 * 1.05 : undefined, // Mock: slightly higher
          lpg: station.lpg,
          cng: station.cng,
          hvodiesel: station.hvodiesel,
          h2: station.h2,
        }
      }));

    console.log('Found', relevantStations.length, 'stations with prices');

    return NextResponse.json({
      stations: relevantStations,
      city: city,
      source: 'tankerkoenig'
    });

  } catch (error) {
    console.error('API error:', error);
    // Fallback to mock data on any error
    return getMockData(plz);
  }
}

function getMockData(plz: string) {
  const mockStations = [
    {
      id: '1',
      name: 'Aral Tankstelle',
      brand: 'Aral',
      street: 'Hauptstraße 1',
      place: `${plz} Musterstadt`,
      dist: 0.5,
      prices: { diesel: 1.859, e5: 1.959, e10: 1.939 }
    },
    {
      id: '2',
      name: 'Shell Station',
      brand: 'Shell',
      street: 'Bahnhofstraße 10',
      place: `${plz} Musterstadt`,
      dist: 0.8,
      prices: { diesel: 1.879, e5: 1.979, e10: 1.959 }
    },
    {
      id: '3',
      name: 'Esso Tankcenter',
      brand: 'Esso',
      street: 'Industriestraße 5',
      place: `${plz} Musterstadt`,
      dist: 1.2,
      prices: { diesel: 1.849, e5: 1.949, e10: 1.929 }
    },
    {
      id: '4',
      name: 'Total Tankstelle',
      brand: 'Total',
      street: 'Marktplatz 3',
      place: `${plz} Musterstadt`,
      dist: 1.5,
      prices: { diesel: 1.889, e5: 1.989, e10: 1.969 }
    },
    {
      id: '5',
      name: 'Jet Tankstation',
      brand: 'Jet',
      street: 'Autobahn A100',
      place: `${plz} Musterstadt`,
      dist: 2.0,
      prices: { diesel: 1.869, e5: 1.969, e10: 1.949 }
    }
  ];

  return NextResponse.json({
    stations: mockStations.sort((a, b) => a.prices.diesel - b.prices.diesel),
    city: 'Musterstadt',
    source: 'mock',
    note: 'Live-Preise nicht verfügbar. Demo-Daten werden angezeigt.'
  });
}