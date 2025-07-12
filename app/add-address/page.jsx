'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/clerk-react";

// Custom Dropdown Component
const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`relative ${className}`}
    >
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          px-2 py-2.5 border rounded w-full text-gray-500 bg-white cursor-pointer
          flex justify-between items-center
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'border-orange-600' : ''}
        `}
      >
        <span className={value ? 'text-gray-700' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className={`
                px-3 py-2 cursor-pointer hover:bg-orange-50 hover:text-orange-600
                ${value === option ? 'bg-orange-100 text-orange-700' : 'text-gray-700'}
              `}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Province → District full map
const PROVINCE_DISTRICTS = {
  "Province 1": [
    "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga",
    "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"
  ],
  "Province 2": [
    "Bara", "Dhanusa", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"
  ],
  "Bagmati": [
    "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur",
    "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"
  ],
  "Gandaki": [
    "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur",
    "Parbat", "Syangja", "Tanahun"
  ],
  "Lumbini": [
    "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Parasi",
    "Palpa", "Pyuthan", "Rolpa", "Rukum East", "Rupandehi"
  ],
  "Karnali": [
    "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Salyan",
    "Surkhet", "Rukum West"
  ],
  "Sudurpashchim": [
    "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula",
    "Doti", "Kailali", "Kanchanpur"
  ]
};

// Bagmati only: District → Municipality
const BAGMATI_MUNICIPALITIES = {
  "Kathmandu": [
    "Kathmandu Metropolitan City", "Kirtipur Municipality", "Gokarneshwor Municipality",
    "Budhanilkantha Municipality", "Tokha Municipality", "Chandragiri Municipality",
    "Nagarjun Municipality", "Tarakeshwor Municipality", "Kageshwori Manohara Municipality",
    "Shankharapur Municipality"
  ],
  "Lalitpur": [
    "Lalitpur Metropolitan City", "Godawari Municipality", "Mahalaxmi Municipality",
    "Konjyosom Rural Municipality"
  ],
  "Bhaktapur": [
    "Bhaktapur Municipality", "Madhyapur Thimi Municipality",
    "Changunarayan Municipality", "Suryabinayak Municipality"
  ],
  "Chitwan": [
    "Bharatpur Metropolitan City", "Kalika Municipality", "Khairhani Municipality",
    "Ratnanagar Municipality", "Rapti Municipality", "Ichchhakamana Rural Municipality"
  ],
  "Makwanpur": [
    "Hetauda Sub-Metropolitan City", "Thaha Municipality", "Indrasarowar Rural Municipality",
    "Kailash Rural Municipality", "Bhimphedi Rural Municipality", "Makawanpurgadhi Rural Municipality",
    "Bakaiya Rural Municipality", "Bagmati Rural Municipality",
    "Raksirang Rural Municipality", "Manahari Rural Municipality"
  ],
  "Dhading": [
    "Nilkantha Municipality", "Dhunibeshi Municipality", "Gajuri Rural Municipality",
    "Galchhi Rural Municipality", "Jwalamukhi Rural Municipality", "Khaniyabash Rural Municipality",
    "Netrawati Dabjong Rural Municipality", "Rubi Valley Rural Municipality",
    "Siddhalek Rural Municipality", "Tripurasundari Rural Municipality"
  ],
  "Nuwakot": [
    "Bidur Municipality", "Belkotgadhi Municipality", "Kakani Rural Municipality",
    "Dupcheshwor Rural Municipality", "Likhu Rural Municipality", "Meghang Rural Municipality",
    "Panchakanya Rural Municipality", "Shivapuri Rural Municipality",
    "Suryagadhi Rural Municipality", "Tadi Rural Municipality"
  ],
  "Rasuwa": [
    "Uttargaya Rural Municipality", "Kalika Rural Municipality", "Gosaikunda Rural Municipality",
    "Naukunda Rural Municipality", "Aamachchodingmo Rural Municipality"
  ],
  "Sindhupalchok": [
    "Chautara Sangachokgadhi Municipality", "Melamchi Municipality",
    "Indrawati Rural Municipality", "Balephi Rural Municipality", "Bhotekoshi Rural Municipality",
    "Barhabise Municipality", "Helambu Rural Municipality", "Jugal Rural Municipality",
    "Lisankhu Pakhar Rural Municipality", "Panchpokhari Thangpal Rural Municipality",
    "Sunkoshi Rural Municipality", "Tripura Sundari Rural Municipality"
  ],
  "Kavrepalanchok": [
    "Dhulikhel Municipality", "Banepa Municipality", "Panauti Municipality",
    "Panchkhal Municipality", "Namobuddha Municipality", "Mandandeupur Municipality",
    "Bethanchok Rural Municipality", "Bhumlu Rural Municipality",
    "Chaurideurali Rural Municipality", "Khanikhola Rural Municipality",
    "Mahabharat Rural Municipality", "Roshi Rural Municipality",
    "Temal Rural Municipality"
  ],
  "Ramechhap": [
    "Manthali Municipality", "Ramechhap Municipality", "Umakunda Rural Municipality",
    "Khandadevi Rural Municipality", "Doramba Rural Municipality",
    "Likhu Rural Municipality", "Sunapati Rural Municipality",
    "Gokulganga Rural Municipality"
  ],
  "Sindhuli": [
    "Kamalamai Municipality", "Dudhauli Municipality", "Golanjor Rural Municipality",
    "Ghyanglekh Rural Municipality", "Hariharpurgadhi Rural Municipality",
    "Marin Rural Municipality", "Phikkal Rural Municipality",
    "Sunkoshi Rural Municipality", "Tinpatan Rural Municipality"
  ],
  "Dolakha": [
    "Bhimeshwor Municipality", "Jiri Municipality", "Baiteshwor Rural Municipality",
    "Bigu Rural Municipality", "Gaurishankar Rural Municipality",
    "Kalinchowk Rural Municipality", "Melung Rural Municipality",
    "Sailung Rural Municipality", "Tamakoshi Rural Municipality"
  ]
};

export default function AddAddress() {
  const { getToken, router } = useAppContext();
  const { openSignIn } = useClerk();

  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '+977 ',
    province: '',
    district: '',
    zipcode: '',
    area: '',
  });

  const handleProvinceChange = (province) => {
    setAddress({
      ...address,
      province,
      district: '',
      zipcode: ''
    });
  };

  const handleDistrictChange = (district) => {
    setAddress({
      ...address,
      district,
      zipcode: ''
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!address.fullName || !address.phoneNumber || !address.province || !address.district || !address.area) {
      toast.error("Please fill in all required fields");
      return;
    }

    // ✅ Nepali mobile number format: +977 97 / 98 + 8 digits (exactly 10 digits total)
    // Remove +977 and spaces for validation
    const cleanPhoneNumber = address.phoneNumber.replace(/^\+977\s*/, '').replace(/\s/g, '');
    const phonePattern = /^9[7-8][0-9]{8}$/;

    if (cleanPhoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (!phonePattern.test(cleanPhoneNumber)) {
      toast.error("Please enter a valid Nepali mobile number");
      return;
    }

    // ✅ Block dummy numbers like 9999999999 or 1234567890
    const allSameDigits = /^(\d)\1+$/;
    const knownFakeNumbers = ["1234567890", "9876543210"];

    if (allSameDigits.test(cleanPhoneNumber) || knownFakeNumbers.includes(cleanPhoneNumber)) {
      toast.error("This phone number looks fake. Please enter your real number.");
      return;
    }

    if (
      address.province === "Bagmati" &&
      BAGMATI_MUNICIPALITIES[address.district] &&
      !address.zipcode
    ) {
      toast.error("Please select your Municipality/Metro");
      return;
    }

    if (
      address.province !== "Bagmati" &&
      !address.zipcode
    ) {
      toast.error("Please enter your Nearest Popular Place");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please sign up or log in to add your delivery address");
        openSignIn();
        return;
      }

      const { data } = await axios.post(
        '/api/user/add-address',
        { addressData: address },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        setAddress({
          fullName: '',
          phoneNumber: '+977 ',
          province: '',
          district: '',
          zipcode: '',
          area: '',
        });
        router.push('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add address");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping <span className="font-semibold text-orange-600">Address</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            <input
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              type="text"
              placeholder="Full name"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            />
            <input
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              type="text"
              placeholder="+977 Phone number"
              value={address.phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                // Ensure it always starts with +977
                if (!value.startsWith('+977 ')) {
                  setAddress({ ...address, phoneNumber: '+977 ' });
                  return;
                }
                // Extract only the digits after +977
                const digits = value.replace('+977 ', '').replace(/\D/g, '');
                // Limit to exactly 10 digits
                if (digits.length <= 10) {
                  setAddress({ ...address, phoneNumber: '+977 ' + digits });
                }
              }}
              onFocus={(e) => {
                if (e.target.value === '') {
                  setAddress({ ...address, phoneNumber: '+977 ' });
                }
              }}
            />

            <CustomDropdown
              options={Object.keys(PROVINCE_DISTRICTS)}
              value={address.province}
              onChange={handleProvinceChange}
              placeholder="Select Province"
            />

            <CustomDropdown
              options={address.province ? PROVINCE_DISTRICTS[address.province] : []}
              value={address.district}
              onChange={handleDistrictChange}
              placeholder="Select District"
              disabled={!address.province}
            />

            {address.province === "Bagmati" && BAGMATI_MUNICIPALITIES[address.district] ? (
              <CustomDropdown
                options={BAGMATI_MUNICIPALITIES[address.district]}
                value={address.zipcode}
                onChange={(value) => setAddress({ ...address, zipcode: value })}
                placeholder="Select Municipality/Metro"
              />
            ) : (
              <input
                className="px-2 py-2.5 border rounded w-full text-gray-500"
                type="text"
                placeholder="Nearest Popular Place"
                value={address.zipcode}
                onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
              />
            )}

            <textarea
              className="px-2 py-2.5 border rounded w-full text-gray-500 resize-none"
              rows={4}
              placeholder="Address (Area and Street)"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            ></textarea>

            <button type="submit" className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase">
              Save address
            </button>
          </div>
        </form>
        <Image className="md:mr-16 mt-16 md:mt-0" src={assets.my_location_image} alt="my_location_image" />
      </div>
      <Footer />
    </>
  );
}