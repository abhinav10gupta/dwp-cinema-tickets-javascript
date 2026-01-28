'use-strict';

const TicketService = require('../src/pairtest/TicketService');
const TicketTypeRequest = require('../src/pairtest/lib/TicketTypeRequest');
const InvalidPurchaseException = require('../src/pairtest/lib/InvalidPurchaseException');

//Third Party Services 
const TicketPaymentService = require('../src/thirdparty/paymentgateway/TicketPaymentService');
const SeatReservationService = require('../src/thirdparty/seatbooking/SeatReservationService');

describe('TicketService - basic happy journey path', () => {
    let service;
    let paymentSpy;
    let seatSpy;

    beforeEach(() => {
        paymentSpy = jest
            .spyOn(TicketPaymentService.prototype, 'makePayment')
            .mockImplementation(() => {});
        seatSpy = jest
            .spyOn(SeatReservationService.prototype, 'reserveSeat')
            .mockImplementation(() => {});
        service = new TicketService(); // Keep the interface unchanged.
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('1st Case : 1 Adult pay £25 and reserves 1 seat', () => {
        // Act
        service.purchaseTickets(1, new TicketTypeRequest('ADULT', 1));

        //Assert 
        expect(paymentSpy).toHaveBeenCalledTimes(1);
        expect(paymentSpy).toHaveBeenCalledWith(1, 25);
        expect(seatSpy).toHaveBeenCalledTimes(1);
        expect(seatSpy).toHaveBeenCalledWith(1,1);
    });

    test('2 adults, 1 Child, 1 Infant -> pay £65 and reserves 3 seat', () => {
        service.purchaseTickets(
            123,
            new TicketTypeRequest('ADULT', 2),
            new TicketTypeRequest('CHILD', 1),
            new TicketTypeRequest('INFANT', 1)
        );

        expect(paymentSpy).toHaveBeenCalledWith(123, 65);
        expect(seatSpy).toHaveBeenCalledWith(123, 3);
    });
})