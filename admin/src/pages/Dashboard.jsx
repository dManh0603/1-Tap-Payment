import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { formatAmount } from '../helpers/ViewHelper';
import { Box, InputGroup, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, InputLeftElement, Input } from '@chakra-ui/react'

import { initAreaChart } from '../helpers/ChartArea';
import { initPieChart } from '../helpers/ChartPie';

const Dashboard = () => {

  const [isLoading, setIsLoading] = useState(true);
  const storedToken = localStorage.getItem('userToken');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [succeedTransactionCount, setSucceedTransactionCount] = useState(0)
  const currentYear = new Date().toISOString().slice(0, 4);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedYear, setSelectedYear] = useState(parseInt(currentYear));
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  // Reference to the chart instance
  const [areaChartInstance, setAreaChartInstance] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);

  const navigate = useNavigate();

  function handleYearChange(value) {
    setSelectedYear(value);
  }

  function handleMonthChange(e) {
    setSelectedMonth(e.target.value);
  }

  useEffect(() => {
    const initChart = async () => {
      if (areaChartInstance) {
        areaChartInstance.destroy();
      }
      if (!isLoading) {
        try {
          const areaChartInstance = await initAreaChart(selectedYear);
          setAreaChartInstance(areaChartInstance);
        } catch (error) {
          console.error('Error initializing chart:', error);
        }
      }
    };

    initChart();
  }, [isLoading, selectedYear]);

  useEffect(() => {
    const initChart = async () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
      if (!isLoading) {
        try {
          const pieChartInstance = await initPieChart(selectedMonth);
          setPieChartInstance(pieChartInstance);
        } catch (error) {
          console.error('Error initializing chart:', error);
        }
      }
    };

    initChart();
  }, [isLoading, selectedMonth]);

  useEffect(() => {
    if (!storedToken) return navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchDashboard = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };

      try {
        const { data } = await axios.get('/api/admin/dashboard', config);
        setMonthlyIncome(data.monthlyIncome);
        setAnnualIncome(data.annualIncome);
        setTransactionCount(data.transactionCount);
        setSucceedTransactionCount(data.succeedTransactionCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <!-- Main Content --> */}
      {isLoading
        ? <Box pt={'40vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Box>
        : <>
          <div id="content">
            {/* <!-- Begin Page Content --> */}
            <div className="container-fluid">

              {/* <!-- Page Heading --> */}
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                <a className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                  className="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
              </div>

              {/* <!-- Content Row --> */}
              <div className="row">

                {/* <!-- Earnings (Monthly) Card Example --> */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Earnings (Monthly)</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {formatAmount(monthlyIncome)} VND
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Earnings (Monthly) Card Example --> */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Earnings (Annual)</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{formatAmount(annualIncome)} VND</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Earnings (Monthly) Card Example --> */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Succeed transaction
                          </div>
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{succeedTransactionCount}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Pending Requests Card Example --> */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Total transaction</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{transactionCount}</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Content Row --> */}

              <div className="row">

                {/* <!-- Area Chart --> */}
                <div className="col-xl-8 col-lg-7">
                  <div className="card shadow mb-4">
                    {/* <!-- Card Header - Dropdown --> */}
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                      <Box>
                        <InputGroup >
                          <NumberInput
                            step={1}
                            defaultValue={selectedYear}
                            min={2000}
                            max={2100}
                            onChange={handleYearChange}
                            id='yearInput'
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </InputGroup>

                      </Box>
                    </div>
                    {/* <!-- Card Body --> */}
                    <div className="card-body">
                      <div className="chart-area">
                        <canvas id="myAreaChart"></canvas>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Pie Chart --> */}
                <div className="col-xl-4 col-lg-5">
                  <div className="card shadow mb-4">
                    {/* <!-- Card Header - Dropdown --> */}
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">Monthly traffic overview</h6>
                      <Box>
                        <Input type='month' value={selectedMonth} onChange={handleMonthChange} />
                      </Box>
                    </div>
                    {/* <!-- Card Body --> */}
                    <div className="card-body">
                      <div className="chart-pie pb-2">
                        <canvas id="myPieChart"></canvas>
                      </div>
                      <div className="mt-4 text-center small">
                        <span className="mr-2">
                          <i className="fas fa-circle text-primary"></i> Motorbike
                        </span>
                        <span className="mr-2">
                          <i className="fas fa-circle text-success"></i> Bicycle
                        </span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {/* <!-- /.container-fluid --> */}
          </div >
          {/* < !--End of Main Content-- > */}

          {/* < !--Footer --> */}
          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; 1-Tap Payment 2023</span>
              </div>
            </div>
          </footer>
          {/* <!--End of Footer-- > */}


          {/* < !--Scroll to Top Button-- > */}
          <a className="scroll-to-top rounded" href="#page-top">
            <i className="fas fa-angle-up"></i>
          </a>

          {/* <!--Logout Modal-- > */}
          <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                  <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                  <a className="btn btn-primary" href="login.html">Logout</a>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  )


}

export default Dashboard