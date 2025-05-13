import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { THospital } from "./THospital";
import { TMedicalSpecCode } from "./TMedicalSpecCode";

@Index("t_hospital_medicalcodes_pkey", ["id"], { unique: true })
@Entity("t_hospital_medicalcodes", { schema: "public" })
export class THospitalMedicalcodes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(() => THospital, (tHospital) => tHospital.tHospitalMedicalcodes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "hospital_id", referencedColumnName: "id" }])
  hospital: THospital;

  @ManyToOne(
    () => TMedicalSpecCode,
    (tMedicalSpecCode) => tMedicalSpecCode.tHospitalMedicalcodes,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "medical_spec_code_id", referencedColumnName: "id" }])
  medicalSpecCode: TMedicalSpecCode;
}
