import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Box, Spinner } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar';
import { formatDate } from '../helpers/ViewHelper';
import { DataTable } from 'simple-datatables';
import { useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet'
import Topbar from '../components/Topbar';
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
      <Sidebar />

      {isLoading && transactions
        ?
        <div className='w-100'>
          <Topbar />
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
          <Topbar />
          <div className="container-fluid px-4">
            <h1 className="">Total Transactions</h1>
            <div className="card mb-4">
              <div className="card-body">
                <table id="datatablesSimple" ref={tableRef}>
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Created at</th>
                      <th>Updated at</th>
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
                        <td>{t.email}</td>
                        <td>{t.PP_info.status}</td>
                        <td>{t.amount} $</td>
                        <td>{formatDate(t.createdAt)}</td>
                        <td>{formatDate(t.updatedAt)}</td>
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
