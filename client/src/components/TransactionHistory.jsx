import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/profile/TransactionItem';
import { Button, Card, CardBody, Stack, StackDivider, Text } from '@chakra-ui/react';

const TransactionHistory = () => {
  const userToken = localStorage.getItem('userToken');

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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

  useEffect(() => {
    const fetchUserTransaction = async () => {
      const depositTransaction = await axios.get('/api/transaction/', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setTransactions(depositTransaction.data.transactions);
    };
    fetchUserTransaction();
  }, []);

  return (
    <>
      <Card>
        <CardBody>
          {transactions?.length === 0
            ? <Text fontSize={'lg'}>You have no recent transaction.</Text>
            : <>
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
            </>
          }

        </CardBody>
      </Card>
    </>
  );
};

export default TransactionHistory;
