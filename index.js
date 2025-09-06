const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

// ====== LOGS (in-memory) ======
const logs = [];

/**
 * يسجّل تطبيق قاعدة لرسالة واردة
 */
function logMatch({ from, message, matchedKeyword, reply }) {
  logs.unshift({
    id: uuid(),
    from: from || '',
    message: message || '',
    matchedKeyword: matchedKeyword || '',
    reply: reply || '',
    timestamp: new Date().toISOString(),
  });
  if (logs.length > 1000) logs.pop(); // احتفظ بآخر 1000
}

// ====== RULES (in-memory كبداية) ======
let rules = [
  { id: uuid(), keyword: "مرحبا", reply: "أهلًا وسهلًا بك 👋" },
  { id: uuid(), keyword: "شكرا", reply: "العفو 🌹" }
];

// GET /rules
app.get('/rules', (req, res) => {
  res.json(rules);
});

// POST /rules
app.post('/rules', (req, res) => {
  const { keyword, reply } = req.body || {};
  if (!keyword || !reply) {
    return res.status(400).json({ error: 'keyword and reply are required' });
  }
  const rule = { id: uuid(), keyword, reply };
  rules.push(rule);
  res.status(201).json(rule);
});

// PUT /rules/:id
app.put('/rules/:id', (req, res) => {
  const { id } = req.params;
  const { keyword, reply } = req.body || {};
  const r = rules.find(rule => rule.id === id);
  if (!r) return res.status(404).json({ error: 'rule not found' });

  if (keyword) r.keyword = keyword;
  if (reply) r.reply = reply;

  res.json(r);
});

// DELETE /rules/:id
app.delete('/rules/:id', (req, res) => {
  const { id } = req.params;
  const index = rules.findIndex(rule => rule.id === id);
  if (index === -1) return res.status(404).json({ error: 'rule not found' });

  rules.splice(index, 1);
  res.json({ success: true });
});

// ====== LOGS endpoints ======
// GET /logs
app.get('/logs', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '100', 10), 1000);
  res.json(logs.slice(0, limit));
});

// POST /logs (للاختبار اليدوي)
app.post('/logs', (req, res) => {
  const { from, message, matchedKeyword, reply } = req.body || {};
  if (!message || !reply) {
    return res.status(400).json({ error: 'message and reply are required' });
  }
  logMatch({ from, message, matchedKeyword, reply });
  res.status(201).json({ ok: true });
});

// ====== Start server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
