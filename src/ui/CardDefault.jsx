/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { CarouselCustomArrows } from "./CarouselCustomArrows";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useFavoriteCarMutation,
  useCarremoveFavoriteMutation,
  useCarFavoriteAddRemoveQuery,
} from "../services/carAPI";
import { useGetDealerQuery } from "../services/dealerAPI";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addFavoriteCar, removeFavoriteCar } from "../pages/favoritesSlice";
import DriveEtaIcon from '@mui/icons-material/DriveEta'; // Example icon for KM
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'; // Example icon for fuel type
import TransmissionIcon from '@mui/icons-material/Settings'; // Example icon for transmission (you can choose a better one)
import { FaArrowRight } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import CheckCircle from '@mui/icons-material/CheckCircle';

function RatedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="red"
      className="h-6 w-6"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function UnratedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

export function CardDefault({ data, Carid, refetch,isLoading }) {
  const dispatch = useDispatch();
  const favoriteCars = useSelector((state) => state.favorites.favoriteCars);
  const [isHovered, setIsHovered] = useState(false);

  const [favoriteCar] = useFavoriteCarMutation();
  const token = Cookies.get("token");
  let jwtDecodes;

  // console.log("in cardefault ....."+data)
  if (token) {
    jwtDecodes = jwtDecode(token);
  }
  const UserId = jwtDecodes?.userId;
  const userRole = token ? jwtDecodes?.authorities[0] : null;
  const data2 = {
    carId: Carid,
    userId: UserId,
  };
  const carid = data2.carId;
  const useid = data2.userId;

  const {
    data: favData,
    error,
    refetch: refetchFavCarData,
  } = useCarFavoriteAddRemoveQuery({ carid, useid });

  // Fetch dealer information if dealerId is available
  const { data: dealerData, isLoading: dealerLoading } = useGetDealerQuery(
    { id: data.dealerId },
    { skip: !data.dealerId }
  );

  const [CarremoveFavorite] = useCarremoveFavoriteMutation();

  const handleFavoriteToggle = async () => {
    const data2 = {
      carId: Carid,
      userId: UserId,
    };
    if (favoriteCars?.find((favCar) => favCar.carId === data.carId)) {
      dispatch(removeFavoriteCar(data));
      const res = await CarremoveFavorite({
        saveCarId: favData?.object?.saveCarId,
      });
      refetchFavCarData();
    } else {
      const res = await favoriteCar(data2);
      dispatch(addFavoriteCar(data2));
      // refetchFavCarData()
    }
  };

  // Seller info from API data - simplified to show only basic info
  const seller = {
    name: dealerData?.dealerName || data.dealerName || data.sellerName || "Seller",
    ownership: data.ownerType || data.ownership || "First Owner", // Ownership status
    profileImg: dealerData?.profileImage || data.dealerProfileImage || data.sellerImg || "/public/logos/dummy-profile-pic.jpg",
  };

  const combinedText = `${data.year || ''} ${data.brand || ''} ${data.model || ''}`;
  const truncatedText =
    combinedText.length > 25
      ? combinedText.substring(0, 22) + "..."
      : combinedText;

  // Format price with proper currency
  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format kilometers
  const formatKm = (km) => {
    if (!km) return "KM not available";
    return `${km.toLocaleString()} Kms`;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow flex flex-row items-center p-4 mb-4 max-w-4xl mx-auto border border-gray-200 hover:shadow-lg transition-all">
      {/* Car Image */}
      <div className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <Link to={`/carlist/cardetails/${data.carId}`}>
          <img
            src={data.images && data.images.length > 0 ? data.images[0] : data.carImage || '/public/cars/no-image-available.png'}
            alt={combinedText}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src = '/public/cars/no-image-available.png';
            }}
          />
        </Link>
      </div>
      {/* Car Info */}
      <div className="flex-1 px-6 flex flex-col justify-between h-full min-w-0">
        <div className="flex items-center mb-1">
          <span className="text-xs text-orange-500 font-semibold mr-2">{data.bodyType || 'Sedan'}</span>
        </div>
        <div className="font-semibold text-lg text-gray-900 truncate">{combinedText}</div>
        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2 space-x-4">
          <span className="flex items-center">
            <DriveEtaIcon className="text-green-600 mr-1" style={{fontSize:'1rem'}} /> 
            {formatKm(data.kmDriven)}
          </span>
          <span className="flex items-center">
            <LocalGasStationIcon className="text-green-600 mr-1" style={{fontSize:'1rem'}} /> 
            {data.fuelType || 'N/A'}
          </span>
          <span className="flex items-center">
            <TransmissionIcon className="text-green-600 mr-1" style={{fontSize:'1rem'}} /> 
            {data.transmission || 'N/A'}
          </span>
          <span className="flex items-center">
            <FaLocationDot className="text-green-600 mr-1" style={{fontSize:'1rem'}} /> 
            {data.area || data.location || 'N/A'}
          </span>
        </div>
        <div className="text-orange-600 font-bold text-xl mb-2">{formatPrice(data.price)}</div>
        <Link to={`/carlist/cardetails/${data.carId}`}>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition flex items-center text-sm font-semibold">View Details <FaArrowRight className="ml-2" /></button>
        </Link>
      </div>
      {/* Seller Info - Simplified */}
      <div className="flex flex-col items-center justify-center w-32 border-l pl-4 min-h-[100px]">
        {dealerLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>
        ) : (
          <>
            <img 
              src={seller.profileImg} 
              alt={seller.name || "Seller"} 
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 mb-2"
              onError={(e) => {
                e.target.src = "/public/logos/dummy-profile-pic.jpg";
              }}
            />
            <div className="text-gray-900 font-semibold text-xs text-center truncate w-full mb-1">{seller.name}</div>
            <div className="text-gray-500 text-xs text-center">{seller.ownership}</div>
          </>
        )}
      </div>
    </div>
  );
}
