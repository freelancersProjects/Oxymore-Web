import React, { useEffect, useRef, useState } from "react";
import "./TabSwitcher.scss";

export interface Tab {
  label: string;
  value: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  value,
  onChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({
    width: "0px",
    transform: "translateX(0px)",
    borderRadius: "12px",
  });

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.value === value);
    const container = containerRef.current;
    if (container) {
      const activeButton = container.querySelectorAll("button")[
        index
      ] as HTMLButtonElement;
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton;
        const radius =
          index === 0
            ? "12px 0 0 12px"
            : index === tabs.length - 1
            ? "0 12px 12px 0"
            : "0";
        setSliderStyle({
          width: `${offsetWidth}px`,
          transform: `translateX(${offsetLeft}px)`,
          borderRadius: radius,
        });
      }
    }
  }, [value, tabs]);

  return (
    <nav
      ref={containerRef}
      className={`oxm-tabswitcher ${className || ""}`}
      role="tablist"
    >
      <div className="oxm-tabswitcher__slider" style={sliderStyle} />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`oxm-tabswitcher__tab${
            value === tab.value ? " active" : ""
          }`}
          role="tab"
          aria-selected={value === tab.value}
          tabIndex={value === tab.value ? 0 : -1}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabSwitcher;
