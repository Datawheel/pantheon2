"use client";

import {useEffect, useRef} from "react";

const GoogleAdSense = ({
  adClient,
  adSlot,
  adFormat = "fluid",
  adLayoutKey = "-f1-1f+i5-pl-fa",
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (
      adRef.current &&
      !adRef.current.hasAttribute("data-adsbygoogle-status")
    ) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("Error loading Google AdSense:", err);
      }
    }
  }, []);

  return (
    <div className="my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{display: "block"}}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout-key={adLayoutKey}
      />
    </div>
  );
};

export default GoogleAdSense;
