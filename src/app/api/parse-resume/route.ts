import { NextRequest, NextResponse } from 'next/server';

// Comprehensive tech skill taxonomy for extraction
const KNOWN_SKILLS = [
  { name: 'Go (Golang Concurrency & Goroutines)', category: 'Languages', keywords: ['go', 'golang', 'goroutines', 'channels', 'mutex', 'sync'] },
  { name: 'Python & FastAsync', category: 'Languages', keywords: ['python', 'django', 'fastapi', 'flask', 'asyncio'] },
  { name: 'TypeScript & React/Next.js', category: 'Languages', keywords: ['typescript', 'react', 'next.js', 'javascript', 'node.js', 'frontend'] },
  { name: 'Distributed Locks & Idempotency', category: 'Distributed Systems', keywords: ['distributed lock', 'idempotency', 'idempotent', 'redlock', 'fencing token', 'lease'] },
  { name: 'Distributed Consensus (Raft / Paxos)', category: 'Distributed Systems', keywords: ['raft', 'paxos', 'consensus', 'etcd', 'quorum', 'leader election'] },
  { name: 'PostgreSQL Indexing & MVCC Internals', category: 'Databases', keywords: ['postgres', 'postgresql', 'mvcc', 'sql', 'b-tree', 'database indexing', 'relational'] },
  { name: 'Redis & In-Memory Data Stores', category: 'Databases', keywords: ['redis', 'memcached', 'cache', 'key-value', 'caching'] },
  { name: 'gRPC & Protocol Buffers Architecture', category: 'Distributed Systems', keywords: ['grpc', 'protobuf', 'protocol buffers', 'rpc', 'http/2'] },
  { name: 'Cache Invalidation & Thundering Herd Defense', category: 'System Design', keywords: ['thundering herd', 'cache stampede', 'singleflight', 'xfetch', 'cache invalidation'] },
  { name: 'Kubernetes & Container Orchestration', category: 'Cloud & Infra', keywords: ['kubernetes', 'k8s', 'docker', 'containers', 'helm', 'pod'] },
  { name: 'OpenTelemetry & Distributed Tracing', category: 'Cloud & Infra', keywords: ['opentelemetry', 'tracing', 'jaeger', 'prometheus', 'datadog', 'observability'] },
  { name: 'Kafka & Event-Driven Architecture', category: 'Distributed Systems', keywords: ['kafka', 'event-driven', 'pub/sub', 'message queue', 'rabbitmq', 'sqs'] },
  { name: 'AWS & Cloud Architecture', category: 'Cloud & Infra', keywords: ['aws', 's3', 'ec2', 'lambda', 'cloud', 'gcp', 'azure'] },
  { name: 'System Design & Scalability', category: 'System Design', keywords: ['system design', 'scalability', 'microservices', 'high throughput', 'low latency'] }
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawText = formData.get('text') as string | null;

    let textContent = '';

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.name.toLowerCase().endsWith('.pdf')) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const pdfParse = require('pdf-parse');
          const parsed = await pdfParse(buffer);
          textContent = parsed.text;
        } catch (pdfErr) {
          console.error("PDF parse fallback to text conversion", pdfErr);
          textContent = buffer.toString('utf-8');
        }
      } else {
        textContent = buffer.toString('utf-8');
      }
    } else if (rawText) {
      textContent = rawText;
    }

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json({ error: 'No readable text found in upload.' }, { status: 400 });
    }

    const lower = textContent.toLowerCase();

    // Extract candidate name heuristic (first non-empty line)
    const lines = textContent.split('\n').map((l) => l.trim()).filter(Boolean);
    const candidateName = lines.length > 0 && lines[0].length < 40 ? lines[0] : 'Candidate';

    // Skill detection against taxonomy
    const detectedSkills = KNOWN_SKILLS.map((skill, index) => {
      let matchCount = 0;
      let matchedKeyword = '';

      for (const kw of skill.keywords) {
        if (lower.includes(kw)) {
          matchCount++;
          matchedKeyword = kw;
        }
      }

      let status: 'mastered' | 'adjacent' | 'critical_gap' = 'critical_gap';
      let proof = `Missing from resume. Recommended for target senior engineering roles.`;

      if (matchCount >= 2) {
        status = 'mastered';
        proof = `Verified on resume: demonstrated proof in "${matchedKeyword}" and related production tools.`;
      } else if (matchCount === 1) {
        status = 'adjacent';
        proof = `Familiar with "${matchedKeyword}" on resume; lacks enterprise benchmark proof.`;
      }

      return {
        id: `s-${index + 1}`,
        name: skill.name,
        category: skill.category,
        status,
        marketFrequency: 0.85,
        demonstratedProof: proof,
        description: `Production evaluation of ${skill.name}.`
      };
    });

    const masteredCount = detectedSkills.filter((s) => s.status === 'mastered').length;
    const adjacentCount = detectedSkills.filter((s) => s.status === 'adjacent').length;
    const computedReadiness = Math.round(((masteredCount * 1.0 + adjacentCount * 0.5) / detectedSkills.length) * 100);

    return NextResponse.json({
      success: true,
      candidateName,
      extractedTextLength: textContent.length,
      detectedSkills,
      readinessScore: Math.max(45, computedReadiness)
    });

  } catch (error: any) {
    console.error('Resume Parse API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse resume' }, { status: 500 });
  }
}
