import React, { useEffect, useRef, useState } from "react";
import "./TabSwitcher.scss";

export interface Tab {
  label: string;
  value: string;
  icon?: React.ReactNode;
  badge?: number;
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.value === value);
    const activeTab = tabRefs.current[index];
    
    if (activeTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      setIndicatorStyle({
        width: tabRect.width,
        left: tabRect.left - containerRect.left,
      });
    }
  }, [value, tabs]);

  return (
    <div className={`oxm-tabswitcher-wrapper ${className || ""}`}>
      <nav
        ref={containerRef}
        className="oxm-tabswitcher"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`oxm-tabswitcher__tab${
              value === tab.value ? " active" : ""
            }`}
            role="tab"
            aria-selected={value === tab.value}
            tabIndex={value === tab.value ? 0 : -1}
            onClick={() => onChange(tab.value)}
          >
            {tab.icon && <span className="oxm-tabswitcher__tab__icon">{tab.icon}</span>}
            <span className="oxm-tabswitcher__tab__label">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="oxm-tabswitcher__tab__badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </nav>
      <hr className="oxm-tabswitcher__separator" />
      <div
        className="oxm-tabswitcher__indicator"
        style={{
          width: `${indicatorStyle.width}px`,
          transform: `translateX(${indicatorStyle.left}px)`,
        }}
      />
    </div>
  );
};

export default TabSwitcher;
