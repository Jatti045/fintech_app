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
  fetchGoals,
} from "@/store/slices/goalSlice";
import type { IGoal } from "@/types/goal/types";
import { useThemedAlert } from "@/utils/themedAlert";
import {
  EmptyGoalState,
  GoalAllocateModal,
  GoalBudgetCard,
  GoalModal,
  NewGoalButton,
} from "@/components/goal";
import SearchBar from "@/components/global/SearchBar";
import useGoalOperation from "@/hooks/goal/useGoalOperation";

export default function GoalsScreen() {
  const dispatch = useAppDispatch();
  const { THEME } = useTheme();
  const { user } = useAuth();
  const goals = useGoals();
  const { isLoading } = useGoalStatus();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openAllocateModal, setOpenAllocateModal] = useState(false);
  const [allocationMode, setAllocationMode] = useState<
      "allocate" | "deallocate"
  >("allocate");
  const [editingGoal, setEditingGoal] = useState<IGoal | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const calendar = useCalendar();
  const isSearching = searchQuery.trim().length > 0;

  const {  goalName,
  setGoalName,
  setGoalTarget,
  setGoalIcon,
} = useGoalOperation();


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchGoals({currentMonth: calendar.month, currentYear: calendar.year}));
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const resetGoalForm =() => {
    setGoalName("");
    setGoalTarget("");
    setGoalIcon("");
  };

  const openCreateGoal = () => {
    setEditingGoal(null);
    resetGoalForm();
    setOpenGoalModal(true);
  };

  const openEditGoal =(goal: IGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.name || "");
    setGoalTarget(String(goal.target || ""));
    setGoalIcon(goal.icon || "");
    setOpenGoalModal(true);
  };

  const handleGoalModalClose =() => {
    setOpenGoalModal(false);
    setEditingGoal(null);
    resetGoalForm();
  };

  const handleSetGoalModalOpen =
    (open: boolean) => {
      if (!open) {
        handleGoalModalClose();
        return;
      }
      setOpenGoalModal(true);
    };

  const openAllocate =(goal: IGoal) => {
    setSelectedGoalId(goal.id);
    setOpenAllocateModal(true);
    setAllocationMode("allocate");
  };

  const openDeallocate =(goal: IGoal) => {
    setSelectedGoalId(goal.id);
    setOpenAllocateModal(true);
    setAllocationMode("deallocate");
  };

  const handleAllocateModalClose =() => {
    setOpenAllocateModal(false);
    setSelectedGoalId(null);
  };

  const handleSetAllocateModalOpen =
    (open: boolean) => {
      if (!open) {
        handleAllocateModalClose();
        return;
      }
      setOpenAllocateModal(true);
    };

  const filteredGoals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return goals;
    return goals.filter((g) => (g.name ?? "").toLowerCase().includes(q));
  }, [goals, searchQuery]);

  const hasGoals = goals && goals.length > 0;

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

      <ScrollView className="flex-1 pb-30 px-4 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isSearching ? false : refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={THEME.background}
            colors={[THEME.primary]}
          />
        }
      >
        {/* Display goal cards */}
        {hasGoals ? (
          filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => (
              <GoalBudgetCard
                  key={goal.id}
                goal={goal}
                currency={user?.currency || "USD"}
                onEdit={openEditGoal}
                onAllocate={openAllocate}
                onDeallocate={openDeallocate}
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
          <EmptyGoalState />
        )}
      </ScrollView>

      <NewGoalButton
        onPress={openCreateGoal}
      />

      <GoalModal
        openSheet={openGoalModal}
        setOpenSheet={handleSetGoalModalOpen}
        editingGoal={editingGoal}
        saving={isLoading}
        handleGoalModalClose={handleGoalModalClose}
      />

      <GoalAllocateModal
        openSheet={openAllocateModal}
        setOpenSheet={handleSetAllocateModalOpen}
        goalToAllocate={selectedGoalId}
        mode={allocationMode}
        handleAllocateModalClose={handleAllocateModalClose}
        saving={isLoading}
      />
    </SafeAreaView>
  );
}
