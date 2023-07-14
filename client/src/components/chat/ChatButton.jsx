import { ChatIcon, CheckIcon, SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, InputGroup, InputLeftElement, InputRightElement, Skeleton, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox'
import axios from 'axios'
import { ChatState } from '../../contexts/ChatProvider'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import ChatList from './ChatList'
import UserListItem from '../profile/UserListItem'
import ScrollableFeed from 'react-scrollable-feed'

const ChatButton = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const toast = useToast();
  const storedToken = localStorage.getItem('userToken');

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchChat();
    }
  };

  const searchChat = async () => {
    if (!searchValue) {
      toast({
        title: 'Please enter name or email to search',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setSearchLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      const { data } = await axios.get(`/api/user/search/${searchValue}`, config);

      if (data.length === 0) {
        toast({
          title: 'No results found',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-left',
        })
        return;
      }

      setSearchResult(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something wrong. Please try again later!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    } finally {
      setSearchLoading(false);
    }
  }

  const onDrawerClose = () => {
    setSearchValue('')
    setSearchResult([])
    onClose()
  }

  useEffect(() => {
    if (searchValue === '') {
      setSearchResult([])
    }
    return setSearchResult([])
  }, [searchValue])

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>
        <NotificationBadge
          count={notification.length}
          effect={Effect.SCALE}
        />
        <ChatIcon />
      </Button>
      <Drawer placement={'left'} onClose={onDrawerClose} isOpen={isOpen} size={'md'}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Text>Let's have a conversation.</Text>

            <InputGroup mt={3}>
              <InputLeftElement onClick={searchChat}>
                <SearchIcon />
              </InputLeftElement>

              <Input placeholder='Search for friends and more ...' size='md'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <InputRightElement>
                <CheckIcon color='green.500' />
              </InputRightElement>
            </InputGroup>

            {searchLoading
              ? <Stack mt={3}>
                <Skeleton height='50px' />
                <Skeleton height='50px' />
                <Skeleton height='50px' />
                <Skeleton height='50px' />
                <Skeleton height='50px' />
                <Skeleton height='50px' />
              </Stack>
              : <Box mt={3}>
                <ScrollableFeed>
                  {
                    searchResult?.map(u => (
                      <UserListItem
                        mt={2}
                        key={u._id}
                        user={u}
                        handleFunction={() => { setSearchResult([]); accessChat(u._id) }}
                      />
                    ))
                  }
                </ScrollableFeed>
              </Box>

            }
          </DrawerHeader>
          {
            (!searchLoading) && (searchResult.length === 0) &&
            <DrawerBody >
              {selectedChat
                ? <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                : <ChatList fetchAgain={fetchAgain} />
              }
            </DrawerBody>
          }
        </DrawerContent>
      </Drawer></>
  )
}

export default ChatButton