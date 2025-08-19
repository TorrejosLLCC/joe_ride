import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type VoucherTransactionType = 'EARNED' | 'SPENT';

@Entity()
export class VoucherTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'varchar' })
  type: VoucherTransactionType;

  @Column({ type: 'int' })
  amount: number;

  @Column({ nullable: true })
  reference?: string; // ride id etc

  @CreateDateColumn()
  createdAt: Date;
}
