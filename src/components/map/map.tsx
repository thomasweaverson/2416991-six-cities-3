import { memo, useEffect, useRef } from 'react';
import { Offer, OfferPreview } from '../../types/offer';
import useMap from '../../hooks/use-map';
import { layerGroup, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BlockName, City } from '../../types/common';
import { Block } from '../../const/common';
import { useAppSelector } from '../../hooks';
import { getActiveOffId } from '../../store/slices/app/app.selectors';
import { areMapPropsEqual } from './utils';
import { CURRENT_CUSTOM_ICON, DEFAULT_CUSTOM_ICON } from './const';

export type MapProps = {
  city: City;
  offers: (OfferPreview | Offer)[];
  block?: BlockName;
};

const Map = ({ city, offers, block = Block.CITIES }: MapProps): JSX.Element => {
  const selectedOfferId = useAppSelector(getActiveOffId);
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      offers.forEach((offer) => {
        const marker = new Marker({
          lat: offer.location.latitude,
          lng: offer.location.longitude,
        });
        marker
          .setIcon(
            selectedOfferId !== null && offer.id === selectedOfferId
              ? CURRENT_CUSTOM_ICON
              : DEFAULT_CUSTOM_ICON,
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, offers, selectedOfferId]);
  return <section className={`${block}__map map`} ref={mapRef} data-testid="map"></section>;
};

const MemoizedMap = memo(Map, areMapPropsEqual);

export default MemoizedMap;
