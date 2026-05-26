# Project overview · molave.ai
01Introduction

molave.ai
---------

An intelligence layer for meetings and interviews, built entirely on AWS by the Persol Frontier AI Lab.

molave.ai is one product with three main features. It is a meeting room built around the people in it. The same room hosts your daily team syncs and your interviews. The AI Interviewer can run the interview by itself, or sit alongside a human as a co pilot, so every candidate gets the same patient attention. The AI Meeting Assistant captures the decisions and action items during team meetings so nobody walks away unsure. Room Awareness watches what is happening across every conversation in the room, so the host can pay better attention to the person in front of them.

Every part of the system is built from AWS primitives, and Persol runs it entirely inside its own AWS account. The intelligence layer that ties the features together is built by our team. That is the central engineering contribution. Phase 1 of the full system lands in June 2026, and the pilot expansion to selected Persol teams runs through Q3 2026 (July through September).

### The three main features

AI Interviewer

Conducts a job interview, or assists a human interviewer, with structured questions and a fair, substance focused evaluation.

AI Meeting Assistant

The team meeting room itself. It captures the decisions, tracks the action items, and helps every participant be heard, so nobody walks away unsure of what was agreed.

Room Awareness

Runs inside the same room during every conversation. Reads facial geometry, voice cadence, and transcript context, and offers gentle private suggestions to the people running the meeting. Never categorical labels. Always charitable interpretation.

02Vision and mission

Help people be more present.
----------------------------

Vision

Help people be more present in every conversation that matters.

Mission

Help managers run more thoughtful meetings, and recruiters conduct fairer interviews. Provide AI that quietly helps you notice and act on what would otherwise be missed.

The mission has two halves. The first is practical: better meetings, better interviews, less wasted time. The second is human: dignity for everyone in the conversation. Both halves carry equal weight.

03The problem

The most important conversations are also the most broken.
----------------------------------------------------------

Meetings and interviews are the most important conversations in modern work. They are also the most broken.

In meetings, hosts cannot track who is engaged across a screen full of faces. Decisions and action items disappear. Quiet contributors stay quiet. Anyone who missed the meeting must chase down what happened. Time is consumed without producing outcomes.

In interviews, the experience is inconsistent. Candidates are judged on surface presence rather than substance. Recruiters are exhausted by the volume and miss strong candidates. Evaluation reports fixate on impression rather than skill.

In both cases, the technology in the room is designed to record, not to help people pay attention to each other.

04The solution

One meeting room. Three features. All for the people inside.
------------------------------------------------------------

We build the meeting room your team holds its conversations in. The same room hosts your daily team syncs and your interviews. Three features run inside the room, all working together to help the people who are there.

The AI Interviewer

Inside the room, the AI runs the interview. Or it sits alongside a human interviewer as a co pilot. It asks the same set of questions for the role, listens patiently to the candidate, and writes a fair evaluation that focuses on what they actually said. Every candidate gets the same attention.

The AI Meeting Assistant

The team meeting room itself, with the assistant running inside it. It captures the decisions, tracks the action items, helps the quieter voices be heard, and sends a personalized summary afterward so the people who missed it can still keep up.

Room Awareness

Runs quietly in the room during both interviews and team meetings. It reads small facial signals, voice cadence, and the live transcript, combines them, and offers gentle private suggestions to the people running the meeting (the host, any human interviewer, and any observers). It never labels people. It always interprets charitably. The point is to help the team pay better attention to the person in front of them.

05Main feature · 01

AI Interviewer
--------------

An AI interviewer for first round interviews. It runs inside the molave.ai meeting room. It can do the interview by itself, or sit alongside a human interviewer as a quiet co pilot.

### Behavior

The AI Interviewer presents itself through a consistent, warm persona. It introduces itself, explains the structure of the interview, and adjusts to the candidate's pace. It asks role specific questions, follows up on substantive answers, and listens patiently when candidates need time to think.

It treats candidates with the same dignity throughout, regardless of fluency, accent, or composure.

### Configuration

