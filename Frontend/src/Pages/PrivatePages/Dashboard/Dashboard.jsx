import { Container, Box } from '@mui/material';
import Navbar from '../../../Component/DashboardComponents/Navbar';
import BalanceCard from '../../../Component/DashboardComponents/BalanceCard';
import IncomeExpenseCards from '../../../Component/DashboardComponents/IncomeExpenseCards';
import AnalyticsSection from '../../../Component/DashboardComponents/AnalyticsSection';

function Dashboard() {
  // Mock Data - Replace these with real Redux state selectors later
  // e.g. const transactions = useSelector(state => state.transactions.list);
  // const [dashboardData, setDashboardData] = useState({
  //   balance: 12450.50,
  //   income: 8500.00,
  //   expense: 3450.25,
  //   categoryData: [
  //     { name: 'Food', value: 800 },
  //     { name: 'Housing', value: 1500 },
  //     { name: 'Transport', value: 400 },
  //     { name: 'Utilities', value: 300 },
  //     { name: 'Entertainment', value: 450.25 },
  //   ],
  //   trendData: [
  //     { name: 'Week 1', income: 4000, expense: 1200 },
  //     { name: 'Week 2', income: 1000, expense: 800 },
  //     { name: 'Week 3', income: 500, expense: 950 },
  //     { name: 'Week 4', income: 3000, expense: 500.25 },
  //   ]
  // });

  return (
   <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <BalanceCard />
        <IncomeExpenseCards />
        <AnalyticsSection />
      </Container>
   </>
  );
}

export default Dashboard;