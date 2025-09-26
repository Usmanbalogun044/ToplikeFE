import { useEffect } from "react";
import "./App.css";
import Routing from "./Router/Routing";

function App() {
  useEffect(() => {
    const handlePaymentCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get("reference");
      const trxref = urlParams.get("trxref");

      if (reference || trxref) {
        try {
          const response = await fetch(
            "https://api.toplike.app/api/paystack/callback",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                reference: reference || trxref,
              }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            // Show success message and update subscription status
            console.log("Payment successful:", data.message);
            // You can update global state or show a notification here
          }
        } catch (error) {
          console.error("Error processing payment callback:", error);
        }
      }
    };

    handlePaymentCallback();
  }, []);

  return (
    <>
      <Routing />
    </>
  );
}

export default App;
