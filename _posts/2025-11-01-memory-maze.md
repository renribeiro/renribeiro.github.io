---
title: "Memory-Maze: Scenario Driven Visual Language Navigation Benchmark for Guiding Blind People"
date: 2025-11-01 00:00:00 +0900
description: >-
  We developed Memory-Maze, a visual language navigation benchmark using
  route instructions recalled from memory, to support robots guiding blind people.
categories: [Publications]
tags: [Vision-Based Navigation, Performance Evaluation and Benchmarking, Human-Centered Automation]
publication:
  year: 2025
  authors:
    - Masaki Kuribayashi
    - Kohei Uehara
    - Allan Wang
    - Daisuke Sato
    - Renato Alexandre Ribeiro
    - Simon Chu
    - Shigeo Morishima
  highlight_author: Renato Alexandre Ribeiro
  equal_contributors: [Masaki Kuribayashi, Kohei Uehara]
  affiliations:
    - name: Waseda University, Japan
      authors: [Masaki Kuribayashi, Shigeo Morishima]
    - name: Miraikan - The National Museum of Emerging Science and Innovation, Japan
      authors: [Masaki Kuribayashi, Kohei Uehara, Allan Wang, Renato Alexandre Ribeiro]
    - name: Carnegie Mellon University, United States
      authors: [Allan Wang, Daisuke Sato, Simon Chu]
  venue: IEEE Robotics and Automation Letters
  venue_short: RA-L
  venue_group: RA-L
  type: Journal article
  links:
    - label: Paper
      url: /assets/pdf/memory-maze_RAL.pdf
    - label: DOI
      url: https://doi.org/10.1109/LRA.2025.3615028
    - label: BibTeX
      url: /assets/bibtex/ral2025-memory-maze.bib
    - label: Code
      url: https://github.com/chestnutforestlabo/MemoryMaze
publication_page: true
narration_audio: /assets/audio/memory-maze-bm_lewis.mp3
narration_minutes: 3
---

## Abstract

Visual Language Navigation (VLN) powered robots
have the potential to guide blind people by understanding
route instructions provided by sighted passersby. This capability allows robots to operate in environments often unknown a priori. Existing VLN models are insufficient for the scenario of navigation guidance for blind people, as they need to understand routes described from human memory, which frequently contains stutters, errors, and omissions of details, as opposed to those obtained by thinking out loud, such as in the R2R dataset. However, existing benchmarks do not contain instructions obtained from human memory in natural environments. To this end, we present our benchmark, Memory-Maze, which simulates the
scenario of seeking route instructions for guiding blind people. Our benchmark contains a maze-like structured virtual environment and novel route instruction data from human memory. Our analysis demonstrates that instruction data collected from memory was longer and contained more varied wording. We further demonstrate that addressing errors and ambiguities from memory-based instructions is challenging, by evaluating state-of-the-art models alongside our baseline model with modularized perception and controls.
{: .research-abstract }

{% include research-figure.html src="/assets/img/publications/ral2025-memory-maze/memory-maze-benchmark.png" alt="Memory-Maze compares hesitant route instructions recalled from memory with direct think-aloud instructions, above views of its simulated indoor environment and a wheeled navigation agent." caption="Memory-Maze: route instructions recalled from memory and obtained by thinking out loud (top), the simulated navigation environment (middle), and the navigation agent (bottom)." %}
