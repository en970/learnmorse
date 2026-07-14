"use client";

import { SettingsProvider } from "@/lib/settings/SettingsContext";
import { TeachingScreen } from "@/components/TeachingScreen";

export default function Home() {
  return (
    <SettingsProvider>
      <TeachingScreen />
    </SettingsProvider>
  );
}
