'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, TrendingUp, Users, Trophy, Lock, Award, ChevronDown } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "AI-Powered Security",
      description: "PyTorch ML models predict risks and optimize your portfolio in real-time with institutional-grade protection"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Zero-Knowledge Privacy",
      description: "Delegate without revealing your private keys using advanced ZK-SNARKs cryptography"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Social Investing",
      description: "Join circles, compete in clashes, and earn rewards together with like-minded investors"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Circle Clashes",
      description: "Compete with other investment circles for substantial prizes and recognition"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "NFT Achievements",
      description: "Unlock exclusive soulbound badges and showcase your DeFi mastery to the community"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Gasless Transactions",
      description: "Pay gas fees with any ERC-20 token via ERC-4337 account abstraction"
    }
  ];

  const stats = [
    { value: "$10M+", label: "Total Value Locked" },
    { value: "10,000+", label: "Active Users" },
    { value: "50+", label: "Investment Circles" },
    { value: "15%", label: "Average APY" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJoLTJ2LTJoMnptLTItMmgydjJoLTJ2LTJ6bTItMmgtMnYyaDJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMmgtMnYyaDJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMmgtMnYyaDJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMmgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-amber-900/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 p-0.5">
              <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">DelegateVault</span>
              <div className="text-xs text-amber-600 font-semibold tracking-widest">PRIME</div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-8 text-sm">
              <a href="#features" className="text-gray-300 hover:text-amber-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-amber-400 transition-colors">About</a>
              <a href="#security" className="text-gray-300 hover:text-amber-400 transition-colors">Security</a>
            </nav>
            {!isConnected ? (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openConnectModal}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-semibold text-sm shadow-lg shadow-amber-900/30 border border-amber-500/20"
                  >
                    Connect Wallet
                  </motion.button>
                )}
              </ConnectButton.Custom>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-semibold text-sm shadow-lg shadow-amber-900/30 border border-amber-500/20"
              >
                Dashboard
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-8"
            >
              <div className="backdrop-blur-sm bg-amber-950/30 px-6 py-2.5 rounded-full inline-flex items-center space-x-2 border border-amber-800/30">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-amber-400">Powered by AI & ZK Proofs</span>
              </div>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
               
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="text-white">The Pinnacle of</span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">Decentralized Finance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Experience institutional-grade vault management with AI-powered strategies, 
              zero-knowledge privacy, and social investing on the Monad blockchain
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
            >
              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openConnectModal}
                      className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-bold text-lg shadow-2xl shadow-amber-900/50 border border-amber-500/30 flex items-center space-x-2 group"
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
                  className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-bold text-lg shadow-2xl shadow-amber-900/50 border border-amber-500/30 flex items-center space-x-2 group"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 font-bold text-lg border border-amber-800/30 hover:border-amber-700/50 transition-all"
              >
                View Documentation
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex justify-center"
            >
              <ChevronDown className="w-8 h-8 text-amber-600" />
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-sm bg-gradient-to-br from-amber-950/20 to-gray-950/40 border border-amber-900/20 rounded-2xl p-8 text-center group hover:border-amber-700/40 transition-all"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-950/30 border border-amber-800/30">
              <span className="text-amber-500 text-sm font-semibold">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Unparalleled </span>
              <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Next-generation technology for sophisticated DeFi investing
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
                className="group cursor-pointer"
              >
                <div className="h-full backdrop-blur-sm bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-amber-900/20 rounded-2xl p-8 hover:border-amber-700/40 transition-all hover:shadow-2xl hover:shadow-amber-900/20">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-700/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-amber-600/50 transition-all">
                    <div className="text-amber-500">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-amber-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-amber-500/20 to-amber-700/20 rounded-3xl blur-xl"></div>
            <div className="relative backdrop-blur-sm bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-amber-800/30 rounded-3xl p-16 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              
              <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">Begin Your </span>
                <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join an elite community of sophisticated investors leveraging AI-powered vault management
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-bold text-lg shadow-2xl shadow-amber-900/50 border border-amber-500/30 inline-flex items-center space-x-3"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 p-0.5">
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold text-amber-400">DelegateVault</span>
                <div className="text-xs text-amber-600 font-semibold">PRIME</div>
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 DelegateVault Prime. Built with excellence on Monad.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}