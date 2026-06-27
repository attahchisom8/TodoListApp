/* This module handle panel component like clock */

/**
 * clockSetUp - a function to setup the dynamics of a clock (stability and
 * motion
 * @hourHand: hour hand
 * @minuteHand: minute hand
 * @secondHand: second hand
 *
 * The smooth values are as such:
 *  a) It takes 60s to make one minute and therefore 3600s (1hr) to move The
 *  minute hand round the clock once
 *
 *  b) it takes 60min to make an hour and therefore 60min x 12 to move the
 *  hour hand round the clock once
 *
 * Return: void
 */

export const clockSetUp = (hourHand, minuteHand, secondHand) => {
  const smoothSecToMinute = 0.1 // 360 / (60 * 60); 0.1deg per minute
  const smoothMinToHour = 0.5 // 360 / (60 * 12) : 0.5deg per hour

  const moveHands = () => {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours() % 12;

     const secondDeg = 6 * sec; // 360/ 60
  const minuteDeg = 6 * min + sec * smoothSecToMinute;
  const hourDeg = 30 * hr + min * smoothMinToHour; // 360 / 12

    secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  }

  moveHands();
  setInterval(moveHands, 1000);
}

/**
 * formattedDate - return us date format
 * 
 * Return: void
 */

export const formattedDate = () => {
  const now = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",

  }

  return  now.toLocaleDateString("en-us", options);
}
