import React from 'react';
import { motion } from 'framer-motion';
import { OXMButton } from '@oxymore/ui';
import CheckIcon from '../../assets/svg/check.svg';
import CrossIcon from '../../assets/svg/cross.svg';
import { SUBSCRIPTION_PLANS } from './data';
import type { SubscriptionFeature } from '../../types/subscription';
import './Subscription.scss';

const Subscription: React.FC = () => {
  const handleUpgrade = (planName: string) => {
    console.log(`Upgrading to ${planName}`);
  };

  const handleViewAllFeatures = () => {
    console.log('View all features');
  };

  const currentPlan = "Free Plan";

  return (
    <motion.div
      className="subscription-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="subscription-container">
        <motion.div
          className="subscription-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <motion.h1
            className="subscription-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          >
            Subscription Plans
          </motion.h1>
          <motion.p
            className="subscription-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          >
            Select the plan that fits your playstyle and unlock advanced features.
          </motion.p>
        </motion.div>

        <motion.div
          className="subscription-plans"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        >
          {SUBSCRIPTION_PLANS.map((plan, index) => (
            <motion.div
              key={index}
              className="subscription-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + (index * 0.1),
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="plan-content">
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price-container">
                    <span className="plan-price">{plan.price}</span>
                    <span className="plan-period">{plan.period}</span>
                  </div>
                  <OXMButton
                    variant={plan.name === currentPlan ? "secondary" : "primary"}
                    onClick={() => handleUpgrade(plan.name)}
                    className={`upgrade-button ${plan.name === currentPlan ? 'current-plan' : ''}`}
                    disabled={plan.name === currentPlan}
                  >
                    {plan.name === currentPlan ? 'CURRENT PLAN' : 'UPGRADE'}
                  </OXMButton>
                </div>

                <div className="plan-features">
                <div className="feature-section">
                  <h4 className="section-title">CREDITS</h4>
                  <hr className="section-divider" />
                  <div className="feature-list">
                    {plan.credits.map((feature: SubscriptionFeature, featureIndex: number) => (
                      <div key={featureIndex} className="feature-item">
                        <div className="feature-info">
                          <span className="feature-name">{feature.name}</span>
                          {feature.value && <span className="feature-value">{feature.value}</span>}
                        </div>
                        <div className="feature-icon">
                          {feature.included ? (
                            <img src={CheckIcon} alt="Included" className="check-icon" />
                          ) : (
                            <img src={CrossIcon} alt="Not included" className="cross-icon" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="feature-section">
                  <h4 className="section-title">INCLUDED</h4>
                  <hr className="section-divider" />
                  <div className="feature-list">
                    {plan.included.map((feature: SubscriptionFeature, featureIndex: number) => (
                      <div key={featureIndex} className="feature-item">
                        <div className="feature-info">
                          <span className="feature-name">{feature.name}</span>
                          {feature.value && <span className="feature-value">{feature.value}</span>}
                        </div>
                        <div className="feature-icon">
                          {feature.included ? (
                            <img src={CheckIcon} alt="Included" className="check-icon" />
                          ) : (
                            <img src={CrossIcon} alt="Not included" className="cross-icon" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                <button
                  className="view-all-features-button"
                  onClick={handleViewAllFeatures}
                >
                  VIEW ALL FEATURES
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Subscription;
