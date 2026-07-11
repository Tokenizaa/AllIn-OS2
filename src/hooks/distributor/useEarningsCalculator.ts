import { useState } from "react";
import { EarningsRules } from "@/services/orders";

export function useEarningsCalculator() {
  const [directs, setDirects] = useState(3);
  const [multiplication, setMultiplication] = useState(3);
  const [generations, setGenerations] = useState(3);
  const [avgTicket, setAvgTicket] = useState(300);

  const totalNetworkSize = EarningsRules.calculateNetworkSize(directs, multiplication, generations);
  const estimatedMonthlyIncome = EarningsRules.calculateMonthlyIncome(directs, multiplication, generations, avgTicket);

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
