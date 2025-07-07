import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Flame, TrendingDown, GitCommitVertical } from 'lucide-react';

interface Suggestion {
  id: string;
  icon: string;
  text: string;
  cta: string;
}

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

const iconMap: { [key: string]: React.FC<any> } = {
  Lightbulb,
  Flame,
  TrendingDown,
  GitCommitVertical
};

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions }) => {
  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => {
        const Icon = iconMap[suggestion.icon] || Lightbulb;
        return (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-base p-4 flex items-start space-x-4"
          >
            <div className="p-2 bg-accent-from/10 rounded-lg text-accent-from">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary mb-2">{suggestion.text}</p>
              <button className="text-xs font-bold text-accent-from hover:text-accent-to transition">
                {suggestion.cta} &rarr;
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SuggestionsPanel;
