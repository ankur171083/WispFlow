import {
  UserProfileState,
  SkillNode,
  JobDescription,
  RoadmapWeek,
  PortfolioProject,
  MockQuestion,
  ApplicationItem,
  ResumeVariant
} from './types';

export const INITIAL_USER_PROFILE: UserProfileState = {
  name: "Alex Morgan",
  title: "Mid-Level Backend Software Engineer",
  targetRole: "Senior Distributed Systems & Platform Engineer",
  targetSeniority: "Senior / Staff IC",
  weeklyHoursBudget: 12,
  marketReadinessIndex: 68,
  voiceAspirationTranscript:
    "I've spent 3 years writing Python and Node services, but I want to transition into high-throughput systems infrastructure at Series B-D scaleups. I need to prove deep competence in Go, distributed consensus like Raft, distributed locks, and gRPC telemetry under high concurrency."
};

export const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 's1',
    name: 'Go (Golang Concurrency & Goroutines)',
    category: 'Languages',
    status: 'adjacent',
    marketFrequency: 0.92,
    demonstratedProof: 'Basic microservices in personal repos; no high-concurrency benchmarks.',
    prerequisites: ['Systems Programming Concepts'],
    description: 'Channel primitives, sync.Mutex, sync.RWMutex, race condition detection, and memory leak profiling.'
  },
  {
    id: 's2',
    name: 'Distributed Locks & Idempotency',
    category: 'Distributed Systems',
    status: 'critical_gap',
    marketFrequency: 0.88,
    demonstratedProof: 'Absent from resume. Mentioned in 9/10 target JDs.',
    prerequisites: ['Redis Internals', 'Transaction Isolation Levels'],
    description: 'Redis Redlock algorithms, fence tokens, single-use idempotency keys, and asynchronous webhook replay safety.'
  },
  {
    id: 's3',
    name: 'Distributed Consensus (Raft / Paxos)',
    category: 'Distributed Systems',
    status: 'critical_gap',
    marketFrequency: 0.76,
    demonstratedProof: 'Theoretical knowledge only. Lacks implementation proof.',
    prerequisites: ['State Machine Replication', 'RPC Protocols'],
    description: 'Leader election, log replication, split-brain resolution, and quorum configuration.'
  },
  {
    id: 's4',
    name: 'PostgreSQL Indexing & MVCC Internals',
    category: 'Databases',
    status: 'mastered',
    marketFrequency: 0.95,
    demonstratedProof: 'Optimized 50M+ row database with partial B-tree indices and VACUUM tuning at current company.',
    prerequisites: ['Relational Database Basics'],
    description: 'B-Tree vs GIN indices, EXPLAIN ANALYZE interpretation, WAL logging, and transaction isolation.'
  },
  {
    id: 's5',
    name: 'gRPC & Protocol Buffers Architecture',
    category: 'Distributed Systems',
    status: 'adjacent',
    marketFrequency: 0.84,
    demonstratedProof: 'Basic service-to-service RPC, but no custom interceptors or streaming.',
    prerequisites: ['HTTP/2 Framing', 'Interface Definition Languages'],
    description: 'Bi-directional streaming, client-side load balancing, deadlines, and middleware interceptors.'
  },
  {
    id: 's6',
    name: 'Cache Invalidation & Thundering Herd Defense',
    category: 'System Design',
    status: 'critical_gap',
    marketFrequency: 0.82,
    demonstratedProof: 'Used basic Redis GET/SET without stampede defense.',
    prerequisites: ['In-Memory Caching Primitives'],
    description: 'Cache-aside pattern, probabilistic early expiration (XFetch), singleflight coalescing, and bloom filters.'
  },
  {
    id: 's7',
    name: 'Kubernetes & Container Orchestration',
    category: 'Cloud & Infra',
    status: 'adjacent',
    marketFrequency: 0.70,
    demonstratedProof: 'Docker Compose expert, but limited Helm chart and K8s CRD experience.',
    prerequisites: ['Linux Namespaces & Cgroups'],
    description: 'Pod lifecycle, liveness/readiness probes, horizontal pod autoscaling, and ingress controllers.'
  },
  {
    id: 's8',
    name: 'OpenTelemetry & Distributed Tracing',
    category: 'Cloud & Infra',
    status: 'mastered',
    marketFrequency: 0.78,
    demonstratedProof: 'Implemented Jaeger trace propagation across 8 microservices, reducing P99 latency by 140ms.',
    prerequisites: ['Structured Logging'],
    description: 'W3C trace context propagation, span exporters, sampling strategies, and Prometheus metric exporters.'
  }
];

