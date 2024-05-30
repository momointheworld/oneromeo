'use client';
import React, { useEffect } from "react";

const StripePricingTable = () => {
    const PRICING_TABLE_ID = process.env.PRICING_TABLE_ID;
    const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

        return React.createElement("stripe-pricing-table", {
            "pricing-table-id": PRICING_TABLE_ID,
            "publishable-key": NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        }); 
    }


export default StripePricingTable;
