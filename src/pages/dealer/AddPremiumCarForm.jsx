/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Inputs from "../../forms/Inputs";
import { Textarea, Input } from "@material-tailwind/react";
import { useCarRegisterPremiumMutation } from "../../services/carAPI";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetOnlyBrandsQuery,
  useGetVariantsQuery,
  useGetSubVariantsQuery,
} from "../../services/brandAPI";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetAllColorQuery } from "../../services/colorAPI";

const cityOptions = {
  Pune: ["MH-12"],
  PimpriChichwad: ["MH-14"],
  Mumbai: ["MH-01", "MH-02", "MH-03", "MH-47"],
  Amravati: ["MH-27"],
  Yavatmal: ["MH-29"],
  Chandrapur: ["MH-34"],
  Kolhapur: ["MH-09"],
  Solapur: ["MH-13", "MH-45"],
  Nanded: ["MH-26"],
  Latur: ["MH-24"],
  Satara: ["MH-11"],
  Sangli: ["MH-10"],
  Nashik: ["MH-15", "MH-51"],
  Beed: ["MH-32"],
  Jalna: ["MH-21"],
  Nagpur: ["MH-31", "MH-49  "],
  Gondia: ["MH-35"],
  Gadchiroli: ["MH-33"],
  Bhandara: ["MH-36"],
  Washim: ["MH-37"],
  Jalgaon: ["MH-19"],
  Akola: ["MH-30"],
  Buldhana: ["MH-28"],
  Dhule: ["MH-18"],
  Nandurbar: ["MH-39"],
  Thane: ["MH-04", "MH-05", "MH-48"],
  Raigad: ["MH-06"],
  Ratnagiri: ["MH-08"],
  Sindhudurg: ["MH-07"],
  Ahmednagar: ["MH-16"],
  Dharashiv: ["MH-25"],
  SambhajiNagar: ["MH-20"],
};

