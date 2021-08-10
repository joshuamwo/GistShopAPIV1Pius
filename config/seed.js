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
  for (i = 0; i < 8; i++) {
    var newBeef = new beefModel({
      name: faker.animal.cow(),
      age_in_weeks: 45,
      weekly_weight: [{ date: Date.now(), weight: 1200 }, { date: Date.now(), weight: 1198 }],
      breed: 'short horn',
      department: 'beef',
      history: ['hardware poisoning', 'aggressive to stragers']
    });
    beefModel.create(newBeef)
  }
}

const seedDairy = () => {
  var i;
  for (i = 0; i < 25; i++) {
    var newDairy = new dairyModel({
      name: faker.animal.cow(),
      age_in_weeks: 200,
      weekly_weight: [{ date: Date.now(), weight: 500 }, { date: Date.now(), weight: 479 }],
      milk_daily: [{ date: Date.now(), litres: 40 }, { date: Date.now(), litres: 38 }],
      breed: 'brown swiss',
      department: 'dairies',
      history: ['foot rot', 'two miscarriages']
    });
    dairyModel.create(newDairy)
  }
}

const seedPigs = () => {
  var i;
  for (i = 0; i < 22; i++) {
    var newPig = new pigModel({
      name: faker.animal.cat(),
      age_in_weeks: 22,
      weekly_weight: [{ date: Date.now(), weight: 320 }, { date: Date.now(), weight: 315 }],
      breed: 'chester white',
      sex: 'female',
      department: 'pigs',
      history: ['Gastric ulcers']
    });
    pigModel.create(newPig)
  }
}

const seedLayers = () => {
  var i;
  for (i = 0; i < 45; i++) {
    var newLayer = new layerModel({
      name: faker.name.firstName(),
      age_in_weeks: 30,
      monthly_weight: [{ date: Date.now(), weight: 6 }, { date: Date.now(), weight: 5 }],
      eggs_weekly: [{ date: Date.now(), number: 6 }, { date: Date.now(), number: 7 }],
      breed: 'rhode island red',
      department: 'layers',
      history: ['Cecal Worms', 'Poultry Mites']
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
    department: 'beef',
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
  seedWorkers();
  seedBeef();
  seedDairy();
  seedPigs();
  seedLayers();
  seedInventory();
  seedTask();
}
module.exports = seeder;