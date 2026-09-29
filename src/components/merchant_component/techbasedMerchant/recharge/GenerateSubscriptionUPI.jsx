import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const baseUrl = import.meta.env.VITE_BASE_URL;

function GenerateSubscriptionUPI({ plan_id, amount, plane,isLight}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${baseUrl}/api/tech-merchant/createSubscriptionlink`,
                {
                    plan_id: plan_id,
                    amount: amount
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            if (response.data.success && response.data.payment_link) {
                const paymentLink = `https://pay.easebuzz.in/pay/${response.data.payment_link}`;
                window.location.href = paymentLink;

            } else {
                setError('Failed to generate payment link.');
            }


        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Error generating link")
            setError(err.response?.data?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`mt-7 flex h-[31px] w-full items-center justify-center rounded-[7px] border text-[12px] font-bold transition ${
                  isLight
                    ? "border-neutral-600 bg-[#191919] text-white hover:bg-black"
                    : "border-neutral-300 bg-white text-black hover:bg-neutral-100"
                }`}
              >
              
               {loading ? 'Generating...' : plane}


                      
              </button>
           

            {error && (
                <p className="text-red-600 mt-2 text-sm">
                    {error}
                </p>
            )}
        </div>
    );

}

export default GenerateSubscriptionUPI;
