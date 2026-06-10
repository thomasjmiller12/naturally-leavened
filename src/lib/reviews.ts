export type Review = {
  quote: string; // what they said
  name: string; // first name + last initial, e.g. "Sarah M."
  detail?: string; // optional context, e.g. "Beginner class · March 2026"
  rating?: number; // optional 1–5 star rating
};

/* ════════════════════════════════════════════════════════════════════
   Class reviews — shown on the Classes page, just above booking.

   Add real reviews here as you collect them (texts, Instagram, in person).
   The section stays hidden while this list is empty, so nothing fake or
   placeholder ever shows. Example of the shape:

     {
       quote: "I came in sure I'd mess it up and left with a gorgeous loaf.",
       name: "Sarah M.",
       detail: "Beginner class · March 2026",
       rating: 5,
     },
   ════════════════════════════════════════════════════════════════════ */
export const REVIEWS: Review[] = [];
