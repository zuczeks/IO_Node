//  http://77.55.192.26:2137/

const express = require('express');
const { Pool } = require('pg');

config = {
    host: 'sql.server928985.nazwa.pl',
    user: 'server928985_debater', // default process.env.PGUSER || process.env.USER
    password: 'AleksanderNieTakiWielki99%', //default process.env.PGPASSWORD
    database: 'server928985_debater', // default process.env.PGDATABASE || process.env.USER
    port: 5432, // default process.env.PGPORT
    query_timeout: 5000
  }

const pool = new Pool(config);

const app = express();
app.use(express.json())
const node_port = 2137;
app.listen(node_port, () => console.log(`Listening on port ${node_port}`));

/////////////////////       Debug Section           //////////////////////////

tournament_record = {start_date: '2022-03-03T23:00:00.000Z', name: 'Nazwa debugowej debaty', city: 'Moskwa', location: 'Plac czerwony'}
phase_record = {name: 'Faza2', structure: 'NULL'}
debate_record = {d_time: '23:00:00.000', d_date: '2022-03-03', location: 'pod cerkwia', team_1: 'NULL', team_2: 'NULL'}

app.get('/debug/database', (req, res) => {
    data = '';
    pool.query({text: "SELECT 'Database connection correct!' AS message"}, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/debug/tables', (req, res) => {
    data = [];
    pool.query({text: 'SELECT * FROM pg_catalog.pg_tables'}, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            qres.rows.forEach(row => {
                console.log({table: row.tablename, schema: row.schemaname});
                data.push({table: row.tablename, schema: row.schemaname})
            });
            res.send(data);
        }
    });
});

app.get('/debug/phase', (req, res) => {
    data = '';
    pool.query(P_list, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows);
        }
    });
});

app.get('/debug/debate', (req, res) => {
    data = '';
    pool.query(D_list, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows);
        }
    });
});

app.get('/debug/node', (req, res) => {
    res.send('Node server is working!');
    console.log('Sent response');
});

/////////////////////       Database Queries        //////////////////////////

T_list = {
    name:   'tournament_list',
    text:   'SELECT * FROM "Tournament"',
    values: []
}

D_list = {
    name:   'debate_list',
    text:   'SELECT * FROM "Debate"',
    values: []
}

P_list = {
    name:   'phase_list',
    text:   'SELECT * FROM "Tournament_phase"',
    values: []
}

D_list_phase = {
    name:   'debate_list_by_phase',
    text:   'SELECT * FROM "Debate" WHERE "Debate".tournament_id = $1 AND "Debate".phase_id = $2',
    values: []
}

P_list_tournament = {
    name:   'phase_list_by_debate',
    text:   'SELECT * FROM "Tournament_phase" WHERE "Tournament_phase".tournament_id = $1',
    values: []
}

U_list = {
    name:   'list_users',
    text:   'SELECT * FROM "User"',
    values: []
}

A_list = {
    name:   'list_admin',
    text:   'SELECT * FROM "Admin" a JOIN "User" u ON a.user_id = u.id',
    values: []
}

TE_list = {
    name:   'list_team',
    text:   'SELECT * FROM "Team" tm WHERE tm.tournament_id = $1',
    values: []
}

TJ_list = {
    name:   'list_tournament_jury',
    text:   'SELECT * FROM "Tournament_jury" tj WHERE tj.tournament_id = $1',
    values: []
}

DJ_list = {
    name:   'list_debate_juror',
    text:   'SELECT * FROM "Debate_juror" dj WHERE dj.debate_id = $1',
    values: []
}

TA_list = {
    name:   'list_tournament_admin',
    text:   'SELECT * FROM "Tournament_admin" ta WHERE ta.tournament_id = $1',
    values: []
}

TM_list = {
    name:   'list_tournament_marshall',
    text:   'SELECT * FROM "Tournament_marshall" tm WHERE tm.tournament_id = $1',
    values: []
}

