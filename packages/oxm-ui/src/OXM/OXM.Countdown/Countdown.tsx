import React, { useState, useEffect } from "react";
import "./Countdown.scss";

export interface CountdownProps {
  targetDate: Date;
  theme?: "blue" | "purple";
  size?: "small" | "medium" | "large";
  showLabels?: boolean;
  className?: string;
  onComplete?: () => void;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const OXMCountdown: React.FC<CountdownProps> = ({
  targetDate,
  theme = "purple",
  size = "medium",
  showLabels = true,
  className = "",
  onComplete,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
        onComplete?.();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const classes = [
    "oxm-countdown",
    `oxm-countdown--${theme}`,
    `oxm-countdown--${size}`,
    isComplete ? "oxm-countdown--complete" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const timeUnits = [
    { value: timeLeft.days, label: "Jours", show: showDays },
    { value: timeLeft.hours, label: "Heures", show: showHours },
    { value: timeLeft.minutes, label: "Minutes", show: showMinutes },
    { value: timeLeft.seconds, label: "Secondes", show: showSeconds },
  ].filter(unit => unit.show);

  return (
    <div className={classes}>
      {isComplete ? (
        <div className="oxm-countdown-complete">
          <span>Terminé !</span>
        </div>
      ) : (
        <div className="oxm-countdown-grid">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="oxm-countdown-unit">
              <div className="oxm-countdown-value">
                {formatNumber(unit.value)}
              </div>
              {showLabels && (
                <div className="oxm-countdown-label">{unit.label}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OXMCountdown;
