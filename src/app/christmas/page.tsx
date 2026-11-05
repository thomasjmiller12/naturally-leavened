import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChristmasBakery from "@/components/seasonal/christmas/ChristmasBakery";
import { CHRISTMAS_BAKERY_ENABLED } from "@/lib/christmas";
import styles from "@/components/seasonal/christmas/ChristmasBakery.module.css";

export const metadata: Metadata = {
  title: "The Little Christmas Bakery | Naturally Leavened",
  description: "A tiny handmade Christmas bakery with warm bread, snowy trees and a mischievous snowman.",
};

export default function ChristmasPage() {
  if (!CHRISTMAS_BAKERY_ENABLED) notFound();
  return (
    <div className={styles.fullPage}>
      <div className={styles.fullInner}>
        <Link href="/" className={styles.backLink}>Naturally Leavened</Link>
        <h1 className={styles.screenReader}>The little Christmas bakery</h1>
        <ChristmasBakery />
      </div>
    </div>
  );
}
