'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Station {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  dist: number;
  prices: {
    diesel?: number;
    e5?: number;
    e10?: number;
    e5plus?: number;
    lpg?: number;
    cng?: number;
    hvodiesel?: number;
    h2?: number;
  };
}

interface SparCheckStorageData {
  zip?: string;
}

const FUEL_OPTIONS = [
  { key: 'e5', label: 'E5', color: 'bg-yellow-400' },
  { key: 'e10', label: 'E10', color: 'bg-yellow-500' },
  { key: 'diesel', label: 'Diesel', color: 'bg-green-500' },
  { key: 'lpg', label: 'LPG', color: 'bg-purple-500' },
  { key: 'cng', label: 'CNG', color: 'bg-blue-500' },
  { key: 'hvodiesel', label: 'HVO', color: 'bg-green-600' },
  { key: 'h2', label: 'H₂', color: 'bg-red-500' },
];

const RADIUS_STEPS = [5, 10, 15, 25];

export default function GuenstigTanken() {
  const [plz, setPlz] = useState('');
  const [city, setCity] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [radius, setRadius] = useState(15);
  const [selectedFuels, setSelectedFuels] = useState<string[]>(['diesel', 'e5', 'e10']);
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [stickHeader, setStickHeader] = useState(false);
  const [mode, setMode] = useState<'tanken' | 'laden'>('tanken');

  // Load city when PLZ is entered
  const loadCity = useCallback(async (zipCode: string) => {
    if (zipCode.length !== 5) return;

    setLoadingCity(true);
    try {
      const response = await fetch(`/api/tanken/${zipCode}`);
      if (!response.ok) throw new Error('API Fehler');
      const data = await response.json();
      setCity(data.city || 'Unbekannt');
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoadingCity(false);
    }
  }, []);

  // Get current location and find nearest PLZ
  const getCurrentLocationPLZ = async () => {
    setLoadingGeo(true);
    setError('');
    
    try {
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => {
            if (err.code === 1) reject(new Error('Standortzugriff verweigert'));
            else if (err.code === 2) reject(new Error('Standort nicht verfügbar'));
            else reject(new Error('Fehler beim Abrufen des Standorts'));
          },
          { timeout: 10000, enableHighAccuracy: false }
        );
      });

      // Reverse geocode to get address/PLZ using Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}`
      );
      
      if (!response.ok) throw new Error('Geocoding Fehler');
      const addressData = await response.json();
      
      // Extract PLZ from address
      const foundPlz = addressData.address?.postcode;
      if (!foundPlz || !/^\d{5}$/.test(foundPlz)) {
        throw new Error('Keine gültige Postleitzahl gefunden');
      }

      // Set PLZ and trigger search
      setPlz(foundPlz);
      await loadCity(foundPlz);
      searchStations(foundPlz, 15, ['diesel', 'e5', 'e10']);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Standort konnte nicht bestimmt werden';
      setError(errorMsg);
      console.error('Geolocation Error:', err);
    } finally {
      setLoadingGeo(false);
    }
  };

  // Search stations with current filters
  const searchStations = useCallback(async (searchPlz?: string, searchRadius?: number, searchFuels?: string[]) => {
    const searchZip = searchPlz || plz;
    const useRadius = searchRadius ?? radius;
    const useFuels = searchFuels || selectedFuels;

    if (searchZip.length !== 5 || useFuels.length === 0) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/tanken/${searchZip}?radius=${useRadius}&fuels=${useFuels.join(',')}`);
      if (!response.ok) throw new Error('API Fehler');
      const data = await response.json();
      setStations(data.stations || []);
      setSearched(true);
      
      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Fehler beim Laden der Tankstellen.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [plz, radius, selectedFuels]);

  const handlePlzChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setPlz(value);
    if (value.length === 5) {
      loadCity(value);
      searchStations(value, radius, selectedFuels);
    } else {
      setCity('');
      setStations([]);
      setSearched(false);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (plz.length === 5) {
      searchStations(plz, newRadius, selectedFuels);
    }
  };

  const handleFuelToggle = (fuel: string) => {
    const newFuels = selectedFuels.includes(fuel)
      ? selectedFuels.filter(f => f !== fuel)
      : [...selectedFuels, fuel];
    
    if (newFuels.length > 0) {
      setSelectedFuels(newFuels);
      if (plz.length === 5 && searched) {
        searchStations(plz, radius, newFuels);
      }
    }
  };

  const getPriceDisplay = (prices: Station['prices'], fuel: string) => {
    const priceMap: { [key: string]: keyof Station['prices'] } = {
      diesel: 'diesel',
      e5: 'e5',
      e10: 'e10',
      e5plus: 'e5plus',
      lpg: 'lpg',
      cng: 'cng',
      hvodiesel: 'hvodiesel',
      h2: 'h2',
    };
    const price = prices[priceMap[fuel]];
    return price ? price.toFixed(3) : null;
  };

  // Load from localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plzParam = params.get('plz');

    if (plzParam && /^\d{5}$/.test(plzParam)) {
      setPlz(plzParam);
      loadCity(plzParam);
      searchStations(plzParam, 15, ['diesel', 'e5', 'e10']);
    } else {
      const savedData = localStorage.getItem('sparCheckData');
      if (savedData) {
        const data = JSON.parse(savedData) as SparCheckStorageData;
        if (data.zip && /^\d{5}$/.test(data.zip)) {
          setPlz(data.zip);
          loadCity(data.zip);
          searchStations(data.zip, 15, ['diesel', 'e5', 'e10']);
        }
      }
    }
  }, [loadCity, searchStations]);

  // Scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setStickHeader(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-linear-to-b from-slate-900 to-slate-800 text-white">
        <div className="px-6 pt-32 pb-16 md:pb-24 max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80 mb-4">Kraftstoffpreise</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">Günstig tanken</h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">Die günstigsten Tankstellen in deiner Nähe – live und kostenlos.</p>

          {/* Large PLZ Input */}
          <div className="mb-8">
            <div className="flex gap-2 items-stretch">
              <input
                type="text"
                placeholder="Gib deine Postleitzahl ein"
                value={plz}
                onChange={handlePlzChange}
                className="flex-1 px-6 py-4 text-2xl rounded-lg bg-white text-black border-0 focus:ring-2 focus:ring-primary font-semibold text-center"
                maxLength={5}
              />
              <button
                onClick={getCurrentLocationPLZ}
                disabled={loadingGeo}
                className={`px-6 py-4 rounded-lg font-semibold transition flex items-center justify-center whitespace-nowrap ${
                  loadingGeo
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
                title="Aktuelle Position verwenden"
              >
                {loadingGeo ? (
                  <span className="animate-spin">📍</span>
                ) : (
                  <span>📍</span>
                )}
              </button>
            </div>
            {city && <p className="text-primary font-semibold mt-3">{city}</p>}
            {loadingCity && <p className="text-gray-400 text-sm mt-3">Stadt wird geladen...</p>}
            {loadingGeo && <p className="text-gray-300 text-sm mt-3">Standort wird ermittelt...</p>}
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 justify-center mb-8">
            <button
              onClick={() => setMode('tanken')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === 'tanken'
                  ? 'bg-primary text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              ⛽ Tanken
            </button>
            <button
              onClick={() => setMode('laden')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === 'laden'
                  ? 'bg-primary text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              🔌 Laden (bald)
            </button>
          </div>

          {/* Fuel Selection */}
          {plz.length === 5 && (
            <div>
              <p className="text-sm text-gray-400 mb-3">Wähle Treibstoffe:</p>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {FUEL_OPTIONS.map(fuel => (
                  <button
                    key={fuel.key}
                    onClick={() => handleFuelToggle(fuel.key)}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      selectedFuels.includes(fuel.key)
                        ? `${fuel.color} text-black`
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {fuel.label}
                  </button>
                ))}
              </div>

              {/* Radius Selection */}
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Radius: {radius} km</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {RADIUS_STEPS.map(r => (
                    <button
                      key={r}
                      onClick={() => handleRadiusChange(r)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition ${
                        radius === r
                          ? 'bg-primary text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Header (appears after scrolling past hero) */}
      {stickHeader && (
        <div className="sticky top-0 z-50 bg-linear-to-b from-slate-900 to-slate-800 text-white shadow-lg">
          <div className="px-4 py-2 max-w-4xl mx-auto">
            <div className="flex gap-2 items-center justify-center">
              <input
                type="text"
                placeholder="PLZ"
                value={plz}
                onChange={handlePlzChange}
                className="w-20 px-2 py-1 text-sm rounded bg-white text-black border-0 focus:ring-2 focus:ring-primary font-semibold"
                maxLength={5}
              />
              {city && <span className="text-xs font-semibold">{city}</span>}
              <span className="text-xs text-gray-400 ml-auto">{radius} km • {selectedFuels.length} Fuels</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <section ref={resultsRef} className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {!searched && plz.length === 5 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Scrolle nach oben um die Filters zu nutzen</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary"></div>
              </div>
              <p className="text-gray-600 mt-4 text-sm">Laden...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-4">
              <p className="text-red-800 text-sm font-semibold">{error}</p>
            </div>
          )}

          {searched && !loading && stations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 font-semibold text-sm">Keine Tankstellen gefunden</p>
            </div>
          )}

          {stations.length > 0 && (
            <div>
              <p className="text-gray-600 text-xs mb-3 font-semibold">
                {stations.length} Station{stations.length !== 1 ? 'en' : ''}
              </p>
              <div className="space-y-2">
                {stations.map((station, index) => (
                  <div key={station.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200">
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                            <h3 className="font-semibold text-sm text-gray-900">{station.name}</h3>
                          </div>
                          <p className="text-xs text-gray-600">{station.street}</p>
                          <p className="text-xs text-gray-500">{station.place} • {station.dist.toFixed(1)} km</p>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${station.street},${station.place}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 bg-primary hover:bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold transition whitespace-nowrap"
                        >
                          📍
                        </a>
                      </div>

                      {/* Prices */}
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-1 mt-2">
                        {FUEL_OPTIONS.map(fuel => {
                          const price = getPriceDisplay(station.prices, fuel.key);
                          return price ? (
                            <div key={fuel.key} className="flex items-center gap-1">
                              <div className={`w-1.5 h-5 rounded ${fuel.color}`}></div>
                              <div>
                                <p className="text-xs text-gray-600 leading-none">{fuel.label}</p>
                                <p className="font-bold text-xs text-gray-900">{price}€</p>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
