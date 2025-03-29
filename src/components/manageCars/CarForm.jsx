import React, { useState } from 'react';
import CarModelForm from './CarModelForm';
import CarDetailsForm from './CarDetailsForm';
import AdditionalDetailsForm from './AdditionalDetailsForm';
import axios from 'axios';

const CarForm = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carModel: { id: null },
    vinNumber: "",
    registrationNumber: "",
    year: new Date().getFullYear(),
    color: "",
    mileage: 0,
    engineCapacity: 0,
    currentStatus: "Available",
    purchaseDate: "",
    purchasePrice: 0,
    sellingPrice: 0,
    storageLocation: { id: null },
    detailedSpecs: {
      doors: 4,
      seats: 5,
      cargoCapacityLiters: 0,
      acceleration0To100: 0,
      topSpeed: 0,
      additionalFeatures: {}
    }
  });

  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert numeric string values to numbers
    const processedData = {
      ...formData,
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      engineCapacity: parseFloat(formData.engineCapacity),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      detailedSpecs: {
        ...formData.detailedSpecs,
        doors: parseInt(formData.detailedSpecs.doors),
        seats: parseInt(formData.detailedSpecs.seats),
        cargoCapacityLiters: parseInt(formData.detailedSpecs.cargoCapacityLiters),
        acceleration0To100: parseFloat(formData.detailedSpecs.acceleration0To100),
        topSpeed: parseInt(formData.detailedSpecs.topSpeed)
      }
    };
    
    // console.log("Data submitted successfully", processedData);
    try {
      const response = await axios.post('http://localhost:9000/api/v1/cars', processedData);
      console.log("Data submitted successfully", response.data);
      onClose(); // Close the modal
    } catch(err){
      console.log("Error submitting car data", err);
    }
  };
  
  if(!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Add New Vehicle</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
              <div className="ml-2 text-sm font-medium">Car Make</div>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-200 self-center">
              <div className={`h-0.5 bg-blue-600 ${step >= 2 ? 'w-full' : 'w-0'} transition-all`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
              <div className="ml-2 text-sm font-medium">Car Details</div>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-200 self-center">
              <div className={`h-0.5 bg-blue-600 ${step >= 3 ? 'w-full' : 'w-0'} transition-all`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
              <div className="ml-2 text-sm font-medium">Specifications</div>
            </div>
          </div>
          
          <div>
            {step === 1 && ( <CarModelForm setFormData={setFormData}/> )}
            {step === 2 && ( <CarDetailsForm formData={formData} setFormData={setFormData} />)}
            {step === 3 && ( <AdditionalDetailsForm formData={formData} setFormData={setFormData} />)}
            
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-auto"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarForm;