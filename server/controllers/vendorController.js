const pool = require('../config/config');
const moment = require('moment');

class VendorController {

    static async getAllTicketThirdParty(req, res, next) {
        try {
            const vendor = req.userAccount?.vendor;
            const { 
                msar_area_name, 
                Link, 
                cpdt_name, 
                mlink_cid_main, 
                tpty_third_no, 
                tpty_service, 
                tpty_progress,
                search,
                page = 1,
                limit = 10
            } = req.query;
    
            let query = 'SELECT * FROM ticket_thirdparty WHERE cpdt_name = $1';
            let countQuery = 'SELECT COUNT(*) FROM ticket_thirdparty WHERE cpdt_name = $1';
            let values = [vendor];
            let conditions = [];
            let paramCount = 1;
    
            // Menambahkan kondisi pencarian
            if (search) {
                conditions.push(`(
                    LOWER(msar_area_name) LIKE LOWER($${++paramCount}) OR
                    LOWER("Link") LIKE LOWER($${paramCount}) OR
                    LOWER(cpdt_name) LIKE LOWER($${paramCount}) OR
                    LOWER(mlink_cid_main) LIKE LOWER($${paramCount}) OR
                    LOWER(tpty_third_no) LIKE LOWER($${paramCount}) OR
                    LOWER(tpty_service) LIKE LOWER($${paramCount}) OR
                    LOWER(tpty_progress) LIKE LOWER($${paramCount})
                )`);
                values.push(`%${search}%`);
            }
    
            // Menambahkan filter untuk setiap kolom
            if (msar_area_name) {
                conditions.push(`msar_area_name = $${++paramCount}`);
                values.push(msar_area_name);
            }
            if (Link) {
                conditions.push(`"Link" = $${++paramCount}`);
                values.push(Link);
            }
            if (cpdt_name) {
                conditions.push(`cpdt_name = $${++paramCount}`);
                values.push(cpdt_name);
            }
            if (mlink_cid_main) {
                conditions.push(`mlink_cid_main = $${++paramCount}`);
                values.push(mlink_cid_main);
            }
            if (tpty_third_no) {
                conditions.push(`tpty_third_no = $${++paramCount}`);
                values.push(tpty_third_no);
            }
            if (tpty_service) {
                conditions.push(`tpty_service = $${++paramCount}`);
                values.push(tpty_service);
            }
            if (tpty_progress) {
                conditions.push(`tpty_progress = $${++paramCount}`);
                values.push(tpty_progress);
            }
    
            // Menambahkan kondisi ke query
            if (conditions.length) {
                query += ' AND ' + conditions.join(' AND ');
                countQuery += ' AND ' + conditions.join(' AND ');
            }
    
            // Menambahkan paginasi
            const offset = (page - 1) * limit;
            query += ` ORDER BY tpty_third_no DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
            values.push(limit, offset);
    
            // Eksekusi query
            const [resultCount, resultData] = await Promise.all([
                pool.query(countQuery, values.slice(0, -2)),
                pool.query(query, values)
            ]);
    
            const totalItems = parseInt(resultCount.rows[0].count);
            const totalPages = Math.ceil(totalItems / limit);
    
            res.status(200).json({
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: parseInt(page),
                    itemsPerPage: parseInt(limit)
                },
                data: resultData.rows
            });
        } catch (error) {
            console.error('Error in getAllTicketThirdParty:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAllTicketThirdPartyClean(req, res, next) {
        try {
            const vendor = req.userAccount?.vendor;
            const { 
                Month, 
                msar_area_name, 
                Link, 
                mlink_cid_main, 
                page = 1,
                limit = 10,
                search
            } = req.query;
    
            let query = 'SELECT * FROM ticket_thirdpartyclean WHERE cpdt_name = $1';
            let countQuery = 'SELECT COUNT(*) FROM ticket_thirdpartyclean WHERE cpdt_name = $1';
            let values = [vendor];
            let conditions = [];
            let paramCount = 1;
    
            // Menambahkan kondisi pencarian
            if (search) {
                conditions.push(`(
                    LOWER("Month"::text) LIKE LOWER($${++paramCount}) OR
                    LOWER(msar_area_name) LIKE LOWER($${paramCount}) OR
                    LOWER("Link") LIKE LOWER($${paramCount}) OR
                    LOWER(mlink_cid_main) LIKE LOWER($${paramCount})
                )`);
                values.push(`%${search}%`);
            }
    
            // Menambahkan filter untuk setiap kolom
            if (Month) {
                conditions.push(`"Month" = $${++paramCount}`);
                values.push(Month);
            }
            if (msar_area_name) {
                conditions.push(`msar_area_name = $${++paramCount}`);
                values.push(msar_area_name);
            }
            if (Link) {
                conditions.push(`"Link" = $${++paramCount}`);
                values.push(Link);
            }
            if (mlink_cid_main) {
                conditions.push(`mlink_cid_main = $${++paramCount}`);
                values.push(mlink_cid_main);
            }
    
            // Menambahkan kondisi ke query
            if (conditions.length) {
                query += ' AND ' + conditions.join(' AND ');
                countQuery += ' AND ' + conditions.join(' AND ');
            }
    
            // Menambahkan paginasi
            const offset = (page - 1) * limit;
            query += ` ORDER BY "Month" DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
            values.push(limit, offset);
    
            // Eksekusi query
            const [resultCount, resultData] = await Promise.all([
                pool.query(countQuery, values.slice(0, -2)),
                pool.query(query, values)
            ]);
    
            const totalItems = parseInt(resultCount.rows[0].count);
            const totalPages = Math.ceil(totalItems / limit);
    
            res.status(200).json({
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: parseInt(page),
                    itemsPerPage: parseInt(limit)
                },
                data: resultData.rows
            });
        } catch (error) {
            console.error('Error in getAllTicketThirdPartyClean:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createTicketComplaint(req, res, next) {
        try {
          const { tpty_third_no } = req.params;
          const { mlink_cid_main, MTTR, photo, reason } = req.body;
      
          // Validasi input
          if (!mlink_cid_main || !MTTR || !photo || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
          }
      
          // Ambil nilai Month dari ticket_thirdparty
          const getMonthQuery = `
            SELECT "Month"
            FROM ticket_thirdparty
            WHERE tpty_third_no = $1
          `;
          const monthResult = await pool.query(getMonthQuery, [tpty_third_no]);
      
          if (monthResult.rows.length === 0) {
            return res.status(404).json({ error: 'No matching ticket found in ticket_thirdparty' });
          }
      
          const Month = monthResult.rows[0].Month;
      
          // Generate id_ticket_complaint
          const today = moment();
          const dateStr = today.format('YYYYMMDD');
          
          // Get the latest ticket number for today
          const getLatestTicketQuery = `
            SELECT id_ticket_complaint 
            FROM ticket_complaint 
            WHERE id_ticket_complaint LIKE $1 
            ORDER BY id_ticket_complaint DESC 
            LIMIT 1
          `;
          const latestTicket = await pool.query(getLatestTicketQuery, [`TT${dateStr}%`]);
          
          let ticketNumber = '01';
          if (latestTicket.rows.length > 0) {
            const lastNumber = parseInt(latestTicket.rows[0].id_ticket_complaint.slice(-2));
            ticketNumber = (lastNumber + 1).toString().padStart(2, '0');
          }
      
          const id_ticket_complaint = `TT${dateStr}${ticketNumber}`;
      
          const insertQuery = `
            INSERT INTO ticket_complaint (
              id_ticket_complaint, mlink_cid_main, tpty_third_no, "Month", "MTTR(sec)", photo, reason, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          `;
      
          const values = [id_ticket_complaint, mlink_cid_main, tpty_third_no, Month, MTTR, photo, reason, 'waiting'];
      
          const result = await pool.query(insertQuery, values);
      
          res.status(201).json({
            message: 'Ticket complaint created successfully',
            data: result.rows[0]
          });
        } catch (error) {
          console.error('Error in createTicketComplaint:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }

      static async updateTicketComplaint(req, res, next) {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
      
          const { id_ticket_complaint } = req.params;
          const { status } = req.body;
      
          if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected".' });
          }
      
          // Update status of ticket_complaint
          const updateComplaintQuery = `
            UPDATE ticket_complaint
            SET status = $1
            WHERE id_ticket_complaint = $2
            RETURNING *
          `;
          const complaintResult = await client.query(updateComplaintQuery, [status, id_ticket_complaint]);
      
          if (complaintResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Ticket complaint not found' });
          }
      
          const updatedComplaint = complaintResult.rows[0];
      
          if (status === 'accepted') {
            // Update MTTR in ticket_thirdpartyclean
            const updateCleanQuery = `
              UPDATE ticket_thirdpartyclean
              SET "MTTR(sec)" = "MTTR(sec)" - $1
              WHERE mlink_cid_main = $2 AND "Month" = $3
              RETURNING *
            `;
            const cleanResult = await client.query(updateCleanQuery, [
              updatedComplaint['MTTR(sec)'],
              updatedComplaint.mlink_cid_main,
              updatedComplaint.Month
            ]);
      
            if (cleanResult.rows.length === 0) {
              await client.query('ROLLBACK');
              return res.status(404).json({ error: 'Matching record in ticket_thirdpartyclean not found' });
            }
      
            // Update MTTR(final) in ticket_thirdparty
            const updateThirdPartyQuery = `
              UPDATE ticket_thirdparty
              SET "MTTR(final)" = "MTTR(sec)" - $1
              WHERE tpty_third_no = $2
              RETURNING *
            `;
            const thirdPartyResult = await client.query(updateThirdPartyQuery, [
              updatedComplaint['MTTR(sec)'],
              updatedComplaint.tpty_third_no
            ]);
      
            if (thirdPartyResult.rows.length === 0) {
              await client.query('ROLLBACK');
              return res.status(404).json({ error: 'Matching record in ticket_thirdparty not found' });
            }
      
            await client.query('COMMIT');
      
            res.status(200).json({
              message: 'Ticket complaint updated and MTTR adjusted successfully',
              updatedComplaint: updatedComplaint,
              updatedCleanTicket: cleanResult.rows[0],
              updatedThirdPartyTicket: thirdPartyResult.rows[0]
            });
          } else {
            // If status is 'rejected', we only update the status
            await client.query('COMMIT');
            res.status(200).json({
              message: 'Ticket complaint rejected',
              updatedComplaint: updatedComplaint
            });
          }
        } catch (error) {
          await client.query('ROLLBACK');
          console.error('Error in updateTicketComplaint:', error);
          res.status(500).json({ error: 'Internal server error' });
        } finally {
          client.release();
        }
      }
}

module.exports = VendorController;