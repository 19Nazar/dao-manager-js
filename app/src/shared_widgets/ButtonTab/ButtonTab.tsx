import { AllHTMLAttributes, forwardRef } from "react";
import "./ButtonTab.css";

export interface ButtonTabProps
    extends Omit<AllHTMLAttributes<HTMLButtonElement>, never> {
    /**
     * Determines if the tab is currently active
     * Affects the visual styling of the tab
     */
    isActive: boolean;
    /**
     * Specifies the type of button
     * @default "button"
     */
    type?: "button" | "submit" | "reset";
}

/**
 * Customizable tab button component with active/inactive states
 *
 * @param {ButtonTabProps} props - Component properties
 * @param {React.ForwardedRef<HTMLButtonElement>} ref - Forwarded ref for the button element
 * @returns {React.ReactElement} Rendered tab button element
 *
 * @example
 * // Basic tab navigation component
 * function TabNavigationExample() {
 *   const [activeTab, setActiveTab] = useState(0);
 *
 *   return (
 *     <div className="flex">
 *       <ButtonTab
 *         isActive={activeTab === 0}
 *         onClick={() => setActiveTab(0)}
 *       >
 *         First Tab
 *       </ButtonTab>
 *       <ButtonTab
 *         isActive={activeTab === 1}
 *         onClick={() => setActiveTab(1)}
 *       >
 *         Second Tab
 *       </ButtonTab>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Tabs with different states
 * function TabStatesExample() {
 *   return (
 *     <div className="flex">
 *       <ButtonTab isActive={true}>Active Tab</ButtonTab>
 *       <ButtonTab isActive={false}>Inactive Tab</ButtonTab>
 *     </div>
 *   );
 * }
 */
export const ButtonTab = forwardRef<HTMLButtonElement, ButtonTabProps>(
    ({ isActive, type = "button", children, ...restProps }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                className={`button ${isActive ? "active" : ""}`}
                {...restProps}
            >
                <h6 className={`text ${isActive ? "active" : ""}`}>
                    {children}
                </h6>
            </button>
        );
    },
);

ButtonTab.displayName = "ButtonTab";
