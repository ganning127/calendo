import
{
  Container, Heading, Img, Box, SimpleGrid, Stack, AvatarGroup, Avatar, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, useBreakpointValue, Text, Checkbox, FormControl,
  FormLabel,
  FormErrorMessage,
  Input, Button,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack

} from '@chakra-ui/react';
import Head from 'next/head';
import clientPromise from '../lib/mongodb';

export const getServerSideProps = async () =>
{
  try
  {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e)
  {
    console.error(e);
    return {
      props: { isConnected: false },
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

const sampleTask = {
  name: "Clean up bed",
};

const sampleTasks = [
  sampleTask, sampleTask, sampleTask, sampleTask, sampleTask
];


export default function Home({
  isConnected
})
{


  const { isOpen: task_isOpen, onOpen: task_onOpen, onClose: task_onClose } = useDisclosure();

  const { isOpen: cat_isOpen, onOpen: cat_onOpen, onClose: cat_onClose } = useDisclosure();


  return (
    <>
      <Container maxW='container.xl'>
        <Box mt={4}>
          <Img src="/calendo_logo.png" />
        </Box>

        <SimpleGrid h='90vh' columns={{ base: 1, md: 2 }} spacing={8} >


          <Box border=''>
            <Stack direction={'row'} spacing={4} align={'center'} mt={16}>
              <AvatarGroup>
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
              </AvatarGroup>
            </Stack>

            <Box h='400px' shadow='xl' rounded='md' border='' mt={16} bg='white'>

            </Box>

          </Box>

          <Box border='' alignSelf='center'>




            <Accordion defaultIndex={[0, 1]} allowMultiple mt={8}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      Section 1 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Stack spacing={1}>
                    {
                      sampleTasks.map((task, index) =>
                      {
                        return (
                          <>
                            <Checkbox>{task.name}</Checkbox>
                          </>
                        );
                      })
                    }
                  </Stack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      Section 1 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Stack spacing={1}>
                    {
                      sampleTasks.map((task, index) =>
                      {
                        return (
                          <>
                            <Checkbox>{task.name}</Checkbox>
                          </>
                        );
                      })
                    }
                  </Stack>
                </AccordionPanel>
              </AccordionItem>



              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      Section 1 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Stack spacing={1}>
                    {
                      sampleTasks.map((task, index) =>
                      {
                        return (
                          <>
                            <Checkbox>{task.name}</Checkbox>
                          </>
                        );
                      })
                    }
                  </Stack>
                </AccordionPanel>
              </AccordionItem>



              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      Section 1 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Stack spacing={1}>
                    {
                      sampleTasks.map((task, index) =>
                      {
                        return (
                          <>
                            <Checkbox>{task.name}</Checkbox>
                          </>
                        );
                      })
                    }
                  </Stack>
                </AccordionPanel>
              </AccordionItem>

            </Accordion>

            {/* 
            <FormControl>
              <FormLabel>Add a new task</FormLabel>
              <Input type='email' />
            </FormControl> */}


            <HStack spacing={4}>
              <Button
                mt={4}
                colorScheme='teal'
                onClick={task_onOpen}
              >
                New Task
              </Button>


              <Button
                mt={4}
                colorScheme='teal'
                onClick={cat_onOpen}
              >
                New Group
              </Button>
            </HStack>
          </Box>

          <Modal isOpen={task_isOpen} onClose={task_onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new task</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <Input type='newTask' placeholder='e.g. buy milk from store' />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button variant='ghost'>Cancel</Button>
                <Button colorScheme='teal' mr={3} onClick={task_onClose}>
                  Add
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={cat_isOpen} onClose={cat_onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new category</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <Input type='newTask' placeholder='e.g. Finance' />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button variant='ghost'>Cancel</Button>
                <Button colorScheme='teal' mr={3} onClick={cat_onClose}>
                  Add
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>



        </SimpleGrid>

        <Heading color='blue'>Are we connected? {isConnected ? "yes" : "no"}</Heading>
      </Container>
    </>
  );
}
