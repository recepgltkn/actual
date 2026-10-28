import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { FinancialText } from '#components/FinancialText';
import { useCategories } from '#hooks/useCategories';
import { useFormat } from '#hooks/useFormat';

export type CategoryTotal = {
  categoryId: string | null;
  amount: number;
};

type CategoryDistributionGraphProps = {
  categoryTotals: CategoryTotal[];
};

const MAX_ROWS = 4;

export function CategoryDistributionGraph({
  categoryTotals,
}: CategoryDistributionGraphProps) {
  const { t } = useTranslation();
  const format = useFormat();
  const { data: categories } = useCategories();

  const rows = useMemo(() => {
    const names = new Map(
      categories?.list.map(category => [category.id, category.name]),
    );
    const sorted = categoryTotals
      .filter(row => row.amount < 0)
      .map(row => ({
        id: row.categoryId ?? 'uncategorized',
        name: row.categoryId
          ? (names.get(row.categoryId) ?? t('Uncategorized'))
          : t('Uncategorized'),
        amount: Math.abs(row.amount),
      }))
      .sort((left, right) => right.amount - left.amount);

    const visible = sorted.slice(0, MAX_ROWS);
    const otherAmount = sorted
      .slice(MAX_ROWS)
      .reduce((total, row) => total + row.amount, 0);

    if (otherAmount > 0) {
      visible.push({ id: 'other', name: t('Other'), amount: otherAmount });
    }

    return visible;
  }, [categories?.list, categoryTotals, t]);

  const maxAmount = Math.max(...rows.map(row => row.amount), 0);

  return (
    <View
      aria-label={t('Spending by category')}
      style={{
        boxSizing: 'border-box',
        height: 'calc(5vh + 5vw)',
        justifyContent: 'center',
        padding: '8px 14px',
        overflow: 'hidden',
      }}
    >
      <Text
        style={{
          color: theme.tableHeaderText,
          fontSize: 11,
          marginBottom: 3,
        }}
      >
        <Trans>Spending by category</Trans>
      </Text>
      {rows.length > 0 ? (
        rows.map(row => (
          <View
            key={row.id}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
              height: 16,
            }}
          >
            <Text
              style={{
                color: theme.pageText,
                flex: '0 1 150px',
                fontSize: 11,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={row.name}
            >
              {row.name}
            </Text>
            <View
              aria-hidden="true"
              style={{
                backgroundColor: theme.tableBorder,
                borderRadius: 3,
                flex: 1,
                height: 6,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  backgroundColor: theme.pageTextPositive,
                  borderRadius: 3,
                  height: '100%',
                  width: `${(row.amount / maxAmount) * 100}%`,
                }}
              />
            </View>
            <FinancialText
              style={{
                ...styles.tnum,
                fontSize: 11,
                minWidth: 82,
                textAlign: 'right',
              }}
            >
              {format(row.amount, 'financial')}
            </FinancialText>
          </View>
        ))
      ) : (
        <Text style={{ color: theme.pageTextSubdued, fontSize: 12 }}>
          <Trans>No spending in the current filters</Trans>
        </Text>
      )}
    </View>
  );
}
