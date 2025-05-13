import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { SensorDAO } from "./SensorDAO";
import { NetworkDAO } from "./NetworkDAO";

@Entity("gateways")
export class GatewayDAO {
  @PrimaryColumn({ nullable: false })
  gatewayMac: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => SensorDAO, (sensor) => sensor.gateway)
  sensors: SensorDAO[];

  @ManyToOne(() => NetworkDAO, (network) => network.gateways, {
    onDelete: "CASCADE",
    nullable: false,
  })
  network: NetworkDAO;
}


