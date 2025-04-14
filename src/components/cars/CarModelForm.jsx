import React, { useState, useEffect } from "react";
import axios from "axios";

const CarModelForm = ({ formData, setFormData, setStepValid, isEditMode }) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch car makes on mount
  useEffect(() => {
      fetchCarMakes();
  }, []);

  // When editing, load the car model data and fetch necessary data
  useEffect(() => {
    if (isEditMode && formData.carModel && formData.carModel.id) {
      fetchCarModelDetails(formData.carModel.id);
    }
  }, [isEditMode, formData.carModel]);

  // Fetch models when make is selected
  useEffect(() => {
    if (selectedMake) fetchCarModels(selectedMake);
  }, [selectedMake]);

  // Fetch variants when model is selected
  useEffect(() => {
    if (selectedMake && selectedModel) fetchCarVariants(selectedMake, selectedModel);
  }, [selectedMake, selectedModel]);

  // Validate when variant is selected
  useEffect(() => {
    setStepValid(formData.carModel && formData.carModel.id !== null);
  }, [formData.carModel, setStepValid]);

  const fetchCarModelDetails = async (modelId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:9000/api/v1/car-models/${modelId}`);
      const carModelData = response.data;
      
      setSelectedMake(carModelData.make);
      setSelectedModel(carModelData.model);
      setSelectedVariant(carModelData.id);
      
      // This will trigger the useEffects to load makes, models, and variants
    } catch (error) {
      console.error("Error fetching car model details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarMakes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:9000/api/v1/car-models/makes");
      setMakes(response.data);
    } catch (error) {
      console.error("Error fetching car makes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarModels = async (make) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:9000/api/v1/car-models/makes/${make}/models`);
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarVariants = async (make, model) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:9000/api/v1/car-models/search`, {
        params: { make, model }
      });
      setVariants(response.data);
    } catch (error) {
      console.error("Error fetching car variants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeSelect = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel(null);
    setVariants([]);
    setFormData(prev => ({
      ...prev,
      carModel: { id: null }
    }));
    setStepValid(false);
  };

  const handleModelSelect = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setFormData(prev => ({
      ...prev,
      carModel: { id: null }
    }));
    setStepValid(false);
  };

  const handleVariantSelect = (e) => {
    const variant = parseInt(e.target.value);
    setSelectedVariant(variant);
    setFormData((prev) => ({
      ...prev,
      carModel: {
        id: variant
      },
    }));
    setStepValid(true);
  };

  if (isLoading && isEditMode) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600">Loading car information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Car Make <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleMakeSelect}
          value={selectedMake || ""}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Model <span className="text-red-500">*</span>
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleModelSelect}
            value={selectedModel || ""}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Variant <span className="text-red-500">*</span>
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleVariantSelect}
            value={selectedVariant || ""}
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