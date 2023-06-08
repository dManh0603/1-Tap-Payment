import React, { useState } from 'react'
import { UserState } from '../contexts/UserProvider'
import MyChats from '../components/chat/MyChats'
import ChatBox from '../components/chat/ChatBox'
import { Box } from '@chakra-ui/react'

const Chatpage = () => {
  const { user } = UserState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>

        <Box
          display={'flex'}
          justifyContent={'space-between'}
          w={'100%'}
          p={'0 10px 10px 10px'}
          h={'91.5vh'}
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>

    </>
  )
}

export default Chatpage