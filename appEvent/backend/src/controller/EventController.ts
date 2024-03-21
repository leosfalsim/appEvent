import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../database/models/event";
import { IEvent } from "../../../frontend/src/app/interfaces/IEvent";

const createEvent = async (req: Request, res: Response, next: NextFunction) => {

    const {name, description, startDate, endDate, eventColor, owner, members} = req.body;

    if(!name) {
        return res.status(422).json({ msg: 'The name is mandatory!' });
    }

    if(!description) {
        return res.status(422).json({ msg: 'The description is mandatory!' });
    }

    if(!startDate) {
        return res.status(422).json({ msg: 'The startDate is mandatory!' });
    }

    if(!endDate) {
        return res.status(422).json({ msg: 'The endDate is mandatory!' });
    }

    if(!eventColor) {
        return res.status(422).json({ msg: 'The eventColor is mandatory!' });
    }

    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description, 
        startDate: startDate, 
        endDate: endDate, 
        eventColor: eventColor,
        owner: owner,
        members: members
    });

    try{

        const eventWithSameDate = await Event.findOne({
            $or: [
                {
                    startDate: req.body.startDate
                },
                {
                    endDate: req.body.endDate
                },
            ]
        });

        if(eventWithSameDate) {
            return res.status(400).json({
                msg: 'Already exists a event with the same date!'
            });
        }

        await event
        .save()
        .then(() => 

            res.status(201).json({
                msg: 'Event created successfully!',
            }));

    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
};

const getEventsById = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.userId;
    
    try{

        const events: Array<IEvent> = await Event.find({
            $or: [
                {
                    owner: userId
                },
                {
                    members: 
                    {
                        $in: [userId]
                    }
                },
            ]
        }) || [];

        if(events) {
            return res.status(200).json(
                events
            );
        }else {
            return res.status(200).json({
                msg: 'Not found!'
            });
        }
        
    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
}

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;

    try{
        
        return await Event.findByIdAndDelete(eventId)
        .then((event) => {
            event 
            ? 
            res.status(200).json({ 
                msg: 'Event deleted successfully!'
            })
            :
            res.status(404).json({ 
                msg: 'Event not found!'
            });
        });

    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;

    try{

    const currentEvent = await Event.findById(eventId);

    if(!currentEvent) {
        return res.status(404).json({
            msg: 'Event not found!'
        });
    }

    if(req.body.startDate !== currentEvent.startDate || req.body.endDate !== currentEvent.endDate) {
        const eventWithSameDate = await Event.findOne({
            _id: { $ne: eventId }, // Exclui o próprio evento
            $or: [
              {
                startDate: req.body.startDate,
              },
              {
                endDate: req.body.endDate,
              },
            ],
        });

        if(eventWithSameDate) {
            return res.status(400).json({
                msg: 'Already exists a event with the same date!'
            });
        }
    } 

    currentEvent.set(req.body);
    return currentEvent?.save().then((event) => {
        res.status(200).json({
            msg: 'Event updated!'
        });
    }).catch((error) => res.status(500).json({
        msg: 'Sorry, occurred an error! Try again later!'
    }));

    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
}

export default { createEvent, getEventsById, deleteEvent, updateEvent };