Companies can configure the AI Interviewer per role. Configurable elements include:

*   The set of questions to ask
*   The evaluation rubric to apply
*   The depth and number of follow up questions
*   Whether the AI Interviewer runs the interview alone or sits alongside a human
*   Whether the candidate sees a video persona or only hears a voice
*   The persona's voice and presentation style

### Evaluation output

After the interview, the AI Interviewer produces two outputs.

For the recruiter

A fair, substance focused evaluation. It lists demonstrated skills, the strength of the candidate's reasoning, and clear growth areas. It does not include impressions of fluency, composure, or appearance.

For the candidate

A respectful, growth oriented summary. It tells the candidate what they communicated well, what they might develop, and provides their full transcript and recording.

### Co pilot mode

06Main feature · 02

AI Meeting Assistant
--------------------

The team meeting room your team holds its daily work in. The assistant is always inside. It listens, captures the decisions, and helps everyone in the room actually take part, not just the loudest voices.

### What it does during the meeting

The Assistant captures the conversation, identifies decisions as they are made, and tracks who is responsible for each action item. It maintains a live agenda position so the host knows where in the meeting they are.

When a participant has been quiet, when energy is dropping, or when several people appear to be lost, the Assistant sends a private suggestion to the people running the meeting. The host decides whether to act on it.

### What it produces after the meeting

After the meeting ends, every participant receives a summary. The summary includes decisions, action items, and the parts of the conversation that affected them personally.

Anyone who could not attend receives a personalized briefing of about a minute, focused on what they need to know.

### Pre meeting intelligence

Before a meeting, the Assistant can review the agenda and suggest whether the meeting should be kept as scheduled, shortened, moved to an asynchronous format, or cancelled. Over time, this reduces meeting volume across the team.

### Integration

The meeting room is built on the AWS Chime SDK and runs entirely inside Persol's AWS account. Company calendar integration (Google Calendar, Microsoft 365) is included so meetings are scheduled and joined from the calendars teams already use.

07Main feature · 03

Room Awareness
--------------

Runs in the background during interviews and meetings. Reads small facial geometry, voice cadence, and transcript context. The output is a set of gentle private suggestions for the host. Never a label on a person.

### How it works

We extract facial geometry from AWS Rekognition. This includes face landmarks, head pose, eye direction and openness, and mouth state. We combine these signals with voice cadence and the live transcript.

Our custom interpretation layer, running on AWS Bedrock, evaluates the combined signals and produces a suggestion only when multiple signals agree. The suggestion is delivered privately to the people running the meeting (the host, any human interviewer, and any observers). It is never broadcast to the candidate or to anyone being evaluated.

### What we deliberately do not do

We do not produce categorical emotion labels such as happy, sad, angry, or confused. Room Awareness is attention sensing for the host, not a verdict on anyone in the room. Four reasons we hold this line:

1.  The scientific basis for emotion-from-face is contested.
    
    Lisa Feldman Barrett's research, widely cited, demonstrates that facial expressions do not reliably map to internal emotional states.
    
2.  Documented bias.
    
    Face emotion APIs are known to produce different results across skin tones, ages, and genders. Microsoft's Azure Face Emotion API was retired in 2022 for exactly this reason.
    
3.  Cultural variation.
    
    Japanese facial expression norms differ substantially from Filipino norms. A model trained on Western faces produces misleading readings for both populations.
    
4.  Static labels miss intent.
    
    The label "confused" can mean thinking hard or genuinely lost. A label cannot tell the difference.
    

### Example suggestions

Room Awareness produces nudges like the following:

*   Carrie has been quiet for several minutes. Worth asking her thoughts.
*   Three participants appear to be reviewing something. A pause might help.
*   The candidate appears to be composing her response. Give her a moment.
*   Energy has dropped. A short break would help.

### Privacy commitments

08Beyond the main features

Supporting capabilities
-----------------------

These capabilities support the three main features but are not the focus of the project.

Multilingual support

Participants can use languages other than English. Captions and summaries are available in each participant's preferred language. This is supportive of inclusion across global teams but is not the lead capability.

