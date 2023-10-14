import { useState } from "react";
import { Checkbox, Text, IconButton, Flex } from "@chakra-ui/react";
import { AiOutlineDelete } from 'react-icons/ai';
import { useRouter } from "next/router";

export const Task = ({ _id, name, due, owner, completed, priority }) =>
{
    const router = useRouter();
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

    const handleDelete = async (e) =>
    {
        const resp = await fetch('/api/deleteTask', {
            method: "POST",
            body: JSON.stringify({
                _id: _id,
            })
        });

        const data = await resp.json();
        if (data.success)
        {
            router.push("/admin");
        }
    };


    return (
        <Flex justify='space-between'>
            <Checkbox onChange={handleStatusChange} isChecked={ncompleted} textDecoration={ncompleted ? "line-through" : ""} color={ncompleted ? "blue.400" : "black"}>

                <Text mr={16}>{name} {
                    (new Date(due).toLocaleString() != "Invalid Date") && (
                        <Text as='span'>(Due: {new Date(due).toLocaleString()})</Text>
                    )
                }</Text>
            </Checkbox>

            <IconButton aria-label='Delete' icon={<AiOutlineDelete />} bg='transparent' color='red' _hover={{
                bg: 'red.400',
                color: 'white'
            }} onClick={handleDelete} />

        </Flex>);
};