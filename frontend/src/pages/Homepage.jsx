import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Image } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import ForgetPassword from '../components/authentication/ForgetPassword'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem('userToken'));

    if (userToken) navigate('/me');

  })


  return (
    <Container maxW='xl' centerContent>
      <Box mt={'2'} w='100%'>
        <Image src='/banner-yersin.jpg' />
      </Box>
      <Box
        d={'flex'}
        justifyContent={'center'}
        p={3}
        bg={'white'}
        w={'100%'}
        m={'12px 0 16px 0'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <Text fontSize={'4xl'} fontFamily={'Work sans'} textAlign={'center'}>
          NEU 1-Tap Parking Payment
        </Text>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={'3'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <TabList mb={'1em'}>
            <Tab w={'50%'}>Login</Tab>
            <Tab w={'50%'}>Forgot password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <ForgetPassword />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage