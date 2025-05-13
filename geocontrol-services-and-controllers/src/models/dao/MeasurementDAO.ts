import { Gateway } from "@models/dto/Gateway";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SensorDAO } from "./SensorDAO";

@Entity("measurements")
export class MeasurementDAO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  createdAt: Date;

  @ManyToOne(() => SensorDAO, (sensor) => sensor.measurements, {
    onDelete: "CASCADE",
    nullable: false,
  })
  sensor: SensorDAO;
}


