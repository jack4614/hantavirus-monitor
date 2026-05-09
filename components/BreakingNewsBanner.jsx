import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function BreakingNewsBanner({ latestArticle, isDismissed, onDismiss }) {
  const { t } = useTranslation();
  const [timeAgo, setTimeAgo] = useState('');
  const [isVisible, setIsVisible] = useState(!isDismissed);

  useEffect(() => {
    if (!latestArticle) return;

    const updateTimeAgo = () => {
      const publishDate = new Date(latestArticle.publishedAt);
      const now = new Date();
      const diffMs = now - publishDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        setTimeAgo(t('justNow') || 'just now');
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins} ${t('minutesAgo') || 'minutes ago'}`);
      } else if (diffHours < 24) {
        setTimeAgo(`${diffHours} ${t('hoursAgo') || 'hours ago'}`);
      } else {
        setTimeAgo(`${diffDays} ${t('daysAgo') || 'days ago'}`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [latestArticle, t]);

  if (!latestArticle || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Icon + Pulse Animation */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 relative">
                <span className="text-2xl">🚨</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-white rounded-full"
                  style={{ width: 40, height: 40 }}
                />
              </div>

              {/* Title + Timestamp */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold uppercase tracking-wide">
                  {t('breakingNews') || 'BREAKING NEWS'}
                </div>
                <p className="text-lg font-semibold truncate hover:underline">
                  <Link href={`/articles/${latestArticle.slug}`}>
                    {latestArticle.title}
                  </Link>
                </p>
                <p className="text-xs opacity-90">
                  {timeAgo}
                </p>
              </div>
            </div>

            {/* Right: Read More + Close Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/articles/${latestArticle.slug}`}
                className="bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-red-50 transition whitespace-nowrap text-sm sm:text-base"
              >
                {t('readMore') || 'Read More'} →
              </Link>

              <button
                onClick={() => {
                  setIsVisible(false);
                  onDismiss?.();
                }}
                className="text-white hover:bg-red-500 p-2 rounded transition"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spacer to prevent content overlap */}
      <div className="h-24 sm:h-20" />
    </AnimatePresence>
  );
}
