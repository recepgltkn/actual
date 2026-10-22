import React, { Fragment } from 'react';
import { Trans } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';

import { Button } from '@actual-app/components/button';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { MobileBackButton } from '#components/mobile/MobileBackButton';
import { AddTransactionButton } from '#components/mobile/transactions/AddTransactionButton';
import { MobilePageHeader, Page } from '#components/Page';
import { useCategory } from '#hooks/useCategory';
import { useLocale } from '#hooks/useLocale';
import { useSyncedPref } from '#hooks/useSyncedPref';

import { CategoryTransactions } from './CategoryTransactions';
import { UncategorizedTransactions } from './UncategorizedTransactions';

export function CategoryPage() {
  const locale = useLocale();
  const [_numberFormat] = useSyncedPref('numberFormat');
  const numberFormat = _numberFormat || 'comma-dot';
  const [hideFraction] = useSyncedPref('hideFraction');

  const { id: categoryIdParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const month = searchParams.get('month') || monthUtils.currentMonth();
  const isAllTime = searchParams.get('range') === 'all';
  const { data: category } = useCategory(categoryIdParam);

  function setRange(range: 'month' | 'all') {
    const next = new URLSearchParams(searchParams);
    if (range === 'all') {
      next.set('range', 'all');
    } else {
      next.delete('range');
    }
    setSearchParams(next);
  }

  return (
    <Page
      header={
        <MobilePageHeader
          title={
            category ? (
              <View>
                <TextOneLine>{category.name}</TextOneLine>
                <TextOneLine>
                  (
                  {isAllTime ? (
                    <Trans>All time</Trans>
                  ) : (
                    monthUtils.format(month, "MMMM ''yy", locale)
                  )}
                  )
                </TextOneLine>
              </View>
            ) : (
              <TextOneLine>
                <Trans>Uncategorized</Trans>
              </TextOneLine>
            )
          }
          leftContent={<MobileBackButton />}
          rightContent={<AddTransactionButton categoryId={category?.id} />}
        />
      }
      padding={0}
    >
      {/* This key forces the whole table rerender when the number format changes */}
      <Fragment key={numberFormat + hideFraction}>
        {category ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: '12px 10px',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 3,
                  gap: 2,
                  borderRadius: 22,
                  backgroundColor: theme.pillBackground,
                }}
              >
                <Button
                  variant={isAllTime ? 'menu' : 'menuSelected'}
                  onPress={() => setRange('month')}
                  style={{ borderRadius: 18, padding: '8px 16px' }}
                  aria-pressed={!isAllTime}
                >
                  {monthUtils.format(month, 'MMM yyyy', locale)}
                </Button>
                <Button
                  variant={isAllTime ? 'menuSelected' : 'menu'}
                  onPress={() => setRange('all')}
                  style={{ borderRadius: 18, padding: '8px 16px' }}
                  aria-pressed={isAllTime}
                >
                  <Trans>All time</Trans>
                </Button>
              </View>
            </View>
            <CategoryTransactions
              key={`${category.id}-${month}-${isAllTime}`}
              category={category}
              month={month}
              isAllTime={isAllTime}
            />
          </>
        ) : (
          <UncategorizedTransactions />
        )}
      </Fragment>
    </Page>
  );
}
