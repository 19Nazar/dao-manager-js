import React, { AllHTMLAttributes, forwardRef } from "react";
import "./ButtonSettings.css";

export interface ButtonSettingsProps
  extends Omit<AllHTMLAttributes<HTMLButtonElement>, never> {
  /**
   * Determines if the tab is currently active
   * Affects the visual styling of the tab
   */
  isActive: boolean;
}

const ButtonSettings = forwardRef<HTMLButtonElement, ButtonSettingsProps>(
  ({ isActive, children, style, onClick, onMouseOver, onMouseOut }, ref) => {
    return (
      <button
        ref={ref}
        className={`custom-button ${isActive ? "active" : "inactive"}`}
        style={{ ...style }}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {children}
      </button>
    );
  },
);

ButtonSettings.displayName = "ButtonSettings";

export default ButtonSettings;