export const TARGET_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'jd-stripe',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer, Money Movement',
    stage: 'Series B-D',
    location: 'Remote (US / Global)',
    matchScore: 64,
    requiredSkills: [
      'Distributed Locks & Idempotency',
      'Go (Golang Concurrency & Goroutines)',
      'Distributed Consensus (Raft / Paxos)',
      'PostgreSQL Indexing & MVCC Internals'
    ],
    preferredSkills: ['gRPC & Protocol Buffers Architecture', 'OpenTelemetry & Distributed Tracing'],
    snippet:
      'Our team powers $1T+ in annual volume. You will design fault-tolerant, idempotent state machines with strict correctness guarantees and sub-millisecond p99 latencies.'
  },
  {
    id: 'jd-vercel',
    company: 'Vercel',
    role: 'Senior Edge Systems Engineer',
    stage: 'Series B-D',
    location: 'Remote',
    matchScore: 71,
    requiredSkills: [
      'Go (Golang Concurrency & Goroutines)',
      'Cache Invalidation & Thundering Herd Defense',
      'gRPC & Protocol Buffers Architecture'
    ],
    preferredSkills: ['Kubernetes & Container Orchestration', 'Distributed Consensus (Raft / Paxos)'],
    snippet:
      'We run hundreds of edge clusters worldwide. You will optimize cache routing, eliminate thundering herd storms, and build low-latency control planes.'
  },
  {
    id: 'jd-supabase',
    company: 'Supabase',
    role: 'Distributed Database Systems Engineer',
    stage: 'Series B-D',
    location: 'Remote (Worldwide)',
    matchScore: 82,
    requiredSkills: [
      'PostgreSQL Indexing & MVCC Internals',
      'Go (Golang Concurrency & Goroutines)',
      'Distributed Locks & Idempotency'
    ],
    preferredSkills: ['OpenTelemetry & Distributed Tracing', 'Raft Consensus'],
    snippet:
      'Work on global replication, multi-tenant connection pooling, and resilient transaction processing on top of Postgres core.'
  },
  {
    id: 'jd-openai',
    company: 'OpenAI',
    role: 'Inference Infrastructure Systems Engineer',
    stage: 'Public / FAANG',
    location: 'San Francisco / Remote',
    matchScore: 59,
    requiredSkills: [
      'Go (Golang Concurrency & Goroutines)',
      'Distributed Consensus (Raft / Paxos)',
      'Kubernetes & Container Orchestration',
      'Cache Invalidation & Thundering Herd Defense'
    ],
    preferredSkills: ['Distributed Locks & Idempotency', 'gRPC & Protocol Buffers Architecture'],
    snippet:
      'Scale GPU cluster scheduling and model serving worker nodes. We need engineers who think in terms of memory bandwidth, synchronization primitives, and fault tolerance.'
  }
];

