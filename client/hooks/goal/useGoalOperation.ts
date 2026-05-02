import {useCallback} from "react";
import {useGoalForm} from "@/hooks/goal/useGoalForm";
import {createGoal, deleteGoal, updateGoal} from "@/store/slices/goalSlice";
import {useThemedAlert} from "@/utils/themedAlert";
import {useAppDispatch, useCalendar} from "@/hooks/useRedux";
import {IGoal} from "@/types/goal/types";
import {hapticSuccess} from "@/utils/haptics";
import {removeGoalAllocationsForGoalFromCache} from "@/utils/cache";
import {fetchTransaction, removeGoalAllocationSpent} from "@/store/slices/transactionSlice";
import {PAGINATION_LIMIT} from "@/constants/appConfig";


export const useGoalOperation = () => {
    const form = useGoalForm();
    const {goalName, setGoalName, goalIcon, setGoalIcon, goalTarget, setGoalTarget} = form;
    const {showAlert} = useThemedAlert();
    const calendar = useCalendar();
    const dispatch = useAppDispatch();

    const goalValidation = (): number | undefined => {
        const target = Number(goalTarget);

        if (!goalName.trim()) {
            showAlert({ title: "Goal name is required" });
            return;
        }

        if (!target || target <= 0) {
            showAlert({ title: "Goal target must be a positive number" });
            return;
        }

        return target;
    }

    const handleCreateGoal = useCallback(
        async (handleGoalModalClose: () => void) => {
            const target = goalValidation();

            if (typeof target != 'number') return;


                const result = await dispatch(
                    createGoal({ name: goalName.trim(), target, icon: goalIcon || null }),
                );
                if (createGoal.rejected.match(result)) {
                    showAlert({
                        title: "Creation failed",
                        message: String(result.payload || "Could not create goal"),
                    });
                    return;
                } else {
                    hapticSuccess();
                }


            handleGoalModalClose();
        }, [
            dispatch,
            goalIcon,
            goalName,
            goalTarget,
            showAlert,
        ]
    )

    const handleUpdateGoal = useCallback(
        async (editingGoal: IGoal, handleGoalModalClose: () => void) => {
            const target = goalValidation();
            if (typeof target != 'number') return;

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
            } else {
                hapticSuccess();
            }
                handleGoalModalClose();
        }, [
            dispatch,
            goalIcon,
            goalName,
            showAlert,
        ]
    )

    const handleDeleteGoal = useCallback(
        async (goal: IGoal) => {
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

                            hapticSuccess();

                            const removedCurrentMonthAmount =
                                await removeGoalAllocationsForGoalFromCache(
                                    goal.id,
                                    calendar.year,
                                    calendar.month,
                                );

                            if (removedCurrentMonthAmount > 0) {
                                dispatch(removeGoalAllocationSpent(removedCurrentMonthAmount));
                            }

                            const response = await dispatch(
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
        }, [calendar.month, calendar.year, dispatch, showAlert]
    )

    return {
        ...form,
        handleCreateGoal,
        handleUpdateGoal,
        handleDeleteGoal,
    };
};

export default useGoalOperation;