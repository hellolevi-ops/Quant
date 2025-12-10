
import React from 'react';
import { X, Check, Award, Zap, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { UserTier } from '../types';

interface MembershipModalProps {
  onClose: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { userTier, setUserTier } = useUser();

  const handleUpgrade = (tier: UserTier) => {
    setUserTier(tier);
    // In a real app, this would trigger a payment flow
    alert(`Upgraded to ${tier}!`);
  };

  const tiers = [
    {
      id: UserTier.FREE,
      name: t('mem.tier_free'),
      price: t('mem.free_price'),
      icon: Award,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-white/10',
      features: [
        { label: t('mem.feature_gen'), value: 'Basic' },
        { label: t('mem.feature_backtest'), value: '10 / day' },
        { label: t('mem.feature_clone'), value: '0 / day' },
        { label: t('mem.feature_ai'), value: 'Gemini Flash' },
      ]
    },
    {
      id: UserTier.GOLD,
      name: t('mem.tier_gold'),
      price: t('mem.gold_price'),
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      features: [
        { label: t('mem.feature_gen'), value: 'Advanced' },
        { label: t('mem.feature_backtest'), value: 'Unlimited' },
        { label: t('mem.feature_clone'), value: '5 / day' },
        { label: t('mem.feature_ai'), value: 'GPT-4o / Gemini Pro' },
      ]
    },
    {
      id: UserTier.DIAMOND,
      name: t('mem.tier_diamond'),
      price: t('mem.diamond_price'),
      icon: Crown,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/50',
      features: [
        { label: t('mem.feature_gen'), value: 'Expert' },
        { label: t('mem.feature_backtest'), value: 'Unlimited + Cloud' },
        { label: t('mem.feature_clone'), value: '20 / day' },
        { label: t('mem.feature_ai'), value: 'All Models + DeepSeek' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-5xl glass-panel p-8 rounded-2xl border border-white/20 relative shadow-2xl animate-in slide-in-from-bottom-8 mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">{t('mem.modal_title')}</h2>
          <p className="text-slate-400">Choose the plan that fits your trading needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrent = userTier === tier.id;
            const Icon = tier.icon;
            
            return (
              <div 
                key={tier.id} 
                className={`relative p-6 rounded-xl border flex flex-col transition-all ${tier.bg} ${isCurrent ? 'border-neon-blue shadow-[0_0_20px_rgba(14,165,233,0.15)] transform scale-105 z-10' : tier.border}`}
              >
                {isCurrent && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neon-blue text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                    {t('mem.current_plan')}
                  </div>
                )}

                <div className="mb-6 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${tier.bg} border border-white/10`}>
                    <Icon size={24} className={tier.color} />
                  </div>
                  <h3 className={`text-xl font-bold ${tier.color} mb-1`}>{tier.name}</h3>
                  <div className="text-2xl font-bold text-white">{tier.price}</div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                      <span className="text-slate-400">{feat.label}</span>
                      <span className="text-white font-medium text-right">{feat.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => !isCurrent && handleUpgrade(tier.id)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isCurrent 
                      ? 'bg-white/5 text-slate-500 cursor-default' 
                      : 'bg-white text-black hover:bg-slate-200 shadow-lg'
                  }`}
                >
                  {isCurrent ? t('mem.current_plan') : t('mem.upgrade_now')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
