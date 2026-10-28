import { theme } from '@actual-app/components/theme';
import type {
  balanceTypeOpType,
  GroupedEntity,
  IntervalEntity,
  LegendEntity,
} from '@actual-app/core/types/models';

import { getColorScale } from '#components/reports/chart-theme';

export function calculateLegend(
  intervalData: IntervalEntity[],
  calcDataFiltered: GroupedEntity[],
  groupBy: string,
  graphType?: string,
  balanceTypeOp?: balanceTypeOpType,
): LegendEntity[] {
  const colorScale = getColorScale('qualitative');

  function getStableColor(id: string | null | undefined, index: number) {
    if (!id) {
      return colorScale[index % colorScale.length];
    }

    // Keep an entity's color stable when its rank changes between reports.
    let hash = 2166136261;
    for (let i = 0; i < id.length; i++) {
      hash ^= id.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return colorScale[(hash >>> 0) % colorScale.length];
  }

  const chooseData =
    groupBy === 'Interval'
      ? intervalData.map(c => {
          return { name: c.date, id: null, data: c };
        })
      : calcDataFiltered.map(c => {
          return { name: c.name, id: c.id, data: c };
        });

  function getColor(
    data: IntervalEntity | GroupedEntity,
    index: number,
    id: string | null | undefined,
  ) {
    if (graphType === 'DonutGraph') {
      return getStableColor(id, index);
    }

    if (groupBy === 'Interval') {
      if (balanceTypeOp === 'totalDebts') {
        return theme.reportsNumberNegative;
      }

      if (balanceTypeOp === 'netDebts') {
        return theme.reportsNumberNegative;
      }

      if (
        balanceTypeOp === 'totalTotals' ||
        balanceTypeOp === 'totalBudgeted'
      ) {
        const total =
          balanceTypeOp === 'totalBudgeted'
            ? data.totalBudgeted
            : data.totalTotals;

        if (total < 0) {
          return theme.reportsNumberNegative;
        }

        return theme.reportsNumberPositive;
      }

      if (balanceTypeOp === 'totalAssets' || balanceTypeOp === 'netAssets') {
        return theme.reportsNumberPositive;
      }

      return theme.reportsChartFill;
    }

    return getStableColor(id, index);
  }

  const legend: LegendEntity[] = chooseData.map((item, index) => {
    return {
      id: item.id || '',
      name: item.name || '',
      color: getColor(item.data, index, item.id || item.name),
      dataKey: item.id || item.name || '', // Use id for unique data lookup
      uncategorizedId:
        'uncategorizedId' in item.data ? item.data.uncategorizedId : undefined,
      bucketTagNames:
        'bucketTagNames' in item.data ? item.data.bucketTagNames : undefined,
    };
  });
  return legend;
}
