---
title: "From Coarse Search to Precise Alignment: Auditory Guidance for Non-Visual Target Acquisition in VR"
date: 2026-06-24 00:00:00 +0900
description: >-
  We compared spatial audio, spoken directions, and hand-referenced sound for
  reaching nearby virtual targets with 11 blind participants.
categories: [Publications]
tags: [Visual Impairment, Spatial Interaction, Virtual Reality]
publication:
  year: 2026
  authors:
    - Kengo Tanaka
    - Renato Alexandre Ribeiro
    - João Guerreiro
    - Hironobu Takagi
    - Yoichi Ochiai
    - Chieko Asakawa
  highlight_author: Renato Alexandre Ribeiro
  affiliations:
    - name: University of Tsukuba, Tsukuba, Japan
      authors: [Kengo Tanaka, Yoichi Ochiai]
    - name: Miraikan – The National Museum of Emerging Science and Innovation, Tokyo, Japan
      authors: [Kengo Tanaka, Renato Alexandre Ribeiro, Hironobu Takagi]
    - name: LASIGE, Faculdade de Ciências, Universidade de Lisboa, Lisboa, Portugal
      authors: [João Guerreiro]
    - name: Graduate School of Science and Technology, Keio University, Kanagawa, Japan
      authors: [Chieko Asakawa]
  venue: The 28th International ACM SIGACCESS Conference on Computers and Accessibility
  venue_short: ASSETS26
  venue_group: ASSETS
  type: Full paper
  links:
    - label: Paper
      url: https://techandpeople.github.io/downloads/ASSETS26_SpatialAudio.pdf
    - label: DOI
      url: https://doi.org/10.1145/3797867.3828980
    - label: BibTeX
      url: /assets/bibtex/assets2026-spatial-audio.bib
publication_page: true
narration_audio: /assets/audio/coarse_lewis.mp3
narration_minutes: 3
---

## Abstract

Non-visual target acquisition in arm-reachable near 3D space requires both coarse directional search and fine-grained correction, yet it remains unclear how auditory guidance should adapt as precision demands increase. We investigate this question in virtual reality through a comparative study of three auditory guidance techniques: continuous head-referenced spatial audio, on-demand VERBAL guidance that provides spoken hand-relative directions, and on-demand HAND-REFERENCED audio that shifts the auditory reference frame to the hand and uses pitch to indicate vertical offset. Eleven blind participants performed target-reaching tasks across three difficulty levels defined by target size. VERBAL yielded the most robust overall performance, producing lower error rates, faster completion times, lower workload, and the strongest user preference. HAND-REFERENCED helped participants monitor height and lateral alignment, but did not fully resolve depth-related difficulty. Our findings show that non-visual near-space target acquisition is a multi-stage process involving coarse localization and final acquisition, with head-referenced spatial audio supporting initial orientation and on-demand cues supporting local correction near the target.
{: .research-abstract }

{% include research-figure.html src="/assets/img/publications/assets2026-spatial-audio/guidance-techniques.png" alt="Three panels: a person in a VR headset reaches toward a virtual target using spatial sound; clicking a controller trigger plays a spoken direction; holding the trigger shifts the sound reference to the controller for hand-relative guidance." caption="Target acquisition with spatial audio (a), on-demand spoken directions (b), and on-demand hand-referenced audio (c)." %}