TP_list = {
    name:   'list_tournament_participant',
    text:   'SELECT * FROM "Tournament_participant" tp WHERE tp.tournament_id = $1',
    values: []
}

T_insert = {
    name:   'insert_tournament',
    text:   'INSERT INTO "Tournament"(start_date, name, city, location) VALUES ($1, $2, $3, $4) RETURNING id',
    values: []
}

PH_insert = {
    name:   'insert_phase',
    text:   'INSERT INTO "Tournament_phase"(tournament_id, name, structure) VALUES ($1, $2, $3) RETURNING id',
    values: []
}

D_insert = {
    name:   'insert_debate',
    text:   'INSERT INTO "Debate"(tournament_id, phase_id, d_time, d_date, location, team_1, team_2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    values: []
}

U_insert = {
    name:   'insert_user',
    text:   'INSERT INTO "User"(actual_login, name, surname, email) VALUES ($1, $2, $3, $4) RETURNING id',
    values: []
}

A_insert = {
    name:   'delete_admin',
    text:   'INSERT INTO "Admin"(user_id) VALUES ($1)',
    values: []
}

TE_insert = {
    name:   'insert_team',
    text:   'INSERT INTO "Team"(tournament_id, name, speaker_1, speaker_2, speaker_3, speaker_4) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    values: []
}

TJ_insert = {
    name:   'insert_tournament_jury',
    text:   'INSERT INTO "Tournament_jury"(tournament_id, user_id) VALUES ($1, $2)',
    values: []
}

DJ_insert = {
    name:   'insert_debate_juror',
    text:   'INSERT INTO "Debate_juror"(jury_id, debate_id, evaluation, juror_feedback) VALUES ($1, $2, $3, $4)',
    values: []
}

TA_insert = {
    name:   'insert_tournament_admin',
    text:   'INSERT INTO "Tournament_admin"(tournament_id, user_id) VALUES ($1, $2)',
    values: []
}

TM_insert = {
    name:   'insert_tournament_marshall',
    text:   'INSERT INTO "Tournament_marshall"(tournament_id, user_id) VALUES ($1, $2)',
    values: []
}

TP_insert = {
    name:   'insert_tournament_participant',
    text:   'INSERT INTO "Tournament_participant"(tournament_id, user_id) VALUES ($1, $2)',
    values: []
}

T_delete = {
    name:   'delete_tournament',
    text:   'DELETE FROM "Tournament" WHERE "Tournament".id = $1',
    values: []
}

PH_delete = {
    name:   'delete_phase',
    text:   'DELETE FROM "Tournament_phase" ph WHERE ph.tournament_id = $1 AND ph.id = $2',
    values: []
}

D_delete = {
    name:   'delete_debate',
    text:   'DELETE FROM "Debate" d WHERE d.tournament_id = $1 AND d.phase_id = $2 AND d.id = $3',
    values: []
}

U_delete = {
    name:   'delete_user',
    text:   'DELETE FROM "User" u WHERE u.id = $1',
    values: []
}

A_delete = {
    name:   'insert_admin',
    text:   'DELETE FROM "Admin" a WHERE a.user_id = $1',
    values: []
}

TE_delete = {
    name:   'delete_team',
    text:   'DELETE FROM "Team" t WHERE t.tournament_id = $1 AND t.id = $2',
    values: []
}

TJ_delete = {
    name:   'delete_tournament_jury',
    text:   'DELETE FROM "Tournament_jury" tj WHERE tj.tournament_id = $1 AND tj.user_id = $2',
    values: []
}

DJ_delete = {
    name:   'delete_debate_juror',
    text:   'DELETE FROM "Debate_juror" dj WHERE dj.debate_id = $1 AND dj.jury_id = $2',
    values: []
}

TA_delete = {
    name:   'delete_tournament_admin',
    text:   'DELETE FROM "Tournament_admin" ta WHERE ta.tournament_id = $1 AND ta.user_id = $2',
    values: []
}

