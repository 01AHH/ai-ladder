"use client";

import { useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { EditorialPage } from "@/components/EditorialPage";
import { InterfacePage } from "@/components/interface/InterfacePage";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [context, setContext] = useState("");
  const [activeScene, setActiveScene] = useState("hero");

  if (theme === "dark") {
    return (
      <InterfacePage
        theme={theme}
        setTheme={setTheme}
        context={context}
        setContext={setContext}
      />
    );
  }
  return (
    <EditorialPage
      theme={theme}
      setTheme={setTheme}
      context={context}
      setContext={setContext}
      activeScene={activeScene}
      setActiveScene={setActiveScene}
    />
  );
}
