import
{
    Container, Heading, Img, Box, SimpleGrid, Stack, AvatarGroup, Avatar, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, useBreakpointValue, Text, Checkbox, FormControl,
    FormLabel,
    FormErrorMessage,
    Input, Button,
    FormHelperText, Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
    useToast
} from '@chakra-ui/react';
import { Task } from '../components/Task';
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import clientPromise from '../lib/mongodb';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
const parser = require('any-date-parser');


export const getServerSideProps = async ({ req }) =>
{
    try
    {
        const client = await clientPromise;
        const db = await client.db("calendo-cluster");
        const collection = await db.collection("tasks");

        const userTasksAll = await collection
            .find({})
            .toArray();


        let propsToReturn = {};

        for (let i = 0; i < userTasksAll.length; i++)
        {
            let cat = userTasksAll[i]['ownerFullName'];
            if (cat in propsToReturn)
            {
                propsToReturn[cat].push(userTasksAll[i]);
            } else
            {
                propsToReturn[cat] = [userTasksAll[i]];
            }
        }

        propsToReturn = JSON.parse(JSON.stringify(propsToReturn));

        // `await clientPromise` will use the default database passed in the MONGODB_URI
        // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
        //
        // `const client = await clientPromise`
        // `const db = client.db("myDatabase")`
        //
        // Then you can execute queries against your database like so:
        // db.find({}) or any of the MongoDB Node Driver commands

        return {
            props: { groupedTasks: propsToReturn, success: true },
        };

    } catch (e)
    {

    }

};

export default function Admin({ groupedTasks })
{
    console.log(groupedTasks);
    const { isOpen: task_isOpen, onOpen: task_onOpen, onClose: task_onClose } = useDisclosure();
    const [newTask, setNewTask] = useState("");
    const [newCat, setNewCat] = useState("");
    const toast = useToast();
    const router = useRouter();


    const handleAddTask = async () =>
    {
        if (newTask == "")
        {
            alert("can't add null task");
            return;
        }

        const dateregexp = /\b(?:(?:today|tomorrow|(?:mon|tues?|wed(?:nes)|thur?(?:rs)?|fri|sat(?:ur)?|sun)(?:day)?)|(?:\d|\d\d|\d\d\d\d)?[/-]\d\d?(?:[/-](?:\d|\d\d|\d\d\d\d))?)\b/gmi;
        const timeregexp = /(?<![\/-])\b[012]?\d[:h]?(?:\d\d)?(?: ?[ap]m?)?\b(?![\/-])/gm;
        const str = newTask;

        const dateArray = [...str.matchAll(dateregexp)];
        console.log('dateArray', dateArray);
        const timeArray = [...str.matchAll(timeregexp)];
        console.log('timeArray', timeArray);

        let date;
        let time;
        if (dateArray && dateArray.length > 0)
        {
            date = dateArray[dateArray.length - 1][0];
        } else
        {
            date = "today";
        }

        if (timeArray && timeArray.length > 0)
        {
            time = timeArray[timeArray.length - 1][0];
        } else
        {
            time = "12:00";
        }

        console.log(date + " at " + time);

        const dateJSON = parser.attempt(date + ' at ' + time);
        let datetime;
        if (dateJSON.hasOwnProperty('invalid'))
        {
            // could not parse, handle
            // maybe set it for tomorrow or something
            console.log("invalid date encountered");
            datetime = new Date();
        } else
        {
            if (!dateJSON.hasOwnProperty("year"))
            {
                dateJSON.year = new Date().getFullYear();
            }
            if (!dateJSON.hasOwnProperty("month"))
            {
                dateJSON.month = new Date().getMonth() + 1;
            }
            if (!dateJSON.hasOwnProperty("day"))
            {
                dateJSON.day = new Date().getDate();
            }
            if (!dateJSON.hasOwnProperty("hour"))
            {
                dateJSON.hour = new Date().getHours();
            }
            if (!dateJSON.hasOwnProperty("minute"))
            {
                dateJSON.minute = new Date().getMinutes();
            }

            console.log("using parsed");
            datetime = new Date(dateJSON.year, dateJSON.month - 1, dateJSON.day, dateJSON.hour, dateJSON.minute);
        }


        console.log("DATETIME IS: ", datetime);

        const resp = await fetch('/api/addMassTasks', {
            method: "POST",
            body: JSON.stringify({
                name: newTask,
                due: datetime, // should be new Date()
                created_by: "SELF",
                owner: null, // this would be a UUID that matches w/clerk
                ownerFullName: null,
                completed: false, // true/false
                category: newCat != "" ? newCat : "misc",
                priority: 1 // 1 is the highest
            })
        });

        const data = await resp.json();

        if (data.success)
        {
            toast({
                title: `Task: ${newTask} created`,
                description: "We've created your task for you.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            task_onClose();
            router.push("/admin");

            setNewCat("");
            setNewTask("");
        }


    };

    return (
        <>
            <Head>
                <title>Admin</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Container maxW='container.xl'>
                <Flex mt={4} justifyContent='space-between'>
                    <Img src="/calendo_logo.png" />
                    <UserButton afterSignOutUrl="/" />
                </Flex>

                <Button
                    mt={4}
                    colorScheme='blue'
                    onClick={task_onOpen}
                >
                    New Task
                </Button>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {
                        Object.keys(groupedTasks).map((name, index) =>
                        {
                            return (
                                <Box bg='white' p={4} rounded='md' shadow='lg' key={index}>
                                    <Text>{name}</Text>
                                    <Stack spacing={1}>

                                        {
                                            groupedTasks[name].map((task, i) =>
                                            {
                                                return (
                                                    <>
                                                        <Task
                                                            key={i}
                                                            _id={task._id}
                                                            name={task.name}
                                                            created_by={task.created_by}
                                                            owner={task.owner}
                                                            completed={task.completed}
                                                            category={task.category}
                                                            priority={task.priority}
                                                            due={task.due}
                                                        />
                                                    </>
                                                );
                                            })
                                        }
                                    </Stack>
                                </Box>
                            );
                        })
                    }
                </SimpleGrid>



                <Modal isOpen={task_isOpen} onClose={task_onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>new task | calendo</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl>
                                <FormLabel>new task</FormLabel>
                                <Input type='newTask' placeholder='e.g. buy milk from store' onChange={(e) => { setNewTask(e.target.value); }} value={newTask} />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>category</FormLabel>
                                <Input type='newCat' placeholder='e.g. school' onChange={(e) => { setNewCat(e.target.value); }} value={newCat} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant='ghost' onClick={task_onClose}>Cancel</Button>
                            <Button colorScheme='blue' mr={3} onClick={handleAddTask}>
                                Add
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </Container>

        </>);
}