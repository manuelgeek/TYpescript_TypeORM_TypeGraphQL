import { Arg, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository, In } from 'typeorm';
import PageEntity from '../entities/PageEntity';

import PortfolioEntity from '../entities/PortfolioEntity';
import PortfolioVersionEntity, { PortfolioVersion } from '../entities/PortfolioVersionEntity';

@Resolver()
@Service()
export default class UpdatePortofolioResolver {
  @Query(() => PortfolioEntity, { description: 'Update a portfolio version, snapshot' })
  async createPortfolioSnapshot(@Arg('portfolioId') id: number): Promise<PortfolioEntity | undefined> {
    const portfolioRepository = getRepository(PortfolioEntity);

    const portfolio = await portfolioRepository.findOne({
      relations: ['pages', 'versions', 'pages.version'],
      where: { id },
    });

    if (!portfolio) throw Error('Entity not found');

    if (!portfolio.versions.map((v) => v.version).includes(PortfolioVersion.Draft))
      throw Error('No draft Version found');
    const pageRepository = getRepository(PageEntity);

    const versionRepository = getRepository(PortfolioVersionEntity);
    await versionRepository
      .createQueryBuilder()
      .update()
      .set({ version: PortfolioVersion.Snapshot })
      .where({ id: portfolio.versions.find((v) => v.version === PortfolioVersion.Draft)?.id })
      .execute();
    const v = versionRepository.create({ version: PortfolioVersion.Snapshot, portfolio });
    const version = await versionRepository.save(v);

    const pageIds = portfolio.pages.map((p) => p.id);
    await pageRepository
      .createQueryBuilder()
      .update()
      .set({ version })
      .where({ id: In(pageIds) })
      .execute();

    return portfolioRepository.findOne({
      relations: ['pages', 'versions', 'pages.version'],
      where: { id },
    });
  }

  @Query(() => PortfolioEntity, { description: 'Update a portfolio version, draft with pages' })
  async createPortfolioDraft(
    @Arg('portfolioId') id: number,
    @Arg('pages', (type) => [PageEntity]) pages: PageEntity[]
  ): Promise<PortfolioEntity | undefined> {
    const portfolioRepository = getRepository(PortfolioEntity);

    const portfolio = await portfolioRepository.findOne({
      relations: ['pages', 'versions', 'pages.version'],
      where: { id },
    });

    if (!portfolio) throw Error('Entity not found');

    if (portfolio.versions.map((v) => v.version).includes(PortfolioVersion.Draft))
      throw Error('Draft Version already Exists');

    const versionRepository = getRepository(PortfolioVersionEntity);
    const v = versionRepository.create({ version: PortfolioVersion.Draft, portfolio });
    const version = await versionRepository.save(v);

    pages.forEach(async ({ name, url }) => {
      const pageRepository = getRepository(PageEntity);
      const p = pageRepository.create({ name, url, portfolio, version });
      await pageRepository.save(p);
    });

    return portfolioRepository.findOne({
      relations: ['pages', 'versions', 'pages.version'],
      where: { id },
    });
  }
}
