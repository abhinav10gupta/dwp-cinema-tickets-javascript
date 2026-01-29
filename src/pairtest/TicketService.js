// import TicketTypeRequest from './lib/TicketTypeRequest.js';
const InvalidPurchaseException = require('./lib/InvalidPurchaseException.js');
const TicketPaymentService = require('../thirdparty/paymentgateway/TicketPaymentService.js');
const SeatReservationService = require('../thirdparty/seatbooking/SeatReservationService.js');
const {CONSTANTS, PRICES} = require('./config/cinemaRules.js');

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
    if(!Number.isInteger(accountId) || accountId <= 0){
      throw new InvalidPurchaseException('Invalid accountId. Must be a positive integer.');
    }

    if(ticketTypeRequests.length === 1 && Array.isArray(ticketTypeRequests[0])){
      ticketTypeRequests = ticketTypeRequests[0];
    }
    
    const totals = { INFANT: 0, CHILD: 0, ADULT: 0}
    const MAX_TICKETS = CONSTANTS.MAX_TICKETS;
   
    for (const req of ticketTypeRequests) {
      if ( !req || typeof req.getTicketType !== 'function' || typeof req.getNoOfTickets !== 'function') {
        throw new InvalidPurchaseException('Invalid ticket request.');
      }
      const type = String(req.getTicketType()).toUpperCase();
      const qty = req.getNoOfTickets();
      if(!Number.isInteger(qty) || qty < 0 ){
        throw new InvalidPurchaseException('Invalid number of tickets. Must be a positive integer.');
      }

      if(!['INFANT', 'CHILD', 'ADULT'].includes(type)) {
        throw new InvalidPurchaseException(`Unknown ticket type: ${type}.`);
      }

      totals[type] += qty;
    }


    const totalAmount = totals.ADULT * PRICES.ADULT + totals.CHILD * PRICES.CHILD; // Infants are free
    const totalSeats = totals.ADULT + totals.CHILD; // No seat allocated to infants
    const totalTickets = totals.ADULT + totals.CHILD + totals.INFANT;
    
    if ( totalTickets === 0 ) {
      throw new InvalidPurchaseException('Total tickets must be atleast 1');
    }

    if(( totals.CHILD > 0 || totals.INFANT > 0) && totals.ADULT === 0){
      throw new InvalidPurchaseException('Child/Infant ticket requires atleast one Adult.');
    }

    if (totalTickets > MAX_TICKETS) {
      throw new InvalidPurchaseException(`Cannot purchase more than ${MAX_TICKETS} tickets.`);
    }

    this.paymentService.makePayment(accountId, totalAmount);
    this.seatService.reserveSeat(accountId, totalSeats);
  }
}

module.exports = TicketService;
 