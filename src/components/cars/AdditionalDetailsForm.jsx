import React, { useState, useEffect } from 'react';

const AdditionalDetailsForm = ({ formData, setFormData, setStepValid }) => {
  const [additionalFeatures, setAdditionalFeatures] = useState([{ key: "", value: "" }]);
  const [errors, setErrors] = useState({});

  // Initialize with existing data when editing
  useEffect(() => {
    if (formData.detailedSpecs?.additionalFeatures && Object.keys(formData.detailedSpecs.additionalFeatures).length > 0) {
      const features = Object.entries(formData.detailedSpecs.additionalFeatures).map(([key, value]) => ({
        key,
        value: value.toString()
      }));
      
      if (features.length > 0) {
        setAdditionalFeatures(features);
      }
    }
  }, []);

  // Convert additional features to the required format
  useEffect(() => {
    const featuresObj = {};
    additionalFeatures.forEach(feature => {
      if (feature.key.trim() !== "") {
        featuresObj[feature.key] = feature.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      detailedSpecs: {
        ...prev.detailedSpecs,
        additionalFeatures: featuresObj
      }
    }));
  }, [additionalFeatures]);

  // Validate form
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Check if required fields are filled
    if (!formData.detailedSpecs?.doors) newErrors.doors = "Number of doors is required";
    if (!formData.detailedSpecs?.seats) newErrors.seats = "Number of seats is required";
    if (formData.detailedSpecs?.cargoCapacityLiters === undefined || formData.detailedSpecs?.cargoCapacityLiters === null) 
      newErrors.cargoCapacityLiters = "Cargo capacity is required";
    if (formData.detailedSpecs?.acceleration0To100 === undefined || formData.detailedSpecs?.acceleration0To100 === null) 
      newErrors.acceleration0To100 = "Acceleration is required";
    if (!formData.detailedSpecs?.topSpeed) newErrors.topSpeed = "Top speed is required";
    
    // Check if all additional features have both key and value
    const hasEmptyFeature = additionalFeatures.some(feature => 
      (feature.key.trim() !== "" && feature.value.trim() === "") || 
      (feature.key.trim() === "" && feature.value.trim() !== "")
    );
    
    if (hasEmptyFeature) {
      newErrors.additionalFeatures = "All features must have both name and value";
    }
    
    setErrors(newErrors);
    
    // Update step validation status
    setStepValid(Object.keys(newErrors).length === 0);
  };

  const handleAddFeature = () => {
    setAdditionalFeatures([...additionalFeatures, { key: "", value: "" }]);
  };
  
  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...additionalFeatures];
    updatedFeatures.splice(index, 1);
    setAdditionalFeatures(updatedFeatures);
  };
  
  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...additionalFeatures];
    updatedFeatures[index][field] = value;
    setAdditionalFeatures(updatedFeatures);
  };

  const handleDetailedSpecsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      detailedSpecs: {
        ...prevData.detailedSpecs,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Car Specifications</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Doors <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="doors"
            value={formData.detailedSpecs?.doors || ''}
            onChange={handleDetailedSpecsChange}
            className={`w-full px-3 py-2 border ${errors.doors ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="1"
            max="6"
            required
          />
          {errors.doors && <p className="text-red-500 text-xs mt-1">{errors.doors}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Seats <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="seats"
            value={formData.detailedSpecs?.seats || ''}
            onChange={handleDetailedSpecsChange}
            className={`w-full px-3 py-2 border ${errors.seats ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="1"
            max="12"
            required
          />
          {errors.seats && <p className="text-red-500 text-xs mt-1">{errors.seats}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo Capacity (L) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="cargoCapacityLiters"
            value={formData.detailedSpecs?.cargoCapacityLiters || ''}
            onChange={handleDetailedSpecsChange}
            className={`w-full px-3 py-2 border ${errors.cargoCapacityLiters ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            step="0.01"
            required
          />
          {errors.cargoCapacityLiters && <p className="text-red-500 text-xs mt-1">{errors.cargoCapacityLiters}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            0-100 km/h (sec) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="acceleration0To100"
            value={formData.detailedSpecs?.acceleration0To100 || ''}
            onChange={handleDetailedSpecsChange}
            className={`w-full px-3 py-2 border ${errors.acceleration0To100 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            step="0.1"
            required
          />
          {errors.acceleration0To100 && <p className="text-red-500 text-xs mt-1">{errors.acceleration0To100}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Top Speed (km/h) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="topSpeed"
            value={formData.detailedSpecs?.topSpeed || ''}
            onChange={handleDetailedSpecsChange}
            className={`w-full px-3 py-2 border ${errors.topSpeed ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            required
          />
          {errors.topSpeed && <p className="text-red-500 text-xs mt-1">{errors.topSpeed}</p>}
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800">Additional Features</h3>
          <button 
            type="button" 
            onClick={handleAddFeature}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            + Add Feature
          </button>
        </div>
        
        {errors.additionalFeatures && (
          <p className="text-red-500 text-sm mb-2">{errors.additionalFeatures}</p>
        )}
        
        <div className="space-y-2">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input 
                type="text" 
                value={feature.key}
                onChange={(e) => handleFeatureChange(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Feature name"
              />
              <input 
                type="text" 
                value={feature.value}
                onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Feature details"
              />
              <button 
                type="button" 
                onClick={() => handleRemoveFeature(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetailsForm;