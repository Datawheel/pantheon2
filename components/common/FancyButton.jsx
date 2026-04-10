import "./FancyButton.css";

/** renders as either a button or a link, but always looks like a fancy button */
// export default class FancyButton extends Component {
export default function FancyButton({
  disabled,
  children, // the text
  icon: IconComponent, // lucide-react icon component
  onClick, // won't render as a link
  link, // won't render as a button
  href,
  El = "button",
}) {
  if (El === "link" || El === "a" || link) {
    El = "a";
  } else El = "button";

  return (
    <El
      className="fancy-button"
      onClick={El === "button" ? onClick : null}
      href={El === "a" ? href : null}
      disabled={disabled}
    >
      <span className="fancy-button-text">
        {children || "missing `children` prop in FancyButton.jsx"}
      </span>
      {IconComponent && <IconComponent className="fancy-button-icon" size={16} />}
    </El>
  );
}
