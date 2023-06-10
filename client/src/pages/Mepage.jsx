import { Box, Container, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserState } from '../contexts/UserProvider';
import Banner from '../components/miscellaneous/Banner';
import Profile from '../components/miscellaneous/Profile';
import DepositModal from '../components/miscellaneous/DepositModal';
import DeactivateCardModal from '../components/miscellaneous/DeactivateCardModal';

const Mepage = () => {

  const navigate = useNavigate();
  const { user } = UserState();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken === null) return navigate('/');
    console.log('user', user);

  }, []);

  return (
    <>
      {user &&
        <Container maxW='xl' centerContent>
          <Banner />

          <Box
            bg={'white'}
            w={'100%'}
            p={'3'}
            borderRadius={'lg'}
            borderWidth={'1px'}
          >
            <Box maxW='32rem'>
              <Profile user={user} />

              <Box mt={3} display={'flex'} justifyContent={'space-between'}>
                {user.card_disabled ? <Text as={'i'}>Contact admin for any help</Text> : <DeactivateCardModal user={user} />}
                <DepositModal />
              </Box>
            </Box>
          </Box>
        </Container>

      }
    </>
  )
}

export default Mepage