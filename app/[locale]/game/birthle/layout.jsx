"use client";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

export default function Layout({children}) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D">
      {children}
    </GoogleReCaptchaProvider>
  );
}
