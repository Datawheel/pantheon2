"use client";

import {useEffect, useRef} from "react";

const GoogleAdSense = ({
  adClient,
  adSlot,
  adFormat = "fluid",
  adLayoutKey = null,
  style = null,
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
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={
        style
          ? style
          : {display: "block", minHeight: "250px", minWidth: "300px"}
      }
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      {...(adLayoutKey ? {"data-ad-layout-key": adLayoutKey} : {})}
    />
  );
};

export default GoogleAdSense;
