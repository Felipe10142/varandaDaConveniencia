import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinIcon } from "lucide-react";
import { motion } from "framer-motion";
import FadeContent from "../animations/FadeContent";
import AnimatedContent from "../animations/AnimatedContent";
import TrueFocus from "../animations/TrueFocus";
import Ribbons from "../animations/Ribbons";
const LocationMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Fix for Leaflet icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView(
        [-27.89578292116541, -48.59583685279781],
        17,
      );
      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
      // Custom marker icon
      const customIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-full h-full bg-primary rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
      // Add marker
      L.marker([-27.89578292116541, -48.59583685279781], {
        icon: customIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(
          "<b>Varanda da Conveniência</b><br>R. Aderbal Ramos da Silva, 1302",
        )
        .openPopup();
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  return (
    <section
      id="localizacao"
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <Ribbons
          baseThickness={30}
          colors={["#D62828", "#F77F00", "#F4A261"]}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={true}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="flex justify-center mb-4">
            <TrueFocus
              sentence="Nossa Localização"
              manualMode={true}
              blurAmount={3}
              borderColor="#D62828"
              glowColor="rgba(214, 40, 40, 0.6)"
              animationDuration={0.5}
            />
          </div>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-gray text-lg max-w-2xl mx-auto">
            Estamos localizados na Enseada da Pinheira, um dos lugares mais
            bonitos do litoral de Santa Catarina.
          </p>
        </motion.div>
        <FadeContent blur={true} duration={1000} className="w-full">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Map */}
            <div className="w-full md:w-2/3 h-96">
              <div ref={mapContainerRef} className="w-full h-full"></div>
            </div>
            {/* Address Info */}
            <div className="w-full md:w-1/3 p-8">
              <AnimatedContent direction="horizontal" distance={50}>
                <h3 className="text-2xl font-bold text-dark mb-4">
                  Venha nos visitar
                </h3>
                <div className="flex items-start mb-4">
                  <MapPinIcon className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Varanda da Conveniência</p>
                    <p className="text-gray">
                      R. Aderbal Ramos da Silva, 1302
                      <br />
                      Enseada da Pinheira, Palhoça - SC
                      <br />
                      CEP: 88138-351
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-bold mb-2">Horário de Funcionamento:</h4>
                  <ul className="space-y-1 text-gray">
                    <li className="flex justify-between">
                      <span>Segunda - Sexta:</span>
                      <span>09:00 - 22:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sábado:</span>
                      <span>09:00 - 23:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Domingo:</span>
                      <span>11:00 - 22:00</span>
                    </li>
                  </ul>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
};
export default LocationMap;
