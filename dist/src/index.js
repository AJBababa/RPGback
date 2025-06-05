"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
app.use(cors_1.default());
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist/RPG')));
var users = {};
var roomStates = {};
var body_parser_1 = __importDefault(require("body-parser"));
var jsonParser = body_parser_1.default.json();
var db = __importStar(require("./db-connection"));
// ---------- RPG ---------- //
//primer get del user 
app.get('/player/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /player/:id.");
                console.log("Par\u00E1metro recibido por URL: " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM players WHERE id='" + req.params.id + "'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("Player found: " + db_response.rows[0].id);
                    res.json(db_response.rows[0]);
                }
                else {
                    console.log("Player not found.");
                    res.json("Player not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Crear player
app.post('/player', jsonParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, query, db_response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint POST /player. \n        Body: " + JSON.stringify(req.body));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                body = req.body;
                query = "\n            INSERT INTO players (\n                id, name, max_health_points, current_health_points, max_mana_points, current_mana_points, strength,\n                magical_damage, defense, critical_chance, critical_damage,\n                experience, level, currency, image_url\n            ) VALUES (\n                '" + body.id + "', '" + body.name + "', " + body.max_health_points + ", " + body.current_health_points + ", " + body.max_mana_points + ", \n                " + body.current_mana_points + ", " + body.strength + ", " + body.magical_damage + ", " + body.defense + ", " + body.critical_chance + ", \n                " + body.critical_damage + ", " + body.experience + ", " + body.level + ", " + body.currency + ", '" + body.image_url + "'\n            );\n        ";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                console.log(db_response);
                if (db_response.rowCount === 1) {
                    res.json('Player created.');
                }
                else {
                    res.json('Error creating player.');
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//todos los items cumunes
app.get('/items/comunes', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /items/comunes");
                console.log("Par\u00E1metro recibido por URL: " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM items WHERE rarity = 'common'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("items found: " + db_response.rows);
                    res.json(db_response.rows);
                }
                else {
                    console.log("items not found.");
                    res.json("items not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error(err_3);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// items hasta epicos
app.get('/items/comunes-raros-epicos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /items/comunes");
                console.log("Par\u00E1metro recibido por URL: " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM items WHERE rarity IN ('common', 'rare', 'epic')";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("items found: " + db_response.rows);
                    res.json(db_response.rows);
                }
                else {
                    console.log("items not found.");
                    res.json("items not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//items random tienda
app.get('/items/random', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /items/random");
                console.log("Par\u00E1metro recibido por URL: " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM items ORDER BY RANDOM() LIMIT 4";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("items found: " + db_response.rows);
                    res.json(db_response.rows);
                }
                else {
                    console.log("items not found.");
                    res.json("items not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.error(err_5);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// al salir de la dungeon actualizar las stats, vida y currency, añadir mas en un futuro si eso, maná cuando lo haga
app.post('/player/updateStats', jsonParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, current_health_points, currency, query, db_response, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, current_health_points = _a.current_health_points, currency = _a.currency;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                query = "UPDATE players SET current_health_points = " + current_health_points + ", currency = " + currency + " WHERE id = '" + id + "'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _b.sent();
                if (db_response.rowCount === 1) {
                    res.json('Player updated successfully.');
                }
                else {
                    res.status(404).json('Player not found.');
                }
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                console.error(err_6);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//equipar el gear al player
app.post('/gear/:id/equip', jsonParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, _a, type, itemId, checkQuery, checkRes, query, dbRes, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                playerId = req.params.id;
                _a = req.body, type = _a.type, itemId = _a.itemId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                checkQuery = "SELECT * FROM gear WHERE id = '" + playerId + "'";
                return [4 /*yield*/, db.query(checkQuery)];
            case 2:
                checkRes = _b.sent();
                query = void 0;
                if (checkRes.rows.length === 0) {
                    query = "\n        INSERT INTO gear (id, " + type + ")\n        VALUES ('" + playerId + "', " + itemId + ")\n      ";
                }
                else {
                    query = "\n        UPDATE gear SET " + type + " = " + itemId + "\n        WHERE id = '" + playerId + "'\n      ";
                }
                return [4 /*yield*/, db.query(query)];
            case 3:
                dbRes = _b.sent();
                res.json({ message: 'Ítem equipado correctamente.' });
                return [3 /*break*/, 5];
            case 4:
                err_7 = _b.sent();
                console.error(err_7);
                res.status(500).send('Error al equipar ítem.');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//para ver el gear del player
app.get('/gear/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, query, result, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                playerId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM gear WHERE id = '" + playerId + "'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).json({ message: 'Gear not found for player' });
                }
                return [3 /*break*/, 4];
            case 3:
                err_8 = _a.sent();
                console.error(err_8);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ---------- WEB SOCKET ---------- //
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        var room = socket.data.room_code;
        var userId = socket.data.user_email;
        if (room && userId && users[room]) {
            // Filtrar fuera al usuario desconectado
            users[room] = users[room].filter(function (user) { return user.id !== userId; });
            // borrar sala si no hay players
            if (users[room].length === 0) {
                delete users[room];
            }
            // Emitir lista actualizada
            io.to(room).emit('user_list' + room, users[room]);
        }
    });
    socket.on('join room', function (payload) {
        var info = payload.info;
        var roomCode = info.roomCode;
        socket.join(info.roomCode);
        socket.data.username = info.playerName;
        socket.data.room_code = info.roomCode;
        socket.data.user_email = info.user_email;
        // Si no existe sala crear como array vacío
        if (!users[info.roomCode]) {
            users[info.roomCode] = [];
        }
        // Evitar que un jugador se agregue dos veces
        var alreadyInRoom = users[info.roomCode].some(function (u) { return u.id === info.user_email; });
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
            setTimeout(function () {
                handleEnemyTurn(roomCode);
            }, 1000);
        }
        // Si hay más de 2 expulsar
        if (users[info.roomCode].length > 2) {
            socket.emit('room full', { message: 'La sala ya está llena.' });
            return;
        }
    });
    function getSocketIdByEmail(user_email) {
        var sockets = io.of("/").sockets;
        var targetId;
        sockets.forEach(function (socket, id) {
            if (socket.data.user_email === user_email) {
                targetId = id;
            }
        });
        return targetId;
    }
    function handleEnemyTurn(roomCode) {
        var state = roomStates[roomCode];
        if (!state)
            return;
        var damage = state.enemy.damage;
        for (var _i = 0, _a = state.users; _i < _a.length; _i++) {
            var player = _a[_i];
            var socketId = getSocketIdByEmail(player.user_email);
            if (socketId) {
                io.to(socketId).emit('enemy_attack', {
                    damage: damage
                });
            }
        }
        state.turnIndex = 1;
        var next = state.users[0];
        io.to(roomCode).emit('set_turn', { user_email: next.user_email });
    }
    socket.on('update_my_hp', function (data) {
        socket.to(data.room).emit('update_other_hp', {
            user_email: data.user_email,
            current_health_points: data.current_health_points
        });
        if (data.current_health_points <= 0) {
            console.log("Jugador " + data.user_email + " ha muerto. Fin de la partida cooperativa.");
            io.to(data.room).emit('game_over', { loser: data.user_email });
            delete roomStates[data.room];
            delete users[data.room];
        }
    });
    socket.on('player_attack', function (data) {
        var state = roomStates[data.room];
        if (!state)
            return;
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
            return;
        }
        // Cambiar turno
        if (state.turnIndex === 1) {
            state.turnIndex = 2;
            var next = state.users[1];
            io.to(data.room).emit('set_turn', { user_email: next.user_email });
        }
        else if (state.turnIndex === 2) {
            state.turnIndex = 0;
            setTimeout(function () {
                handleEnemyTurn(data.room);
            }, 1000);
        }
    });
});
// ---------- SERVIDOR ---------- //
var port = process.env.PORT || 3000;
server.listen(port, function () {
    return console.log("App listening on PORT " + port + ".\n\n    ENDPOINTS:\n    \n     - GET /player/:id\n     - GET /items/comunes\n     - GET /gear/:id\n     - POST /player\n     - POST /player/update-stats\n\n     ");
});
