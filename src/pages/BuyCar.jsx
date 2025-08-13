// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from "react";
// import FilterCars from "../components/buyCar/FilterCars";
// import GridCarList from "../components/buyCar/GridCarList";
// import { useFilterCarQuery, useGetbyUserCarIdQuery } from "../services/carAPI";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFavoriteCars } from "./favoritesSlice";

// import { FiLoader } from 'react-icons/fi';

// const BuyCar = () => {
//   const dispatch = useDispatch();
//   const token = Cookies.get("token");
//   const [urlState, setUrllState] = useState(null);

//   const emptyImage = "..\\..\\cars\\emptyfolder.png";

//   const { data, isLoading, error, refetch } = useFilterCarQuery(urlState);
//   let jwtDecodes;
//   if (token) {
//     jwtDecodes = jwtDecode(token);
//   }
//   const UserId = jwtDecodes?.userId;
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (UserId) {
//       // dispatch(fetchFavoriteCars(UserId)); // dispatch the thunk function itself -action to fetch the user's favorite cars by sending their UserId to the backend.
//     }
//   }, [dispatch, UserId]);


//   if (error?.status === 401) {
//     Cookies.remove("token");
//     navigate("/signin");
//   }
//   if (isLoading) {
//     return (
//       <div className="w-screen h-screen flex justify-center items-center p-8">
//         <FiLoader className="animate-spin text-blue-gray-800 h-16 w-16" />
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* <div className="container mx-auto mt-12">
//         <div className="grid grid-cols-1 gap-2 md:grid-cols-5 lg:grid-cols-4 lg:gap-6">
//           <div className="md:col-span-2 lg:col-span-1 top-0">
//             <FilterCars setUrlState={setUrllState} onFilterChange={refetch} />
//           </div>
//           <div className="md:col-span-3 lg:col-span-3 no-scrollbar">
//             {error?.status === 404 ? (
//               <div >
//                 <div className="flex justify-center mt-14">
//                   <img
//                     className="w-40"
//                     src={emptyImage}
//                     alt="no data"
//                   />
//                 </div>
//                 <p className="flex justify-center text-2xl md:text-3xl font-semibold">No Data Available</p>
//               </div>
//             ) : (
//               <GridCarList data={data} error={error} refetch={refetch} />
//             )}
//           </div>
//         </div>
//       </div> */}

// <div className="container mx-auto mt-12 px-4">
//         <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 lg:gap-6">
//           <div className="md:col-span-2 lg:col-span-1 sticky top-16  ">
//             <FilterCars setUrlState={setUrllState} onFilterChange={refetch} />
//           </div>
//           <div className="md:col-span-3 lg:col-span-3 overflow-y-auto no-scrollbar scroll-smooth">
//             {error?.status === 404 ? (
//               <div>
//                 <div className="flex justify-center mt-14">
//                   <img
//                     className="w-40"
//                     src={emptyImage}
//                     alt="no data"
//                   />
//                 </div>
//                 <p className="flex justify-center text-2xl md:text-3xl font-semibold">No Data Available</p>
//               </div>
//             ) : (
//               <GridCarList data={data} error={error} refetch={refetch} />
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BuyCar;





// /* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import FilterCars from "../components/buyCar/FilterCars";
import GridCarList from "../components/buyCar/GridCarList";
import { useFilterCarQuery } from "../services/carAPI";
import { useNavigate,useLocation  } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { FiFilter } from "react-icons/fi";
// import { Filter } from "@material-ui/icons";

// import { fetchFavoriteCars } from "./favoritesSlice";

// import { FiLoader } from 'react-icons/fi';

const BuyCar = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
    const location = useLocation();
    const { filterCar } = location.state ?? {};
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const [urlState, setUrlState] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  // const [showCount, setShowCount] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  const emptyImage = "..\\..\\cars\\emptyfolder.png";

  const { data, isLoading, error, refetch } = useFilterCarQuery({ 
    urlState, 
    pageNO: currentPage 
  });
  console.log("isLoading:", isLoading);

  let jwtDecodes;
  if (token) {
    jwtDecodes = jwtDecode(token);
  }
  const UserId = jwtDecodes?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    if (UserId) {
      // dispatch(fetchFavoriteCars(UserId));
    }
  }, [dispatch, UserId]);

  console.log(`API response:`, data);
   useEffect(()=>{
    if(filterCar) setUrlState(filterCar);
  },[]);

  // Update API whenever filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [urlState]); // Only reset page when filters change, not on every refetch

  // Refetch when page or filters change
  useEffect(() => {
    refetch();
  }, [currentPage, urlState, refetch]);

  // Calculate pagination
  const totalCars = data?.list?.length || 0;
  const totalPages = Math.ceil(totalCars / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = data?.list?.slice(startIndex, endIndex) || [];

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 3 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current page + ellipsis + last page
        pages.push(1);
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page !== '...' && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sort cars based on user selection
  const sortCars = (cars) => {
    if (!cars || !Array.isArray(cars)) return [];
    
    const sortedCars = [...cars];
    
    switch (sortBy) {
      case 'price_low_high':
        return sortedCars.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high_low':
        return sortedCars.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'year_newest':
        return sortedCars.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'year_oldest':
        return sortedCars.sort((a, b) => (a.year || 0) - (b.year || 0));
      default:
        return sortedCars;
    }
  };

  // Apply sorting to current cars
  const sortedCars = sortCars(currentCars);

  if (error?.status === 401) {
    Cookies.remove("token");
    navigate("/signin");
    return null; // Return null to prevent rendering
  }
  if (isLoading) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen">
        <div className="container mx-auto px-4 pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading cars...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Top Section: Breadcrumb, Heading, Description */}
      <div className="container mx-auto px-2 mt-4 pt-6 pb-2 ">
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <span>Home</span>
          <span className="mx-2 ">&gt;</span>
          <span className="text-orange-500 font-semibold">Buy Cars</span>
        </div>
        <hr/>
        <h1 className="w-full mt-2 text-2xl md:text-2xl font-bold mb-2 text-gray-900">Explore Our Exclusive Collection Of Premium Cars</h1>
        <p className=" text-gray-400 text-sm md:text-base w-full">
          Lorem Ipsum Dolor Sit Amet Consectetur. Ipsum Consectetur Vestibulum Tellus Viverra Id Ut Sit In Vestibulum Tellus Viverra Id Ut Sit In Vestibulum Tellus Viverra Id Ut Sit In.
        </p>
      </div>
      <div className="container mx-auto px-4">

        {/* Filter buttons row */}
        <div className="flex flex-wrap items-center justify-between mt-4">
          {/* Left: dropdowns */}
          <div className="flex space-x-3">
            <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="year_newest">Year: Newest First</option>
              <option value="year_oldest">Year: Oldest First</option>
            </select>

            {/* <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
            >
              <option value={10}>Show: 10</option>
              <option value={20}>Show: 20</option>
              <option value={30}>Show: 30</option>
              <option value={50}>Show: 50</option>
            </select> */}
          </div>

          {/* Right: results text */}
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1} - {Math.min(endIndex, totalCars)} of {totalCars} results
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 lg:gap-6    ">
          
      {/* Mobile filter button */}
      <div className="block md:hidden mb-4">
        <div className="flex justify-end">
        <button
          onClick={() => setShowMobileFilter((prev) => !prev)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
        >
          <FiFilter className="text-lg " />
          Filters
        </button>
        </div>

        {/* Mobile filter dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showMobileFilter ? "max-h-[1000px] mt-3" : "max-h-0"
          }`}
        >
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <FilterCars setUrlState={setUrlState} onFilterChange={refetch} />
          </div>
        </div>
      </div>
        

          <div className="hidden md:block md:col-span-1 lg:col-span-1 w-full max-w-[520px] h-full">
            <div className="sticky top-0 flex flex-col">
              <FilterCars setUrlState={setUrlState} onFilterChange={refetch} />
            </div>
          </div>
          {/* Car cards on the right */}
          <div className="md:col-span-4 lg:col-span-3 mt-8 overflow-y-auto no-scrollbar scroll-smooth">
            {error?.status === 404 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <img
                    className="w-32 h-32 opacity-50"
                    src={emptyImage}
                    alt="no data"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Cars Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or check back later.</p>
                <button 
                  onClick={() => {
                    setUrlState(null);
                    setCurrentPage(1);
                  }}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <GridCarList data={{...data, list: sortedCars}} error={error} refetch={refetch} isLoading={isLoading} />
            )}
          </div>
 


        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-8">
            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                }`}
              >
                &lt;
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-orange-500 text-white border-orange-500'
                      : page === '...'
                      ? 'bg-white text-gray-500 cursor-default'
                      : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                  }`}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyCar;



