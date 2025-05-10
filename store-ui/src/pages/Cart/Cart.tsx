import axiosClient, { cartUrl } from "../../api/config";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PaidIcon from '@mui/icons-material/Paid';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>({});
  const [textQuantity, setQuantity] = useState<number>(1);

  const onQuantityChange = (e: any) => setQuantity(Number(e.target.value));

  const handleAdd = (itemId: any) => {
    setCart((prevCart: any) => {
      const updatedItems = prevCart.items.map((item: any) =>
        item.productId === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { ...prevCart, items: updatedItems };
    });
  };

  const handleMinus = (itemId: any) => {
    setCart((prevCart: any) => {
      const updatedItems = prevCart.items.map((item: any) =>
        item.productId === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return { ...prevCart, items: updatedItems };
    });
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log("Proceed to checkout", cart);
    navigate('/checkout'); // Example of navigation
  };

  // Fetch cart items on load
  useEffect(() => {
    axiosClient
      .get(`${cartUrl}cart/john@example.com`)
      .then((response) => setCart(response.data))
      .catch((error) => console.error('Error fetching cart:', error));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={5} sx={{ p: 3 }}>
        {/* Cart Header */}
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          Your Shopping Cart
        </Typography>

        {/* Cart Items */}
        {cart?.items?.map((item: any, index: number) => (
          <Grid container key={index} direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">{item?.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                SKU: {item?.sku}
              </Typography>
            </Grid>

            <Grid item xs={4} sm={3}>
              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                  <IconButton
                    color="primary"
                    aria-label="decrement"
                    onClick={() => handleMinus(item.productId)}
                    sx={{ color: '#f44336' }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <TextField
                    sx={{ width: '5ch' }}
                    required
                    id="quantity"
                    label="Qty"
                    size="small"
                    value={item?.quantity}
                    inputProps={{ min: 1 }}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    color="primary"
                    aria-label="increment"
                    onClick={() => handleAdd(item.productId)}
                    sx={{ color: '#4caf50' }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography variant="h6" color="primary">
                ${item?.price * item?.quantity}
              </Typography>
            </Grid>
          </Grid>
        ))}

        {/* Checkout Section */}
        <Grid container sx={{ mt: 3 }} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PaidIcon />}
              onClick={handleCheckout}
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#388e3c',
                },
              }}
            >
              Proceed to Checkout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Cart;