TM_delete = {
    name:   'delete_tournament_marshall',
    text:   'DELETE FROM "Tournament_marshall" tm WHERE tm.tournament_id = $1 AND tm.user_id = $2',
    values: []
}

TP_delete = {
    name:   'delete_tournament_participant',
    text:   'DELETE FROM "Tournament_participant" tp WHERE tp.tournament_id = $1 AND tp.user_id = $2',
    values: []
}
//////////////////////////////      Posts       /////////////////////////////////

app.post('/api/tournament', (req, res) => {
    b = req.body;
    ti = JSON.parse(JSON.stringify(T_insert));
    ti.values = [b.start_date, b.name, b.city, b.location];
    pool.query(ti, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/phase', (req, res) => {
    b = req.body;
    p = req.params;
    phi = JSON.parse(JSON.stringify(PH_insert));
    phi.values = [p.tid, b.name, b.structure];
    pool.query(phi, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/phase/:pid/debate', (req, res) => {
    b = req.body;
    p = req.params;
    di = JSON.parse(JSON.stringify(D_insert));
    di.values = [p.tid, p.pid, b.d_time, b.d_date, b.location, b.team_1, b.team_2];
    pool.query(di, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/user', (req, res) => {
    b = req.body;
    ui = JSON.parse(JSON.stringify(U_insert));
    ui.values = [b.actual_login, b.name, b.surname, b.email];
    pool.query(ui, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/admin', (req, res) => {
    b = req.body;
    ai = JSON.parse(JSON.stringify(A_insert));
    ai.values = [b.user_id];
    pool.query(ai, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/team', (req, res) => {
    b = req.body;
    tei = JSON.parse(JSON.stringify(TE_insert));
    tei.values = [b.tournament_id, b.name, b.speaker_1, b.speaker_2, b.speaker_3, b.speaker_4];
    pool.query(tei, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/jury', (req, res) => {
    b = req.body;
    p = req.params;
    tji = JSON.parse(JSON.stringify(TJ_insert));
    tji.values = [p.tid, b.user_id];
    pool.query(tji, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/phase/:pid/debate/:did/juror', (req, res) => {
    b = req.body;
    p = req.params;
    dji = JSON.parse(JSON.stringify(DJ_insert));
    dji.values = [b.jury_id, p.did, b.evaluation, b.juror_feedback];
    pool.query(dji, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/admin', (req, res) => {
    b = req.body;
    p = req.params;
    tai = JSON.parse(JSON.stringify(TA_insert));
    tai.values = [p.tid, b.user_id];
    pool.query(tai, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/marshall', (req, res) => {
    b = req.body;
    p = req.params;
    tmi = JSON.parse(JSON.stringify(TM_insert));
    tmi.values = [p.tid, b.user_id];
    pool.query(tmi, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.post('/api/tournament/:tid/participant', (req, res) => {
    b = req.body;
    p = req.params;
    tpi = JSON.parse(JSON.stringify(TP_insert));
    tpi.values = [p.tid, b.user_id];
    pool.query(tpi, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

//////////////////////////////      Deletes     ////////////////////////////////////

app.delete('/api/tournament/:tid', (req, res) => {
    p = req.params;
    td = JSON.parse(JSON.stringify(T_delete));
    td.values.push(p.tid);
    pool.query(td, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send({Message: 'Success'})
        }
    });
});

app.delete('/api/tournament/:tid/phase/:pid', (req, res) => {
    p = req.params;
    pd = JSON.parse(JSON.stringify(PH_delete));
    pd.values.push(p.tid, p.pid);
    pool.query(pd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send({Message: 'Success'})
        }
    });
});

app.delete('/api/tournament/:tid/phase/:pid/debate/:did', (req, res) => {
    p = req.params;
    dd = JSON.parse(JSON.stringify(D_delete));
    dd.values.push(p.tid, p.pid, p.did);
    pool.query(dd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send({Message: 'Success'})
        }
    });
});

app.delete('/api/user/:uid', (req, res) => {
    p = req.params;
    ud = JSON.parse(JSON.stringify(U_delete));
    ud.values = [p.uid];
    pool.query(ud, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/admin/:uid', (req, res) => {
    p = req.params;
    ad = JSON.parse(JSON.stringify(A_delete));
    ad.values = [p.uid];
    pool.query(ad, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/tournament/:tid/team/:teid', (req, res) => {
    p = req.params;
    ted = JSON.parse(JSON.stringify(TE_delete));
    ted.values = [p.tid, p.teid];
    pool.query(ted, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/tournament/:tid/jury/:jid', (req, res) => {
    p = req.params;
    tjd = JSON.parse(JSON.stringify(TJ_delete));
    tjd.values = [p.tid, p.jid];
    pool.query(tjd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/tournament/:tid/phase/:pid/debate/:did/juror/:jid', (req, res) => {
    p = req.params;
    djd = JSON.parse(JSON.stringify(DJ_delete));
    djd.values = [p.did, p.jid];
    pool.query(djd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/tournament/:tid/admin/:aid', (req, res) => {
    b = req.body;
    p = req.params;
    tad = JSON.parse(JSON.stringify(TA_delete));
    tad.values = [p.tid, p.aid];
    pool.query(tad, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/tournament/:tid/marshall/:mid', (req, res) => {
    p = req.params;
    tmd = JSON.parse(JSON.stringify(TM_delete));
    tmd.values = [p.tid, p.mid];
    pool.query(tmd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

app.delete('/api/tournament/:tid/participant/:pid', (req, res) => {
    b = req.body;
    p = req.params;
    tpd = JSON.parse(JSON.stringify(TP_delete));
    tpd.values = [p.tid, p.pid];
    pool.query(tpd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows[0])
            res.send(qres.rows[0])
        }
    });
});

//////////////////////////////      Gets        ////////////////////////////////////

app.get('/api/tournament', (req, res) => {
    data = '';
    pool.query(T_list, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows);
        }
    });
});

app.get('/api/tournament/:tid/phase', (req, res) => {
    p = req.params;
    ptl = JSON.parse(JSON.stringify(P_list_tournament));
    ptl.values.push(p.tid);
    pool.query(ptl, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/phase/:pid/debate', (req, res) => {
    p = req.params;
    dpl = JSON.parse(JSON.stringify(D_list_phase));
    dpl.values.push(p.tid, p.pid);
    pool.query(dpl, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/user', (req, res) => {
    p = req.params;
    ud = JSON.parse(JSON.stringify(U_list));
    pool.query(ud, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/admin', (req, res) => {
    p = req.params;
    ad = JSON.parse(JSON.stringify(A_list));
    pool.query(ad, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/team', (req, res) => {
    p = req.params;
    ted = JSON.parse(JSON.stringify(TE_list));
    ted.values = [p.tid];
    pool.query(ted, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/jury', (req, res) => {
    p = req.params;
    tjd = JSON.parse(JSON.stringify(TJ_list));
    tjd.values = [p.tid];
    pool.query(tjd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/phase/:pid/debate/:did/juror', (req, res) => {
    p = req.params;
    djd = JSON.parse(JSON.stringify(DJ_list));
    djd.values = [p.did];
    pool.query(djd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/admin', (req, res) => {
    b = req.body;
    p = req.params;
    tad = JSON.parse(JSON.stringify(TA_list));
    tad.values = [p.tid];
    pool.query(tad, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/marshall', (req, res) => {
    p = req.params;
    tmd = JSON.parse(JSON.stringify(TM_list));
    tmd.values = [p.tid];
    pool.query(tmd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});

app.get('/api/tournament/:tid/participant', (req, res) => {
    b = req.body;
    p = req.params;
    tpd = JSON.parse(JSON.stringify(TP_list));
    tpd.values = [p.tid];
    pool.query(tpd, (err, qres) => {
        if (err) {
            console.log(err.stack)
            res.status(500)
            res.send(err.stack)
        } 
        else {
            console.log(qres.rows)
            res.send(qres.rows)
        }
    });
});