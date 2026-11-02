import { z } from 'zod';
import source from '../../curated_portfolio_testimonials.json';

const student = z.object({
  id: z.string(),
  group: z.literal('student'),
  author: z.object({
    name: z.null(),
    displayName: z.string().min(1),
    attributionStatus: z.literal('anonymous'),
  }),
  quote: z.object({
    language: z.literal('ar'),
    original: z.string().min(1),
    displayExcerpt: z.string().min(1),
  }),
  source: z.object({
    type: z.literal('student_feedback'),
    platform: z.null(),
    url: z.null(),
  }),
  visible: z.boolean().default(true),
});

const colleague = z.object({
  id: z.string(),
  group: z.literal('colleague'),
  author: z.object({
    name: z.string().min(1),
    displayName: z.string().min(1),
    role: z.string().min(1),
    relation: z.string().min(1),
    attributionStatus: z.literal('named'),
  }),
  quote: z.object({
    language: z.literal('en'),
    original: z.string().min(1),
  }),
  source: z.object({
    type: z.literal('linkedin_recommendation'),
    platform: z.literal('LinkedIn'),
    url: z.url(),
  }),
  visible: z.boolean().default(true),
});

const testimonial = z.discriminatedUnion('group', [student, colleague]);

const collection = z.object({
  schemaVersion: z.number(),
  homepageOrder: z.array(z.string()),
  allTestimonialsOrder: z.array(z.string()),
  testimonials: z.array(testimonial),
}).superRefine((data, context) => {
  const ids = data.testimonials.map((entry) => entry.id);
  const known = new Set(ids);

  if (known.size !== ids.length) {
    context.addIssue({ code: 'custom', message: 'Testimonial IDs must be unique.' });
  }

  for (const [name, order] of [['homepageOrder', data.homepageOrder], ['allTestimonialsOrder', data.allTestimonialsOrder]] as const) {
    if (new Set(order).size !== order.length) {
      context.addIssue({ code: 'custom', message: `${name} contains a duplicate ID.` });
    }
    for (const id of order) {
      if (!known.has(id)) context.addIssue({ code: 'custom', message: `${name} references unknown ID ${id}.` });
    }
  }

  for (const entry of data.testimonials) {
    if (entry.group === 'student' && !entry.quote.original.includes(entry.quote.displayExcerpt)) {
      context.addIssue({ code: 'custom', message: `${entry.id} excerpt is not verbatim from its original response.` });
    }
    if (entry.group === 'colleague' && entry.author.name !== entry.author.displayName) {
      context.addIssue({ code: 'custom', message: `${entry.id} named attribution differs from its display name.` });
    }
  }
});

const curated = collection.parse(source);
const byId = new Map(curated.testimonials.map((entry) => [entry.id, entry]));

export type Testimonial = z.infer<typeof testimonial>;

export function orderedTestimonials(order: 'homepageOrder' | 'allTestimonialsOrder'): Testimonial[] {
  return curated[order].map((id) => {
    const entry = byId.get(id);
    if (!entry) throw new Error(`Missing testimonial: ${id}`);
    return entry;
  }).filter((entry) => entry.visible);
}
