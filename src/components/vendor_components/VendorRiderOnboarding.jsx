
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import Select from "react-select";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BASE_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Chennai", label: "Chennai" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Pune", label: "Pune" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
  { value: "Faridabad", label: "Faridabad" },
  { value: "Ghaziabad", label: "Ghaziabad" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Lucknow", label: "Lucknow" },
  { value: "Kanpur", label: "Kanpur" },
  { value: "Nagpur", label: "Nagpur" },
  { value: "Indore", label: "Indore" },
  { value: "Bhopal", label: "Bhopal" },
  { value: "Surat", label: "Surat" },
  { value: "Vadodara", label: "Vadodara" },
  { value: "Rajkot", label: "Rajkot" },
  { value: "Nashik", label: "Nashik" },
  { value: "Thane", label: "Thane" },
  { value: "Vijayawada", label: "Vijayawada" },
  { value: "Visakhapatnam", label: "Visakhapatnam" },
  { value: "Coimbatore", label: "Coimbatore" },
  { value: "Madurai", label: "Madurai" },
  { value: "Kochi", label: "Kochi" },
  { value: "Trivandrum", label: "Trivandrum" },
  { value: "Kozhikode", label: "Kozhikode" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Mohali", label: "Mohali" },
  { value: "Panchkula", label: "Panchkula" },
  { value: "Patna", label: "Patna" },
  { value: "Ranchi", label: "Ranchi" },
  { value: "Jamshedpur", label: "Jamshedpur" },
  { value: "Bhubaneswar", label: "Bhubaneswar" },
  { value: "Cuttack", label: "Cuttack" },
  { value: "Guwahati", label: "Guwahati" },
  { value: "Shillong", label: "Shillong" },
  { value: "Imphal", label: "Imphal" },
  { value: "Aizawl", label: "Aizawl" },
  { value: "Gangtok", label: "Gangtok" },
  { value: "Dehradun", label: "Dehradun" },
  { value: "Haridwar", label: "Haridwar" },
  { value: "Rishikesh", label: "Rishikesh" },
  { value: "Agra", label: "Agra" },
  { value: "Varanasi", label: "Varanasi" },
  { value: "Prayagraj", label: "Prayagraj" },
  { value: "Meerut", label: "Meerut" },
  { value: "Aligarh", label: "Aligarh" },
  { value: "Moradabad", label: "Moradabad" },
  { value: "Bareilly", label: "Bareilly" },
  { value: "Jodhpur", label: "Jodhpur" },
  { value: "Udaipur", label: "Udaipur" },
  { value: "Kota", label: "Kota" },
  { value: "Ajmer", label: "Ajmer" },
  { value: "Amritsar", label: "Amritsar" },
  { value: "Ludhiana", label: "Ludhiana" },
  { value: "Jalandhar", label: "Jalandhar" },
  { value: "Mangaluru", label: "Mangaluru" },
  { value: "Mysuru", label: "Mysuru" },
  { value: "Hubballi", label: "Hubballi" },
  { value: "Belagavi", label: "Belagavi" },
  { value: "Raipur", label: "Raipur" },
  { value: "Bhilai", label: "Bhilai" },
  { value: "Bilaspur", label: "Bilaspur" },
  { value: "Jabalpur", label: "Jabalpur" },
  { value: "Gwalior", label: "Gwalior" },
  { value: "Tirupati", label: "Tirupati" },
  { value: "Warangal", label: "Warangal" },
  { value: "Nellore", label: "Nellore" },
  { value: "Tirunelveli", label: "Tirunelveli" },
  { value: "Salem", label: "Salem" },
  { value: "Trichy", label: "Trichy" },
  { value: "Allahabad", label: "Allahabad" },
  { value: "Srinagar", label: "Srinagar" },
  { value: "Jammu", label: "Jammu" },
  { value: "Port Blair", label: "Port Blair" },
  { value: "Panaji", label: "Panaji" },
  { value: "Margao", label: "Margao" },
  { value: "Puducherry", label: "Puducherry" },
];


let decode;
if (localStorage.getItem("token")) {
  decode = jwtDecode(localStorage.getItem("token"));
}
const vendorId = decode?.id;


function VendorRiderOnboarding() {
  const [loading, setLoading] = useState(false);
  const [csv, setCsv] = useState()
  const [vendorsData, setVendorsData] = useState([]);
  const [formRiderData, setFormRiderData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    facility_city: "",
  });



  const handleRiderChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormRiderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ImportRiderSampleCSV = async (e) => {
    e.preventDefault()
    e.preventDefault();
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file',file)
    try {
      const res = await axios.post(`${baseUrl}/api/vendor/bulkOnboardRidersCSV`,data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      toast.success("Sample file downloaded successfully");
    } catch (err) {
      toast.error("Error generateRiderSampleCSV ");
    }
  }
  const generateRiderSampleCSV = async () => {

    try {
      const res = await axios.get(`${baseUrl}/api/vendor/generateRiderSampleCSV`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Rider Onboarding Format.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sample file downloaded successfully");
    } catch (err) {
      toast.error("Error generateRiderSampleCSV ");
    }
  }

  const handleRiderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    for (const key in formRiderData) {
      if (formRiderData[key] !== null && formRiderData[key] !== "") {
        data.append(key, formRiderData[key]);
      }
    }



    try {
      const res = await axios.post(
        `${baseUrl}/api/vendor/onboardRider`,
        {
          "name": formRiderData.name,
          "email": formRiderData.email,
          "phone_number": formRiderData.phone_number,
          "password": formRiderData.password,
          "facility_city": formRiderData.facility_city,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Rider onboarded successfully!");
      setFormRiderData({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        facility_city: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error onboarding rider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (<Loader />) : (

        <div className="bg-gray-100 min-h-screen w-full">
          {/* Heading Strip */}
          <div className="mb-6 flex flex-col md:flex-row justify-between bg-[#0446DB] py-6 shadow-md px-6">
            <h1 className="text-2xl text-white">Rider Onboarding</h1>
            
            <div >
              <button
              onClick={() => generateRiderSampleCSV()}
              className="bg-white mt-2 mr-1  text-[#0446DB] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
            >
              Sample CSV
            </button>
              <input
              type="file"
              name="sample"
              onChange={ImportRiderSampleCSV}
              className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
            />
            </div>


          </div>

          <div className="px-4  relative -top-14 py-4 flex justify-center">
            <form
              onSubmit={handleRiderSubmit}
              className="
        bg-white rounded-2xl 
        w-full max-w-2xl 
        shadow-lg p-6 sm:p-8 
        space-y-6
        border border-gray-200 
        hover:shadow-xl 
        transition duration-300
      "
            >
              <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Rider Onboarding
              </h1>

              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formRiderData.name}
                  onChange={handleRiderChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0446DB]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formRiderData.email}
                  onChange={handleRiderChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number*
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formRiderData.phone_number}
                  onChange={handleRiderChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password*
                </label>
                <input
                  type="password"
                  name="password"
                  value={formRiderData.password}
                  onChange={handleRiderChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Facility City */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Facility City*
                </label>
                <Select
                  required
                  options={options}
                  isSearchable
                  value={options.find(
                    (option) => option.value === formRiderData?.facility_city
                  )}
                  onChange={(selectedOption) =>
                    setFormRiderData((prev) => ({
                      ...prev,
                      facility_city: selectedOption?.value || "",
                    }))
                  }
                  placeholder="Select City"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0446DB] hover:bg-indigo-800 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>



      )}
    </>
  );
}

export default VendorRiderOnboarding;