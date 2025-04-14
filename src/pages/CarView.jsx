import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import axios from 'axios';
import {
  Car,
  Info,
  Calendar,
  Fuel,
  Gauge,
  Palette,
  DollarSign,
  MapPin,
  Shield,
  User,
  Phone,
  ClipboardList,
  FileText,
  AlertCircle,
  Truck,
  Check,
  X,
  FileSpreadsheet,
  PiggyBank,
  Clock,
  FileBarChart,
  Award,
  Settings,
  ArrowLeft,
  CarFront
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CarView = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:9000/api/v1/cars/${id}`);
        setCar(response.data);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError("Failed to load vehicle details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <PageTemplate title="Loading Car Details...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate title="Error">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      </PageTemplate>
    );
  }

  if (!car) {
    return (
      <PageTemplate title="Car Not Found">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p>The requested vehicle could not be found.</p>
        </div>
      </PageTemplate>
    );
  }

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <PageTemplate title={`${car.carModel.make} ${car.carModel.model} Details`}>
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/cars" className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Cars
        </Link>
      </div>

      {/* Vehicle Status Banner */}
      <div className={`mb-6 p-4 rounded-lg flex items-center text-white
        ${car.currentStatus === 'Available' ? 'bg-green-600' : 
          car.currentStatus === 'Sold' ? 'bg-gray-600' : 
          'bg-yellow-600'}
      `}>
        <Car size={24} className="mr-3" />
        <div>
          <span className="font-semibold text-lg">Status: {car.currentStatus}</span>
          {car.currentStatus === 'Sold' && car.sale && (
            <p className="text-sm opacity-90">Sold on {formatDate(car.sale.saleDate)} for {formatPrice(car.sale.salePrice)}</p>
          )}
          {car.currentStatus === 'Reserved' && car.reservation && (
            <p className="text-sm opacity-90">Reserved until {formatDate(car.reservation.reservationEndDate)}</p>
          )}
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left Column - Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Car size={20} className="mr-2 text-blue-600" />
            Basic Information
          </h2>
          
          <div className="divide-y">
            <div className="py-3 flex items-center">
              <Info size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Make & Model</p>
                <p className="font-medium">{car.carModel.make} {car.carModel.model} {car.carModel.variant}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Calendar size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{car.year}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <FileText size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Registration</p>
                <p className="font-medium">{car.registrationNumber || 'Not Registered'}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <FileSpreadsheet size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">VIN</p>
                <p className="font-medium">{car.vinNumber}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Palette size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{car.color || 'Not Specified'}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Gauge size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{car.mileage.toLocaleString()} km</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Fuel size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="font-medium">{car.carModel.fuelType}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle Column - Technical Specs */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Settings size={20} className="mr-2 text-blue-600" />
            Technical Specifications
          </h2>
          
          <div className="divide-y">
            <div className="py-3 flex items-center">
              <Truck size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Body Type</p>
                <p className="font-medium">{car.carModel.bodyType}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Settings size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-medium">{car.carModel.transmissionType} ({car.carModel.gears} gears)</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <CarFront size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Engine Capacity</p>
                <p className="font-medium">{car.engineCapacity} L</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <AlertCircle size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Emission Norm</p>
                <p className="font-medium">{car.carModel.emissionNorm}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Fuel size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Fuel Tank Capacity</p>
                <p className="font-medium">{car.carModel.fuelTankCapacity}</p>
              </div>
            </div>
            
            {car.detailedSpecs && (
              <>
                <div className="py-3 flex items-center">
                  <User size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Seating</p>
                    <p className="font-medium">{car.detailedSpecs.seats} seats, {car.detailedSpecs.doors} doors</p>
                  </div>
                </div>
                
                {car.detailedSpecs.acceleration0To100 > 0 && (
                  <div className="py-3 flex items-center">
                    <Clock size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Acceleration (0-100 km/h)</p>
                      <p className="font-medium">{car.detailedSpecs.acceleration0To100} seconds</p>
                    </div>
                  </div>
                )}
                
                {car.detailedSpecs.topSpeed > 0 && (
                  <div className="py-3 flex items-center">
                    <Gauge size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Top Speed</p>
                      <p className="font-medium">{car.detailedSpecs.topSpeed} km/h</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Right Column - Financial & Location Info */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <DollarSign size={20} className="mr-2 text-blue-600" />
            Financial Information
          </h2>
          
          <div className="divide-y mb-6">
            <div className="py-3 flex items-center">
              <PiggyBank size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="font-medium">{formatPrice(car.purchasePrice)}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <Calendar size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">{formatDate(car.purchaseDate)}</p>
              </div>
            </div>
            
            <div className="py-3 flex items-center">
              <DollarSign size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Listed Price</p>
                <p className="font-medium">{formatPrice(car.sellingPrice)}</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin size={20} className="mr-2 text-blue-600" />
            Storage Location
          </h2>
          
          {car.storageLocation && (
            <div className="divide-y">
              <div className="py-3 flex items-center">
                <MapPin size={18} className="text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location Name</p>
                  <p className="font-medium">{car.storageLocation.name}</p>
                </div>
              </div>
              
              <div className="py-3 flex items-center">
                <Info size={18} className="text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{car.storageLocation.address}</p>
                </div>
              </div>
              
              <div className="py-3 flex items-center">
                <User size={18} className="text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium">{car.storageLocation.contactPerson}</p>
                </div>
              </div>
              
              <div className="py-3 flex items-center">
                <Phone size={18} className="text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="font-medium">{car.storageLocation.contactNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Features */}
      {car.detailedSpecs && car.detailedSpecs.additionalFeatures && Object.keys(car.detailedSpecs.additionalFeatures).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Award size={20} className="mr-2 text-blue-600" />
            Additional Features
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(car.detailedSpecs.additionalFeatures).map(([feature, value]) => (
              <div key={feature} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {value === "Yes" || value === "yes" || value === true ? (
                    <Check size={18} className="text-green-500 mr-2" />
                  ) : value === "No" || value === "no" || value === false ? (
                    <X size={18} className="text-red-500 mr-2" />
                  ) : (
                    <Info size={18} className="text-blue-500 mr-2" />
                  )}
                  <p className="font-medium">{feature}</p>
                </div>
                {value !== "Yes" && value !== "No" && value !== "yes" && value !== "no" && value !== true && value !== false && (
                  <p className="text-sm text-gray-600">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Financial Transactions */}
      {car.financialTransactions && car.financialTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileBarChart size={20} className="mr-2 text-blue-600" />
            Financial Transactions
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {car.financialTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg
                        ${transaction.transactionType === 'Purchase' ? 'bg-blue-100 text-blue-800' : 
                          transaction.transactionType === 'Sale' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatPrice(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Inspections */}
      {car.inspections && car.inspections.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ClipboardList size={20} className="mr-2 text-blue-600" />
            Inspection History
          </h2>
          
          <div className="space-y-4">
            {car.inspections.map((inspection) => (
              <div key={inspection.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <Shield size={16} className="mr-2 text-blue-500" />
                    Inspection on {formatDate(inspection.inspectionDate)}
                  </h3>
                  <span className={`px-2 py-1 text-xs leading-tight font-semibold rounded-full
                    ${inspection.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {inspection.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{inspection.notes}</p>
                {inspection.inspectionItems && inspection.inspectionItems.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Inspection Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {inspection.inspectionItems.map((item, idx) => (
                        <div key={idx} className="flex items-center">
                          {item.passed ? (
                            <Check size={16} className="text-green-500 mr-2" />
                          ) : (
                            <X size={16} className="text-red-500 mr-2" />
                          )}
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {car.currentStatus === 'Available' && (
          <>
            <Link to={`/sales/new?carId=${car.id}`} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 flex items-center">
              <DollarSign size={16} className="mr-2" />
              Record Sale
            </Link>
            <Link to={`/reservations/new?carId=${car.id}`} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-yellow-700 flex items-center">
              <Calendar size={16} className="mr-2" />
              Create Reservation
            </Link>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default CarView;