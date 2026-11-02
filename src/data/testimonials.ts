import { z } from 'zod';
import source from '../../curated_portfolio_testimonials.json';

const common = {
  id: z.string().min(1),
  isFeatured: z.boolean(),
  displayOrder: z.number().int().positive(),
  visible: z.boolean().default(true),
};

const student = z.object({
  ...common,
  group: z.literal('student'),
  isPseudonym: z.literal(true),
  author: z.object({
    name: z.null(),
    displayName: z.string().min(1),
    role: z.string().min(1),
    attributionStatus: z.literal('anonymous'),
  }),
  quote: z.object({
    language: z.literal('ar'),
    original: z.string().min(1),
    englishTranslation: z.string().min(1),
    displayExcerpt: z.string().min(1),
  }),
  source: z.object({
    type: z.literal('student_feedback'),
    url: z.null(),
  }),
});

const professional = z.object({
  ...common,
  group: z.literal('colleague'),
  isPseudonym: z.literal(false),
  author: z.object({
    name: z.string().min(1),
    displayName: z.string().min(1),
    role: z.string().min(1),
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
});

const record = z.discriminatedUnion('group', [student, professional]);
const collection = z.object({
  schemaVersion: z.number().int(),
  homepageOrder: z.array(z.string()),
  allTestimonialsOrder: z.array(z.string()),
  testimonials: z.array(record),
}).superRefine((data, context) => {
  const ids = data.testimonials.map((entry) => entry.id);
  const allIds = new Set(ids);
  const homepageIds = new Set(data.homepageOrder);

  if (allIds.size !== ids.length) context.addIssue({ code: 'custom', message: 'Testimonial IDs must be unique.' });
  if (new Set(data.homepageOrder).size !== data.homepageOrder.length) context.addIssue({ code: 'custom', message: 'homepageOrder has duplicate IDs.' });
  if (new Set(data.allTestimonialsOrder).size !== data.allTestimonialsOrder.length) context.addIssue({ code: 'custom', message: 'allTestimonialsOrder has duplicate IDs.' });
  if (data.homepageOrder.length !== 6) context.addIssue({ code: 'custom', message: 'The homepage must contain six testimonials.' });
  if (data.allTestimonialsOrder.length !== ids.length || data.allTestimonialsOrder.some((id) => !allIds.has(id))) {
    context.addIssue({ code: 'custom', message: 'allTestimonialsOrder must contain every testimonial exactly once.' });
  }
  if (data.homepageOrder.some((id) => !allIds.has(id))) context.addIssue({ code: 'custom', message: 'homepageOrder references an unknown ID.' });

  for (const entry of data.testimonials) {
    if (entry.isFeatured !== homepageIds.has(entry.id)) context.addIssue({ code: 'custom', message: `${entry.id} isFeatured does not match homepageOrder.` });
    if (entry.displayOrder !== data.allTestimonialsOrder.indexOf(entry.id) + 1) context.addIssue({ code: 'custom', message: `${entry.id} displayOrder does not match allTestimonialsOrder.` });
    if (entry.group === 'student' && !entry.quote.original.includes(entry.quote.displayExcerpt)) {
      context.addIssue({ code: 'custom', message: `${entry.id} archival excerpt is not verbatim.` });
    }
    if (entry.group === 'colleague' && entry.author.name !== entry.author.displayName) {
      context.addIssue({ code: 'custom', message: `${entry.id} named attribution differs from its display name.` });
    }
  }
});

const curated = collection.parse(source);

export interface Testimonial {
  id: string;
  displayName: string;
  role: string;
  category: 'student' | 'professional';
  quote: string;
  originalQuote: string;
  language: 'en';
  isPseudonym: boolean;
  isFeatured: boolean;
  displayOrder: number;
  linkedInUrl?: string;
  visible: boolean;
}

const testimonials: Testimonial[] = curated.testimonials.map((entry) => ({
  id: entry.id,
  displayName: entry.author.displayName,
  role: entry.author.role,
  category: entry.group === 'student' ? 'student' : 'professional',
  quote: entry.group === 'student' ? entry.quote.englishTranslation : entry.quote.original,
  originalQuote: entry.quote.original,
  language: 'en',
  isPseudonym: entry.isPseudonym,
  isFeatured: entry.isFeatured,
  displayOrder: entry.displayOrder,
  ...(entry.group === 'colleague' ? { linkedInUrl: entry.source.url } : {}),
  visible: entry.visible,
}));

const byId = new Map(testimonials.map((entry) => [entry.id, entry]));

export function orderedTestimonials(order: 'homepageOrder' | 'allTestimonialsOrder'): Testimonial[] {
  return curated[order].map((id) => {
    const entry = byId.get(id);
    if (!entry) throw new Error(`Missing testimonial: ${id}`);
    return entry;
  }).filter((entry) => entry.visible);
}
