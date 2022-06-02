import { Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import PortfolioEntity from './PortfolioEntity';

export enum PortfolioVersion {
  Snapshot = 'snapshot',
  Published = 'published',
  Draft = 'draft',
}

@InputType({ description: "Portfolio version" })
@ObjectType('PortfolioVersion')
@Entity()
export default class PortfolioVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    type: 'enum',
    enum: PortfolioVersion,
    nullable: false,
  })
  version: PortfolioVersion;

  @ManyToOne(() => PortfolioEntity, { nullable: false })
  portfolio: PortfolioEntity;
}
