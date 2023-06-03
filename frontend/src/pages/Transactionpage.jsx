import React, { useEffect, useState } from 'react';
import { UserState } from '../contexts/UserProvider'
import Banner from '../components/miscellaneous/Banner';

import axios from 'axios';
import TransactionItem from '../components/miscellaneous/TransactionItem';
import { Box, Button, Card, CardBody, CardHeader, Container, Heading, Stack, StackDivider } from '@chakra-ui/react';

const Transactionpage = () => {
  const userToken = localStorage.getItem('userToken');

  const [transactions, setTransactions] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [transactionLength, setTransactionLength] = useState(0);
  const { user } = UserState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchUserTransaction = async () => {
      const response = await axios.get('/api/transaction/', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setTransactions(response.data.transactions);
      setTotalDeposit(response.data.totalAmount);
      setTransactionLength(response.data.transactions.length)
    };
    fetchUserTransaction();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
            <Card>
              <CardHeader>
                <Heading size='md'>Your total deposit {totalDeposit} $</Heading>
                <Heading size='md'>Your transactions ({transactionLength})</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>

                  {currentItems.map((transaction) =>
                    (<TransactionItem key={transaction._id} transaction={transaction} />)
                  )}

                </Stack>
                <div>
                  {pageNumbers.map((pageNumber) => (
                    <Button mr={2} mt={4} key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
                      {pageNumber}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Box>
        </Container>}
    </>
  );
};

export default Transactionpage;
