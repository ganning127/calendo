import { useState } from "react";
import { Checkbox } from "@chakra-ui/react";
export const Task = ({ _id, name, due, owner, completed, priority }) =>
{
    const [ncompleted, setNCompleted] = useState(completed);
    const handleStatusChange = async (e) =>
    {
        setNCompleted(e.target.checked);
        console.log("setting ot be ", e.target.checked);
        const resp = await fetch('/api/changeStatus', {
            method: "POST",
            body: JSON.stringify({
                _id: _id,
                completed: e.target.checked
            })
        });

        const data = await resp.json();
        if (data.success)
        {
            setNCompleted(e.target.checked);
        }
    };


    return <Checkbox onChange={handleStatusChange} isChecked={ncompleted} textDecoration={ncompleted ? "line-through" : ""} color={ncompleted ? "blue.400" : "black"}>{name}</Checkbox>;
};