export const INITIAL_ROADMAP: RoadmapWeek[] = [
  {
    weekNumber: 1,
    title: 'Advanced Concurrency & Channel Primitives in Go',
    focusSkillId: 's1',
    objective: 'Master thread-safe memory management, race conditions, and worker-pool architectures.',
    deliverable: 'Build a bounded worker-pool dispatcher with graceful shutdown & timeout contexts.',
    deliverableType: 'GitHub Repository + Benchmark Suite',
    estimatedHours: 10,
    completed: true,
    resources: [
      {
        id: 'r1',
        title: 'The Go Memory Model (Official Go Spec)',
        type: 'Documentation',
        url: 'https://go.dev/ref/mem',
        readTime: '25 min read'
      },
      {
        id: 'r2',
        title: 'Share Memory by Communicating (Go Blog)',
        type: 'Documentation',
        url: 'https://go.dev/blog/codereview',
        readTime: '15 min read'
      }
    ],
    selfCheckQuestions: [
      'What happens when writing to a closed Go channel vs reading from a closed channel?',
      'How does sync.Pool help mitigate garbage collection pressure under 100k req/sec?',
      'Explain the difference between sync.Mutex and sync.RWMutex under 95% read traffic.'
    ]
  },
  {
    weekNumber: 2,
    title: 'Distributed Locks & Idempotent Transactional Patterns',
    focusSkillId: 's2',
    objective: 'Design lock acquisition protocols that survive worker crashes and network partitions.',
    deliverable: 'Idempotency Key Middleware for HTTP APIs with Redis lease renewal and fence tokens.',
    deliverableType: 'Production-ready Go Module',
    estimatedHours: 12,
    completed: true,
    resources: [
      {
        id: 'r3',
        title: 'How to Do Distributed Locking (Martin Kleppmann)',
        type: 'Whitepaper',
        url: 'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html',
        readTime: '30 min read'
      },
      {
        id: 'r4',
        title: 'Designing Robust and Predictable APIs with Idempotency (Stripe Engineering)',
        type: 'Whitepaper',
        url: 'https://stripe.com/blog/idempotency',
        readTime: '20 min read'
      }
    ],
    selfCheckQuestions: [
      'Why is Redis TTL alone insufficient for safe distributed locking without fencing tokens?',
      'How do you handle idempotency key collisions when the first request is still executing?',
      'What is the transactional outbox pattern and why does it prevent two-phase commit overhead?'
    ]
  },
  {
    weekNumber: 3,
    title: 'Cache Invalidation Strategies & Thundering Herd Defense',
    focusSkillId: 's6',
    objective: 'Prevent cache stampedes when hot keys expire across distributed edge clusters.',
    deliverable: 'Implement a Go SingleFlight + Probabilistic Early Expiration (XFetch) caching proxy.',
    deliverableType: 'Proxy Service with Locust Load Tests',
    estimatedHours: 12,
    completed: false,
    resources: [
      {
        id: 'r5',
        title: 'Optimal Probabilistic Cache Expiration (Vattani et al., VLDB)',
        type: 'Whitepaper',
        url: 'https://vldb.org/pvldb/vol8/p886-vattani.pdf',
        readTime: '35 min read'
      },
      {
        id: 'r6',
        title: 'Golang SingleFlight Package Internals',
        type: 'Documentation',
        url: 'https://pkg.go.dev/golang.org/x/sync/singleflight',
        readTime: '15 min read'
      }
    ],
    selfCheckQuestions: [
      'How does the XFetch algorithm calculate whether to refresh a key before it officially expires?',
      'What are the failure modes of SingleFlight when the underlying origin request deadlocks?',
      'How do you invalidate cache entries across geographically distributed datacenters without split-brain?'
    ]
  },
  {
    weekNumber: 4,
    title: 'High-Performance gRPC Streaming & Middleware Telemetry',
    focusSkillId: 's5',
    objective: 'Build bi-directional streaming microservices with custom deadline propagation.',
    deliverable: 'gRPC event stream orchestrator with client-side load balancing and Prometheus metrics.',
    deliverableType: 'Microservice with Benchmark Graphs',
    estimatedHours: 11,
    completed: false,
    resources: [
      {
        id: 'r7',
        title: 'gRPC on HTTP/2: Framing, Flow Control & Multiplexing',
        type: 'Documentation',
        url: 'https://grpc.io/docs/guides/concepts/',
        readTime: '20 min read'
      }
    ],
    selfCheckQuestions: [
      'How does HTTP/2 flow control prevent buffer bloat in high-volume gRPC streaming?',
      'Why should you always configure gRPC keepalive pings in cloud environments behind ALBs?',
      'How do interceptors pass W3C distributed trace context across service boundaries?'
    ]
  },
  {
    weekNumber: 5,
    title: 'Distributed Consensus: Building a Minimal Raft Node',
    focusSkillId: 's3',
    objective: 'Understand state machine replication, leader election, and log append RPCs.',
    deliverable: 'Raft consensus library in Go passing network partition split-brain simulation test.',
    deliverableType: 'Go Package + Jepsen-Style Chaos Tests',
    estimatedHours: 14,
    completed: false,
    resources: [
      {
        id: 'r8',
        title: 'In Search of an Understandable Consensus Algorithm (Ongaro & Ousterhout)',
        type: 'Whitepaper',
        url: 'https://raft.github.io/raft.pdf',
        readTime: '45 min read'
      }
    ],
    selfCheckQuestions: [
      'How does randomized election timeout prevent split-vote deadlocks in Raft?',
      'What guarantees that a committed log entry is never overwritten by a future leader?',
      'How does Raft handle membership changes without service downtime?'
    ]
  },
  {
    weekNumber: 6,
    title: 'Production Capstone, Hardening & Portfolio Architecture',
    focusSkillId: 's2',
    objective: 'Synthesize all critical gaps into an enterprise-grade open-source flagship repository.',
    deliverable: 'End-to-end LedgerSync service with architectural decision records and live demo URL.',
    deliverableType: 'Flagship Portfolio Repo + Technical Blog RFC',
    estimatedHours: 12,
    completed: false,
    resources: [
      {
        id: 'r9',
        title: 'Writing Architectural Decision Records (ADR Standard)',
        type: 'Documentation',
        url: 'https://adr.github.io/',
        readTime: '15 min read'
      }
    ],
    selfCheckQuestions: [
      'Can you explain your system design trade-offs in 90 seconds to a VP of Engineering?',
      'What are the exact latency bottlenecks when scaling this service from 1k to 100k RPS?',
      'How would you pitch this repository in a Staff-level technical interview?'
    ]
  }
];

