import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { THospital } from "./THospital";

@Index("t_medical_spec_code_pkey", ["id"], { unique: true })
@Entity("t_medical_spec_code", { schema: "public" })
export class TMedicalSpecCode {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", length: 5, default: () => "''" })
  code: string;

  @Column("character varying", {
    name: "name",
    length: 20,
    default: () => "''",
  })
  name: string;

  @OneToMany(() => THospital, (tHospital) => tHospital.medicalSpecCode)
  tHospitals: THospital[];
}
