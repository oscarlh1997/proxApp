"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const connection_entity_1 = require("./infrastructure/repositories/connection.entity");
const connection_service_1 = require("./application/connection.service");
const connection_controller_1 = require("./infrastructure/controllers/connection.controller");
let ConnectionModule = class ConnectionModule {
};
exports.ConnectionModule = ConnectionModule;
exports.ConnectionModule = ConnectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([connection_entity_1.ConnectionEntity])],
        controllers: [connection_controller_1.ConnectionController],
        providers: [connection_service_1.ConnectionService],
        exports: [connection_service_1.ConnectionService],
    })
], ConnectionModule);
//# sourceMappingURL=connection.module.js.map