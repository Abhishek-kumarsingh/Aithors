"use client";

import { useEffect } from "react";

/**
 * TaskInitializer component that initializes scheduled tasks when the app starts
 * This component runs once when the application loads and triggers the server-side
 * task initialization via the /api/init-tasks endpoint
 */
export function TaskInitializer() {
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        console.log("Initializing scheduled tasks...");
        
        const response = await fetch("/api/init-tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Scheduled tasks initialized:", data);
        } else {
          console.error("Failed to initialize scheduled tasks:", response.statusText);
        }
      } catch (error) {
        console.error("Error initializing scheduled tasks:", error);
      }
    };

    // Initialize tasks when the component mounts
    initializeTasks();
  }, []); // Empty dependency array means this runs once on mount

  // This component doesn't render anything visible
  return null;
}
