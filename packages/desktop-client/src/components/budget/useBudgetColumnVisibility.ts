import { useLocalPref } from '#hooks/useLocalPref';

export function useBudgetColumnVisibility() {
  const [showBudgetedPref, setShowBudgeted] = useLocalPref(
    'budget.showBudgeted',
  );
  const [showBalancePref, setShowBalance] = useLocalPref('budget.showBalance');

  return {
    showBudgeted: showBudgetedPref ?? true,
    setShowBudgeted,
    showBalance: showBalancePref ?? true,
    setShowBalance,
  };
}
