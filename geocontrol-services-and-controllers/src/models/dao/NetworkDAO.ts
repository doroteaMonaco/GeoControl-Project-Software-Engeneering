import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";

@Entity("networks")
export class NetworkDAO {
  @PrimaryColumn({ nullable: false })
  networkMac: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => GatewayDAO, (gateway) => gateway.network)
  gateways: GatewayDAO[];
}


