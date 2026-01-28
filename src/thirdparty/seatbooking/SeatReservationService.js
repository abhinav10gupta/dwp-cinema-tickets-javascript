/* eslint-disable */

class SeatReservationService {
  reserveSeat(accountId, totalSeatsToAllocate) {
    if (!Number.isInteger(accountId)) {
      throw new TypeError('accountId must be an integer');
    }
    console.log("reserve seat account ID --> ", accountId);

    if (!Number.isInteger(totalSeatsToAllocate)) {
      throw new TypeError('totalSeatsToAllocate must be an integer');
    }
  }
}

module.exports = SeatReservationService;
