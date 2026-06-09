import { useState } from "react";

export function useEarningsCalculator() {
  const [directs, setDirects] = useState(3);
  const [multiplication, setMultiplication] = useState(3);
  const [generations, setGenerations] = useState(3);
  const [avgTicket, setAvgTicket] = useState(300);

  // Network math
  let totalNetworkSize = 0;
  let estimatedMonthlyIncome = 0;

  for (let g = 1; g <= generations; g++) {
    const generationCount = directs * Math.pow(multiplication, g - 1);
    totalNetworkSize += generationCount;
    
    // Average passive residual unilevel commission payout per generation active: 4% of avgTicket
    const unilevelPayout = avgTicket * 0.04;
    estimatedMonthlyIncome += generationCount * unilevelPayout;
  }

  return {
    directs,
    setDirects,
    multiplication,
    setMultiplication,
    generations,
    setGenerations,
    avgTicket,
    setAvgTicket,
    totalNetworkSize,
    estimatedMonthlyIncome,
  };
}