export const PORTFOLIO_PROJECT: PortfolioProject = {
  id: 'proj-ledgersync',
  title: 'LedgerSync: High-Throughput Idempotent Financial Engine',
  tagline: 'Fault-tolerant transaction orchestrator bridging Distributed Locks, Raft replication, and Go concurrency.',
  targetedGaps: [
    'Distributed Locks & Idempotency',
    'Go (Golang Concurrency & Goroutines)',
    'Cache Invalidation & Thundering Herd Defense'
  ],
  architectureSummary:
    'LedgerSync uses a two-tier consensus model. Inbound payment transactions verify idempotency through a Redis Redlock lease with 64-bit monotonically increasing fencing tokens. State changes are published to an append-only WAL replicated across 3 Go Raft nodes before flushing to PostgreSQL with MVCC optimization.',
  techStack: ['Go 1.22', 'Redis', 'PostgreSQL', 'gRPC / Protobuf', 'OpenTelemetry', 'Docker'],
  mvpRequirements: [
    'HTTP/gRPC API with single-use idempotency key headers and 24-hour replay caching.',
    'Distributed lock manager using Redis Redlock algorithm with fencing token verification.',
    'SingleFlight request coalescing to defend against thundering herd cache stampedes on hot balance lookups.',
    'Asynchronous transactional outbox processor publishing verified ledger events.'
  ],
  stretchFeatures: [
    'Pluggable Raft consensus cluster for zero-data-loss leader failovers during network partitions.',
    'Prometheus exporter tracking p50, p95, and p99 lock acquisition wait times.'
  ],
  recruiterDemoHook:
    'Live Chaos Testing Dashboard: Click a button to simulate network partition; watch LedgerSync elect a new leader and reject non-idempotent concurrent requests with zero double-charge anomalies.',
  readmeMarkdown: `# LedgerSync ⚡
An enterprise-grade, distributed idempotent payment engine built in Go.

## Architectural Highlights
- **Zero Double-Charge Guarantee:** Combines Redis distributed locks with cryptographic fencing tokens and transactional outbox.
- **Thundering Herd Shield:** Prevents cache stampedes under 50,000 req/sec using atomic SingleFlight deduplication.
- **Observability Built-In:** Full W3C distributed trace context propagation via OpenTelemetry and Jaeger.

## Quickstart
\`\`\`bash
docker-compose up -d
go test -v ./tests/chaos/...
\`\`\`
`
};

