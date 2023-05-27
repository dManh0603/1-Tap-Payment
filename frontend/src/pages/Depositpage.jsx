import { Box, Button, Container, Divider, Image, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaypalButton from '../components/payment/PaypalButton';
import { UserState } from '../contexts/UserProvider';
import { ChevronLeftIcon } from '@chakra-ui/icons'

const Depositpage = () => {

  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = UserState();
  const { amount } = location.state


  useEffect(() => {
    if (!amount > 0 || !user) navigate('/me');

    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  })

  return (
    <>
      {user &&
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
            borderWidth={'1px'}
          >
            <Text fontSize={'4xl'} textAlign={'center'}>
              NEU 1-Tap Parking Payment
            </Text>
            <Box display={'flex'} alignContent={'end'}>
              <Button
                colorScheme='blue'
                rightIcon={<ChevronLeftIcon boxSize={8} fontSize={'2xl'} />}
              >
                Logout
              </Button>
            </Box>
          </Box>
          <Box
            bg={'white'}
            w={'100%'}
            my={'4px'}
            borderRadius={'lg'}
          >
            <Button
              colorScheme='blue'
              leftIcon={<ChevronLeftIcon boxSize={8} fontSize={'2xl'} />}
            >
              Back
            </Button>


          </Box>
          <Box
            bg={'white'}
            w={'100%'}
            p={'3'}
            borderRadius={'lg'}
            borderWidth={'1px'}
          >
            <Box maxW='32rem'>
              <Text fontSize={'2xl'} textAlign={'center'}> {user.name}, you are going to deposit {amount}$ to your balance </Text>
              <Divider mt={'3'} />

              <Text fontSize={'xl'} >Please check again your infomation</Text>
              <Text fontSize={'xl'}>
                Your name: {user.name}
                <br></br>
                Your email: {user.email}
                <br></br>
              </Text>
              <Divider mt={'3'} />

              <Text fontSize={'xl'} >You can now pay by these method: </Text>
              <Box mt={3} display={'flex'} justifyContent={'center'}>
                {isLoading
                  ? (<Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                  />)
                  : (<PaypalButton amount={amount} />)}
              </Box>
            </Box>
          </Box>
        </Container>
      }
    </>
  )
}

export default Depositpage