Voice synthesis

The AI Interviewer speaks aloud through AWS Polly when running in voice mode.

Custom vocabulary

Each meeting and interview can be configured with a custom vocabulary of company names, product names, and role specific terms.

Repair and reversibility

Captions, summaries, and suggestions are editable by the relevant person. Corrections improve the system over time.

09Safeguards

Built so the AI cannot mislead the room.
----------------------------------------

Several layers prevent the system from misleading users, particularly around Room Awareness. Each one is a hard rule, not a guideline.

1.  01
    
    Multi signal fusion
    
    A suggestion fires only when multiple signals agree. Facial geometry alone is not enough. Voice prosody alone is not enough. Transcript alone is not enough.
    
2.  02
    
    Confidence thresholds
    
    Below a defined threshold, the system says nothing. Silence is preferred over a wrong suggestion.
    
3.  03
    
    Charitable defaults
    
    When signals are ambiguous, the system defaults to the kinder interpretation. Thinking, not disengaged. Considering, not confused.
    
4.  04
    
    Suggestions, never facts
    
    Every nudge is dismissible. Nothing is broadcast. No long term profile of any person is retained.
    
5.  05
    
    Bias audits
    
    Interpretation is tested across skin tones, ages, and cultures before any rollout.
    
6.  06
    
    Transparency panel
    
    An optional view shows what signals the AI is currently picking up. Hosts can see why the system is behaving as it is.
    
7.  07
    
    Privacy by default
    
    All Room Awareness signal processing follows the privacy commitments described in that section.
    

10How it shows up for people

User journeys
-------------

Two journeys, one for each main interaction surface.

### AI Interviewer journey

1.  The recruiter configures the role and uploads the job description. The AI reviews the resume of each candidate and prepares a tailored question set.
    
2.  The AI Interviewer conducts the interview, or assists a human interviewer. Room Awareness runs quietly and produces private suggestions as needed.
    
3.  The recruiter receives a substance focused evaluation. The candidate receives a respectful summary and a transcript.
    

### Meeting Assistant journey

1.  A calendar invite is created. The Assistant reviews the agenda and suggests whether the meeting should be kept, shortened, made asynchronous, or cancelled.
    
2.  The Assistant joins as a participant. It captures decisions and action items, follows the agenda, and produces private suggestions to the people running the meeting.
    
3.  Every participant receives a personalized summary. Anyone who missed the meeting receives a one minute briefing.
    

11A demo moment

Demonstration scenario
----------------------

A hiring manager begins a job interview. The AI Interviewer greets the candidate warmly in the candidate's preferred language and explains the format. It asks the first question, tailored to the role.

As the candidate answers, the AI captures the substance of her response. Mid interview, she hesitates and her face shows that she is composing a thought, not finishing one. Room Awareness picks this up. The AI sends a private suggestion to the manager: "She has more to say. Give her a few seconds."

The manager waits. The candidate completes her answer. The AI captures it in the evaluation.

After the call, the manager receives a fair, substance focused evaluation. The candidate receives a respectful summary of how the interview went and what she communicated well.

12Engineering

Technical architecture
----------------------

The system is built entirely on AWS primitives. No third party AI products are used.

### AWS services

### Application framework

*   Next.js 16 and TypeScript for the web frontend
*   NestJS for the backend
*   shadcn/ui and Tailwind for components
*   TanStack Query for client state

### Our intelligence layer

The custom intelligence layer is the central engineering contribution. It includes:

*   The AI Interviewer behavior engine, including question selection, follow up logic, and the charitable listening model
*   Multi signal fusion that converts facial geometry, voice prosody, and transcript context into private host suggestions
*   The Meeting Assistant orchestration layer, including decision detection, action item extraction, and agenda tracking
*   The evaluation engine that produces fair, substance focused reports

### Architecture overview

End to end request flow, from the browser to storage:

Architecture overview

