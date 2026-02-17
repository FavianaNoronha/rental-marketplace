import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Security Architecture Component
 * Multi-layered fraud prevention for P2P rental marketplace
 * Implements: KYC, Escrow, Insurance, Legal Recourse
 */
const SecurityArchitecture = () => {
  const [activeLayer, setActiveLayer] = useState('all');

  const securityLayers = [
    {
      id: 'prevention',
      level: 'Level 1',
      title: 'Identity Vetting (KYC)',
      icon: '🛡️',
      color: 'mocha',
      features: [
        {
          name: 'Aadhaar Video KYC',
          description: 'Live face match against Aadhaar/PAN card',
          provider: 'Signzy / HyperVerge',
          status: 'active',
        },
        {
          name: 'Social Verification',
          description: 'Link Instagram/LinkedIn profiles for social vetting',
          provider: 'In-house API',
          status: 'active',
        },
        {
          name: 'Trust Score System',
          description: 'Graduated access: New users start with low-value items',
          provider: 'Proprietary Algorithm',
          status: 'active',
        },
      ],
      benefit: 'Know exactly who the renter is. Makes vanishing impossible.',
    },
    {
      id: 'friction',
      level: 'Level 2',
      title: 'Financial Security',
      icon: '💳',
      color: 'coolBlue',
      features: [
        {
          name: 'Pre-Authorization Hold',
          description: 'Block security deposit on credit card (₹10,000+)',
          provider: 'Cashfree / Razorpay',
          status: 'active',
        },
        {
          name: 'Instant Charge Capture',
          description: 'Capture full deposit if item not returned by deadline',
          provider: 'Cashfree / Razorpay',
          status: 'active',
        },
      ],
      benefit: 'Immediate financial penalty deters theft.',
    },
    {
      id: 'trust',
      level: 'Level 3',
      title: 'Escrow Protection',
      icon: '🏦',
      color: 'gold',
      features: [
        {
          name: 'Trustee-Based Escrow',
          description: 'Rental fee held by neutral third party',
          provider: 'Cashfree Escrow / Escrowpay',
          status: 'active',
        },
        {
          name: 'Smart Release',
          description: 'Payment released only after confirmed return + inspection',
          provider: 'Automated Workflow',
          status: 'active',
        },
      ],
      benefit: 'Protects money until item safely returned.',
    },
    {
      id: 'recovery',
      level: 'Level 4',
      title: 'Insurance Coverage',
      icon: '🔒',
      color: 'mermaid',
      features: [
        {
          name: 'Jewellers Block Policy',
          description: 'Covers theft, loss in transit, damage',
          provider: 'Bajaj Allianz / Chubb',
          status: 'active',
        },
        {
          name: 'Agreed Value Payout',
          description: '100% compensation if item never returns',
          provider: 'Insurance Partner',
          status: 'active',
        },
      ],
      benefit: 'Full financial recovery even in worst case.',
    },
    {
      id: 'enforcement',
      level: 'Level 5',
      title: 'Legal Recourse',
      icon: '⚖️',
      color: 'crimson',
      features: [
        {
          name: 'IPC Section 406',
          description: 'Criminal Breach of Trust - 3 years prison',
          provider: 'Indian Penal Code',
          status: 'legal',
        },
        {
          name: 'FIR Assistance',
          description: 'Platform helps owner file police complaint',
          provider: 'Legal Team',
          status: 'active',
        },
        {
          name: 'Recovery Support',
          description: 'Verified KYC makes police tracking easy',
          provider: 'Platform + Law Enforcement',
          status: 'active',
        },
      ],
      benefit: 'Criminal charges deter theft before it happens.',
    },
  ];

  const filterLayers = activeLayer === 'all' 
    ? securityLayers 
    : securityLayers.filter(layer => layer.id === activeLayer);

  return (
    <section className="py-16 bg-gradient-to-br from-mocha-50 via-white to-taupe-50">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="badge badge-mocha">Security First</span>
            <span className="badge badge-neon">2026 Standard</span>
          </div>
          <h2 className="text-display-md font-serif text-luxury mb-4">
            5-Layer Security Architecture
          </h2>
          <p className="text-xl text-charcoal-600 font-body max-w-3xl mx-auto mb-6">
            We don't "hope" items get returned. Our multi-layered security system 
            makes fraud impossible and ensures 99.8% safe transaction rate.
          </p>
          
          {/* Professional Trust Statement */}
          <div className="max-w-2xl mx-auto p-6 card-luxury border-2 border-gold-200">
            <p className="text-sm text-charcoal-700 italic leading-relaxed">
              <span className="text-gold-600 font-bold">"Professional brands don't rely on trust—they engineer it."</span> 
              {' '}Every rental on CircleStyle passes through 5 independent security checks, 
              each designed by fraud prevention experts and backed by India's leading fintech 
              and insurance providers.
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setActiveLayer('all')}
            className={`btn ${activeLayer === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🔍 All Layers
          </button>
          {securityLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`btn ${activeLayer === layer.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {layer.icon} {layer.level}
            </button>
          ))}
        </div>

        {/* Security Layers Grid */}
        <div className="space-y-8">
          {filterLayers.map((layer, index) => (
            <div
              key={layer.id}
              className="card-luxury p-8 hover-lift border-2 border-mocha-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Layer Info */}
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-6xl`}>{layer.icon}</div>
                    <div>
                      <span className={`badge badge-${layer.color} text-xs mb-2`}>
                        {layer.level}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-charcoal-800">
                        {layer.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 bg-mocha-50 rounded-lg border-l-4 border-mocha-500">
                    <p className="text-sm font-semibold text-mocha-700 mb-1">
                      🎯 Benefit:
                    </p>
                    <p className="text-sm text-charcoal-700">
                      {layer.benefit}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="lg:w-2/3">
                  <div className="space-y-4">
                    {layer.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-white rounded-lg border border-charcoal-200 hover:border-mocha-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-display font-bold text-charcoal-800">
                                {feature.name}
                              </h4>
                              <span className={`badge text-xs ${
                                feature.status === 'active' ? 'badge-neon' : 'badge-taupe'
                              }`}>
                                {feature.status === 'active' ? '✓ Active' : '§ Legal'}
                              </span>
                            </div>
                            <p className="text-sm text-charcoal-600 mb-2">
                              {feature.description}
                            </p>
                            <p className="text-xs text-mocha-600 font-semibold">
                              <span className="text-charcoal-500">Provider:</span> {feature.provider}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works - User Journey */}
        <div className="mt-16 p-8 card-luxury bg-gradient-to-br from-coolBlue-50 to-mocha-50">
          <h3 className="text-2xl font-serif font-bold text-center mb-8">
            How Security Protects Your Transaction
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '1',
                title: 'KYC Verification',
                description: 'Complete Aadhaar Video KYC',
                time: '2 mins',
              },
              {  
                step: '2',
                title: 'Pre-Authorization',
                description: 'Security deposit blocked on card',
                time: 'Instant',
              },
              {
                step: '3',
                title: 'Escrow Hold',
                description: 'Rental fee held by trustee',
                time: 'Instant',
              },
              {
                step: '4',
                title: 'Item Exchange',
                description: 'OTP verification + photos',
                time: '5 mins',
              },
              {
                step: '5',
                title: 'Safe Return',
                description: 'Item returned → Payment released',
                time: '5 mins',
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-mocha-500 to-gold-500 text-white rounded-full text-2xl font-bold mb-4 shadow-luxury">
                  {step.step}
                </div>
                <h4 className="font-display font-bold text-charcoal-800 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-charcoal-600 mb-2">
                  {step.description}
                </p>
                <span className="badge badge-taupe text-xs">
                  ⏱️ {step.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-charcoal-600 mb-6 font-body">
            Ready to rent with complete peace of mind?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn btn-luxury px-10 py-4">
              Browse Protected Items
            </Link>
            <Link to="/how-it-works" className="btn btn-outline px-10 py-4">
              Learn More About Security
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '99.8%', label: 'Safe Transaction Rate', icon: '🛡️' },
            { number: '₹50Cr+', label: 'Items Protected', icon: '💎' },
            { number: '2 mins', label: 'KYC Completion Time', icon: '⚡' },
            { number: '0', label: 'Unresolved Theft Cases', icon: '🎯' },
          ].map((stat, idx) => (
            <div key={idx} className="card-bento p-6 text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-display font-bold text-mocha-600 mb-1">
                {stat.number}
              </div>
              <p className="text-sm text-charcoal-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityArchitecture;
