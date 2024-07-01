const pool = require('../config/config');

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
}

module.exports = VendorController;