export const MOCK_INTERVIEW_QUESTIONS: MockQuestion[] = [
  {
    id: 'q1',
    roleCategory: 'System Design & Distributed Systems',
    prompt:
      'We are experiencing cache stampedes on our edge tier when popular API tokens expire. How would you design a caching layer that completely eliminates the thundering herd problem without introducing stale data?',
    context: 'Targeting Senior / Staff Systems Roles (Vercel, Cloudflare, Stripe)',
    interviewerAudioText:
      'We are experiencing cache stampedes on our edge tier when popular API tokens expire. How would you design a caching layer that completely eliminates the thundering herd problem without introducing stale data?',
    idealRubricPoints: [
      'Mentions SingleFlight / request coalescing to collapse duplicate concurrent queries into 1 backend fetch.',
      'Explains Probabilistic Early Expiration (e.g., XFetch algorithm) to refresh keys before hard TTL.',
      'Discusses soft TTL vs hard TTL with background asynchronous renewal.',
      'Addresses Redis cluster latency and circuit breaker behavior if origin service is degraded.'
    ]
  },
  {
    id: 'q2',
    roleCategory: 'Concurrency & Correctness',
    prompt:
      'In a distributed payment system, a client retries a webhook 3 times in 20 milliseconds due to a flaky network timeout. How do you guarantee the customer is billed exactly once using distributed locks and idempotency keys?',
    context: 'Targeting Stripe, Adyen, Brex Financial Infrastructure Roles',
    interviewerAudioText:
      'In a distributed payment system, a client retries a webhook 3 times in 20 milliseconds due to a flaky network timeout. How do you guarantee the customer is billed exactly once using distributed locks and idempotency keys?',
    idealRubricPoints: [
      'Explains unique idempotency key registration with an in-progress state lock.',
      'Identifies the necessity of fencing tokens so delayed requests cannot overwrite newer state.',
      'Explains transactional database outbox pattern instead of 2PC (Two-Phase Commit).',
      'Articulates client return payload: returning the cached original response without reprocessing.'
    ]
  }
];

export const INITIAL_RESUME_VARIANTS: ResumeVariant[] = [
  {
    id: 'var-a',
    name: 'Variant A: Distributed Systems & Low-Latency Infra',
    tagline: 'Emphasizes Go concurrency, Redis locking, Raft consensus, and P99 latency optimization.',
    targetFocus: 'Platform, Infra & High-Throughput Roles',
    activeApplicationsCount: 14,
    interviewConversionRate: 42.8 // 6 callbacks out of 14
  },
  {
    id: 'var-b',
    name: 'Variant B: Full-Stack Product & Backend Generalist',
    tagline: 'Emphasizes Python, Node.js, Next.js, and product feature velocity.',
    targetFocus: 'General Product Engineering Roles',
    activeApplicationsCount: 18,
    interviewConversionRate: 11.1 // 2 callbacks out of 18
  }
];

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    stage: 'Screening',
    companyType: 'Series B-D',
    resumeVariantId: 'var-a',
    appliedDate: '2026-10-18',
    responseDays: 4,
    autopsyNotes: 'Passed Recruiter screen. Technical round focuses on distributed locks & idempotency.',
    keySkills: ['Go', 'Distributed Locks', 'PostgreSQL']
  },
  {
    id: 'app-2',
    company: 'Vercel',
    role: 'Senior Edge Systems Engineer',
    stage: 'Technical Round',
    companyType: 'Series B-D',
    resumeVariantId: 'var-a',
    appliedDate: '2026-10-12',
    responseDays: 3,
    autopsyNotes: 'Completed system design round. Interviewer asked deep questions on cache invalidation.',
    keySkills: ['Go', 'SingleFlight', 'Edge Caching']
  },
  {
    id: 'app-3',
    company: 'Supabase',
    role: 'Distributed Database Systems Engineer',
    stage: 'Offer',
    companyType: 'Series B-D',
    resumeVariantId: 'var-a',
    appliedDate: '2026-09-28',
    responseDays: 2,
    autopsyNotes: 'Praised PostgreSQL indexing depth and open-source contributions.',
    keySkills: ['Postgres MVCC', 'Go', 'Distributed Systems']
  },
  {
    id: 'app-4',
    company: 'Modal Labs',
    role: 'Cloud Infrastructure Engineer',
    stage: 'Applied',
    companyType: 'Seed / Series A',
    resumeVariantId: 'var-a',
    appliedDate: '2026-10-25',
    keySkills: ['Linux Internals', 'Go', 'Container Runtimes']
  },
  {
    id: 'app-5',
    company: 'Enterprise MegaCorp',
    role: 'Senior Software Engineer',
    stage: 'Rejected',
    companyType: 'Public / FAANG',
    resumeVariantId: 'var-b',
    appliedDate: '2026-09-15',
    responseDays: 28,
    autopsyNotes: 'ATS automated rejection after 4 weeks. Generic product resume failed keyword screen.',
    keySkills: ['Java', 'Spring Boot', 'Kubernetes']
  },
  {
    id: 'app-6',
    company: 'Datadog',
    role: 'Distributed Tracing Engineer',
    stage: 'Wishlist',
    companyType: 'Public / FAANG',
    resumeVariantId: 'var-a',
    appliedDate: '2026-10-30',
    keySkills: ['OpenTelemetry', 'gRPC', 'Distributed Systems']
  }
];
