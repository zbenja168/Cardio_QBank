import { TopicsIndex, Category } from '../types/topic';
import { CategoryAccordion } from '../components/TopicFilter/CategoryAccordion';
import { ProgressData } from '../types/progress';
import { getOverallStats } from '../utils/stats';

interface Props {
  topics: TopicsIndex;
  selectedTopicIds: Set<string>;
  selectedCount: number;
  progress: ProgressData;
  onToggleTopic: (topicId: string) => void;
  onToggleCategory: (category: Category) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onStartQuiz: () => void;
  onGoToDashboard: () => void;
  onGoToReview: () => void;
}

export function HomePage({
  topics, selectedTopicIds, selectedCount, progress,
  onToggleTopic, onToggleCategory, onSelectAll, onClearAll,
  onStartQuiz, onGoToDashboard, onGoToReview,
}: Props) {
  const stats = getOverallStats(progress);
  const bookmarkCount = progress.bookmarkedQuestions.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">CV QBank</h1>
            <p className="text-sm text-slate-500">Cardiovascular Question Bank</p>
          </div>
          <div className="flex items-center gap-3">
            {stats.total > 0 && (
              <button
                onClick={onGoToDashboard}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Dashboard ({stats.percentage}%)
              </button>
            )}
            {bookmarkCount > 0 && (
              <button
                onClick={onGoToReview}
                className="px-4 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
              >
                Bookmarked ({bookmarkCount})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats summary */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-sm text-slate-500">Answered</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.percentage}%</div>
              <div className="text-sm text-slate-500">Correct</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">{topics.totalQuestions - stats.total}</div>
              <div className="text-sm text-slate-500">Remaining</div>
            </div>
          </div>
        )}

        {/* Filter controls */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Select Topics</h2>
          <div className="flex items-center gap-3">
            <button onClick={onSelectAll} className="text-sm text-blue-600 hover:text-blue-800">Select All</button>
            <span className="text-slate-300">|</span>
            <button onClick={onClearAll} className="text-sm text-blue-600 hover:text-blue-800">Clear All</button>
          </div>
        </div>

        {/* Category accordions */}
        <div className="space-y-2 mb-8">
          {topics.categories.map(cat => (
            <CategoryAccordion
              key={cat.id}
              category={cat}
              selectedTopicIds={selectedTopicIds}
              onToggleTopic={onToggleTopic}
              onToggleCategory={onToggleCategory}
            />
          ))}
        </div>

        {/* Start button */}
        <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-4 pb-6">
          <button
            onClick={onStartQuiz}
            disabled={selectedCount === 0}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {selectedCount > 0
              ? `Start Quiz (${selectedCount} questions)`
              : 'Select topics to begin'}
          </button>
        </div>
      </main>
    </div>
  );
}
