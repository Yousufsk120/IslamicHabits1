import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Info } from "lucide-react";

export type CalculationMethodType =
  | "MuslimWorldLeague"
  | "Egyptian"
  | "Karachi"
  | "UmmAlQura"
  | "Dubai"
  | "MoonsightingCommittee"
  | "NorthAmerica"
  | "Kuwait"
  | "Qatar"
  | "Singapore"
  | "Tehran";

interface CalculationMethodSelectorProps {
  selectedMethod: CalculationMethodType;
  onMethodChange: (method: CalculationMethodType) => void;
}

export const CalculationMethodSelector: React.FC<CalculationMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculationMethods = [
    {
      key: "MuslimWorldLeague" as CalculationMethodType,
      name: "Muslim World League",
      description: "Standard method used by many Islamic organizations worldwide",
      regions: "Global default, Europe, Americas",
    },
    {
      key: "Egyptian" as CalculationMethodType,
      name: "Egyptian General Authority",
      description: "Egyptian General Authority of Survey method",
      regions: "Egypt, some African countries",
    },
    {
      key: "Karachi" as CalculationMethodType,
      name: "University of Islamic Sciences, Karachi",
      description: "Hanafi jurisprudence method",
      regions: "Pakistan, India, Afghanistan, parts of Turkey",
    },
    {
      key: "UmmAlQura" as CalculationMethodType,
      name: "Umm Al-Qura University",
      description: "Method used in Saudi Arabia",
      regions: "Saudi Arabia",
    },
    {
      key: "Dubai" as CalculationMethodType,
      name: "Dubai (IACAD)",
      description: "Islamic Affairs and Charitable Activities Department, Dubai",
      regions: "Dubai, UAE",
    },
    {
      key: "MoonsightingCommittee" as CalculationMethodType,
      name: "Moonsighting Committee Worldwide",
      description: "Based on moon sighting methodology",
      regions: "Global (traditional approach)",
    },
    {
      key: "NorthAmerica" as CalculationMethodType,
      name: "Islamic Society of North America",
      description: "ISNA method for North America",
      regions: "USA, Canada",
    },
    {
      key: "Kuwait" as CalculationMethodType,
      name: "Kuwait",
      description: "Ministry of Awqaf and Islamic Affairs, Kuwait",
      regions: "Kuwait",
    },
    {
      key: "Qatar" as CalculationMethodType,
      name: "Qatar",
      description: "Ministry of Awqaf and Islamic Affairs, Qatar",
      regions: "Qatar",
    },
    {
      key: "Singapore" as CalculationMethodType,
      name: "Singapore",
      description: "Majlis Ugama Islam Singapura",
      regions: "Singapore",
    },
    {
      key: "Tehran" as CalculationMethodType,
      name: "Institute of Geophysics, Tehran",
      description: "Method used in Iran",
      regions: "Iran",
    },
  ];

  const selectedMethodInfo = calculationMethods.find((m) => m.key === selectedMethod);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span className="truncate max-w-32">{selectedMethodInfo?.name || selectedMethod}</span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
        >
          <h4 className="font-semibold text-gray-800 mb-4">Prayer Calculation Method</h4>

          <div className="max-h-80 overflow-y-auto space-y-3">
            {calculationMethods.map((method) => (
              <div
                key={method.key}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedMethod === method.key
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => {
                  onMethodChange(method.key);
                  setIsExpanded(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 text-sm">{method.name}</h5>
                    <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      <span className="font-medium">Regions:</span> {method.regions}
                    </p>
                  </div>
                  {selectedMethod === method.key && <div className="ml-2 text-green-600">✓</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">About Calculation Methods</p>
                <p className="mt-1">
                  Different regions and Islamic organizations use various methods to calculate
                  prayer times based on the angle of the sun. Choose the method commonly used in
                  your region for the most accurate times.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};
