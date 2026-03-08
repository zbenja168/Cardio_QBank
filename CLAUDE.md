# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

A cardiovascular medicine question bank (QBank) web application with 1000 NBME/UWorld-style questions. Static React app deployed to GitHub Pages.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Type-check and build for production (outputs to `dist/`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint

## Architecture

**Tech stack:** React 19 + TypeScript + Vite + Tailwind CSS v4. Static site (no backend). Progress tracked in localStorage.

**Data flow:**
1. `topics.json` loads at startup → populates topic filter UI
2. User selects topics → `useQuestions` hook fetches only needed category JSON files
3. Questions are shuffled and presented one at a time
4. Answers saved to localStorage via `useProgress` hook
5. Dashboard reads localStorage to compute analytics

**Key directories:**
- `src/pages/` — 4 pages: HomePage (topic selection), QuizPage, DashboardPage, ReviewPage
- `src/hooks/` — useTopics, useQuestions, useProgress, useTimer
- `src/components/` — TopicFilter (category accordions), Question (QuestionCard with explanation panel)
- `src/utils/` — storage (localStorage), questionLoader (fetch/cache JSON), shuffle, stats
- `src/types/` — TypeScript interfaces for Question, Topic, ProgressData
- `public/data/questions/` — 13 category JSON files totaling 1000 questions
- `public/data/topics.json` — Category/topic index (13 categories, 84 topics)
- `source_bricks/` — Source PDF files (not deployed)

**Question JSON schema:** Each category file has `{categoryId, categoryName, questions[]}`. Each question has: id, topicId, topicName, stem (clinical vignette), choices (A-E), correctAnswer, explanation (summary + whyCorrect + whyWrongByChoice for each distractor), difficulty, imageRef, tags.

**Routing:** Hash-based (`#/quiz`, `#/dashboard`, `#/review`) since GitHub Pages doesn't support SPA fallback.

**Deployment:** GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on push to main.

## Configuration

- `vite.config.ts` — `base: './'` for relative asset paths (GitHub Pages compatible)
- `tsconfig.app.json` — `verbatimModuleSyntax: false` to allow non-type-only imports
