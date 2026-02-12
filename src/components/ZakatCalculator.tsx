import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Info, BookOpen } from "lucide-react";

interface ZakatCalculatorProps {
  onClose?: () => void;
}

interface ZakatCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  nisab: number; // minimum threshold
  rate: number; // percentage rate
  unit: string;
}

const zakatCategories: ZakatCategory[] = [
  {
    id: "cash",
    name: "Cash & Savings",
    icon: "💰",
    description: "Money in bank accounts, cash at hand, investments",
    nisab: 85, // grams of gold equivalent (~$7000 USD)
    rate: 2.5,
    unit: "USD",
  },
  {
    id: "gold",
    name: "Gold",
    icon: "🥇",
    description: "Gold jewelry, coins, and bullion",
    nisab: 85, // grams
    rate: 2.5,
    unit: "grams",
  },
  {
    id: "silver",
    name: "Silver",
    icon: "🥈",
    description: "Silver jewelry, coins, and items",
    nisab: 595, // grams
    rate: 2.5,
    unit: "grams",
  },
  {
    id: "business",
    name: "Business Assets",
    icon: "🏪",
    description: "Trading goods, business inventory",
    nisab: 85, // gold equivalent
    rate: 2.5,
    unit: "USD",
  },
  {
    id: "livestock",
    name: "Livestock",
    icon: "🐄",
    description: "Cattle, sheep, goats, camels",
    nisab: 5, // minimum animals
    rate: 0, // varies by type and number
    unit: "animals",
  },
  {
    id: "agriculture",
    name: "Agricultural Produce",
    icon: "🌾",
    description: "Crops, fruits, and agricultural output",
    nisab: 653, // kg
    rate: 5, // 5% for irrigated, 10% for rain-fed
    unit: "kg",
  },
];

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("cash");
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleAmountChange = (categoryId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmounts((prev) => ({ ...prev, [categoryId]: numValue }));
  };

  const calculateZakat = (category: ZakatCategory, amount: number): number => {
    if (amount < category.nisab) return 0;

    if (category.id === "livestock") {
      // Simplified livestock calculation (actual calculation is more complex)
      if (amount >= 5 && amount <= 24) return 1; // 1 sheep/goat
      if (amount >= 25 && amount <= 35) return 1; // 1 young camel
      return Math.floor(amount / 5); // Simplified
    }

    if (category.id === "agriculture") {
      // 5% for irrigated, 10% for rain-fed (using 7.5% average)
      return (amount * 7.5) / 100;
    }

    return (amount * category.rate) / 100;
  };

  const getTotalZakat = (): number => {
    return zakatCategories.reduce((total, category) => {
      const amount = amounts[category.id] || 0;
      return total + calculateZakat(category, amount);
    }, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const selectedCat = zakatCategories.find((c) => c.id === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Zakat Calculator</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Info className="w-5 h-5" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/20 rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                About Zakat
              </h3>
              <p className="text-sm opacity-90 mb-2">
                Zakat is one of the Five Pillars of Islam and a form of obligatory charity. It is
                calculated as 2.5% of wealth that has been held for a full lunar year and exceeds
                the nisab (minimum threshold).
              </p>
              <ul className="text-sm opacity-90 space-y-1">
                <li>• Nisab for cash/gold: 85 grams of gold (~$7,000 USD)</li>
                <li>• Nisab for silver: 595 grams of silver</li>
                <li>• Must be paid annually on eligible wealth</li>
                <li>• Consult a scholar for complex situations</li>
              </ul>
            </motion.div>
          )}

          {/* Total Zakat Display */}
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-1">Total Zakat Due</p>
              <p className="text-3xl font-bold">{formatCurrency(getTotalZakat())}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[500px]">
          {/* Category Selector */}
          <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="font-semibold text-gray-800 mb-4">Wealth Categories</h2>
            <div className="space-y-2">
              {zakatCategories.map((category) => {
                const amount = amounts[category.id] || 0;
                const zakatAmount = calculateZakat(category, amount);
                const isEligible = amount >= category.nisab;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedCategory === category.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{category.icon}</span>
                      {zakatAmount > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                          {category.id === "livestock"
                            ? `${zakatAmount} animals`
                            : formatCurrency(zakatAmount)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                    {amount > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isEligible ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs text-gray-600">
                          {isEligible ? "Above nisab" : "Below nisab"}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculator Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedCat && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{selectedCat.icon}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{selectedCat.name}</h2>
                    <p className="text-gray-600">{selectedCat.description}</p>
                  </div>
                </div>

                {/* Nisab Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Nisab Threshold
                  </h3>
                  <p className="text-blue-700 text-sm">
                    The minimum amount for this category is {selectedCat.nisab} {selectedCat.unit}.
                    Zakat is {selectedCat.rate}% of the amount above this threshold.
                  </p>
                </div>

                {/* Input Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Amount ({selectedCat.unit})
                    </label>
                    <div className="relative">
                      {selectedCat.unit === "USD" && (
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                      <input
                        type="number"
                        placeholder={`Enter amount in ${selectedCat.unit}`}
                        value={amounts[selectedCat.id] || ""}
                        onChange={(e) => handleAmountChange(selectedCat.id, e.target.value)}
                        className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          selectedCat.unit === "USD" ? "pl-10" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Calculation Results */}
                  {amounts[selectedCat.id] > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-800 mb-3">Calculation Results</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Amount:</span>
                          <span className="font-medium">
                            {amounts[selectedCat.id]} {selectedCat.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nisab Threshold:</span>
                          <span>
                            {selectedCat.nisab} {selectedCat.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span
                            className={`font-medium ${
                              amounts[selectedCat.id] >= selectedCat.nisab
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {amounts[selectedCat.id] >= selectedCat.nisab
                              ? "Zakat Required"
                              : "Below Nisab"}
                          </span>
                        </div>
                        {amounts[selectedCat.id] >= selectedCat.nisab && (
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-lg font-semibold text-emerald-600">
                              <span>Zakat Due:</span>
                              <span>
                                {selectedCat.id === "livestock"
                                  ? `${calculateZakat(selectedCat, amounts[selectedCat.id])} animals`
                                  : formatCurrency(
                                      calculateZakat(selectedCat, amounts[selectedCat.id]),
                                    )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Special Instructions */}
                  {selectedCat.id === "livestock" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-800 mb-2">Note on Livestock Zakat</h3>
                      <p className="text-yellow-700 text-sm">
                        Livestock zakat calculation is complex and varies by animal type, age, and
                        number. This is a simplified calculation. Please consult with a qualified
                        Islamic scholar for accurate assessment.
                      </p>
                    </div>
                  )}

                  {selectedCat.id === "agriculture" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Agricultural Zakat</h3>
                      <p className="text-green-700 text-sm">
                        Rate varies: 10% for rain-fed crops, 5% for irrigated crops. This calculator
                        uses an average of 7.5%. Adjust based on your specific farming method.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
