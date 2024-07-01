const pool = require('../config/config');

class TicketController {
    static async getAllVendorTicket(req, res, next) {
        try {
            let query;
            let values;
            const vendor = req.userAccount?.vendor; // optional chaining

            if (vendor) {
                // Jika ada nilai vendor, ambil data sesuai vendor
                query = 'SELECT * FROM ticket_thirdpartyclean WHERE cpdt_name = $1';
                values = [vendor];
            } else {
                // Jika tidak ada nilai vendor, ambil semua data
                query = 'SELECT * FROM ticket_thirdpartyclean';
                values = [];
            }

            const result = await pool.query(query, values);
            const ticket_data = result.rows;

            res.status(200).json(ticket_data);
        } catch (error) {
            console.error('Error in getAllVendorTicket:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = TicketController;