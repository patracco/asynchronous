'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
//// ==> old school way of sending AJAX requests (api requests) <== ////

// const getCountryData = function (country) {
//   // modern web dev use JSON instead of XML
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // specify type of request (GET) and where to look for the data (endpoint - url) -> https://restcountries.eu/
//   request.send(); // send the request

//   // this EL waits until the data has arrived, then runs the callback
//   request.addEventListener('load', function () {
//     //   const data = JSON.parse(this.responseText); // turns the string into an array containing an object
//     const [data] = JSON.parse(this.responseText); // in order to access the single values, we need to destructure using [data]. Now we can do data.name etc. Now it's no longer an array containing an object, but only an object
//     //   console.log(data);
//     const html = `
// <article class="country">
//     <img class="country__img" src="${data.flag}" />
//     <div class="country__data">
//         <h3 class="country__name">${data.name}</h3>
//         <h4 class="country__region">${data.region}</h4>
//         <p class="country__row"><span>👫</span>${(
//           +data.population / 1000000
//         ).toFixed(1)}</p>
//         <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//         <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//     </div>
// </article>`;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// // regardless of the order of which we call the functions, they will display in the order that they are received. Italy may be displayed on the left or on the right. If we want a specific order, say Italy always first, then we need to chain the request: only once the data of the first is received, start downloading the second.
// getCountryData('italy');
// getCountryData('usa');

///////////////////////////////////////////
//// ==> Chaining requests <== ////
// we want to get the second country (neighbour) depending on the first

const renderCountry = function (data, className = '') {
  const html = `
<article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
</article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

// const getCountryAndNeighbour = function (country) {
//   // AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);

//     // render first country
//     // console.log(data);
//     renderCountry(data);

//     // Get neighbour
//     const [neighbour] = data.borders;
//     if (!neighbour) return;

//     // AJAX call neighbour country
//     const request2 = new XMLHttpRequest();
//     // replace name with alpha because data.borders gives us the country code only (check API docs)
//     request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText); // we don't use destructuring here because /alpha doesn't return an array (destructuring gives an error)
//       //   console.log(data2);

//       // render neighbour
//       renderCountry(data2, 'neighbour'); // 'neighbour' is the className
//     });
//   });
// };

// getCountryAndNeighbour('italy');

///////////////////////////////////////
//// ==> Modern way of sending AJAX requests -> the Fetch API <== ////

// Promise: an object that is used as a placeholder for the future result of an asynchronous operation. A promise is a container for a future value
/* with promises, we have 2 advantages: 
1. We no longer need to rely on events and callbacks passed into asynchronous functions to handle asynchronous results
2. Instead of nesting callbacks, we can chain promises for a sequence of async operations: escape callback hell
*/

// const request = fetch('https://restcountries.eu/rest/v2/name/italy');
// console.log(request); // Promise {<pending>}

/* 
    1. make api call with FETCH
    2. fetch returns a value (response) once it has settled
    3. THEN() do something with that response
    */

/*    
 
 const getCountryData = function (country) {

 fetch(`https://restcountries.eu/rest/v2/name/${country}`) // returns a promise
      // attach a .then() to do something with the response (handle the promise)
      .then(function (response) {
        console.log(response);
        return response.json(); // we do this to be able to read the data from the BODY of the response. We take the response and transform into JSON. This returns a new promise, which means we need to attach another .then() to it
      })
      .then(function (data) {
        console.log(data);
        renderCountry(data[0]);
      }); */

// let's simplify the above + fetch a neighbour country
/*   fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => response.json()) // transform the resp into JSON
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => {
      renderCountry(data, 'neighbour'); // 'neighbour' is the className
    });
};
getCountryData('italy'); */

///////////////////////////////////////////
//// ==> Refactoring <== ////
/* const getCountryData = function (country) {
  // Country 1
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    'Country not found'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })

    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData(whereAmI(52.508, 13.381));
}); */

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you received about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

const whereAmI = function (lat, lng, errorMsg = 'Could not find a country') {
  return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(resp => {
      if (!resp.ok) throw new Error(`${errorMsg} (${resp.status})`);
      return resp.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => {
      renderCountry(data[0]);
      // Neighbour
      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error('No neighbour found!');
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      ).then(data => {
        renderCountry(data, 'neighbour');
      });
    })
    .catch(err => {
      renderError(`Shit! Cought error 💥 ${err.message}. Try again!`);
    });
};

btn.addEventListener('click', function () {
  whereAmI(-33.933, 18.474);
});

///////////////////////////////////////////
//// ==> The Event Loop in Practice - Lecture 254 <== ////
/* 
console.log('Test Start');
setTimeout(() => console.log('0 sec timer'), 0); // setTimeout is actually not guaranteed, because has no priority
Promise.resolve('Resolved promise 1').then(res => console.log(res)); // promises (MICROTASKS QUEUE) have priority over regular callbacks queue lecture 253). In fact, this line is logged before the setTimeout callback.
Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});
console.log('Test End');
*/

/* 
The result is this:
Test Start
Test End
Resolved promise 1
Resolved promise 2 // once finished computing the big number
0 sec timer
*/

///////////////////////////////////////////
//// ==> Building a Simple Promise <== ////
// check in the console how the order of all the below (to line 340) appears.

// note: Promise is an Object. The promise constructor takes a function called 'executor' (over with mouse!)
const lotteryPromise = new Promise(function (resolve, reject) {
  // here async behaviour
  // Let's simulate a draw (3 sec wait)
  console.log('Drawing numbers...');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN!'); // fulfilled state
    } else {
      reject(new Error('You lost your money')); // rejected state, shows in red (as an error) in the console
    }
  }, 3000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// Promisifying. We create a function that returns a Promise, like the fetch() function
const wait = function (seconds) {
  return new Promise(function (resolve, reject) {
    // don't need reject here
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('4 seconds passed');
    return wait(1);
  });

/*
// To compare:
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000); */

Promise.resolve('Resolved').then(res => console.log(res));
Promise.reject(new Error('Rejected')).catch(err => console.log(err));
