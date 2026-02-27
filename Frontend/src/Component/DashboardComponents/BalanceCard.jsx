import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalance } from '../../redux/Features/balanceSlice';

const BalanceCard = () => {
    const balance = useSelector(state => state.balance);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const userId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : null;
        if (userId) {
            dispatch(fetchBalance(userId));
        }
    }, [dispatch]);

    return (
        <Card 
            sx={{ 
                textAlign: 'center', 
                borderRadius: 4, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                mb: 4,
            }}
            >
            <CardContent sx={{ py: 5 }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1} gap={1} color="text.secondary">
                    <AccountBalanceWalletIcon />
                    <Typography variant="h6" fontWeight={500}>
                        Total Balance   
                    </Typography>
                </Box>
                <Typography variant="h3" fontWeight={700} color="primary.blue">
                    ${balance.balance}
                </Typography>
            </CardContent>
        </Card>
        );
    };

export default BalanceCard; 