```
Browser (Next.js + Chime SDK)
       |
WebSocket via API Gateway
       |
AWS Lambda Orchestration
       |
       +- AWS Transcribe         (speech to text)
       +- AWS Rekognition        (facial geometry)
       +- AWS Bedrock            (AI Interviewer, interpretation, summarization)
       +- AWS Polly              (AI Interviewer voice)
       +- AWS Comprehend         (entity extraction)
       +- AWS S3                 (transcripts, recordings)
       +- AWS DynamoDB           (session state, evaluations)
```


13Engineering

Suggested repository structure
------------------------------

A pnpm monorepo split into apps and packages. The web and api apps depend on focused, narrowly scoped packages so each piece of the intelligence layer can be tested in isolation.

Two repos, side by side

```
molave-ai (this repo)             # Next.js 16 frontend
+-- src/
|   +-- app/                      # App Router routes
|   |   +-- (pages)/              # Public marketing + docs
|   |   +-- (auth)/login/         # Sign in
|   |   +-- (app)/dashboard/      # Authenticated product
|   |   +-- actions/              # Server actions
|   |   +-- hooks/                # TanStack Query hooks (API only)
|   |   +-- providers/            # App / Auth / Query providers
|   |   +-- layout.tsx
|   |   +-- globals.css           # Theme tokens
|   +-- components/
|   |   +-- ui/                   # shadcn primitives
|   |   +-- atoms/                # FormInput, Logo, Eyebrow
|   |   +-- molecules/            # LabeledFormInput, FeatureCard, ...
|   |   +-- organisms/            # AppHeader, AppSidebar, LocaleSwitcher
|   |   +-- templates/            # MockupLayout, AuthShell, AppShell
|   +-- features/                 # Per feature modules
|   |   +-- landing/              # Home landing sections
|   |   +-- docs/                 # Project overview surface
|   |   +-- live-preview/         # Live preview meeting room mock
|   |   +-- auth/                 # Login flow
|   +-- i18n/                     # Locales + cookie based config
|   +-- lib/                      # auth contract, utils
|   +-- messages/                 # en-PH.json (default), ja-JP.json
|   +-- proxy.ts                  # Next.js 16 proxy
+-- docs/PROJECT.md               # this document
+-- public/
+-- README.md

molave-ai-api (separate repo)     # NestJS 10, AWS Lambda ready
+-- src/
|   +-- <feature>/                # layered modules per feature
|   |   +-- <feature>.controller.ts
|   |   +-- <feature>.service.ts
|   |   +-- <feature>.module.ts
|   |   +-- dto/
|   +-- common/                   # cross cutting concerns
|   +-- config/                   # typed config
|   +-- main.ts                   # bootstrap (local dev + Lambda)
+-- README.md
```


14Plan

Project timeline
----------------

Phase 1 lands in June 2026, the pilot expansion to Persol teams runs through Q3 2026, and subsequent phases broaden the product.

1.  Working demo
    
    *   molave.ai meeting room (AWS Chime SDK) running for both interviews and team meetings
    *   AI Interviewer ready for live first-round interviews inside the room
    *   AI Meeting Assistant capturing decisions and action items in live team meetings
    *   Substance focused evaluation reports
    *   Personalized post conversation summaries
    
2.  Pilot expansion
    
    *   molave Companion bot for Microsoft Teams (Persol is on Microsoft 365)
    *   Calendar integration with Microsoft 365 (auto join, pre meeting briefing)
    *   Pre meeting briefing: a 2 minute read of recent context, decisions, and open action items
    *   Pilot deployment to two or three Persol teams, with weekly stakeholder review
    *   Platform certification work begins for Zoom and Google Meet (3 to 4 weeks per platform)
    
3.  Broadening
    
    *   molave Companion bot for Zoom and Google Meet after platform certification
    *   molave Desktop window: floating translation overlay and self awareness signals
    *   One minute catch up briefings, adaptive speech profiles, candidate practice mode
    *   Wider language coverage and broader rollout across Persol divisions
    

15Plan

Cost estimation
---------------

Honest working numbers in Philippine Peso (PHP). The build is small on purpose: two engineers, six months, mostly AWS pay-as-you-go usage. Real numbers will move with actual meeting volume and any AWS Enterprise discounts Persol Holdings can negotiate.

