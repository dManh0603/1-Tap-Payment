import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../../helpers/ChatHelper';
import { ChatState } from '../../contexts/ChatProvider';
import { UserState } from '../../contexts/UserProvider';

const ChatList = ({ fetchAgain }) => {
  const { user } = UserState();
  const [loggedUser, setLoggedUser] = useState();
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const storedToken = localStorage.getItem('userToken');
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        };
        const { data } = await axios.get('/api/chat', config);
        setChats(data);

      } catch (error) {
        console.log(error);
        toast({
          title: 'Error retrieving your chats',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
      }
    };

    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <Box
      flexDir="column"
      alignItems="center"
      bg="white"
      w={'100%'}
    >
      <Box
        fontSize={'30px'}
        fontFamily="Work sans"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats.length > 0
          ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  p={3}
                  borderRadius="lg"
                >
                  <Text fontSize={'lg'}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          )
          : (
            // <ChatLoading />
            <div>
              You have no chats.
            </div>
          )}
      </Box>
    </Box>
  );
};

export default ChatList;
