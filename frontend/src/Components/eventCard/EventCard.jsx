import React, { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkmark from '../../images/green-checkmark.png';
import { Backdrop, Button, CardActionArea, CardActions, CircularProgress } from '@mui/material';

import './EventCard.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../userContext';
import { EventContext } from '../EventContext';
import CreateEventDialog from '../CreateEventDialog/CreateEventDialog';
import RegisterToEventDialog from '../RegisterToEventDialog/RegisterToEventDialog';
const EventCard = ({ eventTitle, eventDescription, eventId, farmName, farmId, userId, eventImage, eventTime, eventDate, setEvents, hideButton, isEdit }) => {

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddOrRemoveDialog, setOpenAddOrRemoveDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deletingCompleted, setDeletingCompleted] = useState(false);
    const eventContext = useContext(EventContext);
    const userContext = useContext(UserContext);
    const fDate = new Date(eventDate + " " + eventTime);

    const handleClose = () => {
        setOpenEditDialog(false);
        setOpenAddOrRemoveDialog(false);
    };

    // const handleUnsubscribe = () => {
    //     setDeleting(true);

    //     setTimeout(() => {
    //         eventContext.setEvents((events) =>{
    //             let indexToRemove = events.findIndex(event => eventId == event.eventId);
    //             return events.filter((e,index)=> index != indexToRemove);
    //         })
    //         setDeleting(false);
    //         setDeletingCompleted(true);
    //         setTimeout(() => {
    //             setOpenRemoveDialog(false);
    //             setDeleting(false);
    //             setDeletingCompleted(false);
    //         }, 2000)
    //     }, 1000)

    // }
    const handleAction = () => {
        if (userId == userContext.userData?.userId) {
            setOpenEditDialog(true);
        } else {
            setOpenAddOrRemoveDialog(true);
        }
    }
    return (
        <Card variant="outlined" sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "2px 2px 7px #888" }} >
            <CardMedia alignItems="center">
                <Link to={`/event/${eventId}`}><img src={eventImage} id="event-card-image" /></Link>
            </CardMedia>

            <CardContent sx={{ textAlign: ["left"], width: "100%", flexGrow: 1, height: "fit-content", display: "flex", flexDirection: 'column', justifyContent: "space-between" }} >
                <div style={{ width: "100%" }}>
                    <Typography gutterBottom variant="h5" component="div" align="start" >
                        {eventTitle}
                    </Typography>
                    <Typography variant="h6" color="text.secondary"><div id="event-card-eventDescription">
                        {eventDescription}</div>
                    </Typography>
                </div>
                <div>
                    <Typography gutterBottom variant="h7" component="div" fontWeight="600" align="start" >
                        Location: {farmName}
                    </Typography>
                    <Typography gutterBottom variant="h7" component="div" fontWeight="600" align="start" >
                        Date: {fDate.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}
                    </Typography>

                </div>
            </CardContent>

            <CardActions>
                {!hideButton && <Button
                    variant="contained"
                    size="small"
                    color={userId == userContext.userData?.userId ? "error" : "primary"}
                    fullWidth sx={{ padding: [2, 2, 1] }}
                    onClick={() => handleAction()}>
                    {userId == userContext.userData?.userId ? "Edit Event" : eventContext.events.some(e => e.eventId == eventId) ? "Unsubscribe" : "RSVP"}
                </Button>}
            </CardActions>
            {
                openEditDialog && <CreateEventDialog
                    open={openEditDialog}
                    setOpen={setOpenEditDialog}
                    eventTitle={eventTitle}
                    eventDescription={eventDescription}
                    eventImage={eventImage}
                    eventDate={eventDate}
                    eventTime={eventTime}
                    eventId={eventId}
                    farmId={farmId}
                    farmName={farmName}
                    showRemove={true} />
            }

            {
                openAddOrRemoveDialog && <RegisterToEventDialog
                                            open={openAddOrRemoveDialog}
                                            setOpen={setOpenAddOrRemoveDialog}
                                            eventTitle={eventTitle}
                                            eventDescription={eventDescription}
                                            eventImage={eventImage}
                                            eventDate={eventDate}
                                            eventTime={eventTime}
                                            eventId={eventId}
                                            farmId={farmId}
                                            farmName={farmName}
                                            unregistering={eventContext.events.some(e => e.eventId == eventId)} />
            }
            {/* {
                openRemoveDialog && <Backdrop
                    sx={{ flexDirection: "column", alignItems: "center", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}>
                    {
                        !deleting && !deletingCompleted && <Dialog classes={{ root: { alignItems: "center", backgroundColor: "Blue" } }} open={true} onClose={handleClose}>
                            <DialogTitle sx={{ textAlign: "center", fontWeight: "Bold" }}>Confirm Unsubscription</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleUnsubscribe}>Confirm</Button>
                            </DialogActions>
                        </Dialog>
                    }
                    {
                        deleting && <CircularProgress color="inherit" />

                    }
                    {
                        deletingCompleted && <Dialog classes={{ root: { alignItems: "center", backgroundColor: "Blue" } }} open={true} onClose={handleClose}>
                            <DialogTitle sx={{ textAlign: "center", fontWeight: "Bold" }}>Event Removed From Your Subscriptions</DialogTitle>
                            <DialogContent alignItems={"center"}>
                                <img id="add-item-success-icon" src={Checkmark}></img>
                            </DialogContent>

                        </Dialog>
                    }
                </Backdrop>
            } */}
        </Card >
    );
};

export default EventCard;