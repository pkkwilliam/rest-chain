const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

router.get("/", async (req, res) => {
  try {
    const all = await Subscriber.find();
    console.log("cool", all);

    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:id", getSubscriber, async (req, res) => {
  console.log("resss", res.subscriber);
  res.json({ success: true, name: res.subscriber.name });
});

router.post("/", async (req, res) => {
  const { name, subscriberToChannel } = req.body;
  const newSubscriber = new Subscriber({
    name,
    subscriberToChannel,
  });
  try {
    const response = await newSubscriber.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    console.log("HHHH");
    console.log(req.params.id);

    subscriber = await Subscriber.findOne({});
    console.log(subscriber);

    if (subscriber == null) {
      return res.status(404).json({ message: "dude you are fake" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
  console.log("herere", subscriber);
  res.subscriber = subscriber;
  next();
}

module.exports = router;
