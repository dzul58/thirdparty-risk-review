const pool = require('../config/config');

class VendorController {

    static async getAllTicketThirdParty(req, res, next) {
        try {
            let query;
            let values;
            const vendor = req.userAccount?.vendor; // optional chaining

            query = 'SELECT * FROM ticket_thirdparty WHERE cpdt_name = $1';
            values = [vendor];

            const result = await pool.query(query, values);
            const ticket_data = result.rows;

            res.status(200).json(ticket_data);
        } catch (error) {
            console.error('Error in getAllVendorTicket:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAllTicketThirdPartyClean(req, res, next) {
        try {
            let query;
            let values;
            const vendor = req.userAccount?.vendor; // optional chaining

            query = 'SELECT * FROM ticket_thirdpartyclean WHERE cpdt_name = $1';
            values = [vendor];

            const result = await pool.query(query, values);
            const ticket_data = result.rows;

            res.status(200).json(ticket_data);
        } catch (error) {
            console.error('Error in getAllVendorTicket:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = VendorController;