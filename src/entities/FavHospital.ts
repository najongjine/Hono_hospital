import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("fav_hospital_pkey", ["idP"], { unique: true })
@Entity("fav_hospital", { schema: "public" })
export class FavHospital {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_p" })
  idP: number;

  @Column("character varying", { name: "id", length: 500, default: () => "''" })
  id: string;

  @Column("character varying", {
    name: "address_name",
    nullable: true,
    length: 255,
    default: () => "''",
  })
  addressName: string | null;

  @Column("character varying", {
    name: "road_address_name",
    nullable: true,
    length: 255,
    default: () => "''",
  })
  roadAddressName: string | null;

  @Column("character varying", {
    name: "phone",
    nullable: true,
    length: 50,
    default: () => "''",
  })
  phone: string | null;

  @Column("character varying", {
    name: "category_name",
    nullable: true,
    length: 100,
    default: () => "''",
  })
  categoryName: string | null;

  @Column("character varying", {
    name: "category_group_code",
    nullable: true,
    length: 500,
    default: () => "''",
  })
  categoryGroupCode: string | null;

  @Column("character varying", {
    name: "category_group_name",
    nullable: true,
    length: 500,
    default: () => "''",
  })
  categoryGroupName: string | null;

  @Column("numeric", { name: "x", nullable: true, default: () => "0" })
  x: string | null;

  @Column("numeric", { name: "y", nullable: true, default: () => "0" })
  y: string | null;

  @Column("character varying", {
    name: "place_url",
    nullable: true,
    length: 500,
    default: () => "''",
  })
  placeUrl: string | null;

  @Column("timestamp with time zone", {
    name: "created_dt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_dt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedDt: Date | null;
}
