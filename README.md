# RewriteX

AI powered rank boosting application

## Introduction

RewriteX is an AI-powered content rewriting platform designed to boost search engine rankings by improving article structure, clarity, and SEO quality.
It rewrites existing articles using real reference sources, ensuring high-quality, grounded, and non-plagiarized output suitable for production use.

The system is built with scalability, reliability, and cost control in mind, making it suitable for large-scale content pipelines.

## Problem statement

Traditional content rewriting workflows face multiple challenges:

- Manual SEO optimization is time-consuming and inconsistent
- Large-scale article processing requires fault tolerance
  -Naive LLM usage leads to hallucinations and poor factual grounding

## Solution overview

RewriteX solves these problems by:

- Using reference-guided AI rewriting
- Processing articles in controlled batches
- Applying rate limiting, retries, and backoff
- Preserving original articles while saving AI-enhanced versions
- Enforcing strict JSON output contracts from LLMs

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Gemini LLM (OpenAI-compatible SDK)
- Google Search API
- Custom Web Scraper

### Frontend

- react
- axios
- react-router-dom
- tailwind css

### AI & Processing

- Prompt-engineered LLM pipelines
- Reference-guided content rewriting
- Retry with exponential backoff
- Adaptive rate limiting

### Tooling

- dotenv
- Node Cron / custom jobs
- ESLint

### Backend Folder Structure

```bash
  ├── app.log
├── package.json
├── package-lock.json
└── src
    ├── app.js
    ├── contants.js
    ├── controllers
    │   └── article.controller.js
    ├── db
    │   └── db.js
    ├── index.js
    ├── jobs
    │   └── rewrite.job.js
    ├── logger.js
    ├── models
    │   └── article.model.js
    ├── routes
    │   └── article.route.js
    ├── scrapers
    │   └── beyondchats.scraper.js
    ├── services
    │   ├── article.service.js
    │   ├── googleSearch.service.js
    │   ├── llm.service.js
    │   └── scraper.service.js
    └── utils
        └── cleanHtml.js
```

### Frontend Folder Structure

```bash
  ├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── rewriteX.svg
├── README.md
├── src
│   ├── api
│   │   └── ArticleApi.js
│   ├── App.jsx
│   ├── components
│   │   ├── ArticleCard.jsx
│   │   └── Loader.jsx
│   ├── config
│   │   └── conf.js
│   ├── context
│   │   └── ArticleContext.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── pages
│   │   ├── ArticleDetails.jsx
│   │   └── HomePage.jsx
│   └── utils
│       └── helpers.js
└── vite.config.js
```

## Getting started

### Prerequisites

- Node.js v18+
- MongoDB
- API keys

### Backend setup

```bash
git clone https://github.com/Mayank9056-MM/RewriteX
cd rewritex/backend
npm install
npm run dev
```

#### Create .env file:

```bash
NODE_ENV=development
PORT=
MONGODB_URI=

CORS_ORIGIN =

SERP_API_KEY =

OPENAI_API_KEY =
GEMINI_API_KEY =
```

#### Run scraper

```bash
 npm run scraper
```

#### Run rewrite job:

```bash
  npm run rewrite
```

### Frontend setup

```bash
 cd frontend
 npm i
 npm run dev
```

#### create .env

```bash
 VITE_API_URL=http://localhost:5000/api/v1
```

## System Architecture

```bash
  MongoDB → Google Search → Web Scraper
        → Rate Limiter → Retry + Backoff
        → LLM Rewrite → MongoDB
```

## Author

```text
Mayank Mahajan
Mern stack & AI Backend Developer
```
