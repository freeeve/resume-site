---
title: "DeepLibby"
project_url: "https://deeplibby.com"
dates: "2024-2025"
tech: ["golang", "react", "roaring bitmaps", "postgresql", "badger"]
weight: 2
---
* Full-stack library search engine for Libby eBooks and Audiobooks, solving the problem of searching across multiple library cards
* **Technical Highlights**:
  * Efficient search across millions of book records using Roaring Bitmaps for set operations
  * PostgreSQL for metadata storage with Badger for fast key-value lookups
  * Go backend API with React frontend
  * Integration with Hardcover API to match your TBR (To Be Read) list against available library books
* Built for library power users who manage multiple library cards and want to find the fastest way to access their next read