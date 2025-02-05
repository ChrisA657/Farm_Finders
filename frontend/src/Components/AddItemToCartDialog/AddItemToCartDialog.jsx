
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Backdrop, Box, CircularProgress, Grid, Input, InputAdornment, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkmark from '../../images/green-checkmark.png';
import { Link, useNavigate } from 'react-router-dom';
import { addItemToCart } from '../../api/carts';
import { UserContext } from '../userContext';
const AddItemToCartDialog = ({ open, setOpen, product_name, product_description, product_price, product_stock, product_image_url, product_id, farmId }) => {
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const timer = useRef();
    const timer2 = useRef();
    useEffect(() => {
        console.log("here")

        return () => {
            clearTimeout(timer.current)
            clearTimeout(timer2.current);
        }


    }, [])

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        if(!quantity) return;
        setProcessing(true);
        addItemToCart({product_id, quantity: quantity, user_id: userContext.userData.user_id}).then(setCompleted(true));
        


    }
    const handleCartRedirect = () =>{
        navigate("/cart");
    }
    const handleQuantity = (num) => {
        if (num == 0 || num < 0) {
            setQuantity("");
        }
        else setQuantity(Math.min(num, product_stock));
    }
    if (processing) {
        return <Backdrop
            sx={{ flexDirection: "column", alignItems: "center", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}>
            {
                completed ? <>

                    <Dialog classes={{ root: { alignItems: "center", backgroundColor: "Blue" } }} open={open} onClose={handleClose}>
                        <DialogTitle sx={{ textAlign: "center", fontWeight: "Bold" }}>Item added</DialogTitle>
                        <img id="add-item-success-icon" src={Checkmark}></img>
                        <DialogActions>
                            <Button variant="outlined" onClick={handleClose}>Continue Shopping</Button>
                            <Button variant="outlined" onClick={handleCartRedirect}>View Cart</Button>
                        </DialogActions>
                    </Dialog>
                </> : <CircularProgress color="inherit" />

            }
        </Backdrop>
    }
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: "Bold" }}>Adding To Cart</DialogTitle>
                <DialogTitle sx={{ textAlign: "center", paddingTop: "4px", paddingBottom: "4px" }}>{product_name}</DialogTitle>
                <DialogContent>
                    <DialogContent sx={{ display: "flex", justifyContent: "center", padding: 0, margin: ["24px 0", "24px"] }}>
                        <img src={product_image_url} id="add-item-img" />
                    </DialogContent>
                    <Typography color='GrayText'>{product_description}</Typography>
                    <Box display={"flex"} alignItems='self-end' justifyContent={'space-between'} flexWrap='wrap'>
                        <Stack>
                            <Typography variant='h5' fontWeight={"bold"} sx={{ mt: 1 }}> Price: ${product_price}</Typography>
                            <Typography variant='h6' sx={{ mb:2 }}> Stock: {product_stock}</Typography>
                        </Stack>
                        <TextField
                            sx={{ maxWidth: "80px" }}
                            id="quantity"
                            label="Quantity"
                            type="number"
                            error={quantity === ""}
                            helperText={quantity === "" ? 'invalid #' : ' '}
                            value={quantity}
                            onChange={e => handleQuantity(e.target.value)}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddItemToCartDialog;