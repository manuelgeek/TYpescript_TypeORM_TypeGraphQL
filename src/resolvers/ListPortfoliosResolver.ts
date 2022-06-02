import { Arg, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import PortfolioEntity from '../entities/PortfolioEntity';
import { PortfolioVersion } from '../entities/PortfolioVersionEntity';

@Resolver()
@Service()
export default class ListPortfoliosResolver {
  @Query(() => [PortfolioEntity], { description: 'List all portfolios' })
  async listPortfolios(): Promise<PortfolioEntity[]> {
    const portfolioRepository = getRepository(PortfolioEntity);

    return portfolioRepository.find({ relations: ['pages', 'versions', 'pages.version'] });
  }

  @Query(() => PortfolioEntity, { description: 'List all portfolios' })
  async getPortfolio(@Arg('portfolioId') id: number, @Arg('version', {nullable: true}) version?: PortfolioVersion): Promise<PortfolioEntity | undefined> {
    const portfolioRepository = getRepository(PortfolioEntity);

    const portfolio = portfolioRepository
    .createQueryBuilder('p')
      .innerJoinAndSelect('p.pages', 'pages')
      .innerJoinAndSelect('pages.version', 'version')
      .innerJoinAndSelect('p.versions', 'versions')
      .where('p.id = :id', {id})
      .andWhere(version ? 'versions.version IN (:...versions)' : '1=1', { versions: [version] })
      .getOne()
    // .findOne({ relations: ['pages', 'versions', 'pages.version'], where: {id, versions: {version}} });
    if (!portfolio) throw Error('Entity not found');

    return portfolio;
  }
}
