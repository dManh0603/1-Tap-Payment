import { Box, Image, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModal';
import { UserState } from '../../contexts/UserProvider';
import DrawerButton from './DrawerButton';

const Banner = () => {

  return (
    <>
      <Box w='100%'>
        <Image src='/banner-yersin.jpg' />
      </Box>
      <Box
        d={'flex'}
        justifyContent={'center'}
        p={3}
        bg={'white'}
        w={'100%'}
        m={'0 0 12px 0'}
        borderWidth={'1px'}
      >
        <Text fontSize={'4xl'} fontFamily={'Work sans'} textAlign={'center'}>
          NEU 1-Tap Parking Payment
        </Text>
        <Box display={'flex'} justifyContent={'end'}>

        <DrawerButton />
          {/* <ProfileModal /> */}
        </Box>
      </Box>
    </>
  )
}

export default Banner