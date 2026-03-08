import { useState } from 'react';
import { Category } from '../../types/topic';

interface Props {
  category: Category;
  selectedTopicIds: Set<string>;
  onToggleTopic: (topicId: string) => void;
  onToggleCategory: (category: Category) => void;
}

export function CategoryAccordion({ category, selectedTopicIds, onToggleTopic, onToggleCategory }: Props) {
  const [open, setOpen] = useState(false);
  const selectedCount = category.topics.filter(t => selectedTopicIds.has(t.id)).length;
  const allSelected = selectedCount === category.topics.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-white cursor-pointer hover:bg-slate-50 select-none"
        onClick={() => setOpen(!open)}
      >
        <button
          onClick={e => { e.stopPropagation(); onToggleCategory(category); }}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            allSelected ? 'bg-blue-600 border-blue-600' :
            someSelected ? 'bg-blue-200 border-blue-400' :
            'border-slate-300'
          }`}
        >
          {allSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          {someSelected && <div className="w-2 h-0.5 bg-blue-600 rounded" />}
        </button>
        <span className="font-semibold text-slate-800 flex-1">{category.name}</span>
        <span className="text-sm text-slate-500">{selectedCount}/{category.topics.length}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {open && (
        <div className="bg-slate-50 px-4 py-2 space-y-1 border-t border-slate-200">
          {category.topics.map(topic => (
            <label key={topic.id} className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-slate-100 px-2 rounded">
              <input
                type="checkbox"
                checked={selectedTopicIds.has(topic.id)}
                onChange={() => onToggleTopic(topic.id)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 flex-1">{topic.name}</span>
              <span className="text-xs text-slate-400">{topic.questionCount}q</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
