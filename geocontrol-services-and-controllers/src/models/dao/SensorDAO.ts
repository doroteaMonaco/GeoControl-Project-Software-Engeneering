import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { MeasurementDAO } from "./MeasurementDAO";
import { GatewayDAO } from "./GatewayDAO";

@Entity("sensors")
export class SensorDAO {
  @PrimaryColumn({ nullable: false })
  macAddress: string;

  @Column({ nullable: false })
  name: string;

  @Column("text")
  description: string;

  @Column({ nullable: false })
  variable: string;

  @Column({ nullable: false })
  unit: string;

  @ManyToOne(() => GatewayDAO, (gateway) => gateway.sensors, {
    onDelete: "CASCADE",
    nullable: false,
  })
  gateway: GatewayDAO;

  @OneToMany(() => MeasurementDAO, (measurement) => measurement.sensor)
  measurements: MeasurementDAO[];
}


