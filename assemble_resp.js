import fs from 'fs';
import path from 'path';

const batchDir = 'C:/Thousand_questions/resp_gen_output';
const outQDir = 'C:/Thousand_questions/resp_public/data/questions';
const outTopicsFile = 'C:/Thousand_questions/resp_public/data/topics.json';

// Ensure output directories exist
fs.mkdirSync(outQDir, { recursive: true });
fs.mkdirSync(path.dirname(outTopicsFile), { recursive: true });

// Read all batch files and collect all questions
const allQuestions = [];
for (let i = 1; i <= 23; i++) {
  const fn = path.join(batchDir, `batch_r${String(i).padStart(2, '0')}.json`);
  const data = JSON.parse(fs.readFileSync(fn, 'utf8'));
  allQuestions.push(...data);
}

console.log(`Total questions loaded: ${allQuestions.length}`);

// Group by topicId
const byTopic = {};
for (const q of allQuestions) {
  if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
  byTopic[q.topicId].push(q);
}

console.log(`Topics found: ${Object.keys(byTopic).length}`);
for (const [tid, qs] of Object.entries(byTopic)) {
  console.log(`  ${tid}: ${qs.length} questions`);
}

// Define categories with topic assignments (in date-added order per user spec)
const categories = [
  {
    id: "resp-anatomy",
    name: "Anatomy",
    topicIds: [
      "histology-respiratory-tract",
      "development-respiratory-tract",
      "anatomy-upper-respiratory-tract",
      "anatomy-lower-respiratory-tract",
      "anatomy-diaphragm-ribs-intercostals"
    ]
  },
  {
    id: "resp-physiology",
    name: "Respiratory Physiology",
    topicIds: [
      "overview-respiratory-physiology",
      "mechanics-pressures-breathing",
      "alveolar-ventilation-dead-space",
      "alveolar-gas-exchange-diffusion",
      "pulmonary-circulation",
      "oxygen-co2-transport"
    ]
  },
  {
    id: "resp-acid-base-gas",
    name: "Acid-Base & Gas Disorders",
    topicIds: [
      "respiratory-acidosis",
      "respiratory-alkalosis",
      "co-cn-poisoning",
      "hypoxemia",
      "hypercapnia"
    ]
  },
  {
    id: "resp-ventilation-mechanics",
    name: "Ventilation & Lung Mechanics",
    topicIds: [
      "control-ventilation-altitude-exercise",
      "airway-resistance",
      "pulmonary-function-tests",
      "ventilation-perfusion"
    ]
  },
  {
    id: "resp-obstructive",
    name: "Obstructive Lung Diseases",
    topicIds: [
      "obstructive-restrictive-foundations",
      "tobacco-smoking",
      "copd-pathophysiology",
      "copd-clinical",
      "asthma",
      "treatment-asthma-copd"
    ]
  },
  {
    id: "resp-airway",
    name: "Airway Diseases",
    topicIds: [
      "bronchiectasis",
      "cystic-fibrosis-1",
      "cystic-fibrosis-2",
      "inflammatory-pharynx-larynx-trachea",
      "pertussis-diphtheria",
      "inflammatory-nasal-sinuses"
    ]
  },
  {
    id: "resp-interstitial-restrictive",
    name: "Interstitial & Restrictive Diseases",
    topicIds: [
      "ild-foundations",
      "hypersensitivity-pneumonitis",
      "idiopathic-pulmonary-fibrosis",
      "pneumoconioses",
      "sarcoidosis",
      "autoimmune-respiratory"
    ]
  },
  {
    id: "resp-pleural-chest",
    name: "Pleural & Chest Diseases",
    topicIds: [
      "pleural-effusion",
      "pneumothorax",
      "mesothelioma",
      "traumatic-chest-disorders"
    ]
  },
  {
    id: "resp-acute-failure",
    name: "Acute Respiratory Failure",
    topicIds: [
      "ards",
      "neonatal-rds",
      "sleep-apnea"
    ]
  }
];

// Build category JSON files and topics index
const topicsIndex = { categories: [], totalQuestions: 0 };
let totalQ = 0;

for (const cat of categories) {
  const catQuestions = [];
  const topicEntries = [];

  for (const tid of cat.topicIds) {
    const qs = byTopic[tid];
    if (!qs) {
      console.error(`WARNING: No questions found for topicId: ${tid}`);
      continue;
    }
    catQuestions.push(...qs);
    const topicName = qs[0].topicName;
    topicEntries.push({
      id: tid,
      name: topicName,
      questionCount: qs.length
    });
    // Remove from byTopic to track unassigned
    delete byTopic[tid];
  }

  // Write category JSON
  const catData = {
    categoryId: cat.id,
    categoryName: cat.name,
    questions: catQuestions
  };
  const catFile = path.join(outQDir, `${cat.id}.json`);
  fs.writeFileSync(catFile, JSON.stringify(catData, null, 2));

  console.log(`\nCategory "${cat.name}" (${cat.id}):`);
  console.log(`  ${catQuestions.length} questions`);
  for (const t of topicEntries) {
    console.log(`    - ${t.name}: ${t.questionCount}`);
  }
  totalQ += catQuestions.length;

  topicsIndex.categories.push({
    id: cat.id,
    name: cat.name,
    topics: topicEntries
  });
}

topicsIndex.totalQuestions = totalQ;
fs.writeFileSync(outTopicsFile, JSON.stringify(topicsIndex, null, 2));

// Check for unassigned topics
const unassigned = Object.keys(byTopic);
if (unassigned.length > 0) {
  console.error(`\nWARNING: Unassigned topics: ${unassigned.join(', ')}`);
}

console.log(`\n${'='.repeat(50)}`);
console.log(`SUMMARY`);
console.log(`${'='.repeat(50)}`);
console.log(`Categories created: ${categories.length}`);
console.log(`Total questions: ${totalQ}`);
console.log(`Topics index: ${outTopicsFile}`);
console.log(`Category files in: ${outQDir}`);