export default function AddPremiumCarForm() {
  const { data: brandData } = useGetOnlyBrandsQuery();
  const brands = brandData?.list.map((item) => item.brand) || [];
  const { data: colorData } = useGetAllColorQuery();
  const colors = colorData?.list.map((item) => item.name) || [];
  
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: variantData } = useGetVariantsQuery(selectedBrand, {
    skip: !selectedBrand,
  });
  
  const { data: subVariantData } = useGetSubVariantsQuery(
    { brand: selectedBrand, variant: selectedModel },
    {
      skip: !selectedBrand || !selectedModel,
    }
  );

  const filteredColors = colors
    .filter(
      (color) =>
        color && color.toLowerCase().includes((inputValue || "").toLowerCase())
    )
    .sort();
  
  const { carType: carTypeParam } = useParams();
  
  const [carRegister] = useCarRegisterPremiumMutation();
  const [error, setError] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [formData, setFormData] = useState({
    // features
    acFeature: false,
    musicFeature: false,
    powerWindowFeature: false,
    rearParkingCameraFeature: false,
    buttonStart: false,
    ABS: false,
    sunroof: false,
    airbag: false,
    childSafetyLocks: false,

    // car details
    brand: "",
    variant: "",
    price: "",
    model: "",
    year: "",
    transmission: "",
    color: "",
    city: "",
    fuelType: "",
    kmDriven: "",
    registration: "",
    description: "",
    title: "",
    area: "",

    // insurance
    carInsurance: "",
    carInsuranceDate: "",
    carInsuranceType: "",

    // ownership
    ownerSerial: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate price before proceeding
    if (formData.price < 1500000) {
      setError(true);
      toast.error("Price must be greater than 1,500,000");
      return;
    } else {
      setError(false);
    }

    // Clean variant field
    const cleanedVariant = formData.variant?.replace(/\r/g, '').trim();

    const data = {
      // Features
      buttonStart: formData.buttonStart,
      ABS: formData.ABS,
      sunroof: formData.sunroof,
      airbag: formData.airbag,
      childSafetyLocks: formData.childSafetyLocks,
      acFeature: formData.acFeature,
      musicFeature: formData.musicFeature,
      powerWindowFeature: formData.powerWindowFeature,
      rearParkingCameraFeature: formData.rearParkingCameraFeature,

      // Car details
      area: formData.area,
      brand: formData.brand,
      variant: cleanedVariant,
      color: formData.color,
      description: formData.description,
      fuelType: formData.fuelType,
      kmDriven: parseInt(formData.kmDriven, 10) || 0,
      model: formData.model,
      ownerSerial: parseInt(formData.ownerSerial, 10) || 0,
      city: formData.city,
      price: parseInt(formData.price, 10) || 0,
      registration: formData.registration,
      transmission: formData.transmission,
      title: formData.title,
      year: parseInt(formData.year, 10) || null,

      // Insurance
      carInsurance: formData.carInsurance,
      carInsuranceDate: formData.carInsuranceDate || "",
      carInsuranceType: formData.carInsuranceType || "",

      // Status
      pendingApproval: true,

      // Required fields
      dealerId: parseInt(id, 10),
      date: formattedDate,
    };


try {
      const res = await carRegister(data).unwrap();
      if (res?.status === "success") {
        toast.success("Car Added Successfully!");
        const mainCarId = res.message.split(":").pop().trim();
        setTimeout(() => {
          navigate(`/dealer/${id}/uploadimagep/${mainCarId}`);
        }, 1500); 
      }
    } catch (err) {
      console.error("Full error:", err);
      
      if (err.data) {
        toast.error(err.data.message || "Failed to register car");
        if (err.data.errors) {
          console.error("Validation errors:", err.data.errors);
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    }
  };

  const handleBrandChange = (event, newValue) => {
    const brand = newValue;
    setSelectedBrand(brand);
    setFormData({
      ...formData,
      brand,
      model: "",
      variant: "",
    });
  };

  const handleModelChange = (event, newValue) => {
    const model = newValue;
    setSelectedModel(model);
    setFormData({
      ...formData,
      model,
      variant: "",
    });
  };

  const handleVariantChange = (event, newValue) => {
    const variant = newValue?.replace(/\r/g, '').trim();
    setFormData({
      ...formData,
      variant,
    });
  };

  const handleColorChange = (event, newValue) => {
    const color = newValue;
    setInputValue(color);
    setFormData({
      ...formData,
      color,
    });
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setFormData({
      ...formData,
      city: selectedCity,
      registration: "",
    });
  };

  const handleChangeType = (event) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      carInsuranceType: value,
    }));
  };

  const handleChange = (event) => {
    const value = event.target.value === "true";
    setFormData((prevFormData) => ({
      ...prevFormData,
      carInsurance: value,
    }));
    setShowCalendar(value);
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      price: value,
    });

    if (value && value < 1500000) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      carInsuranceDate: value,
    }));
  };

  useEffect(() => {
    if (variantData) {
      const models = [...new Set(variantData.list.map((item) => item.variant))];
      setModelOptions(models);
    }
  }, [variantData]);

  useEffect(() => {
    if (subVariantData) {
      const variants = [
        ...new Set(subVariantData.list.map((item) => item.subVariant)),
      ];
      setVariantOptions(variants);
    }
  }, [subVariantData]);

  return (
    <>
      <ToastContainer />
      <div className="md:flex justify-center m-6 md:m-0">
        <div>
          <form onSubmit={handleSubmit} className="w-full md:w-[45rem]">
            <div className="flex justify-center">
              <p className="text-3xl font-semibold m-4">Add Premium Car</p>
            </div>
            
            {/* Brand and Model Selection */}
            <div className="md:flex gap-2">
              <div className="mt-5 w-full">
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={brands}
                  getOptionLabel={(option) => option}
                  onChange={handleBrandChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "40px",
                          padding: "0 14px",
                          paddingBottom: "8px",
                          top: 0,
                        },
                        "& .MuiInputBase-input": {
                          height: "100%",
                          padding: "0",
                        },
                      }}
                      {...params}
                      label="Brands"
                      InputLabelProps={{
                        style: {
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  )}
                />
              </div>

              <div className="mt-5 w-full">
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={modelOptions}
                  getOptionLabel={(option) => option}
                  onChange={handleModelChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "40px",
                          padding: "0 14px",
                          paddingBottom: "8px",
                          top: 0,
                        },
                        "& .MuiInputBase-input": {
                          height: "100%",
                          padding: "0",
                        },
                      }}
                      {...params}
                      label="Variant"
                      InputLabelProps={{
                        style: {
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* SubVariant and Transmission */}
            <div className="md:flex">
              <div className="mt-5 w-full">
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={variantOptions}
                  getOptionLabel={(option) => option}
                  onChange={handleVariantChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "40px",
                          padding: "0 14px",
                          paddingBottom: "8px",
                          top: 0,
                        },
                        "& .MuiInputBase-input": {
                          height: "100%",
                          padding: "0",
                        },
                      }}
                      {...params}
                      label="SubVariant"
                      InputLabelProps={{
                        style: {
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  )}
                />
              </div>

              <div className="mt-5 md:ml-2 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  name="transmission"
                  value={formData.transmission}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      transmission: event.target.value,
                    });
                  }}
                >
                  <option value="" disabled>Transmission</option>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
            </div>

            {/* Price and Year */}
            <div className="md:flex">
              <div className="mt-5 w-full">
                <Input
                  required
                  label="Price"
                  type="number"
                  name="price"
                  value={formData.price}
                  error={error}
                  onChange={handlePriceChange}
                  helperText={error ? "Value should be greater than 1,500,000" : ""}
                />
              </div>

              <div className="mt-5 md:ml-2 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  value={formData.year}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      year: event.target.value,
                    })
                  }
                >
                  <option value="" disabled>Year</option>
                  <option>2015</option>
                  <option>2016</option>
                  <option>2017</option>
                  <option>2018</option>
                  <option>2019</option>
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                </select>
              </div>
            </div>

            {/* Color and Owner Serial */}
            <div className="md:flex">
              <div className="mt-5 w-full">
                <Autocomplete
                  disablePortal
                  options={filteredColors}
                  getOptionLabel={(option) => option || ""}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  onChange={handleColorChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Color"
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "40px",
                          padding: "0 14px",
                          paddingBottom: "8px",
                          top: 0,
                        },
                        "& .MuiInputBase-input": {
                          height: "100%",
                          padding: "0",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  )}
                />
              </div>

              <div className="mt-5 md:ml-2 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  name="ownerSerial"
                  value={formData.ownerSerial}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      ownerSerial: event.target.value,
                    })
                  }
                >
                  <option value="" disabled>Select Owner Serial</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            {/* Area and Insurance */}
            <div className="md:flex">
              <div className="mt-5 w-full">
                <Input
                  required
                  label={"Area"}
                  type={"text"}
                  placeholder={"Enter Area"}
                  name={"area"}
                  value={formData.area}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      area: event.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-5 md:ml-2 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  name="carInsurance"
                  value={formData.carInsurance}
                  onChange={handleChange}
                >
                  <option value="">Car Insurance</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {showCalendar && (
                  <>
                    <div className="mt-3">
                      <label className="block text-gray-700 text-sm font-bold" htmlFor="date">
                        Select Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={formData.carInsuranceDate}
                        onChange={handleDateChange}
                        className="w-full border-2 border-gray-400 p-2 rounded-md"
                      />
                    </div>
                    <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="date">
                      Insurance Type
                    </label>
                    <select
                      required
                      className="w-full border-2 border-gray-400 p-2 rounded-md"
                      name="carInsurance"
                      value={formData.carInsuranceType}
                      onChange={handleChangeType}
                    >
                      <option value="" disabled>Insurance Type</option>
                      <option value="Comprehensive">Comprehensive</option>
                      <option value="Zero Dept">Zero Depreciation</option>
                      <option value="Third Party">Third Party</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {/* Km Driven and Fuel Type */}
            <div className="md:flex">
              <div className="mt-5 w-full">
                <Input
                  required
                  label="Km Driven"
                  type="number"
                  name="kmDriven"
                  value={formData.kmDriven}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      kmDriven: event.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-5 md:ml-2 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      fuelType: event.target.value,
                    });
                  }}
                >
                  <option value="" disabled>Fuel Type</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>CNG</option>
                  <option>Petrol+CNG</option>
                </select>
              </div>
            </div>

            {/* City and Registration */}
            <div className="md:flex">
              <div className="mt-5 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  value={formData.city}
                  onChange={handleCityChange}
                >
                  <option value="">Select City</option>
                  {Object.keys(cityOptions).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5 md:ml-2 w-full">
                <select
                  required
                  className="w-full border-2 border-gray-400 p-2 rounded-md"
                  value={formData.registration}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      registration: event.target.value,
                    })
                  }
                  disabled={!formData.city}
                >
                  <option value="">Select Registration</option>
                  {formData.city &&
                    cityOptions[formData.city]?.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Features Checkboxes */}
            <div className="md:flex flex-wrap mt-5">
              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="musicFeature"
                  checked={formData.musicFeature}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      musicFeature: event.target.checked,
                    })
                  }
                />{" "}
                Music
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="powerWindowFeature"
                  checked={formData.powerWindowFeature}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      powerWindowFeature: event.target.checked,
                    })
                  }
                />{" "}
                Power Windows
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="acFeature"
                  checked={formData.acFeature}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      acFeature: event.target.checked,
                    })
                  }
                />{" "}
                Air Conditioning
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="rearParkingCameraFeature"
                  checked={formData.rearParkingCameraFeature}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      rearParkingCameraFeature: event.target.checked,
                    })
                  }
                />{" "}
                Rear Parking Camera
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="buttonStart"
                  checked={formData.buttonStart}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      buttonStart: event.target.checked,
                    })
                  }
                />{" "}
                Button Start
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="ABS"
                  checked={formData.ABS}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      ABS: event.target.checked,
                    })
                  }
                />{" "}
                ABS
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="sunroof"
                  checked={formData.sunroof}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      sunroof: event.target.checked,
                    })
                  }
                />{" "}
                Sunroof
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="childSafetyLocks"
                  checked={formData.childSafetyLocks}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      childSafetyLocks: event.target.checked,
                    })
                  }
                />{" "}
                Child Safety Locks
              </div>

              <div className="ml-5 mb-2">
                <input
                  type="checkbox"
                  name="airbag"
                  checked={formData.airbag}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      airbag: event.target.checked,
                    })
                  }
                />{" "}
                AirBag
              </div>
            </div>

            {/* Title */}
            <div className="mt-5 mb-2">
              <h4>Title</h4>
              <div className="formrow">
                <Input
                  required
                  className="form-control"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      title: event.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <h4>Vehicle Description</h4>
              <div className="formrow">
                <Textarea
                  required
                  className="form-control"
                  name="description"
                  placeholder="Vehicle Description"
                  value={formData.description}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="p-3 mt-3 bg-indigo-400 rounded-md w-28 text-white"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </>
  );
}