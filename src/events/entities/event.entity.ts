import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['name', 'type'])
export class Event {
  @PrimaryGeneratedColumn()
  in: number;

  @Index()
  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'json' })
  payload: Record<string, any>;
}
