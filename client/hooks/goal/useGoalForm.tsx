import {useState} from "react";


export const useGoalForm = () => {
    const [goalName, setGoalName] = useState("");
    const [goalTarget, setGoalTarget] = useState("");
    const [goalIcon, setGoalIcon] = useState("");

    return {
        goalName,
        setGoalName,
        goalTarget,
        setGoalTarget,
        goalIcon,
        setGoalIcon,
    }
}