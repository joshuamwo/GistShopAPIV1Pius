var workerModel = require('../models/workerSchema');
var beefModel = require('../models/beefSchema');
var inventoryModel = require('../models/inventorySchema');
var layerModel = require('../models/layerSchema');
var dairyModel = require('../models/dairySchema');
var pigModel = require('../models/pigSchema');
var taskModel = require('../models/taskSchema');

var faker = require('faker');

const seedWorkers = () => {
  for (let i = 0; i < 52; i++) {
    var newWorker = new workerModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: '123456',
      department: faker.animal.cow(),
      title: faker.name.jobTitle(),
      salary: faker.commerce.price(),
    });
    workerModel.create(newWorker)
  }
}

const seedBeef = () => {
  var i;
  for (i = 0; i < 4; i++) {
    var newBeef = new beefModel({
      name: faker.animal.cow(),
      age_in_weeks: 45,
      weekly_weight: [
        { date: Date.now(), weight: 950 },
        { date: Date.now(), weight: 926 },
      ],
      breed: "hereford",
      history: "White Muscle Disease",
    });
    beefModel.create(newBeef)
  }
}

const seedDairy = () => {
  var i;
  for (i = 0; i < 5; i++) {
    var newDairy = new dairyModel({
      name: faker.animal.cow(),
      age_in_weeks: 114,
      weekly_weight: [{ date: Date.now(), weight: 741 }, { date: Date.now(), weight: 745 }],
      milk_daily: [{ date: Date.now(), litres: 36 }, { date: Date.now(), litres: 38 }],
      breed: 'Guernsey',
      history: 'east coast fever'
    });
    dairyModel.create(newDairy)
  }
}

const seedPigs = () => {
  var i;
  for (i = 0; i < 5; i++) {
    var newPig = new pigModel({
      name: faker.animal.cat(),
      age_in_weeks: 14,
      weekly_weight: [
        { date: Date.now(), weight: 45 },
        { date: Date.now(), weight: 44.25 },
      ],
      breed: "Large  white",
      sex: "female",
      history: " Coccidiosis",
    });
    pigModel.create(newPig)
  }
}

const seedLayers = () => {
  var i;
  for (i = 0; i < 15; i++) {
    var newLayer = new layerModel({
      name: faker.name.firstName(),
      age_in_weeks: 20,
      weekly_weight: [
        { date: Date.now(), weight: 1.24 },
        { date: Date.now(), weight: 1.15 },
      ],
      eggs_weekly: [
        { date: Date.now(), number: 3 },
        { date: Date.now(), number: 5 },
      ],
      breed: " Plymouth Rock",
      history: "Botulism",
    });
    layerModel.create(newLayer)
  }
}

const seedInventory = () => {

  var newInventory = new inventoryModel({
    name: 'maize straws',
    amount: 1500,
    unit_weight: 90,
    vendor: 'triple-A growers',
  });
  inventoryModel.create(newInventory)
}

const seedTask = () => {

  var i;
  for (i = 0; i < 20; i++) {
    var newTask = new taskModel({
      date: faker.date.past(),
      department: 'all',
      instruction: [faker.lorem.sentence()]
    });
    taskModel.create(newTask)
  }

}

const seeder = () => {
  // seedWorkers();
  seedBeef();
  seedDairy();
  seedPigs();
  seedLayers();
  // seedInventory();
  // seedTask();
}
module.exports = seeder;