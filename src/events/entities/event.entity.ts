import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  in: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'json' })
  payload: Record<string, any>;
}
