'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    // Auto-redirect if already connected
    if (isConnected) {
      // Show button for 2 seconds then redirect
      setTimeout(() => {
        // Don't auto-redirect, let user click
      }, 2000);
    }
  }, [isConnected]);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "AI-Powered Security",
      description: "PyTorch ML models predict risks and optimize your portfolio in real-time",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Zero-Knowledge Privacy",
      description: "Delegate without revealing your private keys using ZK-SNARKs",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Social Investing",
      description: "Join circles, compete in clashes, and earn rewards together",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Circle Clashes",
      description: "Compete with other investment circles for prizes and glory",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "NFT Achievements",
      description: "Unlock soulbound badges and showcase your DeFi mastery",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Gasless Transactions",
      description: "Pay gas fees with any ERC-20 token via ERC-4337",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { value: "$10M+", label: "Total Value Locked" },
    { value: "10,000+", label: "Active Users" },
    { value: "50+", label: "Investment Circles" },
    { value: "15%", label: "Average APY" }
  ];

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-blue">DelegateVault</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="glass px-6 py-2 rounded-full inline-flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">Powered by AI & ZK Proofs</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            >
              The Future of
              <br />
              <span className="gradient-text-blue">Social DeFi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              AI-managed investment vaults with zero-knowledge privacy,
              social circles, and competitive rewards on Monad blockchain
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openConnectModal}
                      className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                    >
                      <span>Connect Wallet</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </ConnectButton.Custom>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard')}
                  className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group animate-glow"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glass text-lg px-8 py-4"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <GlassCard className="text-center p-6">
                  <div className="text-4xl font-bold gradient-text-blue mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Powerful <span className="gradient-text-blue">Features</span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need for next-generation DeFi investing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <GlassCard className="p-8 h-full group cursor-pointer">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to <span className="gradient-text-blue">Start Earning?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of users already earning with AI-powered vaults
                </p>
                {!isConnected ? (
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openConnectModal}
                        className="btn-primary text-lg px-12 py-4 inline-flex items-center space-x-2"
                      >
                        <span>Get Started Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    )}
                  </ConnectButton.Custom>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/dashboard')}
                    className="btn-primary text-lg px-12 py-4 inline-flex items-center space-x-2 animate-glow"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 DelegateVault Prime. Built with LoVe on Monad.</p>
        </div>
      </footer>
    </div>
  );
}
