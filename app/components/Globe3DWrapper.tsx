// Import necessary hooks for 3D rendering
import React from "react";
import dynamic from "next/dynamic";

// Import breach location type definition
interface BreachLocation {
  location: string;
  count: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

interface Globe3DProps {
  breachLocations: BreachLocation[];
}

// Import the actual Globe3D component dynamically with no SSR
const DynamicGlobe3D = dynamic(() => import('./Globe3D'), { ssr: false });

// Wrapper component that passes props correctly
const Globe3DWrapper: React.FC<Globe3DProps> = ({ breachLocations }) => {
  // Convert breach locations to the format needed by the Globe3D component
  const locationData = React.useMemo(() => {
    return breachLocations.map(breach => ({
      name: breach.location,
      value: breach.count,
      severity: breach.severity,
      timestamp: breach.timestamp
    }));
  }, [breachLocations]);

  return <DynamicGlobe3D locations={locationData} />;
};

export default Globe3DWrapper;
