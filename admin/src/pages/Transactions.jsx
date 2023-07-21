import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Badge, Box, Spinner } from '@chakra-ui/react'
import { formatDate } from '../helpers/ViewHelper';
import { DataTable } from 'simple-datatables';
import { useNavigate } from 'react-router-dom';
import { formatAmount } from '../helpers/ViewHelper';
import Helmet from 'react-helmet'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const storedToken = localStorage.getItem('userToken');
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!storedToken) return navigate('/')

    const fetchTransactions = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      try {
        const { data } = await axios.get('/api/admin/transactions', config);
        setTransactions(data.transactions);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const table = new DataTable(tableRef.current, {
        // Configure the options for the table here
      });
      // Custom search bar styles
      const searchInput = tableRef.current.querySelector('.dataTables_filter input');
      if (searchInput) {
        searchInput.style.border = '1px solid black';
      }

      return () => {
        table.destroy();
      };
    }
  }, [isLoading]);

  return (
    <>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
      </Helmet>
      {isLoading && transactions
        ?
        <div className='w-100'>
          <Box pt={'40vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Box>
        </div>
        :
        <div id="content-wrapper" className="d-flex flex-column">
          <div className="container-fluid px-4">
            <h1 className="h3 mb-0 text-gray-800">Total transactions</h1>
            <div className="card mb-4">
              <div className="card-body">
                <table id="datatablesSimple" ref={tableRef}>
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Created at</th>
                      <th>Zalopay trans id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <a href={`/transaction/${t._id}`}>
                            <i className="fas fa-eye"></i>
                          </a>
                        </td>
                        <td>{t.created_by.name}</td>
                        <td>{t.created_by.email}</td>
                        <td>{t.type}</td>
                        <td>{t.status === 'SUCCEED'
                          ? <Badge variant='outline' colorScheme='green'>
                            Succeed
                          </Badge>
                          : <Badge variant='outline' colorScheme='red'>
                            Canceled
                          </Badge>}</td>
                        <td>{formatAmount(t.amount)} VND</td>
                        <td>{formatDate(t.createdAt)}</td>
                        <td>{t.zp_trans_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Transactions;
