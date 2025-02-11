'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'Premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'Standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200],
  interestRate: 0.7,
  pin: 3333,
  type: 'Premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'Basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Displaying the transaction activities of a user
const displayMovement = function (movement, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__value">${mov} €</div>
          </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//calculating the balance of a user
const calcAndPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (account) {
  const incoming = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outgoing = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${incoming}€`;
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUi = function (currAccount) {
  displayMovement(currAccount.movements);
  calcAndPrintBalance(currAccount);
  calcDisplaySummary(currAccount);
};
//Event Handlers
let currentUser;

btnLogin.addEventListener('click', function (e) {
  //prevents form from submiting

  e.preventDefault();

  const name = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  currentUser = accounts.find(user => user.userName == name);

  if (currentUser?.pin === Number(pin)) {
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome, ${currentUser.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    updateUi(currentUser);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const recieverAcc = accounts.find(
    acc => acc?.userName === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    transferAmount > 0 &&
    recieverAcc &&
    currentUser.balance >= transferAmount &&
    recieverAcc.userName !== currentUser.userName
  ) {
    currentUser.movements.push(-transferAmount);
    recieverAcc.movements.push(transferAmount);
    updateUi(currentUser);
  }
});

//Delete Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.userName &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const closeUserIndex = accounts.findIndex(
      acc => acc.userName === currentUser.userName
    );
    inputCloseUsername.value = inputClosePin.value = '';
    accounts.splice(closeUserIndex, 1);
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    updateUi(currentUser);
    inputLoanAmount.value = '';
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovement(currentUser.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  const movementUi = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('€', ' ')
  );

  console.log(movementUi);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//lectures..

//Array grouping

const groupedMovements = Object.groupBy(accounts, acc => {
  const totalMovements = acc.movements.length;

  if (totalMovements >= 8) return 'Very Active';
  if (totalMovements >= 4) return 'Active';
  if (totalMovements >= 1) return 'not Active';
  return 'Inactive';
});

const accountType = Object.groupBy(accounts, account => account.type);
//by destructuring
const accountTypeDestruct = Object.groupBy(accounts, ({ type }) => type);

console.log(accountType);
console.log(accountTypeDestruct);

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;

const totalDepositsToUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);

//Array Methods

const arr = Array.from({ length: 7 }, () => 1);

console.log(`implementing array from ${arr}`);
/*
const balance = movements.reduce(function (acc, mov, index, arr) {
  return acc + mov;
}, 0);

console.log(balance);

for (const [i, movement] of movements.entries()) {
  if (movement > 0) console.log(`${i} You deposited money ${movement}`);
  else console.log(`${i} You withdrew money ${movement}`);
}

console.log('-----FOREACH----');

movements.forEach(function (movement, i, array) {
  if (movement > 0) console.log(`${i} You deposited money ${movement}`);
  else console.log(`${i} you withdrew money ${movement}`);
});
*/

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, 
and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is 
an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy 
of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data.
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy 
("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀


const checkDogs = function (dogsJulia, dogsKate) {
  const updatedJulia = dogsJulia.slice();
  updatedJulia.splice(0, 1);
  updatedJulia.splice(-2);
  console.log(updatedJulia);

  const newAll = [...updatedJulia, ...dogsKate];

  newAll.forEach(function (age, index) {
    if (age < 3)
      console.log(`Dog number ${index + 1} is still puppy of ${age} years `);
    else
      console.log(
        `Dog number ${index + 1} is an adult, and is ${age} years old`
      );
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/

/*
const euroToUsd = 1.1;
//arrow Function

const movementToUsdArrow = movements.map(mov => mov * 1.1);
//Regular
const movementToUsdRegular = movements.map(function (mov) {
  return mov * 1.1;
});

const movementsDescription = movements.map(function (mov, i) {
  return `Movement ${
    i + 1
  } : You ${mov > 0 ? 'Deposited' : 'Withdrew'} ${Math.abs(mov)} `;
});

console.log(movementsDescription);
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages
 to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following 
things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If 
the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAge = function (dogAges) {
  const humanAge = dogAges.map(function (age) {
    return age > 2 ? 16 + age * 4 : 2 * age;
  });

  console.log(humanAge);
  const filterredAge = humanAge.filter(function (age) {
    return age >= 18;
  });

  console.log(filterredAge);

  const averageAge =
    filterredAge.reduce(function (acc, age) {
      return acc + age;
    }, 0) / filterredAge.length;

  console.log(averageAge);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
*/

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAge = function (dogAges) {
  const humanAge = dogAges.map(function (age) {
    return age > 2 ? 16 + age * 4 : 2 * age;
  });

  console.log(humanAge);
  const filterredAge = humanAge.filter(function (age) {
    return age >= 18;
  });

  console.log(filterredAge);

  const averageAge =
    filterredAge.reduce(function (acc, age) {
      return acc + age;
    }, 0) / filterredAge.length;

};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

const calcAverageHumanArrow = ages =>
  ages
    .map(age => (age > 2 ? 16 + age * 4 : 2 * age))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

*/

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion 
(see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object
 as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The 
 result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you
 first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat
 too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah 
and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the 
portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < 
(recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:


GOOD LUCK 😀


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(
  `Sarahs dog is eating too ${
    sarahsDog.curFood > sarahsDog.recommendedFood ? 'much' : 'little'
  }`
);

const eatsToMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
const eatsToLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(eatsToMuch);
console.log(eatsToLittle);
*/
