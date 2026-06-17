import type { Metadata } from "next";
import ClassCardsPlayground from "@/components/playground/ClassCardsPlayground";

export const metadata: Metadata = {
  title: "Class Card Styles | Naturally Leavened",
  description:
    "A style lab for the upcoming-class booking cards — ten treatments to choose from.",
};

export default function ClassCardsPage() {
  return <ClassCardsPlayground />;
}
