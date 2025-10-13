import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Coffee from 'lucide-react/dist/esm/icons/coffee';
import Code2 from 'lucide-react/dist/esm/icons/code-2';
import Music from 'lucide-react/dist/esm/icons/music';
import Gamepad2 from 'lucide-react/dist/esm/icons/gamepad-2';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Zap from 'lucide-react/dist/esm/icons/zap';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Github from 'lucide-react/dist/esm/icons/github';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalCommits: number;
  followers: number;
}

export default function FunFacts() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    totalRepos: 0,
    totalStars: 0,
    totalCommits: 0,
    followers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const username = 'Tec94';

        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
        const totalRepos = userData.public_repos;

        setGithubStats({
          totalRepos,
          totalStars,
          totalCommits: 1200, // Approximate, as GitHub API doesn't provide total commits easily
          followers: userData.followers,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Set default values on error
        setGithubStats({
          totalRepos: 23,
          totalStars: 127,
          totalCommits: 1200,
          followers: 45,
        });
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const facts = [
    {
      icon: Coffee,
      label: 'Cups of Coffee',
      value: '2,847',
      detail: 'this year',
      color: 'from-green-400 to-green-600',
      isGitHub: false,
    },
    {
      icon: Github,
      label: 'GitHub Repos',
      value: loading ? '...' : githubStats.totalRepos.toString(),
      detail: 'public projects',
      color: 'from-green-500 to-green-700',
      isGitHub: true,
      link: 'https://github.com/Tec94',
    },
    {
      icon: TrendingUp,
      label: 'GitHub Stars',
      value: loading ? '...' : githubStats.totalStars.toString(),
      detail: 'community love',
      color: 'from-green-300 to-green-500',
      isGitHub: true,
      link: 'https://github.com/Tec94',
    },
    {
      icon: Code2,
      label: 'Total Commits',
      value: loading ? '...' : `${githubStats.totalCommits}+`,
      detail: 'contributions',
      color: 'from-green-600 to-green-800',
      isGitHub: true,
      link: 'https://github.com/Tec94',
    },
    {
      icon: Brain,
      label: 'Problem Solving',
      value: '100%',
      detail: 'passion level',
      color: 'from-green-400 to-green-600',
      isGitHub: false,
    },
    {
      icon: Zap,
      label: 'Late Night Commits',
      value: '42%',
      detail: 'past midnight',
      color: 'from-green-500 to-green-700',
      isGitHub: false,
    },
    {
      icon: Music,
      label: 'Coding Playlist',
      value: '1,250',
      detail: 'songs in rotation',
      color: 'from-green-300 to-green-500',
      isGitHub: false,
    },
    {
      icon: Clock,
      label: 'Productivity Peak',
      value: '11PM',
      detail: 'night owl mode',
      color: 'from-green-600 to-green-800',
      isGitHub: false,
    },
  ];

  return (
    <section id="funfacts" className="py-20 relative overflow-hidden">
      {/* Wave Animation Background */}

      {/* Unique hexagonal honeycomb pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
              <polygon points="28,0 56,15 56,45 28,60 0,45 0,15" fill="none" stroke="rgba(0, 255, 0, 0.3)" strokeWidth="1"/>
              <polygon points="84,30 112,45 112,75 84,90 56,75 56,45" fill="none" stroke="rgba(0, 255, 0, 0.3)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Animated digital rain effect - subtle */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-transparent via-green-500/30 to-transparent"
          style={{
            left: `${10 + i * 12}%`,
            height: '100px',
          }}
          animate={{
            y: ['-100px', '120%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Fun Facts & Stats" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Some random statistics about me that reveal my personality beyond the resume
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {facts.map((fact, index) => {
            const IconComponent = fact.icon;
            const isHovered = hoveredIndex === index;

            const CardWrapper = fact.isGitHub && fact.link ? 'a' : 'div';
            const cardProps = fact.isGitHub && fact.link
              ? { href: fact.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0"
                  animate={{
                    opacity: isHovered ? 0.4 : 0,
                  }}
                  style={{
                    background: `linear-gradient(135deg, rgba(0, 255, 0, 0.3), transparent)`,
                    filter: 'blur(10px)',
                  }}
                />

                {/* Main card */}
                <CardWrapper
                  {...cardProps}
                  className="block no-underline"
                >
                  <motion.div
                    className={`relative p-4 md:p-6 border border-green-500/30 rounded-lg bg-black/60 backdrop-blur-sm overflow-hidden ${
                      fact.isGitHub ? 'cursor-pointer' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      boxShadow: isHovered
                        ? '0 0 30px rgba(0, 255, 0, 0.4), inset 0 0 20px rgba(0, 255, 0, 0.1)'
                        : '0 0 10px rgba(0, 255, 0, 0.2), inset 0 0 10px rgba(0, 255, 0, 0.05)',
                    }}
                  >
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${fact.color} opacity-0`}
                    animate={{
                      opacity: isHovered ? 0.1 : 0,
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="mb-3 flex justify-center"
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent
                      className="h-8 w-8 md:h-10 md:w-10 text-green-400"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.6))',
                      }}
                    />
                  </motion.div>

                  {/* Value */}
                  <div className="text-center mb-2">
                    <motion.div
                      className="text-3xl md:text-4xl font-bold text-green-300 font-mono"
                      animate={{
                        textShadow: isHovered
                          ? '0 0 20px rgba(0, 255, 0, 0.8)'
                          : '0 0 5px rgba(0, 255, 0, 0.3)',
                      }}
                    >
                      {fact.value}
                    </motion.div>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-green-400 font-mono mb-1">
                      {fact.label}
                    </div>
                    <div className="text-xs text-green-500/70 font-mono">
                      {fact.detail}
                    </div>
                  </div>

                    {/* Corner accents */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-green-500" />
                    <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-green-500" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-green-500" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-green-500" />

                    {/* GitHub badge for GitHub stats */}
                    {fact.isGitHub && (
                      <div className="absolute top-2 right-2 text-xs font-mono text-green-400 bg-black/80 px-2 py-1 rounded border border-green-500/40">
                        LIVE
                      </div>
                    )}
                  </motion.div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>

        {/* Fun quote */}
        <BlurReveal delay={0.8} className="mt-12">
          <div className="text-center border border-green-500/30 rounded-lg p-6 bg-black/40 backdrop-blur-sm max-w-2xl mx-auto"
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 20px rgba(0, 255, 0, 0.05)'
            }}
          >
            <p className="text-green-300 font-mono text-lg italic mb-2">
              "First, solve the problem. Then, write the code."
            </p>
            <p className="text-green-500 font-mono text-sm">- John Johnson</p>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
