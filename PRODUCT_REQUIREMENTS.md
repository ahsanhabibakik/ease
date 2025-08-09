# Ease – Product Requirements Document (PRD)

## 1. Executive Summary

Ease is a mobile-first journaling app designed to help users gently process and manage daily worries through compassionate prompts, calming exercises, and reflective practices. By combining intuitive worry capture, guided reflections, and bite-sized mindfulness tools, Ease creates a safe, emotionally supportive space for anyone navigating stress, anxiety, or overthinking.

## 2. Objectives & Success Metrics

### Primary Objectives

- Enable effortless externalization of worries.
- Guide users through structured, compassionate reflection.
- Provide quick access to calming practices and inspirational wisdom.

### Success Metrics

- **Engagement:**
  - Daily Active Users ≥ 20% of installs (first 3 months)
  - ≥ 70% of users complete ≥ 1 reflection/week
  - Avg. session duration ≥ 4 minutes
- **Satisfaction:**
  - NPS ≥ 40 by month 6
  - App-store rating ≥ 4.5★

## 3. User Personas

- **Anxious Student (18–25):** Juggles studies and social life; needs quick relief between classes.
- **Working Professional (25–45):** Balances deadlines + family; fits reflections into commutes or breaks.
- **Caregiver (30–60):** Carries emotional load; values gentle prompts and grounding exercises.

## 4. User Journeys & Stories

- **Capture a Worry:**
  - “As a user, I want to jot down my current worry in a few fields so I can lighten my mental load.”
- **Drop & Schedule:**
  - “I want to ‘Drop It’ and set a reminder, so I don’t forget to revisit my worry later.”
- **Instant Calm:**
  - “When overwhelmed, I want a 5-minute breathing or walking meditation to recenter.”
- **Guided Reflection:**
  - “I want sequential questions to explore my worry from new perspectives.”
- **Wisdom Cards:**
  - “I want short, swipeable quotes, facts, and micro-practices for quick inspiration.”
- **Progress Tracking:**
  - “I want to see how my worries and moods evolve to recognize patterns and growth.”

## 5. Functional Requirements

### 5.1 Worry Input (“What’s Weighing on Your Heart?”)

- **Text Fields:**
  - Give it a name… (worry name)
  - Tell your worry story – why does it matter to you? (details)
- **Dropdowns:**
  - Where does this belong in your life? → School, Work, Family, Finance, Politics, +Add Category
  - Where do you feel this in your body? → Sweaty palms, Heartbeat, Jaw tightness, Restless legs, Others
- **CTA:** Drop It → saves to Worry Jar

### 5.2 Worry List / Journal View (“Worry Jar”)

- List of saved worries (with date/time)
- Actions per item:
  - 🗑️ Let It Go (delete)
  - 🕓 Save for Later (archive)
  - 🪷 Hold for Worry Time (schedule reminder)
- Time picker (default 5 PM) for scheduled reflections

### 5.3 Calm Corner

- Grid of four quick-access practices, each with icon, label, and supportive UI:
  - 🌬️ Let the Air Love You (5-minute breathing; countdown + animation)
  - 🚶 Walk with Your Worries (walking meditation; ambient audio + voice-over)
  - 🧘 Rest in the Now (mindfulness practice; guided audio + progress bar)
  - 🌟 Shake it Off, Shine it Out (star jumps/stretching; simple animation + counter)

### 5.4 Wisdom Cards

- Horizontal carousel with gentle swipe (ripple/petal effect)
- Card Types
  - 🧠 Grounding Facts (e.g., “98% of your atoms change each year.”)
  - 💬 Inspiring Quotes (e.g., “This too shall pass.”)
  - 🌿 Micro-Practices (e.g., “Place your hand on your heart and breathe.”)
- Auto-advance every 10 s; manual swipe controls

### 5.5 Worry Circle Reflection

- Sequential guided prompts (one at a time, soft headings + text box):
  - Why does this feel so true to me? (evidence)
  - What might my wiser self say? (contrary evidence)
  - Could there be another story here? (alternative view)
  - What am I most afraid of… and how real is it? (worst-case likelihood)
  - What is one gentle thing I can do? (actionable step)
- Final CTA: I Release This Worry (marks reflection complete)

### 5.6 Reflection Summary (“In the Mirror of This Moment”)

- Emoji check-in: “How are you feeling now?”
- Prompts:
  - “What helped you most today?”
  - “What didn’t feel right?”
  - “Any realizations about yourself, others, or life?”
  - “Anything you’d like to celebrate – even a little?”
- Option to save or share the summary

## 6. UI/UX Design Guidelines

- **Color Palette:** Soft lavender, muted teal, warm neutrals
- **Typography:** Rounded sans-serif (Headings: xl; Body: base)
- **Icons & Imagery:** Hand-drawn style, gentle curves
- **Animations:** Subtle transitions (fade-ins, ripple swipes)
- **Tone & Language:** Gentle, empathic, affirming
- **Accessibility:** High-contrast text options; VoiceOver support; adjustable font sizes

## 7. Technical Requirements

- **Platforms:** iOS & Android (React Native)
- **Backend:** Serverless functions (Node.js) + NoSQL database (e.g., Firebase)
- **Notifications:** Local reminders for scheduled reflections
- **Assets:** Preloaded breathing animations, guided audio tracks
- **Analytics:** Track feature usage, session length, drop-off points
- **Security & Privacy:**
  - Encryption in transit & at rest
  - Clear privacy policy
  - Optional passcode/biometric lock

## 8. Metrics & Analytics

- **Engagement:**
  - # of worries captured
  - Reflection completion rate
- **Retention:** 7-day & 30-day retention rates
- **Feature Adoption:** % usage of Calm Corner vs. Wisdom Cards vs. Reflection
- **Performance:**
  - App launch < 2 seconds
  - Offline worry capture capability

## 9. Roadmap & Milestones

| Phase | Timeline    | Deliverables                                     |
| ----- | ----------- | ------------------------------------------------ |
| MVP   | 0–3 months  | Worry Input, Worry Jar, Reminders, Calm Corner   |
| v1.1  | 3–6 months  | Wisdom Cards carousel, basic Reflection flow     |
| v1.2  | 6–9 months  | Full Worry Circle, Reflection Summary, Analytics |
| v2.0  | 9–12 months | Social sharing, AI-driven prompts, multilingual  |

## 10. Risks & Mitigations

- **Low Engagement:** Simplify onboarding; A/B test CTAs; in-app tooltips
- **Privacy Concerns:** Transparent policies; local-only storage option
- **UI Overload:** Conduct usability testing; prioritize minimal, focused screens

---

_This PRD was generated from the provided design and requirements outline for the Ease app._
