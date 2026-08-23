import { useEffect, useState, RefObject, useRef } from 'react';
import { Map, TileLayer } from 'leaflet';
import { City } from '../types/common';

const useMap = (
  mapRef: RefObject<HTMLElement | null>,
  city: City,
): Map | null => {
  const [map, setMap] = useState<Map | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    const mapElement = mapRef.current;

    if (mapElement !== null && mapInstanceRef.current === null) {
      const instance = new Map(mapElement, {
        center: {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        zoom: city.location.zoom,
      });

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      );

      instance.addLayer(layer);
      mapInstanceRef.current = instance;
      setMap(instance);
    }

    return () => {
      if (mapInstanceRef.current !== null && !document.body.contains(mapElement)) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMap(null);
      }
    };
  }, [mapRef, city.location.latitude, city.location.longitude, city.location.zoom]);

  useEffect(() => {
    if (map) {
      map.setView(
        {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        city.location.zoom,
        {
          animate: false,
        },
      );
    }
  }, [map, city]);

  return map;
};

export default useMap;
