import express from "express";
import eventController from './../controller/EventController';

const router = express.Router();

router.post('/createEvent', eventController.createEvent);
router.get('/getEventsById/:userId', eventController.getEventsById);
router.delete('/delete/:id', eventController.deleteEvent);
router.patch('/update/:eventId', eventController.updateEvent);

export = router;