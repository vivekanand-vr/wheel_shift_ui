import React, { useState, useEffect } from "react";
import axios from "axios";

const CarModelForm = ({ setFormData }) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // Fetch car makes on mount
  useEffect(() => {
    fetchCarMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    if (selectedMake) fetchCarModels(selectedMake);
  }, [selectedMake]);

  // Fetch variants when model is selected
  useEffect(() => {
    if (selectedModel) fetchCarVariants(selectedMake, selectedModel);
  }, [selectedModel]);

  const fetchCarMakes = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/v1/car-models/makes");
      setMakes(response.data);
    } catch (error) {
      console.error("Error fetching car makes:", error);
    }
  };

  const fetchCarModels = async (make) => {
    try {
      const response = await axios.get(`http://localhost:9000/api/v1/car-models/makes/${make}/models`)
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const fetchCarVariants = async (make, model) => {
    try {
      const response = await axios.get(`http://localhost:9000/api/v1/car-models/search`, {
        params: { make, model }
      });
      setVariants(response.data);
    } catch (error) {
      console.error("Error fetching car variants:", error);
    }
  };

  const handleMakeSelect = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel(null);
    setVariants([]);
  };

  const handleModelSelect = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
  };

  const handleVariantSelect = (e) => {
    const variant = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      carModel: {
        id: variant
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Car Make
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleMakeSelect}
          required
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {selectedMake && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleModelSelect}
            required
           >
            <option value="">Select Model</option>
            {models.map(model => (
                <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        )}
    
      {selectedModel && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Car Variant</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleVariantSelect}
            required
          >
          <option value="">Select Variant</option>
          {variants.map(variant => (
            <option key={variant.id} value={variant.id}>{variant.variant}</option>
          ))}
          </select>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-2">
        <p>Note: Body type, fuel type, and transmission will be determined by the variant selection.</p>
      </div>
    </div>
  );
};

export default CarModelForm;
