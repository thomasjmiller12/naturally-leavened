import Link from "next/link";
import { CLASS_PRICE, HOLIDAY_OFFER_ENABLED, HOLIDAY_PRICE, HOLIDAY_SAVINGS } from "@/lib/holiday";

export function WinterSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 64" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M12 53Q45 35 83 12M33 41 27 19M44 35 42 9M55 29 59 6M64 23 76 4M33 41 58 45M44 35 72 36M55 29 84 26M64 23 91 17" />
        <path d="m28 29-9-5m11 11-13-3m25-11-9-8m10 15-12-6m26-5-6-9m16 4-1-9m-15 35 7 9m4-13 10 8m4-15 10 6" opacity=".55" />
      </g>
      <g fill="#963F45"><circle cx="26" cy="47" r="4"/><circle cx="35" cy="50" r="3.5"/><circle cx="31" cy="40" r="3"/></g>
    </svg>
  );
}

export function HolidayStrip() {
  if (!HOLIDAY_OFFER_ENABLED) return null;
  return (
    <Link href="/classes#holiday-offer" className="holiday-strip">
      <span aria-hidden="true">✧</span>
      <span>Our biggest sale of the year: <strong>${HOLIDAY_SAVINGS} off sourdough classes</strong></span>
      <span className="holiday-strip-detail">No code needed</span>
      <span aria-hidden="true">✧</span>
    </Link>
  );
}

export function HolidayTag() {
  if (!HOLIDAY_OFFER_ENABLED) return null;
  return (
    <Link href="/classes#holiday-offer" className="holiday-tag" aria-label={`Holiday special: $${HOLIDAY_SAVINGS} off sourdough classes. View offer.`}>
      <span className="holiday-tag-ribbon" aria-hidden="true" />
      <WinterSprig className="holiday-tag-sprig" />
      <span className="holiday-tag-caption">A little holiday gift</span>
      <span className="holiday-tag-amount">${HOLIDAY_SAVINGS} off</span>
      <span className="holiday-tag-caption">Our biggest sale of the year</span>
    </Link>
  );
}

export function ClassPrice() {
  return HOLIDAY_OFFER_ENABLED ? (
    <span><span className="sr-only">Regularly </span><s className="opacity-60">${CLASS_PRICE}</s>{" "}<span className="sr-only">Holiday price </span><strong>${HOLIDAY_PRICE}</strong> per person</span>
  ) : <span>${CLASS_PRICE} per person</span>;
}

export function HolidayOffer() {
  if (!HOLIDAY_OFFER_ENABLED) return null;
  return (
    <aside id="holiday-offer" className="holiday-offer" aria-labelledby="holiday-heading">
      <div className="holiday-offer-art" aria-hidden="true"><WinterSprig /></div>
      <div className="holiday-offer-copy">
        <p className="holiday-offer-kicker">A holiday treat, from Haylee</p>
        <h2 id="holiday-heading">Our biggest sale of the year.</h2>
        <p>Save ${HOLIDAY_SAVINGS} on your sourdough class this holiday season.</p>
        <p className="holiday-offer-terms">No code needed. Your discount is applied on baking day. For a limited time.</p>
      </div>
      <div className="holiday-offer-price"><ClassPrice /><span>Holiday special</span></div>
    </aside>
  );
}
