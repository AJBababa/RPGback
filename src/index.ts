import express from "express";
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.static(path.join(__dirname, 'dist/RPG')));


let users: { [roomCode: string]: any[] } = {};

interface RoomState {
    users: any[]; // Jugadores conectados en la sala
    enemy: {
        current_health_points: number;
        max_health_points: number;
        damage: number;
    };
    turnIndex: number; // 0 = enemigo, 1 = player1, 2 = player2
}
const roomStates: { [roomCode: string]: RoomState } = {};



import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

import * as db from './db-connection';




// ---------- RPG ---------- //

//primer get del user 
app.get('/player/:id', async (req, res) => {
    console.log(`Petición recibida al endpoint GET /player/:id.`);
    console.log(`Parámetro recibido por URL: ${req.params.id}`);

    try {
        let query = `SELECT * FROM players WHERE id='${req.params.id}'`;
        let db_response = await db.query(query);

        if (db_response.rows.length > 0) {
            console.log(`Player found: ${db_response.rows[0].id}`);
            res.json(db_response.rows[0]);
        } else {
            console.log(`Player not found.`)
            res.json(`Player not found`);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Crear player
app.post('/player', jsonParser, async (req, res) => {

    console.log(`Petición recibida al endpoint POST /player. 
        Body: ${JSON.stringify(req.body)}`);

    try {
        const body = req.body;
        const query = `
            INSERT INTO players (
                id, name, max_health_points, current_health_points, max_mana_points, current_mana_points, strength,
                magical_damage, defense, critical_chance, critical_damage,
                experience, level, currency, image_url
            ) VALUES (
                '${body.id}', '${body.name}', ${body.max_health_points}, ${body.current_health_points}, ${body.max_mana_points}, 
                ${body.current_mana_points}, ${body.strength}, ${body.magical_damage}, ${body.defense}, ${body.critical_chance}, 
                ${body.critical_damage}, ${body.experience}, ${body.level}, ${body.currency}, '${body.image_url}'
            );
        `;

        const db_response = await db.query(query);

        console.log(db_response);

        if (db_response.rowCount === 1) {
            res.json('Player created.');
        } else {
            res.json('Error creating player.');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//todos los items cumunes
app.get('/items/comunes', async (req, res) => {
    console.log(`Petición recibida al endpoint GET /items/comunes`);
    console.log(`Parámetro recibido por URL: ${req.params.id}`);

    try {
        let query = `SELECT * FROM items WHERE rarity = 'common'`;
        let db_response = await db.query(query);

        if (db_response.rows.length > 0) {
            console.log(`items found: ${db_response.rows}`);
            res.json(db_response.rows);
        } else {
            console.log(`items not found.`)
            res.json(`items not found`);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// items hasta epicos
app.get('/items/comunes-raros-epicos', async (req, res) => {
    console.log(`Petición recibida al endpoint GET /items/comunes`);
    console.log(`Parámetro recibido por URL: ${req.params.id}`);

    try {
        let query = `SELECT * FROM items WHERE rarity IN ('common', 'rare', 'epic')`;
        let db_response = await db.query(query);

        if (db_response.rows.length > 0) {
            console.log(`items found: ${db_response.rows}`);
            res.json(db_response.rows);
        } else {
            console.log(`items not found.`)
            res.json(`items not found`);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//items random tienda
app.get('/items/random', async (req, res) => {
    console.log(`Petición recibida al endpoint GET /items/random`);
    console.log(`Parámetro recibido por URL: ${req.params.id}`);

    try {
        let query = `SELECT * FROM items ORDER BY RANDOM() LIMIT 4`;
        let db_response = await db.query(query);

        if (db_response.rows.length > 0) {
            console.log(`items found: ${db_response.rows}`);
            res.json(db_response.rows);
        } else {
            console.log(`items not found.`)
            res.json(`items not found`);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// al salir de la dungeon actualizar las stats, vida y currency, añadir mas en un futuro si eso, maná cuando lo haga
app.post('/player/updateStats', jsonParser, async (req, res) => {

    const { id, current_health_points, currency } = req.body;

    try {
        const query = `UPDATE players SET current_health_points = ${current_health_points}, currency = ${currency} WHERE id = '${id}'`;

        const db_response = await db.query(query);

        if (db_response.rowCount === 1) {
            res.json('Player updated successfully.');
        } else {
            res.status(404).json('Player not found.');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//equipar el gear al player
app.post('/gear/:id/equip', jsonParser, async (req, res) => {
    const playerId = req.params.id;
    const { type, itemId } = req.body;

    try {
        const checkQuery = `SELECT * FROM gear WHERE id = '${playerId}'`;
        const checkRes = await db.query(checkQuery);

        let query;
        if (checkRes.rows.length === 0) {
            query = `
        INSERT INTO gear (id, ${type})
        VALUES ('${playerId}', ${itemId})
      `;
        } else {
            query = `
        UPDATE gear SET ${type} = ${itemId}
        WHERE id = '${playerId}'
      `;
        }

        const dbRes = await db.query(query);
        res.json({ message: 'Ítem equipado correctamente.' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al equipar ítem.');
    }
});

//para ver el gear del player
app.get('/gear/:id', async (req, res) => {
    const playerId = req.params.id;
    try {
        const query = `SELECT * FROM gear WHERE id = '${playerId}'`;
        const result = await db.query(query);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Gear not found for player' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



















// ---------- WEB SOCKET ---------- //




io.on('connection', (socket: any) => {

    socket.on('disconnect', () => {
        const room = socket.data.room_code;
        const userId = socket.data.user_email;

        if (room && userId && users[room]) {
            // Filtrar fuera al usuario desconectado
            users[room] = users[room].filter(user => user.id !== userId);

            // borrar sala si no hay players
            if (users[room].length === 0) {
                delete users[room];
                
            }

            // Emitir lista actualizada
            io.to(room).emit('user_list' + room, users[room]);
        }
    });


    socket.on('join room', (payload: any) => {
        const info = payload.info;
        const roomCode = info.roomCode;

        socket.join(info.roomCode);
        socket.data.username = info.playerName;
        socket.data.room_code = info.roomCode;
        socket.data.user_email = info.user_email;

        // Si no existe sala crear como array vacío
        if (!users[info.roomCode]) {
            users[info.roomCode] = [];
        }

        // Evitar que un jugador se agregue dos veces
        const alreadyInRoom = users[info.roomCode].some(u => u.id === info.user_email);
        if (!alreadyInRoom) {
            users[info.roomCode].push(info);
        }

        // Enviar lista actualizada a todos los sockets en la sala
        io.to(info.roomCode).emit('user_list' + info.roomCode, users[info.roomCode]);


        // Si hay dos jugadores // --- empieza el juego --- //
        if (users[info.roomCode].length === 2 && !roomStates[roomCode]) {
            roomStates[roomCode] = {
                users: users[roomCode],
                enemy: {
                    current_health_points: 150,
                    max_health_points: 150,
                    damage: 15
                },
                turnIndex: 0
            };

            io.to(roomCode).emit('start_game');

            setTimeout(() => {
                handleEnemyTurn(roomCode);
            }, 1000);
        }

        // Si hay más de 2 expulsar
        if (users[info.roomCode].length > 2) {
            socket.emit('room full', { message: 'La sala ya está llena.' });
            return;
        }
    });

    function getSocketIdByEmail(user_email: string): string | undefined {
        const sockets = io.of("/").sockets;
        let targetId: string | undefined;

        sockets.forEach((socket, id) => {
            if (socket.data.user_email === user_email) {
                targetId = id;
            }
        });

        return targetId;
    }

    function handleEnemyTurn(roomCode: string) {
        const state = roomStates[roomCode];
        if (!state) return;

        const damage = state.enemy.damage;

        for (const player of state.users) {
            const socketId = getSocketIdByEmail(player.user_email);
            if (socketId) {
                io.to(socketId).emit('enemy_attack', {
                    damage: damage
                });
            }
        }


        state.turnIndex = 1;

        const next = state.users[0];
        io.to(roomCode).emit('set_turn', { user_email: next.user_email });
    }


    socket.on('update_my_hp', (data: { room: string, user_email: string, current_health_points: number }) => {
        socket.to(data.room).emit('update_other_hp', {
            user_email: data.user_email,
            current_health_points: data.current_health_points
        });

        if (data.current_health_points <= 0) {
            console.log(`Jugador ${data.user_email} ha muerto. Fin de la partida cooperativa.`);
            io.to(data.room).emit('game_over', { loser: data.user_email });

            delete roomStates[data.room];
            delete users[data.room];
        }

    });

    socket.on('player_attack', (data: { room: string, user_email: string, damage: number }) => {
        const state = roomStates[data.room];
        if (!state) return;

        // Aplicar daño al enemigo
        state.enemy.current_health_points -= data.damage;
        if (state.enemy.current_health_points < 0) {
            state.enemy.current_health_points = 0;
        }

        // Emitir daño al enemigo para todos
        io.to(data.room).emit('player_attack', { damage: data.damage });

        // Si el enemigo muere
        if (state.enemy.current_health_points <= 0) {
            io.to(data.room).emit('enemy_defeated');
            delete roomStates[data.room];
            delete users[data.room];
            return;
        }

        // Cambiar turno
        if (state.turnIndex === 1) {
            state.turnIndex = 2;
            const next = state.users[1];
            io.to(data.room).emit('set_turn', { user_email: next.user_email });

        } else if (state.turnIndex === 2) {
            state.turnIndex = 0;
            setTimeout(() => {
                handleEnemyTurn(data.room);
            }, 1000);
        }
    });








});



// ---------- SERVIDOR ---------- //

const port = process.env.PORT || 3000

server.listen(port, () =>
    console.log(`App listening on PORT ${port}.

    ENDPOINTS:
    
     - GET /player/:id
     - GET /items/comunes
     - GET /gear/:id
     - POST /player
     - POST /player/update-stats

     `));