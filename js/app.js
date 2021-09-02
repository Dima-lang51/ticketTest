const button = document.querySelector('.button');


class Tariff {
  constructor(options) {
    this.type = options.type;
    this.priceKm = options.priceKm; //стоимость км
    this.maxKg = options.maxKg; //макс вес багажа
    this.freeBag = options.freeBag; //бесплатный вес
    this.ageChild = options.ageChild; //возраст ребенка
    this.discountChild = options.discountChild; //скидка за ребенка
  }
  calcDistancePrice(distance, age){
    let distancePrice = distance * this.priceKm;
    if (this.ageChild !== null && this.discountChild !== null) {
      if (age <= this.ageChild) {
        distancePrice = distancePrice - distancePrice * this.discountChild / 100;
      }
    }
    return distancePrice; 
  }

  validateBag(bagWeight) {
    return bagWeight <= this.maxKg;
  }
}



class PlaneTariff extends Tariff {
  constructor(options) {
    super(options);
    this.priceBagPlane = options.priceBagPlane; //стоимость багажа для самолета
  }
  calcBagPrice(bagWeight) {
    let priceBagPlane = 0;
    if (this.priceBagPlane != null && bagWeight > this.freeBag) {
      priceBagPlane = this.priceBagPlane;
    }
    return priceBagPlane;
  }
} 


class TrainTariff extends Tariff {
  constructor(options) {
    super(options);
    this.priceKgBagTrain = options.priceKgBagTrain; //стоимость за кг багажа для поезда
  }
  calcBagPrice(bagWeight) {
    let priceKgBagTrain = 0;
    if (this.priceKgBagTrain != null && bagWeight > this.freeBag) {
      priceKgBagTrain = this.priceKgBagTrain * (bagWeight - this.freeBag);
    }
    return priceKgBagTrain;
  }
}


const planeTariffs = [];
const trainTariffs = [];

//тариф для самолета
const economPlaneTariff = new PlaneTariff({'type': 'Эконом', 'priceKm': 4, 'maxKg': 20, 'freeBag': 5, 'ageChild': null, 'discountChild': null, 'priceBagPlane': 4000});

const advancedPlaneTariff = new PlaneTariff({'type': 'Продвинутый', 'priceKm': 8, 'maxKg': 50, 'freeBag': 20, 'ageChild': 7, 'discountChild': 30, 'priceBagPlane': 5000});

const premiumPlaneTariff = new PlaneTariff({'type': 'Люкс', 'priceKm': 15, 'maxKg': 50, 'freeBag': null, 'ageChild': 16, 'discountChild': 30, 'priceBagPlane': null});

planeTariffs.push(economPlaneTariff);
planeTariffs.push(advancedPlaneTariff);
planeTariffs.push(premiumPlaneTariff);


//тариф для поезда
const economTrainTariff = new TrainTariff({'type': 'Эконом','priceKm': 0.5, 'maxKg': 50, 'freeBag': 15, 'ageChild': 5, 'discountChild': 50, 'priceKgBagTrain': 50});

const advancedTrainTariff = new TrainTariff({'type': 'Продвинутый', 'priceKm': 2, 'maxKg': 60, 'freeBag': 20, 'ageChild': 8, 'discountChild': 30, 'priceKgBagTrain': 50});

const premiumTrainTariff = new TrainTariff({'type': 'Люкс', 'priceKm': 4, 'maxKg': 60, 'freeBag': null, 'ageChild': 16, 'discountChild': 20, 'priceKgBagTrain': null});


trainTariffs.push(economTrainTariff);
trainTariffs.push(advancedTrainTariff);
trainTariffs.push(premiumTrainTariff);

button.addEventListener('click', () => {
  let inputs =  document.querySelectorAll('.input');
  inputs.forEach(element => {
    element.style.border = 'solid 1px #d0cece';
  })
  const km = document.querySelector('.km').value;
  const age = document.querySelector('.age').value;
  const bagWeight = document.querySelector('.bag_weight').value;
  const output = document.getElementById('output');

  if(km === '' || km <= 0 || isNaN(parseFloat(km))) {
    document.querySelector('.km').style.border = '1px solid red';
  } else if (age === '' || age <= 0 || isNaN(parseFloat(age))) {
    document.querySelector('.age').style.border = '1px solid red';
  } else if (bagWeight === '' || bagWeight <= 0 || isNaN(parseFloat(bagWeight))) {
    document.querySelector('.bag_weight').style.border = '1px solid red';
  } else {
    let outputTextBegin = `<p>Предложения:</p>
      <table>
        `;
    let textPlane = '';
    planeTariffs.forEach(element => {
      if (element.validateBag(bagWeight)) {
        let outcome = element.calcDistancePrice(km, age) + element.calcBagPrice(bagWeight);
        textPlane += `<tr>
          <th>${element.type}: ${outcome} ₽</th>
        </tr>`;
      }
    });
    
    if (textPlane != '') {
      textPlane = `<tr>
          <th class="th"><b>Аэрофлот</b></th>
        </tr>` + textPlane;
    }

        let textTrain = '';
  trainTariffs.forEach(element => {
      if (element.validateBag(bagWeight)) {
        let outcome = element.calcDistancePrice(km, age) + element.calcBagPrice(bagWeight);
        textTrain += `<tr>
          <th>${element.type}: ${outcome} ₽</th>
        </tr>`;
      }
  });
  if (textTrain != '') {
    textTrain = `<tr>
          <th class="th"><b>РЖД</b></th>
        </tr>` + textTrain;
  }
  if (textPlane != '' || textTrain != '') {
     output.style.display = 'block';
    output.innerHTML = outputTextBegin + textPlane + textTrain + `</table>`;
  }
  }
})

