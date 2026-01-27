// import TicketTypeRequest from './lib/TicketTypeRequest.js';
const InvalidPurchaseException = require('./lib/InvalidPurchaseException.js');
const TicketPaymentService = require('../thirdparty/paymentgateway/TicketPaymentService.js');
const SeatReservationService = require('../thirdparty/seatbooking/SeatReservationService.js');

class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  // To keep interface intact - No DI in constructor 

  constructor(){
    this.paymentService = new TicketPaymentService();
    this.seatService = new SeatReservationService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    throw new InvalidPurchaseException('Not implemented yet');
  }
}

module.exports = TicketService;
