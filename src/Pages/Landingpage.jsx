import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiClock,
  FiDollarSign,
  FiAward,
  FiHeart,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Landingpage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 4,
    minutes: 30,
    seconds: 0,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0)
          return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0)
          return {
            ...prev,
            days: days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setMobileMenuOpen(false);
    }
  };

  const winners = [
    {
      id: 1,
      username: "@CreativeChioma",
      prize: "₦100,000",
      category: "Fashion Design",
      testimonial:
        "Weekly Wins changed my life! I used the money to start my small business.",
      image: "/winner1.jpg",
    },
    {
      id: 2,
      username: "@MusicKing",
      prize: "₦75,000",
      category: "Original Song",
      testimonial: "Winning gave me the confidence to pursue music full-time!",
      image: "/winner2.jpg",
    },
    {
      id: 3,
      username: "@DanceQueen",
      prize: "₦50,000",
      category: "Dance Video",
      testimonial: "This platform helped me get discovered by a talent agency!",
      image: "/winner3.jpg",
    },
  ];

  return (
    <>
      <main className="font-sans bg-gray-50">
        {/* Navigation */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? "py-3 bg-white shadow-lg top-0" : "py-5 bg-white"
          }`}
        >
          <ul className="flex justify-between items-center container mx-auto px-4 lg:px-20">
            <li>
              <a
                href="#hero"
                className="text-2xl font-extrabold text-purple-700"
                onClick={(e) => handleSmoothScroll(e, "hero")}
              >
                TopLike
              </a>
            </li>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <li>
                <a
                  href="#how-it-works"
                  className="font-semibold text-gray-800 hover:text-purple-600"
                  onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#winners"
                  className="font-semibold text-gray-800 hover:text-purple-600"
                  onClick={(e) => handleSmoothScroll(e, "winners")}
                >
                  Past Winners
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="font-semibold text-gray-800 hover:text-purple-600"
                  onClick={(e) => handleSmoothScroll(e, "faq")}
                >
                  FAQ
                </a>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="font-semibold text-gray-800 hover:text-purple-600"
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition hover:bg-purple-800"
                >
                  Sign Up
                </NavLink>
              </li>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </ul>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white shadow-xl">
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <a
                  href="#how-it-works"
                  className="font-semibold py-2 hover:text-purple-600 transition"
                  onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                >
                  How It Works
                </a>
                <a
                  href="#winners"
                  className="font-semibold py-2 hover:text-purple-600 transition"
                  onClick={(e) => handleSmoothScroll(e, "winners")}
                >
                  Past Winners
                </a>
                <a
                  href="#faq"
                  className="font-semibold py-2 hover:text-purple-600 transition"
                  onClick={(e) => handleSmoothScroll(e, "faq")}
                >
                  FAQ
                </a>
                <NavLink
                  to="/login"
                  className="font-semibold py-2 hover:text-purple-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-center transition hover:bg-purple-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section
          id="hero"
          className="pt-36 flex flex-col px-4 py-20 bg-gradient-to-r from-gray-50 to-purple-50 lg:flex-row lg:px-20"
        >
          <div className="mb-10 lg:mb-0 lg:w-1/2 lg:pr-10" data-aos="fade-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 md:text-5xl">
              Show Your Talent. Win{" "}
              <span className="text-purple-600">₦100,000</span> Weekly!
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Join thousands of Nigerians competing in our weekly challenges.
              Post your best content, get votes, and win cash prizes!
            </p>
            <button
              className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full text-lg cursor-pointer transition transform
             hover:scale-105 hover:bg-purple-700"
            >
              Join Now for ₦500
            </button>
            <div className="mt-8 flex-col space-y-2 text-gray-700">
              <div className="flex items-center">
                <FiClock className="mr-3" size={18} />
                <span>
                  Next contest starts in:{" "}
                  <strong className="ml-1">
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                    {timeLeft.seconds}s
                  </strong>
                </span>
              </div>
              <div className="flex items-center">
                <FiDollarSign className="mr-3" size={18} />
                <span>
                  Current prize pool: <strong className="ml-1">₦300,000</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative" data-aos="fade-right">
            <div className="bg-white p-2 rounded-2xl shadow-2xl transform rotate-1">
              <div className="bg-gray-200 rounded-xl h-64 lg:h-96 flex items-center justify-center overflow-hidden">
                {/* Placeholder for hero image/video */}
                <div className="text-center p-6">
                  <FiAward className="mx-auto text-purple-600 mb-4" size={48} />
                  <p className="text-gray-500">Featured winning submission</p>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <FiHeart className="text-red-500 mr-2" />
                <span className="font-bold">1,200+</span>
                <span className="ml-1">Weekly Votes</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="px-4 py-20 lg:px-20 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How TopLike Works
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Three simple steps to your next win
          </p>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            {[
              {
                number: 1,
                title: "Pay & Submit",
                desc: "Pay ₦500 entry fee and submit your best photo, video, or creative work",
              },
              {
                number: 2,
                title: "Get Votes",
                desc: "Share your entry and get friends & community to vote for you",
              },
              {
                number: 3,
                title: "Win Prizes",
                desc: "The top voted entries win cash prizes every week!",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="flex-1 bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div
                  className="w-16 h-16 font-bold mx-auto mb-6 bg-purple-100 text-purple-600 text-2xl rounded-full flex items-center
                 justify-center"
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Past Winners */}
        <section
          id="winners"
          className="px-4 py-20 bg-gray-100 lg:px-20"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Recent Winners
          </h2>

          <div className="flex justify-evenly overflow-x-auto pb-6 space-x-6 scrollbar-hide">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                data-aos="zoom-in"
              >
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Winner Photo</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{winner.username}</h3>
                  <p className="text-purple-600 font-semibold mb-2">
                    {winner.prize} - {winner.category}
                  </p>
                  <p className="text-gray-600 italic">"{winner.testimonial}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="faq"
          className="px-4 py-20 lg:px-20 bg-white text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Ready to Showcase Your Talent?
          </h2>
          <p className="text-xl mb-8 text-gray-700">
            Join thousands of creatives competing and winning every week
          </p>
          <NavLink
            to="/signup"
            className="inline-block text-white bg-purple-700 font-semibold py-3 px-10 rounded-full text-lg transition transform hover:scale-105 hover:bg-purple-800 shadowe-md"
          >
            Sign Up Now
          </NavLink>
        </section>

        <footer className="bg-gray-900 text-gray-200 px-6 py-10 lg:px-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Branding */}
            <div>
              <h2 className="text-3xl font-bold text-purple-700 mb-4">
                TopLike
              </h2>
              <p className="text-sm text-gray-400">
                Bringing top-tier experiences to your fingertips.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-purple-300 transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-300 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-300 transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4 text-xl">
                <a href="#" className="hover:text-purple-300 transition">
                  <FaFacebookF />
                </a>
                <a href="#" className="hover:text-purple-300 transition">
                  <FaTwitter />
                </a>
                <a href="#" className="hover:text-purple-300 transition">
                  <FaInstagram />
                </a>
                <a href="#" className="hover:text-purple-300 transition">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div
            className="mt-10 pt-6 border-t border-gray-700 flex flex-col space-y-4 justify-between text-sm text-gray-500 md:flex-row
           md:space-y-0"
          >
            <p className="">
              © {new Date().getFullYear()} TopLike. All rights reserved.
            </p>
            <div className="flex items-center space-x-5">
              <a
                className="text-gray-500 hover:text-purple-300"
                href="coming-soon"
              >
                Privacy policy
              </a>
              <a
                className="text-gray-500 hover:text-purple-300"
                href="coming-soon"
              >
                Terms of Service
              </a>
              <a
                className="text-gray-500 hover:text-purple-300"
                href="coming-soon"
              >
                Cookies
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Landingpage;
