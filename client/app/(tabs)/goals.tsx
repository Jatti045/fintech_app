import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch } from "@/store";
import {
  useAuth,
  useCalendar,
  useGoals,
  useGoalStatus,
  useTheme,
} from "@/hooks/useRedux";
import {
  allocateToGoal,
  createGoal,
  deallocateFromGoal,
  deleteGoal,
  fetchGoals,
  updateGoal,
} from "@/store/slices/goalSlice";
import {
  addGoalAllocationSpent,
  fetchTransaction,
  removeGoalAllocationSpent,
} from "@/store/slices/transactionSlice";
import { PAGINATION_LIMIT } from "@/constants/appConfig";
import {
  addGoalAllocationToCache,
  removeGoalAllocationAmountFromCache,
  removeGoalAllocationsForGoalFromCache,
} from "@/utils/cache";
import type { IGoal } from "@/types/goal/types";
import { useThemedAlert } from "@/utils/themedAlert";
import {
  EmptyGoalState,
  GoalAllocateModal,
  GoalBudgetCard,
  GoalModal,
  NewGoalButton,
  GoalOverviewHeader,
} from "@/components/goal";
import { BudgetSkeleton } from "@/components/skeleton/SkeletonLoader";
import SearchBar from "@/components/global/SearchBar";

