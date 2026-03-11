"use client";

import {useEffect, useRef} from "react";

const GoogleAdSense = ({
  adClient,
  adSlot,
  adFormat = "fluid",
  adLayoutKey = null,
  style = null,
  fullWidthResponsive = false,
}) => {
  const adRef = useRef(null);

  const pushed = useRef(false);

  useEffect(() => {
    if (
      adRef.current &&
      !pushed.current &&
      !adRef.current.hasAttribute("data-adsbygoogle-status")
    ) {
      pushed.current = true;
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
      {...(fullWidthResponsive ? {"data-full-width-responsive": "true"} : {})}
    />
  );
};

export default GoogleAdSense;
