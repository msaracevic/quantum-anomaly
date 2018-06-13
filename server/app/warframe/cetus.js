import * as time from '../../helpers/time';

function cetusTime(cetus) {
  // remaining time is until whole day / night cycle is finished
  // night cycle is last 50 minutes of whole cycle
  let timeDayNightRemaining     = time.timeFrom(cetus['Expiry']['$date']['$numberLong']),
      timeOstronBountyRemaining = timeDayNightRemaining,
      day                       = true;

  if (new Date().getTime() - cetus['Expiry']['$date']['$numberLong'] > 0) {
    // this is case when internal API hasn't got new info from the DE servers 
    // and new cycle has begun, in that case just add one more cycle duration (150 minutes)
    cetus['Expiry']['$date']['$numberLong'] = parseInt(cetus['Expiry']['$date']['$numberLong'], 10) + (1000 * 60 * 150);
    timeOstronBountyRemaining = time.timeFrom(cetus['Expiry']['$date']['$numberLong']);
    timeDayNightRemaining = time.timeFrom(cetus['Expiry']['$date']['$numberLong'] - (1000 * 60 * 50));
  }

  if (timeDayNightRemaining.minutes >= 0 && timeDayNightRemaining.minutes <= 50 && timeDayNightRemaining.hours < 1) {
    // it is night for the last 50 minutes
    day = false;
  } else {
    // if it is day, then the time remaining should be 50 minutes less that total
    timeDayNightRemaining = time.timeFrom(cetus['Expiry']['$date']['$numberLong'] - (1000 * 60 * 50));
  }

  return {
    day:                       day,
    timeOstronBountyRemaining: timeOstronBountyRemaining,
    timeDayNightRemaining:     timeDayNightRemaining
  };
}

export default function (syndicates) {
  let cetus = {};
  syndicates.forEach(syndicate => {
    if (syndicate['Tag'] === 'CetusSyndicate') {
      cetus = {
        start:     syndicate['Activation']['$date']['$numberLong'],
        timeStart: time.timeFrom(syndicate['Activation']['$date']['$numberLong']),
        end:       syndicate['Expiry']['$date']['$numberLong'],
        timeEnd:   time.timeFrom(syndicate['Expiry']['$date']['$numberLong']),
        ...cetusTime(syndicate)
      };
    }
  });
  return cetus;
}
