import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import PageEntity from './PageEntity';
import PortfolioVersionEntity from './PortfolioVersionEntity';

@ObjectType('Portfolio')
@Entity()
export default class PortfolioEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false, unique: true })
  url: string;

  @Field((of) => [PortfolioVersionEntity])
  @OneToMany(() => PortfolioVersionEntity, (version) => version.portfolio)
  versions: PortfolioVersionEntity[];

  @Field((of) => [PageEntity])
  @OneToMany(() => PageEntity, (page) => page.portfolio)
  pages: PageEntity[];
}