export default function GoalsScreen() {
  const dispatch = useAppDispatch();
  const { THEME } = useTheme();
  const { user } = useAuth();
  const { showAlert } = useThemedAlert();
  const goals = useGoals();
  const { isLoading } = useGoalStatus();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openAllocateModal, setOpenAllocateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IGoal | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [allocationMode, setAllocationMode] = useState<
    "allocate" | "deallocate"
  >("allocate");

  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalIcon, setGoalIcon] = useState("");
  const [allocateAmount, setAllocateAmount] = useState("");
  const calendar = useCalendar();
  const isInitialLoading = isLoading && goals.length === 0 && !isSearching;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchGoals({currentMonth: calendar.month, currentYear: calendar.year}));
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const resetGoalForm = useCallback(() => {
    setGoalName("");
    setGoalTarget("");
    setGoalIcon("");
  }, []);

  const openCreateGoal = useCallback(() => {
    setEditingGoal(null);
    resetGoalForm();
    setOpenGoalModal(true);
  }, [resetGoalForm]);

  const openEditGoal = useCallback((goal: IGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.name || "");
    setGoalTarget(String(goal.target || ""));
    setGoalIcon(goal.icon || "");
    setOpenGoalModal(true);
  }, []);

  const handleGoalModalClose = useCallback(() => {
    setOpenGoalModal(false);
    setEditingGoal(null);
    resetGoalForm();
  }, [resetGoalForm]);

  const handleSetGoalModalOpen = useCallback(
    (open: boolean) => {
      if (!open) {
        handleGoalModalClose();
        return;
      }
      setOpenGoalModal(true);
    },
    [handleGoalModalClose],
  );

  const submitGoal = useCallback(async () => {
    const target = Number(goalTarget);

    if (!goalName.trim()) {
      showAlert({ title: "Goal name is required" });
      return;
    }

    if (!target || target <= 0) {
      showAlert({ title: "Goal target must be a positive number" });
      return;
    }

    if (editingGoal) {
      const result = await dispatch(
        updateGoal({
          goalId: editingGoal.id,
          updates: { name: goalName.trim(), target, icon: goalIcon || null },
        }),
      );
      if (updateGoal.rejected.match(result)) {
        showAlert({
          title: "Update failed",
          message: String(result.payload || "Could not update goal"),
        });
        return;
      }
    } else {
      const result = await dispatch(
        createGoal({ name: goalName.trim(), target, icon: goalIcon || null }),
      );
      if (createGoal.rejected.match(result)) {
        showAlert({
          title: "Creation failed",
          message: String(result.payload || "Could not create goal"),
        });
        return;
      }
    }

    handleGoalModalClose();
  }, [
    dispatch,
    editingGoal,
    goalIcon,
    goalName,
    goalTarget,
    handleGoalModalClose,
    showAlert,
  ]);

  const openAllocate = useCallback((goal: IGoal) => {
    setSelectedGoalId(goal.id);
    setAllocateAmount("");
    setAllocationMode("allocate");
    setOpenAllocateModal(true);
  }, []);

  const openDeallocate = useCallback((goal: IGoal) => {
    setSelectedGoalId(goal.id);
    setAllocateAmount("");
    setAllocationMode("deallocate");
    setOpenAllocateModal(true);
  }, []);

  const handleAllocateModalClose = useCallback(() => {
    setOpenAllocateModal(false);
    setSelectedGoalId(null);
    setAllocateAmount("");
  }, []);

  const handleSetAllocateModalOpen = useCallback(
    (open: boolean) => {
      if (!open) {
        handleAllocateModalClose();
        return;
      }
      setOpenAllocateModal(true);
    },
    [handleAllocateModalClose],
  );

  const submitAllocation = useCallback(async () => {
    const amount = Number(allocateAmount);
    if (!selectedGoalId) return;

    if (!amount || amount <= 0) {
      showAlert({ title: "Allocation must be a positive number" });
      return;
    }

    const action =
      allocationMode === "allocate"
        ? allocateToGoal({ goalId: selectedGoalId, amount })
        : deallocateFromGoal({ goalId: selectedGoalId, amount });

    const result = await dispatch(action);
    if (
      allocateToGoal.rejected.match(result) ||
      deallocateFromGoal.rejected.match(result)
    ) {
      showAlert({
        title:
          allocationMode === "allocate"
            ? "Allocation failed"
            : "Withdraw failed",
        message: String(
          result.payload ||
            (allocationMode === "allocate"
              ? "Could not allocate to goal"
              : "Could not withdraw from goal"),
        ),
      });
      return;
    }

    if (allocationMode === "allocate") {
      // Immediate local UI update.
      dispatch(addGoalAllocationSpent(amount));

      // Persist allocation amount for refresh fallback.
      await addGoalAllocationToCache(
        calendar.year,
        calendar.month,
        selectedGoalId,
        amount,
      );
    } else {
      // Immediate local UI update for current month card.
      dispatch(removeGoalAllocationSpent(amount));

      // Best-effort cache correction used by month summary fallback.
      await removeGoalAllocationAmountFromCache(
        calendar.year,
        calendar.month,
        selectedGoalId,
        amount,
      );
    }

    // Refresh monthly transaction summary from server (includes goal allocations).
    await dispatch(
      fetchTransaction({
        searchQuery: "",
        currentMonth: calendar.month,
        currentYear: calendar.year,
        page: 1,
        limit: PAGINATION_LIMIT,
        useCache: false,
      }),
    );

    handleAllocateModalClose();
  }, [
    allocateAmount,
    allocationMode,
    calendar.month,
    calendar.year,
    dispatch,
    handleAllocateModalClose,
    selectedGoalId,
    showAlert,
  ]);

  const confirmDelete = useCallback(
    (goal: IGoal) => {
      showAlert({
        title: "Delete goal",
        message: `Delete "${goal.name}"?`,
        buttons: [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const result = await dispatch(deleteGoal(goal.id));
              if (deleteGoal.rejected.match(result)) {
                showAlert({
                  title: "Delete failed",
                  message: String(result.payload || "Could not delete goal"),
                });
                return;
              }

              const removedCurrentMonthAmount =
                await removeGoalAllocationsForGoalFromCache(
                  goal.id,
                  calendar.year,
                  calendar.month,
                );

              if (removedCurrentMonthAmount > 0) {
                dispatch(removeGoalAllocationSpent(removedCurrentMonthAmount));
              }

              await dispatch(
                fetchTransaction({
                  searchQuery: "",
                  currentMonth: calendar.month,
                  currentYear: calendar.year,
                  page: 1,
                  limit: PAGINATION_LIMIT,
                  useCache: false,
                }),
              );
            },
          },
        ],
      });
    },
    [calendar.month, calendar.year, dispatch, showAlert],
  );

  const filteredGoals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return goals;
    return goals.filter((g) => (g.name ?? "").toLowerCase().includes(q));
  }, [goals, searchQuery]);

  const hasGoals = goals && goals.length > 0;

  if (isInitialLoading) {
    return (
      <SafeAreaView
        edges={["left", "right"]}
        className="flex-1"
        style={{ backgroundColor: THEME.background }}
      >
        <BudgetSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1"
      style={{ backgroundColor: THEME.background }}
    >
      <View className="px-4" style={{ paddingTop: 18 }}>
        <View style={{ marginBottom: 12 }}>
          <Text
            className="text-2xl text-center font-bold mb-2"
            style={{ color: THEME.textPrimary }}
          >
            Goals
          </Text>
        </View>

        {hasGoals && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search goals..."
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
        {/* Goal overview header */}
        <GoalOverviewHeader />
        {hasGoals ? (
          filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => (
              <GoalBudgetCard
                key={goal.id}
                goal={goal}
                currency={user?.currency || "USD"}
                onEdit={openEditGoal}
                onDelete={confirmDelete}
                onAllocate={openAllocate}
                onDeallocate={openDeallocate}
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
                No goals match "{searchQuery}"
              </Text>
            </View>
          )
        ) : (
          <EmptyGoalState
            primary={THEME.primary}
            secondary={THEME.secondary}
            textPrimary={THEME.textPrimary}
            textSecondary={THEME.textSecondary}
          />
        )}
      </ScrollView>

      <NewGoalButton
        onPress={openCreateGoal}
        primary={THEME.primary}
        secondary={THEME.secondary}
        textPrimary={THEME.textPrimary}
      />

      <GoalModal
        openSheet={openGoalModal}
        setOpenSheet={handleSetGoalModalOpen}
        editingGoal={editingGoal}
        goalName={goalName}
        setGoalName={setGoalName}
        goalTarget={goalTarget}
        setGoalTarget={setGoalTarget}
        goalIcon={goalIcon}
        setGoalIcon={setGoalIcon}
        onSubmit={submitGoal}
        saving={isLoading}
      />

      <GoalAllocateModal
        openSheet={openAllocateModal}
        setOpenSheet={handleSetAllocateModalOpen}
        allocateAmount={allocateAmount}
        setAllocateAmount={setAllocateAmount}
        mode={allocationMode}
        onSubmit={submitAllocation}
        saving={isLoading}
      />
    </SafeAreaView>
  );
}
