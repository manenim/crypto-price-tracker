import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CryptoPrice {
  // symbol: string

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenName: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
