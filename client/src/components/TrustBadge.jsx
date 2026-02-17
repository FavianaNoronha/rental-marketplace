/**
 * Trust Badge Component - Displays verification and security features
 * Part of the 2026 Professional Trust Architecture
 * Shows real providers and compliance standards
 */
const TrustBadge = ({ type, verified = false, small = false }) => {
  const badges = {
    ai_authenticated: {
      icon: '🤖',
      label: 'AI Authenticated',
      description: 'Image authenticity verified by machine learning',
      provider: 'Google Vision AI',
      color: 'coolBlue',
      compliance: 'ISO 27001',
    },
    kyc_verified: {
      icon: '✓',
      label: 'Aadhaar KYC',
      description: 'Video KYC with live face match completed',
      provider: 'Signzy / HyperVerge',
      color: 'mocha',
      compliance: 'RBI Compliant',
    },
    escrow_protected: {
      icon: '🛡️',
      label: 'Escrow Protected',
      description: 'Payment held by neutral trustee until safe return',
      provider: 'Cashfree Escrow',
      color: 'gold',
      compliance: 'SEBI Registered',
    },
    insured: {
      icon: '🔒',
      label: 'Fully Insured',
      description: 'Jewellers Block Policy covering theft & loss',
      provider: 'Bajaj Allianz / Chubb',
      color: 'mermaid',
      compliance: 'IRDAI Licensed',
    },
    hygiene_certified: {
      icon: '✨',
      label: 'Hygiene Certified',
      description: 'Professionally cleaned & ozone sanitized',
      provider: 'Certified Partners',
      color: 'mocha',
      compliance: 'ISO 22000',
    },
    trusted_seller: {
      icon: '⭐',
      label: 'Trusted Seller',
      description: '5+ successful rentals, 98%+ positive ratings',
      provider: 'Community Verified',
      color: 'gold',
      compliance: 'Platform Guarantee',
    },
    fair_trade: {
      icon: '🤝',
      label: 'Sustainable',
      description: 'Carbon neutral shipping & ethical sourcing',
      provider: 'Carbon Offset Program',
      color: 'mermaid',
      compliance: 'UN SDG Aligned',
    },
    legal_protection: {
      icon: '⚖️',
      label: 'Legal Protection',
      description: 'IPC Section 406 - Criminal Breach of Trust',
      provider: 'Indian Penal Code',
      color: 'crimson',
      compliance: 'Law Enforcement',
    },
  };

  const badge = badges[type];
  if (!badge) return null;

  const colorClasses = {
    mocha: verified ? 'bg-mocha-100 text-mocha-700 border-mocha-300' : 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
    gold: verified ? 'bg-gold-100 text-gold-700 border-gold-300' : 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
    mermaid: verified ? 'bg-mermaid-100 text-mermaid-700 border-mermaid-300' : 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
    coolBlue: verified ? 'bg-coolBlue-100 text-coolBlue-700 border-coolBlue-300' : 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
    crimson: verified ? 'bg-crimson-100 text-crimson-700 border-crimson-300' : 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
  };

  if (small) {
    return (
      <span 
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans font-semibold border ${colorClasses[badge.color]}`}
        title={`${badge.description} • ${badge.provider}`}
      >
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  }

  return (
    <div className={`flex flex-col gap-2 p-5 rounded-lg border-2 ${colorClasses[badge.color]} transition-all hover:shadow-lg hover-lift`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl">{badge.icon}</div>
        <div className="flex-1">
          <div className="font-sans font-bold text-base mb-1">{badge.label}</div>
          <div className="text-xs opacity-90 mb-2">{badge.description}</div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-semibold opacity-70">
              <span className="opacity-50">Provider:</span> {badge.provider}
            </div>
            <div className="text-xs font-semibold opacity-70">
              <span className="opacity-50">Compliance:</span> {badge.compliance}
            </div>
          </div>
        </div>
        {verified && (
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Trust Score Display
 */
export const TrustScore = ({ score, reviews, className = '' }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-300';
    if (score >= 70) return 'text-gold-600 bg-gold-50 border-gold-300';
    return 'text-charcoal-600 bg-charcoal-50 border-charcoal-300';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreColor(score)} ${className}`}>
      <div className="flex flex-col">
        <span className="text-2xl font-display font-bold">{score}</span>
        <span className="text-xs opacity-70">Trust Score</span>
      </div>
      {reviews && (
        <div className="text-xs opacity-70">
          from {reviews} reviews
        </div>
      )}
    </div>
  );
};

/**
 * Verification Timeline - Shows verification progress
 */
export const VerificationTimeline = ({ steps }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
              ${step.completed ? 'bg-green-500 text-white' : 'bg-charcoal-200 text-charcoal-500'}
            `}>
              {step.completed ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-charcoal-200'}`} />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4 className="font-sans font-semibold text-sm mb-1">{step.title}</h4>
            <p className="text-xs text-charcoal-600">{step.description}</p>
            {step.timestamp && (
              <p className="text-xs text-charcoal-500 mt-1">{step.timestamp}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadge;
