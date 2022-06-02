import { Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import PortfolioEntity from './PortfolioEntity';
import PortfolioVersionEntity from './PortfolioVersionEntity';

@InputType({ description: "New page data" })
@ObjectType('Page')
@Entity()
export default class PageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false })
  url: string;

  @ManyToOne(() => PortfolioEntity, { nullable: false })
  portfolio: PortfolioEntity;

  @Field((of) => PortfolioVersionEntity, { nullable: true })
  @ManyToOne(() => PortfolioVersionEntity, { nullable: false })
  version: PortfolioVersionEntity;
}

