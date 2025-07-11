var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
let FavHospital = class FavHospital {
    idP;
    id;
    addressName;
    roadAddressName;
    phone;
    categoryName;
    categoryGroupCode;
    categoryGroupName;
    x;
    y;
    placeUrl;
    createdDt;
    updatedDt;
};
__decorate([
    PrimaryGeneratedColumn({ type: "integer", name: "id_p" }),
    __metadata("design:type", Number)
], FavHospital.prototype, "idP", void 0);
__decorate([
    Column("character varying", { name: "id", length: 500, default: () => "''" }),
    __metadata("design:type", String)
], FavHospital.prototype, "id", void 0);
__decorate([
    Column("character varying", {
        name: "address_name",
        nullable: true,
        length: 255,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "addressName", void 0);
__decorate([
    Column("character varying", {
        name: "road_address_name",
        nullable: true,
        length: 255,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "roadAddressName", void 0);
__decorate([
    Column("character varying", {
        name: "phone",
        nullable: true,
        length: 50,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "phone", void 0);
__decorate([
    Column("character varying", {
        name: "category_name",
        nullable: true,
        length: 100,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "categoryName", void 0);
__decorate([
    Column("character varying", {
        name: "category_group_code",
        nullable: true,
        length: 500,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "categoryGroupCode", void 0);
__decorate([
    Column("character varying", {
        name: "category_group_name",
        nullable: true,
        length: 500,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "categoryGroupName", void 0);
__decorate([
    Column("numeric", { name: "x", nullable: true, default: () => "0" }),
    __metadata("design:type", Object)
], FavHospital.prototype, "x", void 0);
__decorate([
    Column("numeric", { name: "y", nullable: true, default: () => "0" }),
    __metadata("design:type", Object)
], FavHospital.prototype, "y", void 0);
__decorate([
    Column("character varying", {
        name: "place_url",
        nullable: true,
        length: 500,
        default: () => "''",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "placeUrl", void 0);
__decorate([
    Column("timestamp with time zone", {
        name: "created_dt",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "createdDt", void 0);
__decorate([
    Column("timestamp with time zone", {
        name: "updated_dt",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Object)
], FavHospital.prototype, "updatedDt", void 0);
FavHospital = __decorate([
    Index("fav_hospital_pkey", ["idP"], { unique: true }),
    Entity("fav_hospital", { schema: "public" })
], FavHospital);
export { FavHospital };
