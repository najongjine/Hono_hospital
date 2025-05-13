import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TMedicalSpecCode } from "./TMedicalSpecCode";

@Index("t_hospital_hpid_key", ["hpid"], { unique: true })
@Index("t_hospital_pkey", ["id"], { unique: true })
@Entity("t_hospital", { schema: "public" })
export class THospital {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "hpid", unique: true, length: 20 })
  hpid: string;

  @Column("character varying", {
    name: "duty_name",
    nullable: true,
    length: 10,
    default: () => "''",
  })
  dutyName: string | null;

  @Column("character varying", {
    name: "duty_addr",
    nullable: true,
    length: 60,
    default: () => "''",
  })
  dutyAddr: string | null;

  @Column("character varying", {
    name: "duty_div",
    nullable: true,
    length: 2,
    default: () => "''",
  })
  dutyDiv: string | null;

  @Column("character varying", {
    name: "duty_div_nam",
    nullable: true,
    length: 50,
    default: () => "''",
  })
  dutyDivNam: string | null;

  @Column("character varying", {
    name: "duty_emcls",
    nullable: true,
    length: 10,
    default: () => "''",
  })
  dutyEmcls: string | null;

  @Column("character varying", {
    name: "duty_emcls_name",
    nullable: true,
    length: 40,
    default: () => "''",
  })
  dutyEmclsName: string | null;

  @Column("boolean", {
    name: "duty_eryn",
    nullable: true,
    default: () => "true",
  })
  dutyEryn: boolean | null;

  @Column("character varying", {
    name: "duty_tel1",
    nullable: true,
    length: 20,
    default: () => "''",
  })
  dutyTel1: string | null;

  @Column("character varying", {
    name: "duty_tel3",
    nullable: true,
    length: 20,
    default: () => "''",
  })
  dutyTel3: string | null;

  @Column("character varying", {
    name: "duty_time1s",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime1s: string | null;

  @Column("character varying", {
    name: "duty_time1c",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime1c: string | null;

  @Column("character varying", {
    name: "duty_time2s",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime2s: string | null;

  @Column("character varying", {
    name: "duty_time2c",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime2c: string | null;

  @Column("character varying", {
    name: "duty_time3s",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime3s: string | null;

  @Column("character varying", {
    name: "duty_time3c",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime3c: string | null;

  @Column("character varying", {
    name: "duty_time4s",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime4s: string | null;

  @Column("character varying", {
    name: "duty_time4c",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime4c: string | null;

  @Column("character varying", {
    name: "duty_time5s",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime5s: string | null;

  @Column("character varying", {
    name: "duty_time5c",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime5c: string | null;

  @Column("character varying", {
    name: "duty_time6s",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime6s: string | null;

  @Column("character varying", {
    name: "duty_time6c",
    nullable: true,
    length: 5,
    default: () => "''",
  })
  dutyTime6c: string | null;

  @Column("geometry", { name: "location", nullable: true })
  location: string | null;

  @Column("double precision", {
    name: "wgs84_lon",
    nullable: true,
    precision: 53,
    default: () => "0",
  })
  wgs84Lon: number | null;

  @Column("double precision", {
    name: "wgs84_lat",
    nullable: true,
    precision: 53,
    default: () => "0",
  })
  wgs84Lat: number | null;

  @ManyToOne(
    () => TMedicalSpecCode,
    (tMedicalSpecCode) => tMedicalSpecCode.tHospitals,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "medical_spec_code_id", referencedColumnName: "id" }])
  medicalSpecCode: TMedicalSpecCode;
}
