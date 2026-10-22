import React, { useCallback, useMemo, useState } from 'react';

import { q } from '@actual-app/core/shared/query';
import { isPreviewId } from '@actual-app/core/shared/transactions';
import type { IntegerAmount } from '@actual-app/core/shared/util';
import type {
  CategoryEntity,
  TransactionEntity,
} from '@actual-app/core/types/models';

import { TransactionListWithBalances } from '#components/mobile/transactions/TransactionListWithBalances';
import { SchedulesProvider } from '#hooks/useCachedSchedules';
import { useCategoryPreviewTransactions } from '#hooks/useCategoryPreviewTransactions';
import { useDateFormat } from '#hooks/useDateFormat';
import { useNavigate } from '#hooks/useNavigate';
import { useQuery } from '#hooks/useQuery';
import { useTransactions } from '#hooks/useTransactions';
import { useTransactionsSearch } from '#hooks/useTransactionsSearch';
import * as bindings from '#spreadsheet/bindings';

type CategoryTransactionsProps = {
  category: CategoryEntity;
  month: string;
  isAllTime: boolean;
};

export function CategoryTransactions({
  category,
  month,
  isAllTime,
}: CategoryTransactionsProps) {
  const schedulesQuery = useMemo(() => q('schedules').select('*'), []);

  return (
    <SchedulesProvider query={schedulesQuery}>
      <TransactionListWithPreviews
        category={category}
        month={month}
        isAllTime={isAllTime}
      />
    </SchedulesProvider>
  );
}

type TransactionListWithPreviewsProps = {
  category: CategoryEntity;
  month: string;
  isAllTime: boolean;
};

function TransactionListWithPreviews({
  category,
  month,
  isAllTime,
}: TransactionListWithPreviewsProps) {
  const navigate = useNavigate();

  const baseTransactionsQuery = useCallback(
    () =>
      q('transactions')
        .options({ splits: 'inline' })
        .filter(
          isAllTime
            ? { category: category.id }
            : getCategoryMonthFilter(category, month),
        )
        .select('*'),
    [category, isAllTime, month],
  );

  const [transactionsQuery, setTransactionsQuery] = useState(
    baseTransactionsQuery(),
  );
  const {
    transactions,
    isPending: isTransactionsLoading,
    isFetchingNextPage: isLoadingMoreTransactions,
    fetchNextPage: fetchMoreTransactions,
  } = useTransactions({
    query: transactionsQuery,
  });

  const dateFormat = useDateFormat() || 'MM/dd/yyyy';

  const { isSearching, search: onSearch } = useTransactionsSearch({
    updateQuery: setTransactionsQuery,
    resetQuery: () => setTransactionsQuery(baseTransactionsQuery()),
    dateFormat,
  });

  const onOpenTransaction = useCallback(
    (transaction: TransactionEntity) => {
      // details of how the native app used to handle preview transactions here can be found at commit 05e58279
      if (!isPreviewId(transaction.id)) {
        void navigate(`/transactions/${transaction.id}`);
      }
    },
    [navigate],
  );

  const balance = !isAllTime
    ? bindings.categoryBalance(category.id, month)
    : undefined;
  const balanceCleared = !isAllTime
    ? bindings.categoryBalanceCleared(category.id, month)
    : undefined;
  const balanceUncleared = !isAllTime
    ? bindings.categoryBalanceUncleared(category.id, month)
    : undefined;

  const { data: allTimeTotal } = useQuery<{ amount: IntegerAmount | null }>(
    () =>
      isAllTime
        ? q('transactions')
            .options({ splits: 'inline' })
            .filter({ category: category.id })
            .select([{ amount: { $sum: '$amount' } }])
        : null,
    [category.id, isAllTime],
  );

  const { previewTransactions, isLoading: isPreviewTransactionsLoading } =
    useCategoryPreviewTransactions({
      categoryId: category.id,
      month,
    });

  const transactionsToDisplay =
    !isSearching && !isAllTime
      ? previewTransactions.concat(transactions)
      : transactions;

  return (
    <TransactionListWithBalances
      isLoading={
        isSearching
          ? isTransactionsLoading
          : isTransactionsLoading ||
            (!isAllTime && isPreviewTransactionsLoading)
      }
      transactions={transactionsToDisplay}
      balance={balance}
      balanceAmount={
        isAllTime && allTimeTotal !== null
          ? (allTimeTotal?.[0]?.amount ?? 0)
          : undefined
      }
      balanceCleared={balanceCleared}
      balanceUncleared={balanceUncleared}
      searchPlaceholder={`Search ${category.name}`}
      onSearch={onSearch}
      isLoadingMore={isLoadingMoreTransactions}
      onLoadMore={fetchMoreTransactions}
      onOpenTransaction={onOpenTransaction}
    />
  );
}

function getCategoryMonthFilter(category: CategoryEntity, month: string) {
  return {
    category: category.id,
    date: { $transform: '$month', $eq: month },
  };
}
