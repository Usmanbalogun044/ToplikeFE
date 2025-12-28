import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Sharedd/Header";
import { FiCheck, FiStar, FiShield, FiTrendingUp, FiArrowLeft } from "react-icons/fi";
import VerifiedBadge from "../../Components/VerifiedBadge";
import { API_URL } from "../../config";

const VerifiedSubscription = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchUser();
  }, []);

  const fetchUser = () => {
    const cachedProfile = sessionStorage.getItem("currentUserProfile");
    if (cachedProfile) {
        setUser(JSON.parse(cachedProfile).user);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/subscription/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPlans(data.plans || []);
      } else {
        // Fallback mock plan if API fails or is empty, for UI dev purposes
        if (!data.plans) console.warn("No plans returned from API");
        setError("Failed to load plans");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const SubscribeButton = ({ plan }) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubscribe = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/subscription/initialize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plan_id: plan.id })
            });
            const data = await response.json();
            if (response.ok && data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                alert(data.message || "Failed to initialize payment");
                setSubmitting(false);
            }
        } catch (e) {
            alert("Failed to initialize payment");
            setSubmitting(false);
        }
    };

    return (
        <button
          onClick={handleSubscribe}
          disabled={submitting}
          className="btn-brand w-full py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 font-bold text-lg flex justify-center items-center"
        >
          {submitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
             `Subscribe for ₦${Number(plan.price).toLocaleString()}`
          )}
        </button>
    );
  };

  if (loading) {
      return (
        <div className="flex flex-col min-h-screen text-white">
          <Header />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-fuchsia-500"></div>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-purple-300/60 hover:text-white mb-8 transition gap-2">
            <FiArrowLeft /> Back
        </button>

        <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block p-4 bg-fuchsia-500/10 rounded-full mb-6 ring-1 ring-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                <VerifiedBadge size={64} />
            </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Get Verified on <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">TopLike</span>
          </h1>
          <p className="text-lg text-purple-200/60 max-w-2xl mx-auto leading-relaxed">
            Stand out with the blue tick, rank higher on leaderboards, and unlock exclusive premium tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Benefits List */}
            <div className="glass-panel p-8 rounded-3xl animate-fade-in-up delay-100">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-1 bg-fuchsia-500 rounded-full"></span>
                    Why Verify?
                </h3>
                <ul className="space-y-8">
                    <li className="flex items-start">
                        <div className="bg-blue-500/10 p-3 rounded-xl mr-4 border border-blue-500/20">
                            <FiStar className="text-blue-400 w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Blue Tick Badge</h4>
                            <p className="text-sm text-purple-200/50 mt-1">Official verified badge on your profile and all your posts.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-green-500/10 p-3 rounded-xl mr-4 border border-green-500/20">
                            <FiTrendingUp className="text-green-400 w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Increased Visibility</h4>
                            <p className="text-sm text-purple-200/50 mt-1">Appear higher in feeds and get highlighted on leaderboards.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-purple-500/10 p-3 rounded-xl mr-4 border border-purple-500/20">
                            <FiShield className="text-fuchsia-400 w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Priority & Trust</h4>
                            <p className="text-sm text-purple-200/50 mt-1">Faster withdrawals and increased trust from the community.</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Plans */}
            <div className="space-y-6 animate-fade-in-up delay-200">
                {plans.length > 0 ? plans.map(plan => (
                    <div key={plan.id} className="glass-card p-8 rounded-3xl border border-fuchsia-500/30 relative overflow-hidden group hover:border-fuchsia-500/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 bg-fuchsia-600 text-white text-[10px] uppercase font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                            Recommended
                        </div>
                        
                        {/* Glow Effect */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl group-hover:bg-fuchsia-500/30 transition-all duration-500"></div>

                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-8">
                            <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                                ₦{Number(plan.price).toLocaleString()}
                            </span>
                            <span className="text-purple-300/50 ml-2 font-medium">/ month</span>
                        </div>
                        
                        <SubscribeButton plan={plan} />
                        
                        <p className="text-xs text-center text-purple-300/30 mt-6 flex items-center justify-center gap-2">
                            <FiShield /> Secure payment via Paystack. Cancel anytime.
                        </p>
                    </div>
                )) : (
                     <div className="glass-panel p-8 text-center text-purple-300/50">
                        <p>No active subscription plans found.</p>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedSubscription;
