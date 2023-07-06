import React, { useEffect, useState } from 'react';
import { UserState } from '../contexts/UserProvider'

import axios from 'axios';
import TransactionItem from '../components/profile/TransactionItem';
import { Box, Button, Card, CardBody, CardHeader, Container, Heading, Stack, StackDivider } from '@chakra-ui/react';

const TransactionHistory = () => {
  const userToken = localStorage.getItem('userToken');

  const [transactions, setTransactions] = useState([]);
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
      <Card>
        {/* <CardHeader>
          <Heading size='md'>Your transactions ({transactionLength})</Heading>
          <Heading size='md'>Total: {totalDeposit} $</Heading>
        </CardHeader> */}

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
    </>
  );
};

export default TransactionHistory;
