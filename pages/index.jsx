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
import { Task } from "../components/Task";
import { useEffect } from 'react';
import clientPromise from '../lib/mongodb';
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { useState } from 'react';
import { useRouter } from 'next/router';


export const getServerSideProps = async ({ req }) =>
{

  const { userId } = await getAuth(req);


  try
  {
    const client = await clientPromise;
    const db = await client.db("calendo-cluster");
    const collection = await db.collection("tasks");

    const userTasksAll = await collection
      .find({
        owner: userId,
      })
      .toArray();


    let propsToReturn = {};

    for (let i = 0; i < userTasksAll.length; i++)
    {
      let cat = userTasksAll[i]['category'];
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
    console.error(e);
    return {
      props: { success: false },
    };
  }
};

const avatars = [
  {
    name: 'Ryan Florence',
    url: 'https://bit.ly/ryan-florence',
  },
  {
    name: 'Segun Adebayo',
    url: 'https://bit.ly/sage-adebayo',
  },
  {
    name: 'Kent Dodds',
    url: 'https://bit.ly/kent-c-dodds',
  },
  {
    name: 'Prosper Otemuyiwa',
    url: 'https://bit.ly/prosper-baba',
  },
  {
    name: 'Christian Nwamba',
    url: 'https://bit.ly/code-beast',
  },
];


export default function Home({
  groupedTasks
})
{
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn)
  {
    return null;
  }
  const { userId, sessionId, getToken } = useAuth();


  const [newTask, setNewTask] = useState("");
  const [newCat, setNewCat] = useState("");
  const toast = useToast();
  const router = useRouter();


  const { isOpen: task_isOpen, onOpen: task_onOpen, onClose: task_onClose } = useDisclosure();

  const handleAddTask = async () =>
  {
    if (newTask == "")
    {
      alert("can't add null task");
      return;
    }

    const resp = await fetch('/api/addTask', {
      method: "POST",
      body: JSON.stringify({
        name: newTask,
        due: new Date(), // should be new Date()
        created_by: "SELF",
        owner: userId, // this would be a UUID that matches w/clerk
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
      router.push("/");

      setNewCat("");
      setNewTask("");
    }


  };

  return (
    <>
      <Container maxW='container.xl'>
        <Flex mt={4} justifyContent='space-between'>
          <Img src="/calendo_logo.png" />
          <UserButton afterSignOutUrl="/" />

        </Flex>

        <SimpleGrid h='90vh' columns={{ base: 1, md: 2 }} spacing={8} >

          <Box border=''>
            <Stack direction={'row'} spacing={4} align={'center'} mt={16}>
              {/* <AvatarGroup>
                {avatars.map((avatar) => (
                  <Avatar
                    key={avatar.name}
                    name={avatar.name}
                    src={avatar.url}
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    size={useBreakpointValue({ base: 'md', md: 'lg' })}
                    position={'relative'}
                    zIndex={2}
                    _before={{
                      content: '""',
                      width: 'full',
                      height: 'full',
                      rounded: 'full',
                      transform: 'scale(1.125)',
                      bgGradient: 'linear(to-bl, blue.400,green.400)',
                      position: 'absolute',
                      zIndex: -1,
                      top: 0,
                      left: 0,
                    }}
                  />
                ))}
              </AvatarGroup> */}
              <Heading fontWeight="black" textAlign="center" size="2xl" my={4}>
                Welcome back,{" "}
                <Text as="span" color="blue.600">
                  {user.firstName}
                </Text>
                .
              </Heading>
            </Stack>

            <Box h='400px' shadow='xl' rounded='md' border='' mt={16} bg='white'>
              <iframe src="https://calendar.google.com/calendar/embed?src=6c1e5e92ead40842acd5723e743c093b3b197663095df5a2f0f0eaac01f2b5e2%40group.calendar.google.com&ctz=America%2FNew_York" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
            </Box>

          </Box>

          <Box border='' alignSelf='center'>

            <Accordion defaultIndex={[...Array(Object.keys(groupedTasks).length).keys()]} allowMultiple mt={8}>
              {
                Object.keys(groupedTasks).map((category, i) =>
                {
                  return (
                    <AccordionItem key={i + "l"}>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex='1' textAlign='left'>
                            <Heading>{category}</Heading>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Stack spacing={1}>
                          {
                            groupedTasks[category].map((task, index) =>
                            {
                              return (
                                <Task
                                  key={index}
                                  _id={task._id}
                                  name={task.name}
                                  created_by={task.created_by}
                                  owner={task.owner}
                                  completed={task.completed}
                                  category={task.category}
                                  priority={task.priority}
                                />
                              );
                            })
                          }
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })
              }
            </Accordion>


            <HStack spacing={4}>
              <Button
                mt={4}
                colorScheme='blue'
                onClick={task_onOpen}
              >
                New Task
              </Button>
            </HStack>
          </Box>

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





        </SimpleGrid>

      </Container>
    </>
  );
}
