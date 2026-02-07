import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const [result, setResult] = useState("");

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "021111503504 (Ext 194)",
      color: "blue",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      details: "0317-8226242",
      color: "green",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "banoqabil.khi@alkhidmat.com",
      color: "purple",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: "Idara Noor-e-Haq, 501, Quaideen Colony, Karachi",
      color: "green",
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "f0c96f85-78cd-4372-8fd3-7ef9caab9171");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Message Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="pt-24 pb-16">
      <ToastContainer />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Get in touch with us. We're here to help you start your IT career
            journey.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.title}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-${info.color}-100 dark:bg-${info.color}-900/20 flex items-center justify-center`}
                      >
                        <div
                          className={`text-${info.color}-600 dark:text-${info.color}-400`}
                        >
                          {info.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                        {/* {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 dark:text-gray-300">
                            {detail}
                          </p>
                        ))} */}
                        <p className="text-gray-600 dark:text-gray-300">
                          {info.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Support */}
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6"
                  data-aos="fade-up"
                >
                  <h3 className="text-lg font-bold mb-4">Quick Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-sm opacity-90">
                          Within 24 hours
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Support Hours</div>
                        <div className="text-sm opacity-90">
                          Mon-Fri: 9 AM - 6 PM
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Availability</div>
                        <div className="text-sm opacity-90">
                          Online & On-campus
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8"
                data-aos="fade-left"
              >
                <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Fill out the form below and our team will get back to you as
                  soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your requirements or questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full inline-flex items-center justify-center"
                  >
                    Send Message
                  </button>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {result}
                  </span>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By submitting this form, you agree to our Terms of Service
                    and Privacy Policy. We'll never share your information with
                    third parties.
                  </p>
                </div>
              </div>

              {/* Map */}
              <div
                className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
                data-aos="fade-up"
              >
                <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <div className="font-bold">Karachi, Pakistan</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                      Main Campus Location
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-800 section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "What are the admission requirements?",
                a: "Basic computer literacy and passion for learning. Some advanced courses may require prior knowledge.",
              },
              {
                q: "Do you offer payment plans?",
                a: "Yes, we offer flexible payment plans and scholarships for deserving students.",
              },
              {
                q: "Are courses available online?",
                a: "Yes, we offer both online and on-campus learning options.",
              },
              {
                q: "Do you provide job placement?",
                a: "Yes, we have a dedicated career services team that helps with job placements.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
