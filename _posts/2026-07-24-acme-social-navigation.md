---
title: "ACME: A Multi-Cultural, Multi-Embodiment Social-Navigation Dataset"
date: 2026-07-24 00:00:00 +0000
description: >-
  We contributed to ACME, a dataset for social robot navigation and pedestrian
  trajectory prediction spanning eight sites, five countries, and seven robot embodiments.
categories: [Publications]
tags: [Social Navigation, Robot Safety, Human-Robot Interaction, Pedestrian Trajectory Prediction]
publication:
  year: 2026
  authors:
    - "Shashank Rao Marpally"
    - "Allan Wang"
    - "Atharva Ghotavadekar"
    - "Renato Alexandre Ribeiro"
    - "Nhat Le"
    - "Pilar Bachiller-Burgos"
    - "Pranav Goyal"
    - "Subham Agrawal"
    - "Yasuhiro Nitta"
    - "Howard Ziyu Han"
    - "Daeun Song"
    - "Masaki Kuribayashi"
    - "Kohei Uehara"
    - "Xiyue Wang"
    - "Yangzhe Kong"
    - "Duc M. Nguyen"
    - "Amirreza Payandeh"
    - "Gerardo Pérez-González"
    - "Alejandro Torrejón-Harto"
    - "Jeeho Ahn"
    - "Tisha Jain"
    - "Andrew Stratton"
    - "Elvin Yang"
    - "Jorge de Heuvel"
    - "Nico Ostermann-Myrau"
    - "Sai Anudeep Sajja"
    - "Mithilya Raj"
    - "Daisuke Sato"
    - "Gaston Rouquette"
    - "Nikolas Martelaro"
    - "Maki Sugimoto"
    - "Hironobu Takagi"
    - "Chieko Asakawa"
    - "Maren Bennewitz"
    - "Aaron Steinfeld"
    - "Xuesu Xiao"
    - "Christoforos Mavrogiannis"
    - "Harold Soh"
  highlight_author: Renato Alexandre Ribeiro
  author_preview_limit: 4
  equal_contributors: ["Shashank Rao Marpally", "Allan Wang"]
  affiliations:
    - name: "School of Computing, National University of Singapore"
      authors: ["Shashank Rao Marpally", "Atharva Ghotavadekar", "Harold Soh"]
    - name: "Miraikan - The National Museum of Emerging Science and Innovation"
      authors: ["Allan Wang", "Renato Alexandre Ribeiro", "Masaki Kuribayashi", "Kohei Uehara", "Xiyue Wang", "Hironobu Takagi", "Chieko Asakawa"]
    - name: "George Mason University"
      authors: ["Nhat Le", "Daeun Song", "Yangzhe Kong", "Duc M. Nguyen", "Amirreza Payandeh", "Xuesu Xiao"]
    - name: "Universidad de Extremadura"
      authors: ["Pilar Bachiller-Burgos", "Gerardo Pérez-González", "Alejandro Torrejón-Harto"]
    - name: "University of Michigan"
      authors: ["Pranav Goyal", "Jeeho Ahn", "Tisha Jain", "Andrew Stratton", "Elvin Yang", "Christoforos Mavrogiannis"]
    - name: "University of Bonn"
      authors: ["Subham Agrawal", "Jorge de Heuvel", "Nico Ostermann-Myrau", "Sai Anudeep Sajja", "Maren Bennewitz"]
    - name: "Keio University"
      authors: ["Yasuhiro Nitta", "Gaston Rouquette", "Maki Sugimoto"]
    - name: "Carnegie Mellon University"
      authors: ["Howard Ziyu Han", "Mithilya Raj", "Daisuke Sato", "Nikolas Martelaro", "Aaron Steinfeld"]
    - name: "NUS Smart Systems Institute"
      authors: ["Harold Soh"]
    - name: "Ewha Womans University"
      authors: ["Daeun Song"]
  venue: arXiv
  venue_short: arXiv
  venue_group: arXiv
  type: Preprint
  links:
    - label: Paper
      url: https://arxiv.org/pdf/2607.21964v1
    - label: DOI
      url: https://doi.org/10.48550/arXiv.2607.21964
    - label: BibTeX
      url: /assets/bibtex/arxiv2026-acme.bib
publication_page: true
narration_audio: /assets/audio/acme_lewis.mp3
narration_minutes: 3
---

## Abstract

Understanding how robots and humans move in shared spaces is essential for designing effective social robot
navigation policies and predicting human behavior. However, existing datasets often lack the diversity needed to capture differences in culture, geography, and human-robot interaction-factors that strongly shape appropriate social behavior. To address this gap, we introduce ACME: A Cross-cultural, Multi-Embodiment dataset for social navigation. A large-scale data collection effort across 8 sites in 5 countries, using 7 robot embodiments, ACME is a large and diverse multi-modal dataset aimed at advancing social navigation research, providing 29.35 hours of onboard robot data and 43.5 hours of overhead pedestrian tracking data. Unlike prior datasets, it focuses on capturing goal-driven social navigation behavior in complex social scenarios with explicit robot-crowd interaction through robot speech. To facilitate learning navigation policies and predicting pedestrian trajectories, ACME provides 3D and 2D scene features, odometry, interaction information, and human-annotated pedestrian trajectory labels. We make ACME easy to use by providing both human-readable data for each sensor modality as well as raw binary data. Our qualitative and quantitative analyses show that our dataset captures more challenging scenarios and a broader distribution of pedestrian behavior than previous datasets.
{: .research-abstract }

{% include research-figure.html src="/assets/img/publications/arxiv2026-acme/collaboration-map.png" alt="World map linking eight data collection teams in the United States, Spain, Germany, Japan, and Singapore to photographs of their robots and pedestrian environments." caption="ACME brings together eight teams across five countries, using seven robot embodiments in diverse crowd scenarios." %}
