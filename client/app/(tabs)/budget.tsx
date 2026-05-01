import React, { useMemo, useState, useCallback } from "react";
import { useRefresh } from "@/hooks/useRefresh";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useBudgets,
  useTheme,
  useBudgetStatus,
  useCalendar,
  useTransactions,
  useUser,
} from "@/hooks/useRedux";
import { useAppDispatch } from "@/store";
import { fetchBudgets } from "@/store/slices/budgetSlice";
import {
  BudgetCard,
  BudgetModal,
  EmptyBudgetState,
  NewBudgetButton,
  BudgetOverviewHeader,
} from "@/components/budget";
import { useBudgetOperations } from "@/hooks/budget/useBudgetOperation";
import type { IBudget } from "@/types/budget/types";
import { BudgetSkeleton } from "@/components/skeleton/SkeletonLoader";
import SearchBar from "@/components/global/SearchBar";
import { useBudgetDisplayAmounts } from "@/hooks/budget/useBudgetDisplayAmounts";

// ─── Main Screen Component ──────────────────────────────────────────────────

export default function BudgetScreen() {
  // ── Redux selectors ─────────────────────────────────────────────────────
  const budgets = useBudgets();
  const transactions = useTransactions();
  const user = useUser();
  const activeCurrency = user?.currency || "USD";
  const { THEME } = useTheme();
  const { isLoading } = useBudgetStatus();
  const calendar = useCalendar();
  const dispatch = useAppDispatch();
  const { displayBudgets } = useBudgetDisplayAmounts(
    budgets,
    transactions,
    activeCurrency,
  );

  // Only the delete handler is needed at screen level;
  // create + update are fully managed inside BudgetModal.
  const { handleDeleteBudget } = useBudgetOperations();

  // ── Screen-level state ────────────────────────────────────────────────
  const [openSheet, setOpenSheet] = useState(false);
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;

  /** Show skeleton only for true initial load, not while searching. */
  const isInitialLoading = isLoading && budgets.length === 0 && !isSearching;

  // Use generic refresh hook
  const { refreshing, onRefresh } = useRefresh(() =>
    dispatch(
      fetchBudgets({
        currentMonth: calendar.month,
        currentYear: calendar.year,
      }),
    ),
  );

  // ── Stable callbacks ──────────────────────────────────────────────────

  /** Open the modal in edit mode for the given budget. */
  const handleEditPress = useCallback((budget: IBudget) => {
    setEditingBudget(budget);
    setOpenSheet(true);
  }, []);

  /** Clear editing state when the modal closes. */
  const handleModalClose = useCallback(() => {
    setOpenSheet(false);
    setEditingBudget(null);
  }, []);

  /** Open the modal in create mode. */
  const handleNewBudget = useCallback(() => {
    setOpenSheet(true);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────

  /** Budgets filtered by the search query (category name match). */
  const filteredBudgets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return displayBudgets;
    return displayBudgets.filter((b) =>
      (b.category ?? "").toLowerCase().includes(q),
    );
  }, [displayBudgets, searchQuery]);

  const hasBudgets = budgets && budgets.length > 0;

  // Show skeleton loader during initial data fetch
  // if (isInitialLoading) {
  //   return (
  //     <SafeAreaView
  //       edges={["left", "right"]}
  //       className="flex-1"
  //       style={{ backgroundColor: THEME.background }}
  //     >
  //       <BudgetSkeleton />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1"
      style={{ backgroundColor: THEME.background }}
    >
      <View className="px-4" style={{ paddingTop: 18 }}>
        {/* Header */}
        <View style={{ marginBottom: 12 }}>
          <Text
            className="text-2xl text-center font-bold mb-2"
            style={{ color: THEME.textPrimary }}
          >
            Budgets
          </Text>
        </View>

        {/* Search / filter bar */}
        {hasBudgets && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search budgets..."
          />
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isSearching ? false : refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={THEME.background}
            colors={[THEME.primary]}
          />
        }
      >
        {/* Budget overview header */}
        {/*<BudgetOverviewHeader />*/}
        {/* Budget cards or empty state */}
        {hasBudgets ? (
          filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                displayLimit={Number(
                  (budget as any).displayLimit ?? budget.limit,
                )}
                displaySpent={Number(
                  (budget as any).displaySpent ?? budget.spent,
                )}
                currencyCode={(budget as any).displayCurrency || activeCurrency}
                onEdit={handleEditPress}
                onDelete={handleDeleteBudget}
                surface={THEME.surface}
                border={THEME.border}
                background={THEME.background}
                primary={THEME.primary}
                secondary={THEME.secondary}
                textPrimary={THEME.textPrimary}
                textSecondary={THEME.textSecondary}
                danger={THEME.danger}
              />
            ))
          ) : (
            <View className="py-12 items-center">
              <Text style={{ color: THEME.textSecondary }}>
                No budgets match "{searchQuery}"
              </Text>
            </View>
          )
        ) : (
          <EmptyBudgetState
            primary={THEME.primary}
            secondary={THEME.secondary}
            textPrimary={THEME.textPrimary}
            textSecondary={THEME.textSecondary}
          />
        )}
      </ScrollView>

      {/* Floating action button */}
      <NewBudgetButton
        onPress={handleNewBudget}
        primary={THEME.primary}
        secondary={THEME.secondary}
        textPrimary={THEME.textPrimary}
      />

      {/* Create / Edit modal — self-contained via useBudgetOperations */}
      <BudgetModal
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        editingBudget={editingBudget}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}
