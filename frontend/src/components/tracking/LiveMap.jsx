import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTrainMarker } from '../../hooks/useTrainMarker';
import { Navigation, Compass, LocateFixed } from 'lucide-react';

// Clean Light Basemap Style (Watermark-free)
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const HAS_VALID_MAPTILER_KEY = MAPTILER_KEY && MAPTILER_KEY !== 'get_your_own_free_maptiler_key';

const LIGHT_RASTER_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const MAP_STYLE = HAS_VALID_MAPTILER_KEY
  ? `https://api.maptiler.com/maps/backdrop-light/style.json?key=${MAPTILER_KEY}`
  : LIGHT_RASTER_STYLE;

export default function LiveMap({
  selectedTrain,
  routeData,
  livePosition,
  allTrains = [],
  onSelectTrain,
  onSelectStation
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const trainMarkerRef = useRef(null);
  const stationMarkersRef = useRef([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [followTrain, setFollowTrain] = useState(true);
  const [is3D, setIs3D] = useState(false);

  // Extract clean polyline coordinates from route geometry or stations
  const routeCoordinates = React.useMemo(() => {
    return (
      routeData?.geometry?.coordinates ||
      routeData?.polyline ||
      (Array.isArray(routeData?.stations) && routeData.stations.length > 1
        ? routeData.stations
            .map((s) => [
              typeof (s.longitude ?? s.lng) === 'number' ? (s.longitude ?? s.lng) : parseFloat(s.longitude ?? s.lng),
              typeof (s.latitude ?? s.lat) === 'number' ? (s.latitude ?? s.lat) : parseFloat(s.latitude ?? s.lat)
            ])
            .filter(([lng, lat]) => !isNaN(lng) && !isNaN(lat))
        : [])
    );
  }, [routeData]);

  // Smooth marker interpolation hook with route track snapping
  const animatedPos = useTrainMarker(livePosition, routeCoordinates, 2500);

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance;
    try {
      mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        center: [77.2090, 28.6139], // New Delhi default
        zoom: 5.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false
      });
    } catch (err) {
      console.warn('[LiveMap] MapLibre creation error:', err);
      return;
    }

    mapRef.current = mapInstance;

    mapInstance.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      'top-right'
    );

    mapInstance.on('dragstart', () => {
      setFollowTrain(false);
    });

    mapInstance.on('load', () => {
      setMapLoaded(true);
      mapInstance.resize();
    });

    // Handle container dimension changes across tab switches / flex layout
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstance && !mapInstance._removed) {
        mapInstance.resize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial resize fallbacks for React tab mounting
    const timer1 = setTimeout(() => mapInstance.resize(), 100);
    const timer2 = setTimeout(() => mapInstance.resize(), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      if (mapInstance && !mapInstance._removed) {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, []);

  // 2. Draw Complete GeoJSON Route Line in Dark Blue (#0057B8)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = 'train-route-source';
    const lineLayerId = 'train-route-line';
    const casingLayerId = 'train-route-casing';

    const coordinates = routeCoordinates;

    if (coordinates && coordinates.length > 1) {
      const geojson = {
        type: 'Feature',
        properties: {
          trainNumber: selectedTrain?.number || routeData?.trainNumber || ''
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      };

      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(geojson);
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: geojson
        });
      }

      // Route Casing (outer contrast border for maximum distinction against basemap)
      if (!map.getLayer(casingLayerId)) {
        map.addLayer({
          id: casingLayerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#002D62',
            'line-width': 9.5,
            'line-opacity': 0.9
          }
        });
      } else {
        map.setPaintProperty(casingLayerId, 'line-color', '#002D62');
        map.setPaintProperty(casingLayerId, 'line-width', 9.5);
        map.setPaintProperty(casingLayerId, 'line-opacity', 0.9);
      }

      // Route Center Line (prominent Dark Blue #0057B8 track)
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0057B8',
            'line-width': 6.5,
            'line-opacity': 1.0
          }
        });
      } else {
        map.setPaintProperty(lineLayerId, 'line-color', '#0057B8');
        map.setPaintProperty(lineLayerId, 'line-width', 6.5);
        map.setPaintProperty(lineLayerId, 'line-opacity', 1.0);
      }

      // Fit bounds to complete route with smooth transition
      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach(([lng, lat]) => {
        if (typeof lng === 'number' && typeof lat === 'number' && !isNaN(lng) && !isNaN(lat)) {
          bounds.extend([lng, lat]);
        }
      });

      if (!bounds.isEmpty()) {
        const rightPad = window.innerWidth > 1024 ? 380 : 60;
        map.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: rightPad },
          maxZoom: 11,
          duration: 1000
        });
      }
    } else {
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getLayer(casingLayerId)) map.removeLayer(casingLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }
  }, [routeCoordinates, mapLoaded, selectedTrain?.number]);

  // 3. Render Station Markers with Tooltips
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous station markers
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];

    const stationsList = routeData?.stations || [];
    if (stationsList.length === 0) return;

    stationsList.forEach((stn) => {
      const lat = typeof (stn.latitude ?? stn.lat) === 'number' ? (stn.latitude ?? stn.lat) : parseFloat(stn.latitude ?? stn.lat);
      const lng = typeof (stn.longitude ?? stn.lng) === 'number' ? (stn.longitude ?? stn.lng) : parseFloat(stn.longitude ?? stn.lng);
      if (isNaN(lat) || isNaN(lng)) return;

      const el = document.createElement('div');
      el.className = 'map-station-marker';
      el.innerHTML = `
        <div class="station-marker-dot"></div>
        <div class="station-marker-label">${stn.code || stn.stationCode}</div>
      `;

      el.addEventListener('click', () => {
        if (onSelectStation) onSelectStation(stn);
        map.flyTo({ center: [lng, lat], zoom: 12, duration: 800 });
      });

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
          <strong style="color: #003B73;">${stn.name || stn.code} (${stn.code || stn.stationCode})</strong>
          <div style="color: #64748B; margin-top: 2px;">
            Arr: ${stn.scheduledArrival || '--'} | Dep: ${stn.scheduledDeparture || '--'}
          </div>
          ${stn.platform ? `<div style="font-size: 11px; color: #0284C7; font-weight: bold;">Platform: ${stn.platform}</div>` : ''}
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      stationMarkersRef.current.push(marker);
    });
  }, [routeData?.stations, mapLoaded, onSelectStation]);

  // 4. Update Main Selected Train Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !animatedPos?.longitude || !animatedPos?.latitude) return;

    if (!trainMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'live-train-marker-element';
      el.innerHTML = `
        <div class="train-pulse-ring"></div>
        <div class="train-loco-icon" id="marker-loco-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="#003B73" stroke="#FFFFFF" stroke-width="2"/>
          </svg>
        </div>
        <div class="train-marker-badge" id="marker-badge">
          ${selectedTrain?.number || 'TRAIN'} • ${livePosition?.speedKmh || selectedTrain?.speed || 0} km/h
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, rotationAlignment: 'map' })
        .setLngLat([animatedPos.longitude, animatedPos.latitude])
        .addTo(map);

      trainMarkerRef.current = marker;
    } else {
      trainMarkerRef.current.setLngLat([animatedPos.longitude, animatedPos.latitude]);

      const icon = document.getElementById('marker-loco-icon');
      if (icon) {
        icon.style.transform = `rotate(${animatedPos.bearing || 0}deg)`;
      }

      const badge = document.getElementById('marker-badge');
      if (badge && selectedTrain) {
        badge.innerText = `${selectedTrain.number} • ${livePosition?.speedKmh || selectedTrain.speed || 0} km/h`;
      }
    }

    if (followTrain) {
      map.easeTo({
        center: [animatedPos.longitude, animatedPos.latitude],
        duration: 800
      });
    }
  }, [animatedPos, followTrain, mapLoaded, selectedTrain, livePosition?.speedKmh]);

  // Handle 3D Tilt toggle
  const toggle3D = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const next3D = !is3D;
    setIs3D(next3D);
    map.easeTo({
      pitch: next3D ? 45 : 0,
      duration: 800
    });
  }, [is3D]);

  // Recenter on Train
  const handleRecenter = useCallback(() => {
    const map = mapRef.current;
    if (!map || !animatedPos?.longitude) return;
    setFollowTrain(true);
    map.flyTo({
      center: [animatedPos.longitude, animatedPos.latitude],
      zoom: 11,
      duration: 1000
    });
  }, [animatedPos]);

  return (
    <div className="live-map-container">
      {/* MapLibre DOM viewport */}
      <div ref={mapContainerRef} className="maplibre-viewport" />

      {/* Floating Map Controls */}
      <div className="map-floating-toolbar">
        <button
          type="button"
          className={`map-tool-btn ${followTrain ? 'active' : ''}`}
          onClick={() => setFollowTrain(!followTrain)}
          title={followTrain ? 'Follow Lock: Enabled' : 'Follow Lock: Disabled'}
        >
          <LocateFixed size={16} />
          <span>Follow</span>
        </button>

        <button
          type="button"
          className={`map-tool-btn ${is3D ? 'active' : ''}`}
          onClick={toggle3D}
          title="Toggle 2D/3D View"
        >
          <Compass size={16} />
          <span>{is3D ? '2D' : '3D'}</span>
        </button>

        <button
          type="button"
          className="map-tool-btn"
          onClick={handleRecenter}
          title="Center on Train"
        >
          <Navigation size={16} />
          <span>Focus</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="live-map-legend">
        <div className="legend-row">
          <span className="legend-symbol symbol-route" />
          <span>Active Scheduled Route</span>
        </div>
        <div className="legend-row">
          <span className="legend-symbol symbol-station" />
          <span>Scheduled Halt</span>
        </div>
        <div className="legend-row">
          <span className="legend-symbol symbol-train" />
          <span>Live GPS Telemetry</span>
        </div>
      </div>
    </div>
  );
}

