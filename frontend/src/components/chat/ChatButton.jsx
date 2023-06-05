import { ChatIcon } from '@chakra-ui/icons'
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import ChatBox from './ChatBox'
import axios from 'axios'
import { UserState } from '../../contexts/UserProvider'
import { ChatState } from '../../contexts/ChatProvider'

const ChatButton = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const { user } = UserState()

  const toast = useToast();
  const storedToken = localStorage.getItem('userToken');

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      };
      console.log('access chat')

      const { data } = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      console.log('retrieved chat data', data);
      setSelectedChat(data);
      setLoading(false);
      
    } catch (error) {
      console.error(error);
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

  return (
    <>
      <Button colorScheme='blue' onClick={() => {
        onOpen();
        accessChat('6475d74a202e98a518cbca9b');
      }}>
        <ChatIcon />
      </Button>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Contact admin</DrawerHeader>
          <DrawerBody >
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </DrawerBody>
        </DrawerContent>
      </Drawer></>
  )
}

export default ChatButton