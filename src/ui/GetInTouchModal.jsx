import PropTypes from "prop-types";
import { useState } from "react";

export default function GetInTouchModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    contact: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted!");
    onClose();
    setFormData({ name: "", lastName: "", contact: "", email: "", message: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
          Get in Touch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Contact */}
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {/* Message */}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black h-28 resize-none focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="align-middle select-none font-sans font-bold text-center uppercase
              disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs
              shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85]
              focus:shadow-none active:opacity-[0.85] active:shadow-none bg-orange-400 text-black
              px-10 py-3 rounded-lg shadow-md hover:bg-orange-500 transition-all w-full"
            style={{ position: "relative", overflow: "hidden" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

GetInTouchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