### Build cost (Phase 1, through June 2026)

Phase 1 is built by two engineers (the implementation team) inside Persol over roughly six months. Their salaries are already part of Persol's payroll, so the project does not add a new engineering line. What the project does add is a small AWS development environment and a few tooling subscriptions.

*   Engineering effort (2 engineers × ~6 months)\-
*   AWS development environment (6 months × ~₱2,500)~₱15,000
*   Tooling and observability (mostly free tiers)~₱5,000

### Operating cost at pilot scale (Phase 2, Q3 2026 onwards)

Pilot scale assumption: roughly 30 Persol users, ~150 meetings per month, ~10 interviews per month. Every line below is an AWS service we own. No third party AI vendor sits in the loop and no additional licences are required.

Pilot operating cost sits in the ₱25,000–₱30,000 monthly range, depending on actual meeting volume. We plan against ₱30,000 to leave headroom.

### Per session unit economics

Dividing the pilot operating cost across roughly 160 sessions per month gives a small, easy to communicate per session number.

~₱160

30 minute team meeting, 5 attendees, captured and summarized

~₱250

45 minute AI Interview with full evaluation report

+₱30

Room Awareness add on per session

At Phase 3 scale these per session numbers fall further thanks to AWS volume discounts, reserved capacity, and Bedrock Provisioned Throughput.

### Cost trajectory across phases

Operating cost rises roughly with usage. Phase 3 assumes a modest internal rollout, not a public product launch, so the numbers stay grounded.

### Cost reduction levers

Six levers we can pull as usage stabilises, in roughly the order they pay back:

*   AWS Compute Savings Plans for Lambda and Chime SDK once volume is predictable
*   AWS Bedrock Provisioned Throughput for the intelligence layer once token usage is stable
*   Prompt caching and context window trimming to cut Bedrock spend further
*   On device facial geometry extraction to reduce Rekognition spend
*   S3 Intelligent Tiering for transcripts and recordings older than 30 days
*   Custom vocabularies in Transcribe to reduce re-runs and human correction overhead

### Year 1 budget summary

Build cost plus three months of Q3 pilot operations plus a small incident and tooling buffer. Q4 broadens into Phase 3 scale, which we hold outside this Year 1 figure so the pilot decision is made on pilot economics.

*   Phase 1 incremental build (AWS dev + tooling)~₱20,000
*   Phase 2 pilot operations (3 months × ~₱26,000)~₱78,000
*   Buffer for incidents, monitoring, observability~₱30,000

These are intentionally lean estimates. The project is designed to be cheap to keep alive while it proves its value. If pilot usage grows faster than expected, the AWS lines scale linearly and we revisit; nothing locks Persol into a step change in spend.

16Plan

Success metrics
---------------

What we measure to know the product is doing its job.

*   Hours saved per person per week in Meeting Assistant
*   Reduction in the number of meetings per team
*   Interview to hire conversion rate
*   Recruiter time saved per interview
*   Suggestion accept rate, calibrating the interpretation layer over time
*   Manager and recruiter satisfaction
*   Candidate experience score

17Plan

Guiding principle
-----------------

It is the only rule we have. Asked of every feature, every release.

18Plan

Open questions
--------------

Things we have not decided yet, and want input on.

*   Brand name
*   Primary go to market: interview first or meeting first
*   Pricing model: per seat, per meeting, or hybrid
*   Whether to offer an individual tier for candidates
*   Voice profile storage policy, including opt in defaults and retention windows

19Plan

Next steps
----------

1.  1Lock the brand name
2.  2Complete Phase 1 build by early June 2026 so the demo is ready for the stakeholder review
3.  3Record the demonstration video
4.  4Prepare the technical engineering review materials for Persol
5.  5Anticipate and prepare responses to questions on bias, privacy, architecture, and cost

molave.ai · Frontier AI Lab Project Specification · Prepared by John & Carrie · Version 1.0, updated 18 May 2026.